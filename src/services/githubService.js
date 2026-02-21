import axios from 'axios';

const BASE_URL = 'https://api.github.com';

// Optional: Provide a token via env or let it be public (rate limited to 60/hr)
const getHeaders = () => {
    // If we had a token, we could return { Authorization: `token ${token}` }
    return { Accept: 'application/vnd.github.v3+json' };
};

export const fetchUserProfile = async (username) => {
    const response = await axios.get(`${BASE_URL}/users/${username}`, { headers: getHeaders() });
    return response.data;
};

// Fetch all public repos for a user (paginated, getting up to 100 max for simplicity)
export const fetchUserRepos = async (username) => {
    const response = await axios.get(`${BASE_URL}/users/${username}/repos?per_page=100&sort=pushed`, { headers: getHeaders() });
    return response.data;
};

// Fetch user public events to analyze activity rhythms
export const fetchUserEvents = async (username) => {
    const response = await axios.get(`${BASE_URL}/users/${username}/events?per_page=100`, { headers: getHeaders() });
    return response.data;
};

export const fetchAllUserData = async (username) => {
    try {
        const [profile, repos, events] = await Promise.all([
            fetchUserProfile(username),
            fetchUserRepos(username),
            fetchUserEvents(username)
        ]);
        return { profile, repos, events };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        }
        if (error.response && error.response.status === 403) {
            throw new Error('API Rate limit exceeded. Try again later.');
        }
        throw new Error('An error occurred while fetching data from GitHub');
    }
};
