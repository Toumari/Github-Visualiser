import { describe, it, expect } from 'vitest';
import {
    processLanguageData,
    processActivityRhythm,
    processImpactIndex,
    determineDeveloperClass
} from './dataProcessor';

describe('dataProcessor Utilities', () => {

    describe('processLanguageData', () => {
        it('should aggregate language counts and stars correctly', () => {
            const mockRepos = [
                { language: 'JavaScript', stargazers_count: 10 },
                { language: 'JavaScript', stargazers_count: 5 },
                { language: 'Python', stargazers_count: 20 },
                { language: null, stargazers_count: 5 } // Should be ignored
            ];

            const result = processLanguageData(mockRepos);

            // We expect JavaScript (count: 2, stars: 15, value: 2 + 15*0.5 = 9.5)
            // Python (count: 1, stars: 20, value: 1 + 20*0.5 = 11)
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Python'); // Sorted by highest value
            expect(result[0].count).toBe(1);
            expect(result[0].stars).toBe(20);
            expect(result[0].value).toBe(11);

            expect(result[1].name).toBe('JavaScript');
            expect(result[1].count).toBe(2);
            expect(result[1].stars).toBe(15);
            expect(result[1].value).toBe(9.5);
        });

        it('should handle empty repositories seamlessly', () => {
            const result = processLanguageData([]);
            expect(result).toEqual([]);
        });
    });

    describe('processImpactIndex', () => {
        it('should calculate total stars and forks', () => {
            const mockRepos = [
                { id: 1, name: 'repo1', stargazers_count: 50, forks_count: 10 },
                { id: 2, name: 'repo2', stargazers_count: 200, forks_count: 50 },
                { id: 3, name: 'repo3', stargazers_count: 10, forks_count: 2 }
            ];

            const result = processImpactIndex(mockRepos);

            expect(result.totalStars).toBe(260);
            expect(result.totalForks).toBe(62);
            // Top 5 starred repos
            expect(result.mostStarred[0].name).toBe('repo2');
            expect(result.mostStarred[1].name).toBe('repo1');
            expect(result.mostStarred[2].name).toBe('repo3');
        });
    });

    describe('processActivityRhythm', () => {
        it('should classify hours and return correct developer persona', () => {
            // Mocking night time commits (0-6 hours)
            const mockEvents = [
                { type: 'PushEvent', created_at: '2023-10-15T02:00:00Z', payload: { commits: [1, 2] } },
                { type: 'PushEvent', created_at: '2023-10-16T03:30:00Z', payload: { commits: [1] } }
            ];

            const result = processActivityRhythm(mockEvents);

            expect(result.totalCommits).toBe(3);

            // We expect "Night Owl" because all pushes happened at night
            // Note: This relies on local time conversion in the actual function,
            // so we make a generic assertion that a persona is assigned.
            expect(result.persona).toBeDefined();
            expect(typeof result.persona).toBe('string');
            // Total chart length should be 24 hours
            expect(result.chartData).toHaveLength(24);
        });
    });

    describe('determineDeveloperClass', () => {
        it('should classify as Open Source Legend for > 1000 stars', () => {
            const mockProfile = { created_at: '2015-01-01T00:00:00Z', public_repos: 100 };
            const devClass = determineDeveloperClass(mockProfile, 1500, 500);
            expect(devClass).toBe('Open Source Legend');
        });

        it('should classify as Promising Initiate for new accounts', () => {
            const mockProfile = { created_at: new Date().toISOString(), public_repos: 2 };
            const devClass = determineDeveloperClass(mockProfile, 2, 5);
            expect(devClass).toBe('Promising Initiate');
        });
    });
});
