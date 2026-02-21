import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchUserProfile, fetchUserRepos, fetchUserEvents, fetchAllUserData } from './githubService';

// Mock axios methods
vi.mock('axios');

describe('githubService API', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchUserProfile', () => {
        it('should fetch user data successfully', async () => {
            const mockData = { login: 'testuser', name: 'Test User' };
            axios.get.mockResolvedValueOnce({ data: mockData });

            const result = await fetchUserProfile('testuser');

            expect(axios.get).toHaveBeenCalledWith('https://api.github.com/users/testuser', {
                headers: { Accept: 'application/vnd.github.v3+json' }
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('fetchAllUserData', () => {
        it('should aggregate profile, repos, and events', async () => {
            const mockProfile = { login: 'testuser' };
            const mockRepos = [{ id: 1, name: 'repo1' }];
            const mockEvents = [{ type: 'PushEvent' }];

            axios.get
                .mockResolvedValueOnce({ data: mockProfile }) // First call: fetchUserProfile
                .mockResolvedValueOnce({ data: mockRepos })   // Second call: fetchUserRepos
                .mockResolvedValueOnce({ data: mockEvents }); // Third call: fetchUserEvents

            const result = await fetchAllUserData('testuser');

            expect(result.profile).toEqual(mockProfile);
            expect(result.repos).toEqual(mockRepos);
            expect(result.events).toEqual(mockEvents);

            // Verify all 3 API calls were made
            expect(axios.get).toHaveBeenCalledTimes(3);
        });

        it('should handle 404 errors appropriately', async () => {
            axios.get.mockRejectedValueOnce({ response: { status: 404 } });
            await expect(fetchAllUserData('notfounduser')).rejects.toThrow('User not found');
        });

        it('should handle 403 API rate limit errors', async () => {
            axios.get.mockRejectedValueOnce({ response: { status: 403 } });
            await expect(fetchAllUserData('toomanyrequests')).rejects.toThrow('API Rate limit exceeded. Try again later.');
        });
    });
});
