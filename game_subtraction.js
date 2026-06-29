export const SubtractionGame = {
    id: 'subtraction', icon: '➖', title: { 'zh-CN': '减法', 'en-US': 'Subtraction' },
    generate(level, i18n) {
        // Cap at 12 so the visual emojis don't take up the whole screen
        const maxNum = Math.min(5 + Math.floor(level / 2), 12); 
        const a = Math.floor(Math.random() * maxNum) + 2; // Min 2
        const b = Math.floor(Math.random() * a) + 1;      // Can't subtract more than we have
        const diff = a - b;
        
        const emoji = ['🍎', '🍌', '🍇', '🚗', '🐶'][Math.floor(Math.random() * 5)];
        
        // Create the visual: show 'a' emojis, but make the first 'b' ones faded and crossed out
        const visualItems = emoji.repeat(a).split('').map((e, i) => 
            i < b ? `<span style="opacity:0.3; text-decoration:line-through; color:red;">${e}</span>` : e
        ).join('');
        
        let opts = new Set([diff]);
        while(opts.size < 3) {
            let rnd = diff + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
            if (rnd >= 0 && rnd !== diff) opts.add(rnd);
        }
        const options = Array.from(opts).sort(() => Math.random() - 0.5);

        return {
            instruction: `${a} - ${b} = ?`,
            visual: `<div style="font-size:3rem; line-height:1.5;">${visualItems}</div>`,
            options: options.map(val => ({ value: val, display: val, correct: val === diff })),
            tts: i18n.t('minusEqualsWhat', { a, b })
        };
    }
};
