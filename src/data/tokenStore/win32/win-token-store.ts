//
// Implementation of token store that reads and writes to the Windows credential store.
// Uses included "creds.exe" program to access the credential store.
//

import * as childProcess from 'child_process';
import { Observable, Observer } from 'rx-lite';
import * as stream from 'stream';
import * as es from 'event-stream';
import * as path from 'path';
import * as parser from './win-credstore-parser';

import { TokenStore, TokenEntry, TokenKeyType, TokenValueType } from '../tokenStore';

type Duplex = stream.Duplex;

const credExePath = path.join(__dirname, '../bin/windows/creds.exe');

const targetNamePrefix = 'AppCenterExtension:target=';

class Prefixer {
    private prefix: string;
    constructor(_useOldName: boolean) {
        this.prefix = targetNamePrefix;
    }

    public ensurePrefix(targetName: string): string {
        if (targetName.slice(this.prefix.length) !== this.prefix) {
            targetName = this.prefix + targetName;
        }
        return targetName;
    }

    public removePrefix(targetName: string): string {
        return targetName.slice(this.prefix.length);
    }

    public removePrefixFromCred(cred: any): any {
        if (cred.targetName) {
            cred.targetName = this.removePrefix(cred.targetName);
        }
        return cred;
    }
}

function encodeTokenValueAsHex(token: TokenValueType): string {
    const tokenValueAsString = JSON.stringify(token);
    return Buffer.from(tokenValueAsString, 'utf8').toString('hex');
}

function decodeTokenValueFromHex(token: string): TokenValueType {
    return JSON.parse(Buffer.from(token, 'hex').toString('utf8'));
}

function credToTokenEntry(cred: any): TokenEntry {
    // Assumes credential comes in with prefixes on target skipped, and
    // Credential object in hexidecimal
    return {
        key: cred.targetName,
        accessToken: decodeTokenValueFromHex(cred.credential),
    };
}

export class WinTokenStore implements TokenStore {
    /**
     * list the contents of the credential store, parsing each value.
     *
     * We ignore everything that wasn't put there by us, we look
     * for target names starting with the target name prefix.
     *
     *
     * @return {Observable<TokenEntry>} stream of credentials.
     */
    public list(): Observable<TokenEntry> {
        const prefixer = new Prefixer(false);
        return Observable.create<TokenEntry>((observer: Observer<TokenEntry>) => {
            const credsProcess = childProcess.spawn(credExePath, ['-s', '-g', '-t', `${targetNamePrefix}*`]);

            const credStream = credsProcess.stdout
                .pipe(parser.createParsingStream())
                .pipe(es.mapSync(prefixer.removePrefixFromCred.bind(prefixer)) as any as Duplex);

            credStream.on('data', (cred: any) => {
                observer.onNext(credToTokenEntry(cred));
            });
            credStream.on('end', () => {
                observer.onCompleted();
            });

            credStream.on('error', (err: Error) => observer.onError(err));
        });
    }

    /**
     * Get details for a specific credential. Assumes generic credential.
     *
     * @param {tokenKeyType} key target name for credential
     * @return {Promise<TokenEntry>} Returned credential or null if not found.
     */
    public get(key: TokenKeyType, useOldName = false): Promise<TokenEntry> {
        const prefixer = new Prefixer(useOldName);
        const args = ['-s', '-t', prefixer.ensurePrefix(key)];

        const credsProcess = childProcess.spawn(credExePath, args);
        let result: any = null;
        const errors: string[] = [];

        //debug(`Getting key with args ${inspect(args)}`);
        return new Promise<TokenEntry>((resolve, reject) => {
            credsProcess.stdout
                .pipe(parser.createParsingStream())
                .pipe(es.mapSync(prefixer.removePrefixFromCred.bind(prefixer)) as any as Duplex)
                .on('data', (credential: any) => {
                    result = credential;
                    result.targetName = prefixer.removePrefix(result.targetName);
                });

            credsProcess.stderr.pipe(es.split() as any as Duplex).on('data', (line: string) => {
                errors.push(line);
            });

            credsProcess.on('exit', (code: number) => {
                if (code === 0) {
                    //debug(`Completed getting token, result = ${inspect(result)}`);
                    return resolve(credToTokenEntry(result));
                }
                return reject(new Error(`Getting credential failed, exit code ${code}: ${errors.join(', ')}`));
            });
        });
    }

    /**
     * Set the credential for a given key in the credential store.
     * Creates or updates, assumes generic credential.
     *
     * @param {TokenKeyType} key key for entry (string user name for now)
     * @param {TokenValueType} credential the credential to be encrypted
     *
     * @return {Promise<void>} Promise that completes when update has finished
     * @param {Function(err)} callback completion callback
     */
    public set(key: TokenKeyType, credential: TokenValueType): Promise<void> {
        const prefixer = new Prefixer(false);
        const args = ['-a', '-t', prefixer.ensurePrefix(key), '-p', encodeTokenValueAsHex(credential)];

        //debug(`Saving token with args ${inspect(args)}`);
        return new Promise<void>((resolve, reject) => {
            childProcess.execFile(credExePath, args, function (err) {
                if (err) {
                    //debug(`Token store failed, ${inspect(err)}`);
                    return reject(err);
                }
                // debug(`Token successfully stored`);
                return resolve();
            });
        });
    }
    
    /**
     * Remove the given key from the credential store.
     *
     * @param {TokenKeyType} key  target name to remove.
     *                            if ends with "*" character,
     *                            will delete all targets
     *                            starting with that prefix
     * @param {Function(err)} callback completion callback
     */
    public remove(key: TokenKeyType): Promise<void> {
        const prefixer = new Prefixer(false);
        const args = ['-d', '-t', prefixer.ensurePrefix(key)];

        if (key.slice(-1) === '*') {
            args.push('-g');
        }

        // debug(`Deleting token with args ${inspect(args)}`);
        return new Promise<void>((resolve, reject) => {
            childProcess.execFile(credExePath, args, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

export function createWinTokenStore(): TokenStore {
    return new WinTokenStore();
}
