export const processLanguageData = (repos) => {
    const languageMap = {};
    repos.forEach((repo) => {
        if (repo.language) {
            if (!languageMap[repo.language]) {
                languageMap[repo.language] = { count: 0, stars: 0 };
            }
            languageMap[repo.language].count += 1;
            languageMap[repo.language].stars += repo.stargazers_count || 0;
        }
    });

    // Convert to array and sort
    return Object.entries(languageMap)
        .map(([name, data]) => ({
            name,
            count: data.count,
            stars: data.stars,
            // Create a value for D3-like charting (e.g., recharts treemap or pie)
            value: data.count + (data.stars * 0.5)
        }))
        .sort((a, b) => b.value - a.value);
};

export const processActivityRhythm = (events) => {
    // Analyzes PushEvents or Commit events to calculate time of day
    const hours = new Array(24).fill(0);
    let totalCommits = 0;

    events.forEach((event) => {
        if (event.type === 'PushEvent') {
            const date = new Date(event.created_at);
            const hour = date.getHours(); // Local time
            hours[hour] += (event.payload.commits ? event.payload.commits.length : 1);
            totalCommits += (event.payload.commits ? event.payload.commits.length : 1);
        }
    });

    // Calculate Rhythm insight
    let morning = 0; // 6-12
    let afternoon = 0; // 12-18
    let evening = 0; // 18-24
    let night = 0; // 0-6

    for (let i = 0; i < 24; i++) {
        if (i >= 0 && i < 6) night += hours[i];
        else if (i >= 6 && i < 12) morning += hours[i];
        else if (i >= 12 && i < 18) afternoon += hours[i];
        else evening += hours[i];
    }

    const maxPeriod = Math.max(morning, afternoon, evening, night);
    let persona = "Balanced Coder";
    if (maxPeriod === night) persona = "Night Owl";
    if (maxPeriod === morning) persona = "Early Bird";
    if (maxPeriod === afternoon) persona = "Afternoon Architect";
    if (maxPeriod === evening) persona = "Evening Engineer";

    // Format array for Charting
    const chartData = hours.map((count, hour) => ({
        hour: `${hour}:00`,
        commits: count
    }));

    return { chartData, persona, totalCommits };
};

export const processImpactIndex = (repos) => {
    let totalStars = 0;
    let totalForks = 0;

    const mostStarred = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);

    repos.forEach((repo) => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
    });

    return { totalStars, totalForks, mostStarred };
};

export const determineDeveloperClass = (profile, totalStars, totalCommits) => {
    const accountAgeYears = (new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 365.25);

    if (totalStars > 1000) return "Open Source Legend";
    if (totalStars > 100 && accountAgeYears > 3) return "Veteran Architect";
    if (totalStars > 50) return "Rising Star";
    if (profile.public_repos > 50) return "Prolific Creator";
    if (totalCommits > 50) return "Active Contributor";
    if (accountAgeYears < 1) return "Promising Initiate";
    return "Dedicated Developer";
};
