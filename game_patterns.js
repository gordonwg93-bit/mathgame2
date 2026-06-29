export const PatternGame = {
    id: 'patterns', icon: '🧩', title: { 'zh-CN': '找规律', 'en-US': 'Patterns' },
    generate(level, i18n) {
        const complexity = Math.min(2 + Math.floor(level / 3), 4);
        const items = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '🔶', '🔷'];
        const sequence = [];
        for(let i=0; i<complexity; i++) sequence.push(items[Math.floor(Math.random() * items.length)]);
        const uniqueSeq = [...new Set(sequence)];
        if (uniqueSeq.length < 2) return this.generate(level, i18n);
        
        const pattern = [];
        for(let i=0; i<3; i++) pattern.push(...uniqueSeq);
        const answer = pattern.pop();
        
        let opts = new Set([answer]);
        while(opts.size < 3) opts.add(items[Math.floor(Math.random() * items.length)]);
        const options = Array.from(opts).sort(() => Math.random() - 0.5);

        return {
            instruction: i18n.t('whatNext'),
            visual: `<div class="pattern-seq">${pattern.join(' ')} <span class="question-mark">❓</span></div>`,
            options: options.map(val => ({ value: val, display: val, correct: val === answer })),
            tts: i18n.t('whatNext')
        };
    }
};