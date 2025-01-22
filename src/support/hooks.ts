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
    beforeFeature: (uri: string, feature: GherkinDocument['feature']): void => {
        const featureKey = normalizeUri(uri);

        if (!feature) {
            console.error(`No feature object found for URI: ${uri}`);
            return;
        }

        // Retrieve the tags passed via the CLI
        const cliTags = process.env.TAGS || '';

        // Determine exclude tags (e.g., "not @tag")
        const excludeTags = cliTags
            .split(' ')
            .filter((tag) => tag.startsWith('not '))
            .map((tag) => tag.replace('not ', ''));

        // Determine include tags (tags without "not ")
        const includeTags = cliTags
            .split(' ')
            .filter((tag) => !tag.startsWith('not '));

        // Filter scenarios based on tags and count example rows
        const totalScenarios = feature.children?.reduce((count, child) => {
            if (child.scenario) {
                const tags = child.scenario.tags?.map((tag) => tag.name) || [];

                // Skip scenarios with exclude tags
                const isExcluded = excludeTags.some((tag) => tags.includes(tag));
                if (isExcluded) return count;

                // Include scenarios with include tags (or all if no include tags specified)
                const hasIncludeTag =
                    includeTags.length === 0 || includeTags.some((tag) => tags.includes(tag));
                if (hasIncludeTag) {
                    // Count each example row for Scenario Outlines
                    const examplesCount = child.scenario.examples?.reduce((exampleCount, example) => {
                        return exampleCount + (example.tableBody?.length || 0);
                    }, 0) || 1; // Default to 1 if no examples are present
                    return count + examplesCount;
                }
            }
            return count;
        }, 0) || 0;

        // Store the total count of scenarios
        featureDataStorage[featureKey] = {
            totalScenarios,
            currentIndex: 0,
        };

        // Log the feature name and total scenarios
        const featureName = feature.name || 'Unnamed Feature';
        console.log(
            `Feature: ${featureName} - Scenarios matching tags "${cliTags || 'ALL'}": ${totalScenarios}`
        );
    },

    afterTest: async function (
        test: { title: any; file: any; },
        context: any,
        { error, result, duration, passed, retries }: any
    ) {
        // Log the current test details
        console.log(`Test Name: ${test.title}`);
        console.log(`Test Passed: ${passed}`);
        console.log(`Retries Attempted: ${retries.attempts}`);
        console.log(`Test Duration: ${duration}ms`);

        // Add LambdaTest metadata
        browser.executeScript(`lambda-name=${test.title}`,[]);
        browser.executeScript(`lambda-status=${passed ? 'passed' : 'failed'}`, []);

        // Handle progress logging
        const featureKey = normalizeUri(test.file || 'unknown_feature');
        const featureData = featureDataStorage[featureKey];

        if (!featureData) {
            console.error(`Feature data not found for URI: ${featureKey}`);
            return;
        }

        const { totalScenarios } = featureData;

        // Only update progress if the test is not skipped and is not a retry
        if (passed || error) {
            featureData.currentIndex += 1;
        }

        // Log execution progress
        console.log(
            `Execution progress: Scenario ${featureData.currentIndex} of ${featureData.totalScenarios}`
        );

        // Retry handling
        if (!passed && retries.attempts < retries.limit) {
            console.log(
                `Retrying test "${test.title}". Attempt ${retries.attempts + 1} of ${retries.limit}`
            );
            return; // Do not reload or delete session on retries
        }

        // Session management
        if (featureData.currentIndex === totalScenarios) {
            console.log(`All scenarios completed for feature. Deleting session.`);
            await browser.deleteSession();
        } else {
            console.log(`Reloading session for next scenario.`);
            await browser.reloadSession();
        }
    }



};
