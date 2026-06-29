export const ShapesGame = {
    id: 'shapes', icon: '', title: { 'zh-CN': '认图形', 'en-US': 'Shapes' },
    generate(level, i18n) {
        const shapes = [
            { key: 'circle', emoji: '⭕' },
            { key: 'triangle', emoji: '🔺' },
            { key: 'square', emoji: '' },
            { key: 'star', emoji: '⭐' }
        ];
        
        const target = shapes[Math.floor(Math.random() * shapes.length)];
        const distractors = shapes.filter(s => s.key !== target.key).sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [target, ...distractors].sort(() => Math.random() - 0.5);

        return {
            instruction: i18n.t('listenShape'), // "Listen and tap!"
            visual: `<div style="font-size: 6rem;">👂</div>`, // Big ear icon
            options: options.map(opt => ({ 
                value: opt.key, 
                display: `<span style="font-size: 3.5rem;">${opt.emoji}</span>`, 
                correct: opt.key === target.key 
            })),
            tts: i18n.t(target.key) // Speaks "Circle" or "圆形"
        };
    }
};