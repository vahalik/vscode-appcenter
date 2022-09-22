// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import rimraf = require('rimraf');
import * as temp from 'temp';
import { OpenMode, PathLike } from 'node:fs';
import { Abortable } from 'node:events';

export function fileExists(file: string): boolean {
    try {
        return fs.statSync(file).isFile();
    } catch (e) {
        return false;
    }
}

export function isBinaryOrZip(path: string): boolean {
    return path.search(/\.zip$/i) !== -1 || path.search(/\.apk$/i) !== -1 || path.search(/\.ipa$/i) !== -1;
}

export function isDirectory(path: string): boolean {
    return fs.statSync(path).isDirectory();
}

export function copyFileToTmpDir(filePath: string): string {
    if (!isDirectory(filePath)) {
        const outputFolderPath: string = temp.mkdirSync('code-push');
        rimraf.sync(outputFolderPath);
        fs.mkdirSync(outputFolderPath);

        const outputFilePath: string = path.join(outputFolderPath, path.basename(filePath));
        fs.writeFileSync(outputFilePath, fs.readFileSync(filePath));

        return outputFolderPath;
    }
    return '';
}

export function generateRandomFilename(length: number): string {
    let filename = '';
    const validChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        // tslint:disable-next-line:insecure-random
        filename += validChar.charAt(Math.floor(Math.random() * validChar.length));
    }

    return filename;
}

export function fileDoesNotExistOrIsDirectory(path: string): boolean {
    try {
        return isDirectory(path);
    } catch (error) {
        return true;
    }
}

export function createEmptyTmpReleaseFolder(folderPath: string): void {
    rimraf.sync(folderPath);
    fs.mkdirSync(folderPath);
}

export function removeReactTmpDir(): void {
    rimraf.sync(`${os.tmpdir()}/react-*`);
}

export function normalizePath(filePath: string): string {
    // replace all backslashes coming from cli running on windows machines by slashes
    return filePath.replace(/\\/g, '/');
}

export async function walk(dir: string): Promise<string[]> {
    const stats = await stat(dir);
    if (stats.isDirectory()) {
        let files: string[] = [];
        for (const file of await readdir(dir)) {
            files = files.concat(await walk(path.join(dir, file)));
        }
        return files;
    } else {
        return [dir];
    }
}

export async function stat(path: string | Buffer): Promise<fs.Stats> {
    return fs.promises.stat(path);
}

export async function readdir(path: string | Buffer): Promise<string[]> {
    return fs.promises.readdir(path);
}

export async function readFile(
    filename: PathLike,
    options?:
        | ({
              encoding?: null | undefined;
              flag?: OpenMode | undefined;
          } & Abortable)
        | null,
): Promise<Buffer> {
    return fs.promises.readFile(filename, options);
}

export async function access(path: string | Buffer, mode: number): Promise<void> {
    return fs.promises.access(path, mode);
}

export function rmDir(source: string, recursive = true): Promise<void> {
    if (recursive) {
        return new Promise<void>((resolve, reject) => {
            rimraf(source, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } else {
        return fs.promises.rmdir(source);
    }
}

export function mkTempDir(affixes: string): Promise<string> {
    return temp.mkdir(affixes);
}
