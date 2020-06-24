// @flow strict

export const confiantCallbackTest: ABTest = {
    id: 'ConfiantCallbackOnBlockedAd',
    start: '2020-06-23',
    expiry: '2020-08-03',
    author: 'Josh Buckland',
    description: 'Test impact of Confiant callback triggered on a blocked ad',
    audience: 0.01,
    audienceOffset: 0.0,
    successMeasure: 'Confiant callback will have a minimal impact on performance and recovers lsot revenue',
    audienceCriteria: 'n/a',
    dataLinkNames: 'n/a',
    idealOutcome: 'Confiant callback has no impact and saves lost revenue',
    showForSensitive: false,
    canRun: () => true,
    variants: [
        {
            id: 'control',
            test: (): void => {},
        },
        {
            id: 'variant',
            test: (): void => {},
        },
    ],
};
