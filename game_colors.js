export const ColorsGame = {
    id: 'colors', icon: '🎨', title: { 'zh-CN': '认颜色', 'en-US': 'Colors' },
    generate(level, i18n) {
        const colorSets = [
            { name: 'red', emoji: '🔴', items: ['🍎', '🍓', '🌹', ''] },
            { name: 'yellow', emoji: '🟡', items: ['🍌', '🌟', '🌻', ''] },
            { name: 'green', emoji: '🟢', items: ['🥦', '🐸', '🍏', '🌿'] },
            { name: 'blue', emoji: '🔵', items: ['🫐', '', '', ''] }
        ];
        
        const targetSet = colorSets[Math.floor(Math.random() * colorSets.length)];
        const targetItem = targetSet.items[Math.floor(Math.random() * targetSet.items.length)];
        
        // Get distractors (different colors)
        const distractors = colorSets
            .filter(set => set.name !== targetSet.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
        
        // Build options with visual color indicators
        const options = [targetSet, ...distractors].sort(() => Math.random() - 0.5);

        return {
            instruction: i18n.t('findColor'),
            visual: `<div style="font-size: 6rem;">${targetItem}</div>`,
            options: options.map(opt => ({
                value: opt.name,
                display: `<div style="font-size: 4rem;">${opt.emoji}</div>`,
                correct: opt.name === targetSet.name
            })),
            tts: i18n.t('findColor')
        };
    }
};