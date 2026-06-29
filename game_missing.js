export const MissingGame = {
    id: 'missing', icon: '🔍', title: { 'zh-CN': '找缺数', 'en-US': 'Missing No.' },
    generate(level, i18n) {
        const maxVal = Math.min(5 + Math.floor(level / 2), 20);
        const seqLength = Math.min(3 + Math.floor(level / 3), 5); // 3 to 5 numbers in sequence
        
        // Pick a random starting point
        const start = Math.floor(Math.random() * (maxVal - seqLength)) + 1;
        const missingIndex = Math.floor(Math.random() * seqLength);
        const correctNum = start + missingIndex;
        
        // Build the sequence UI
        let seqUI = '';
        for(let i=0; i<seqLength; i++) {
            const num = start + i;
            if(i === missingIndex) {
                seqUI += `<div style="background:white; border:3px dashed var(--accent); border-radius:15px; width:60px; height:60px; display:flex; align-items:center; justify-content:center; font-size:2rem; color:var(--accent);">?</div>`;
            } else {
                seqUI += `<div style="background:white; border:3px solid var(--primary); border-radius:15px; width:60px; height:60px; display:flex; align-items:center; justify-content:center; font-size:2rem; font-weight:bold;">${num}</div>`;
            }
        }
        
        let opts = new Set([correctNum]);
        while(opts.size < 3) {
            let rnd = correctNum + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
            if (rnd > 0 && rnd <= 20 && rnd !== correctNum) opts.add(rnd);
        }
        const options = Array.from(opts).sort(() => Math.random() - 0.5);

        return {
            instruction: i18n.t('missingNum'),
            visual: `<div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">${seqUI}</div>`,
            options: options.map(val => ({ value: val, display: val, correct: val === correctNum })),
            tts: i18n.t('missingNum')
        };
    }
};