import { WebResource } from 'ms-rest';
import { platform, release } from 'os';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: cliVersion } = require('../../../package.json');

export function userAgentFilter(resource: WebResource, next: any, callback: any): any {
    const scriptName = 'vscode-appcenter';
    resource.headers['user-agent'] = `${scriptName}Cli/${cliVersion} ${platform()}/${release()}`;
    return next(resource, callback);
}
