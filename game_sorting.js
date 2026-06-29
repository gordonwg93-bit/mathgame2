export const SortingGame = {
    id: 'sorting', icon: '🧺', title: { 'zh-CN': '分类', 'en-US': 'Sorting' },
    generate(level, i18n) {
        const categories = [
            { name: 'red', emoji: '🔴', items: ['🍎', '🍓', '🍒', '🌹'] },
            { name: 'yellow', emoji: '🟡', items: ['🍌', '🍋', '🌟', '🧀'] }
        ];
        
        // Pick a random category and a random item from it
        const targetCat = categories[Math.floor(Math.random() * categories.length)];
        const targetItem = targetCat.items[Math.floor(Math.random() * targetCat.items.length)];
        
        return {
            instruction: i18n.t('sortByColor'),
            visual: `<div style="font-size: 5rem;">${targetItem}</div>`,
            options: categories.map(cat => ({
                value: cat.name,
                display: `<div class="sort-bin">${cat.emoji}<br><span style="font-size:1rem;">${i18n.t(cat.name)}</span></div>`,
                correct: cat.name === targetCat.name
            })),
            tts: i18n.t('sortByColor')
        };
    }
};