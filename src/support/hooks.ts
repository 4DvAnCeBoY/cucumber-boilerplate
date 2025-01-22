//
// =====
// Hooks
// =====
// WebdriverIO provides a several hooks you can use to interfere the test process in order to
// enhance it and build services around it. You can either apply a single function to it or
// an array of methods. If one of them returns with a promise,
// WebdriverIO will wait until that promise is resolved to continue.
//
import { GherkinDocument } from '@cucumber/messages';
import { ITestCaseHookParameter } from '@cucumber/cucumber';

// Define an interface for feature data
interface FeatureData {
    totalScenarios: number;
    currentIndex: number;
}
const normalizeUri = (uri: string): string => {
    return uri.replace(/\\/g, '/').replace(/.*\/src/, 'src').toLowerCase();
};

// In-memory storage for feature data per thread
const featureDataStorage: Record<string, FeatureData> = {};

export const hooks = {
   
    /**
     * Cucumber-specific hooks
     */
    /**
     * Cucumber Hook: Runs before a Cucumber Feature.
     * @param {string} uri - Path to the feature file.
     * @param {GherkinDocument['feature']} feature - Cucumber feature object.
     */
    beforeFeature: (uri: string, feature: GherkinDocument['feature']): void => {
        const featureKey = normalizeUri(uri);
        console.log(`beforeFeature URI (normalized): ${featureKey}`);
        
        const scenarios = feature?.children?.filter((child) => child.scenario) || [];
        featureDataStorage[featureKey] = {
            totalScenarios: scenarios.length,
            currentIndex: 0
        };
    
        const featureName = feature?.name || 'Unnamed Feature';
        console.log(`Feature: ${featureName} - Total Scenarios: ${scenarios.length}`);
    },
    /**
     * Cucumber Hook: Runs after a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world - World object containing information on pickle and test step.
     * @param {object} result - Results object containing scenario results.
     * @param {boolean} result.passed - True if the scenario has passed.
     * @param {string} result.error - Error stack if the scenario failed.
     * @param {number} result.duration - Duration of the scenario in milliseconds.
     * @param {object} context - Cucumber World object.
     */
    afterScenario: async (
        world: ITestCaseHookParameter,
        result: { passed: boolean; error?: string; duration: number },
        context: object
    ): Promise<void> => {
        const featureKey = normalizeUri(world.pickle.uri);
        console.log(`afterScenario URI (normalized): ${featureKey}`);
        
        const featureData = featureDataStorage[featureKey];
        if (!featureData) {
            console.error(`Feature data not found for URI: ${featureKey}`);
            return;
        }
    
        featureData.currentIndex += 1;
    
        const { currentIndex, totalScenarios } = featureData;
        console.log(`Completed Scenario ${currentIndex} of ${totalScenarios}`);
    
        if (currentIndex === totalScenarios) {
            console.log(`All scenarios completed for feature. Deleting session.`);
            browser.deleteSession();
        } else {
            console.log(`Reloading session for next scenario.`);
           await browser.reloadSession();
        }
    }
   
};