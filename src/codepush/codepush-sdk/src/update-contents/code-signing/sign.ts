// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as fileUtils from '../../utils/file-utils';
import * as hashUtils from './hash-utils';

const CURRENT_CLAIM_VERSION = '1.0.0';
const METADATA_FILE_NAME = '.codepushrelease';

interface CodeSigningClaims {
    claimVersion: string;
    contentHash: string;
}

export default async function sign(privateKeyPath: string, updateContentsPath: string): Promise<void> {
    if (!privateKeyPath) {
        return Promise.resolve<void>(void 0);
    }

    let privateKey: Buffer;

    try {
        privateKey = await fileUtils.readFile(privateKeyPath);
    } catch (err) {
        return Promise.reject(new Error(`The path specified for the signing key ("${privateKeyPath}") was not valid.`));
    }

    // If releasing a single file, copy the file to a temporary "CodePush" directory in which to publish the release
    try {
        if (!fileUtils.isDirectory(updateContentsPath)) {
            updateContentsPath = fileUtils.copyFileToTmpDir(updateContentsPath);
        }
    } catch (error) {
        return Promise.reject(error);
    }

    const signatureFilePath = path.join(updateContentsPath, METADATA_FILE_NAME);
    let prevSignatureExists = true;
    try {
        await fileUtils.access(signatureFilePath, fs.constants.F_OK);
    } catch (err) {
        if (err.code === 'ENOENT') {
            prevSignatureExists = false;
        } else {
            return Promise.reject<void>(
                new Error(
                    `Could not delete previous release signature at ${signatureFilePath}.
                Please, check your access rights.`,
                ),
            );
        }
    }

    if (prevSignatureExists) {
        console.log(`Deleting previous release signature at ${signatureFilePath}`);
        await fileUtils.rmDir(signatureFilePath);
    }

    const hash: string = await hashUtils.generatePackageHashFromDirectory(
        updateContentsPath,
        path.join(updateContentsPath, '..'),
    );
    const claims: CodeSigningClaims = {
        claimVersion: CURRENT_CLAIM_VERSION,
        contentHash: hash,
    };

    return new Promise<void>((resolve, reject) => {
        jwt.sign(claims, privateKey, { algorithm: 'RS256' }, async (err: Error, signedJwt: string) => {
            if (err) {
                reject(new Error('The specified signing key file was not valid'));
            }

            try {
                fs.writeFileSync(signatureFilePath, signedJwt);
                console.log(`Generated a release signature and wrote it to ${signatureFilePath}`);
                resolve(void 0);
            } catch (error) {
                reject(error);
            }
        });
    });
}
