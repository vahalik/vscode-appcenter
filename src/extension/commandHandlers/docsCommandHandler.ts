import BaseCommandHandler from './baseCommandHandler';
import * as Docs from '../commands/docs';

export default class DocsCommandHandler extends BaseCommandHandler {
    
    public async showDocsMenu(): Promise<void> {

        await new Docs.ShowMenu(this.getCommandParams()).runNoClient();
        
    }

}
