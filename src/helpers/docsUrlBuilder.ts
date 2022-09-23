import { AppCenterBeacons, Constants } from '../extension/resources/constants';

export class DocsUrlBuilder {
    public static GetDocsLinkByBeacon(beaconName: AppCenterBeacons): string {

        if ([AppCenterBeacons.Build, AppCenterBeacons.Analytics, AppCenterBeacons.Crashes].includes(beaconName)) {
            return `${Constants.AppCenterDocsURL}${beaconName.toLocaleLowerCase()}`;
        } else if (beaconName === AppCenterBeacons.Distribute) {
            return `${Constants.AppCenterDocsURL}distribution/`;
        } else if (beaconName === AppCenterBeacons.Test) {
            return `${Constants.AppCenterDocsURL}test-cloud/`;
        } else {
            return Constants.AppCenterDocsURL;
        }

    }

    public static GetGettingStartedDocs(): string {
        return `${Constants.AppCenterDocsURL}quickstarts/`;
    }
}