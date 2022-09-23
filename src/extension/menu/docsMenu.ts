import { CommandParams, MenuQuickPickItem } from '../../helpers/interfaces';
// import * as Settings from '../commands/settings';
import { AppCenterBeacons } from '../resources/constants';
import { OpenDocs, OpenGettingStartedDocs } from '../commands/docs';
import { Menu, MenuItems } from './menu';

export class DocsMenu extends Menu {
    constructor(params: CommandParams) {
        super(params);
    }

    protected getMenuItems(): MenuQuickPickItem[] {
        const menuItems: MenuQuickPickItem[] = [];

        menuItems.push(MenuItems.GettingStartedDocs, MenuItems.AnalyticsDocs, MenuItems.DiagnosticsDocs, MenuItems.DistributeDocs, MenuItems.BuildDocs, MenuItems.TestDocs);

        return menuItems;
    }

    protected handleMenuSelection(menuItem: MenuQuickPickItem): Promise<void> {

        if (menuItem.command === MenuItems.GettingStartedDocs.command) {
            new OpenGettingStartedDocs(this._params).runNoClient();
        } else {
            new OpenDocs(this._params, menuItem.command as AppCenterBeacons).runNoClient();
        }

        return void 0;
    }
}
