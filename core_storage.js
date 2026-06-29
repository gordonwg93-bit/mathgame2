export const Storage = {
    getStars: () => parseInt(localStorage.getItem('mathStars') || '0'),
    setStars: (val) => localStorage.setItem('mathStars', val),
    
    getLevel: (gameId) => parseInt(localStorage.getItem(`level_${gameId}`) || '1'),
    setLevel: (gameId, val) => localStorage.setItem(`level_${gameId}`, val),
    
    // --- STICKERS (Now saves prompts for stories!) ---
    getStickers: () => {
        const raw = JSON.parse(localStorage.getItem('mathStickers') || '[]');
        // Legacy support: convert old string arrays to objects
        return raw.map(s => typeof s === 'string' ? { url: s, prompt: 'sticker', time: Date.now() } : s);
    },
    addSticker: (url, prompt) => { 
        const stickers = Storage.getStickers(); 
        stickers.push({ url, prompt, time: Date.now() }); 
        localStorage.setItem('mathStickers', JSON.stringify(stickers)); 
    },
    getTodayStickers: () => {
        const stickers = Storage.getStickers();
        const today = new Date().toDateString();
        return stickers.filter(s => new Date(s.time).toDateString() === today);
    },

    // --- STATS ---
    getStats: () => JSON.parse(localStorage.getItem('mathStats') || '{"answered":0,"correct":0,"byGame":{}}'),
    updateStats: (gameId, isCorrect) => {
        const stats = Storage.getStats();
        stats.answered++;
        if(isCorrect) stats.correct++;
        if(!stats.byGame) stats.byGame = {};
        if(!stats.byGame[gameId]) stats.byGame[gameId] = { answered: 0, correct: 0 };
        stats.byGame[gameId].answered++;
        if(isCorrect) stats.byGame[gameId].correct++;
        localStorage.setItem('mathStats', JSON.stringify(stats));
    },
    
    getMistakes: () => JSON.parse(localStorage.getItem('mathMistakes') || '[]'),
    addMistake: (mistakeObj) => { 
        const mistakes = Storage.getMistakes(); 
        mistakes.push({ ...mistakeObj, time: Date.now() }); 
        if(mistakes.length > 50) mistakes.shift(); 
        localStorage.setItem('mathMistakes', JSON.stringify(mistakes)); 
    },
    clearMistakes: () => localStorage.removeItem('mathMistakes'),

    // --- PET ---
    getPet: () => JSON.parse(localStorage.getItem('mathPet') || '{"xp":0,"hunger":100}'),
    feedPet: () => {
        const pet = Storage.getPet();
        pet.xp++;
        pet.hunger = 100;
        localStorage.setItem('mathPet', JSON.stringify(pet));
    },

    // --- DAILY CHALLENGE ---
    getDailyChallenge: () => JSON.parse(localStorage.getItem('mathDaily') || '{"date":"","completed":false,"perfect":false}'),
    setDailyChallenge: (data) => localStorage.setItem('mathDaily', JSON.stringify(data))
};