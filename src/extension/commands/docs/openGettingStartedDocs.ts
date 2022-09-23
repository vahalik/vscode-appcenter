import * as vscode from 'vscode';
import { CommandParams } from '../../../helpers/interfaces';
import { DocsUrlBuilder } from '../../../helpers/docsUrlBuilder'
import { Command } from '../command';
import { Utils } from '../../../helpers/utils/utils';

export default class OpenGettingStartedDocs extends Command {
    constructor(params: CommandParams) {
        super(params);
    }

    public async runNoClient(): Promise<void> {
        super.runNoClient();

        const url = DocsUrlBuilder.GetGettingStartedDocs();
        vscode.window.showInformationMessage(`Opening 'App Center Quickstart' documentation page in your browser`);
        Utils.OpenUrl(url);
        
    }
}

