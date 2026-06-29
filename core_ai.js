export const getAIImage = (prompt, w=800, h=1200) => {
    const encoded = encodeURIComponent(prompt);
    // nologo=true keeps it clean for kids, seed=random ensures variety
    return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&nologo=true&seed=${Math.random()}`;
};