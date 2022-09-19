import { Profile, ProfileQuickPickItem } from '../../../helpers/interfaces';
import { AuthProvider } from '../../resources/constants';
import { Strings } from '../../resources/strings';
import { Command } from '../command';
import { VsCodeUI } from '../../ui/vscodeUI';
import { Messages } from '../../resources/messages';

export default class SwitchAccount extends Command {
    public async runNoClient(): Promise<boolean | void> {
        if (!(await super.runNoClient())) {
            return false;
        }

        const profiles = await this.vstsAuth.getProfiles();
        if (profiles.length < 2) {
            return true;
        }

        const menuOptions: ProfileQuickPickItem[] = [];
        profiles.forEach((profile) => {
            if (!profile.isActive) {
                menuOptions.push(<ProfileQuickPickItem>{
                    label: profile.userId,
                    description: '',
                    profile: profile,
                });
            }
        });

        try {
            const selected: ProfileQuickPickItem = await VsCodeUI.showQuickPick(
                menuOptions,
                Strings.SelectProfileTitleHint,
            );
            if (!selected) {
                // User cancel selection
                return void 0;
            }
            return this.switchActiveProfile(selected.profile);
        } catch (error) {
            this.handleError(error);
        }
    }

    private async switchActiveProfile(selectedProfile: Profile): Promise<boolean> {
        try {
            selectedProfile.isActive = true;
            await this.vstsAuth.updateProfile(selectedProfile);

            VsCodeUI.ShowInfoMessage(Messages.UserSwitchedMessage(AuthProvider.Vsts, selectedProfile.userName));
        } catch (e) {
            this.handleError(e);
            return false;
        }
        return true;
    }

    private handleError(error: Error) {
        VsCodeUI.ShowErrorMessage(Messages.FailedToSwitchAccounts);
        this.logger.error(error.message, error, true);
    }
}
