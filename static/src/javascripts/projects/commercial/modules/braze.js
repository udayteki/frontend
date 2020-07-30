// @flow

import { onIabConsentNotification } from '@guardian/consent-management-platform';
import config from 'lib/config';
import { getUserFromApi } from '../../common/modules/identity/api';

let didAlreadyRun = false;

const getBrazeUuid = (): Promise<string> =>
    new Promise(resolve => {
        getUserFromApi(user => {
            if (user && user.privateFields && user.privateFields.brazeUuid){
                resolve(user.privateFields.brazeUuid)
            }
        })
    })

const hasRequiredConsents = (): Promise<void> =>
    new Promise(resolve => {
        onIabConsentNotification(state => {
            const hasRequiredConsents = state[1] && state[2] && state[3] && state[4] && state[5];
            if (hasRequiredConsents) {
                resolve(hasRequiredConsents)
            }
        })
    })

export const init = (): Promise<any> => {
    const brazeSwitch = config.get('switches.brazeSwitch');
    if (!brazeSwitch) return Promise.resolve();
    const apiKey = config.get('page.brazeApiKey');
    if (!apiKey) return Promise.reject(new Error('Braze API key not set.'));
    getBrazeUuid().then(brazeUuid => {
        console.log("Initializing Braze");
        hasRequiredConsents().then(() => {
            import(/* webpackChunkName: "braze-web-sdk" */ '@braze/web-sdk').then(appboy => {
                didAlreadyRun = true;

                appboy.initialize(apiKey, {
                    enableLogging: true,
                    noCookies: true,
                    baseUrl: 'https://sdk.fra-01.braze.eu/api/v3',
                    enableHtmlInAppMessages: true
                });

                const f = function (configuration) {
                    console.log(configuration);
                    appboy.display.showInAppMessage(configuration);
                    return true;
                }

                appboy.subscribeToInAppMessage(f);

                appboy.changeUser(brazeUuid);
                appboy.openSession();
            });
        })
    });


    return Promise.resolve();
}


