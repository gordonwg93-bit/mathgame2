export const CountingGame = {
    id: 'counting', icon: '🔢', title: { 'zh-CN': '数一数', 'en-US': 'Counting' },
    generate(level, i18n) {
        // Starts at 5, scales up, caps at 20
        const maxNum = Math.min(5 + Math.floor(level / 2), 20);
        const target = Math.floor(Math.random() * maxNum) + 1;
        
        const items = ['🍎', '🍌', '🍇', '🚗', '🐶', '🐱', '🐸', '🦋', '🌟', '🎈'];
        const emoji = items[Math.floor(Math.random() * items.length)];
        
        let opts = new Set([target]);
        while(opts.size < 3) { 
            let rnd = Math.floor(Math.random() * maxNum) + 1; 
            if (rnd !== target) opts.add(rnd); 
        }
        const options = Array.from(opts).sort(() => Math.random() - 0.5);

        return {
            instruction: `${i18n.t('howMany')} ${emoji} ?`,
            visual: `<div class="emoji-grid">${emoji.repeat(target)}</div>`,
            options: options.map(val => ({ value: val, display: val, correct: val === target })),
            tts: i18n.t('howMany')
        };
    }
};