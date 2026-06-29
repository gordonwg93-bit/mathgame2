export const ShapesGame = {
    id: 'shapes', icon: '🟥', title: { 'zh-CN': '认图形', 'en-US': 'Shapes' },
    generate(level, i18n) {
        const shapes = [
            { emoji: '⭕', key: 'circle' },
            { emoji: '🔺', key: 'triangle' },
            { emoji: '🟦', key: 'square' },
            { emoji: '⭐', key: 'star' }
        ];
        
        const target = shapes[Math.floor(Math.random() * shapes.length)];
        const distractors = shapes.filter(s => s.key !== target.key).sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [target, ...distractors].sort(() => Math.random() - 0.5);

        return {
            instruction: i18n.t('whatShape'),
            visual: `<div style="font-size: 8rem;">${target.emoji}</div>`,
            options: options.map(opt => ({ 
                value: opt.key, 
                display: i18n.t(opt.key), 
                correct: opt.key === target.key 
            })),
            tts: i18n.t('whatShape')
        };
    }
};