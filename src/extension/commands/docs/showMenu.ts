import { CommandParams } from '../../../helpers/interfaces';
import { DocsMenu } from '../../menu/docsMenu';
import { Command } from '../command';

export default class ShowMenu extends Command {
    private _params: CommandParams;
    constructor(params: CommandParams) {
        super(params);
        this._params = params;
    }

    public async runNoClient(): Promise<void> {
        super.runNoClient();

        return new DocsMenu(this._params).show();
    }
}

