export const MeasureGame = {
    id: 'measure', icon: '📏', title: { 'zh-CN': '比长短高矮', 'en-US': 'Measure' },
    generate(level, i18n) {
        const isHeight = Math.random() > 0.5;
        let visual = '';
        let correct = '';
        let instruction = '';

        if (isHeight) {
            // Compare Tower Heights
            const h1 = Math.floor(Math.random() * 4) + 2; // 2 to 5 blocks
            let h2 = Math.floor(Math.random() * 4) + 2;
            while(h1 === h2) h2 = Math.floor(Math.random() * 4) + 2; // Ensure they aren't equal
            
            visual = `
                <div class="measure-container">
                    <div class="measure-tower">${'🧱'.repeat(h1)}</div>
                    <div class="vs">VS</div>
                    <div class="measure-tower">${'🧱'.repeat(h2)}</div>
                </div>
            `;
            correct = h1 > h2 ? 'left' : 'right';
            instruction = i18n.t('whichTaller');
        } else {
            // Compare Train Lengths
            const l1 = Math.floor(Math.random() * 4) + 2; // 2 to 5 cars
            let l2 = Math.floor(Math.random() * 4) + 2;
            while(l1 === l2) l2 = Math.floor(Math.random() * 4) + 2;
            
            visual = `
                <div class="measure-container">
                    <div class="measure-train">${'🚂'.repeat(l1)}</div>
                    <div class="vs">VS</div>
                    <div class="measure-train">${'🚂'.repeat(l2)}</div>
                </div>
            `;
            correct = l1 > l2 ? 'left' : 'right';
            instruction = i18n.t('whichLonger');
        }

        return {
            instruction: instruction,
            visual: visual,
            options: [
                { value: 'left', display: '⬅️', correct: correct === 'left' },
                { value: 'right', display: '➡️', correct: correct === 'right' }
            ],
            tts: instruction
        };
    }
};