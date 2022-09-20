import * as assert from 'assert';
import { CommandNames } from '../src/extension/resources/constants';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    
    vscode.window.showInformationMessage('Start all tests.');

    test('#registerAppCenterCommands', async () => {

        const requiredCommands = new Set([
            CommandNames.AppCenterPortal,
            CommandNames.WhoAmI,
            CommandNames.Login,
            CommandNames.ShowMenu,
            CommandNames.Start,
            CommandNames.GetCurrentApp,
            CommandNames.SetCurrentApp,
            CommandNames.SimulateCrashes,
            CommandNames.InstallSDK,
            CommandNames.CreateNewApp,
            CommandNames.Settings.LoginToAnotherAccount,
            CommandNames.Settings.SwitchAccount,
            CommandNames.Settings.Logout,
            CommandNames.Settings.LoginVsts,
            CommandNames.Settings.SwitchAccountVsts,
            CommandNames.Settings.LogoutVsts,
            CommandNames.Settings.ShowStatusBar,
            CommandNames.Settings.HideStatusBar,
            CommandNames.CodePush.SetCurrentDeployment,
            CommandNames.CodePush.ReleaseReact,
            CommandNames.CodePush.SwitchMandatoryPropForRelease,
            CommandNames.CodePush.SetTargetBinaryVersion,
            CommandNames.CodePush.LinkCodePush,
            CommandNames.Test.ShowMenu,
            CommandNames.Test.RunUITests,
            CommandNames.Test.RunUITestsAsync,
            CommandNames.Test.ViewResults
        ]);

        const registeredCommands = await vscode.commands.getCommands(true);
        const appCenterCommands = new Set(registeredCommands.filter(c => c.startsWith(CommandNames.CommandPrefix)));

        for (const requiredCommand of requiredCommands) {
            assert.strictEqual(appCenterCommands.has(requiredCommand), true, `Command not registered: ${requiredCommand}`);
        }

        for (const registeredCommand of appCenterCommands) {
            assert.strictEqual(requiredCommands.has(registeredCommand), true, `Unexpected command registered: ${registeredCommand}`);
        }

    });
});
