import * as vscode from 'vscode';
import { CommandParams } from '../../../helpers/interfaces';
import { DocsUrlBuilder } from '../../../helpers/docsUrlBuilder'
import { Command } from '../command';
import { AppCenterBeacons } from '../../resources/constants';
import { Utils } from '../../../helpers/utils/utils';

export default class OpenDocs extends Command {
    private _beacon: AppCenterBeacons;
    constructor(params: CommandParams, beacon: AppCenterBeacons) {
        super(params);
        this._beacon = beacon;
    }

    public async runNoClient(): Promise<void> {
        super.runNoClient();

        const url = DocsUrlBuilder.GetDocsLinkByBeacon(this._beacon);
        vscode.window.showInformationMessage(`Opening 'App Center ${this._beacon}' documentation page in your browser`);
        Utils.OpenUrl(url);
        
    }
}

