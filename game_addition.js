export const AdditionGame = {
    id: 'addition', icon: '➕', title: { 'zh-CN': '加法', 'en-US': 'Addition' },
    generate(level, i18n) {
        // Individual numbers go up to 10, so the max sum is 20
        const maxNum = Math.min(2 + Math.floor(level / 2), 10);
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * maxNum) + 1;
        const sum = a + b;
        
        const emoji = ['🍎', '🍌', '🍇', '🚗'][Math.floor(Math.random() * 4)];
        
        let opts = new Set([sum]);
        while(opts.size < 3) {
            // Generate wrong answers close to the real sum to make it slightly harder
            let rnd = sum + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
            if (rnd > 0 && rnd !== sum) opts.add(rnd);
        }
        const options = Array.from(opts).sort(() => Math.random() - 0.5);

        return {
            instruction: `${a} + ${b} = ?`,
            visual: `<div class="math-equation" style="font-size:2.5rem;">${emoji.repeat(a)} ➕ ${emoji.repeat(b)} 🟰 ❓</div>`,
            options: options.map(val => ({ value: val, display: val, correct: val === sum })),
            tts: `${a} plus ${b} equals what?`
        };
    }
};