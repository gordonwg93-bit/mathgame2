export const getAIImage = (prompt, w=800, h=1200) => {
    const encoded = encodeURIComponent(prompt);
    // nologo=true keeps it clean for kids, seed=random ensures variety
    return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&nologo=true&seed=${Math.random()}`;
};

// Returns a cached background URL for a given theme, generating a new one
// only the first time that theme is seen in this browser session.
// Prevents re-fetching a brand-new AI image from the network on every
// single round (which was happening every ~1.5s during fast play).
export const getCachedThemeBackground = (themeKey, promptBuilder) => {
    const cacheKey = `aiBg_${themeKey}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
    const url = promptBuilder();
    try { sessionStorage.setItem(cacheKey, url); } catch (e) { /* storage full or unavailable, ignore */ }
    return url;
};
