export const ShadowGame = {
    id: 'shadow', icon: '👤', title: { 'zh-CN': '找影子', 'en-US': 'Shadows' },
    generate(level, i18n) {
        const items = [
            { emoji: '🍎', name: '苹果' }, { emoji: '🐶', name: '小狗' }, 
            { emoji: '🚗', name: '汽车' }, { emoji: '🌟', name: '星星' },
            { emoji: '🐱', name: '小猫' }, { emoji: '🌂', name: '雨伞' }
        ];
        
        const target = items[Math.floor(Math.random() * items.length)];
        const distractors = items.filter(i => i.emoji !== target.emoji).sort(() => Math.random() - 0.5).slice(0, 2);
        
        const options = [target, ...distractors].sort(() => Math.random() - 0.5);

        return {
            instruction: i18n.t('whoseShadow'),
            visual: `<div style="font-size: 6rem; filter: brightness(0); transition: filter 0.5s;">${target.emoji}</div>`,
            options: options.map(opt => ({ 
                value: opt.emoji, 
                display: `<span style="font-size:2.5rem;">${opt.emoji}</span>`, 
                correct: opt.emoji === target.emoji 
            })),
            tts: i18n.t('whoseShadow')
        };
    }
};