export const CompareGame = {
    id: 'compare', icon: '⚖️', title: { 'zh-CN': '比大小', 'en-US': 'Compare' },
    generate(level, i18n) {
        const maxNum = Math.min(5 + Math.floor(level / 2), 20);
        let num1 = Math.floor(Math.random() * maxNum) + 1;
        let num2 = Math.floor(Math.random() * maxNum) + 1;
        while(num1 === num2) num2 = Math.floor(Math.random() * maxNum) + 1;
        const emoji = ['🍎', '🍌', '🍇', '🚗'][Math.floor(Math.random() * 4)];
        const correct = num1 > num2 ? 'left' : 'right';
        
        return {
            instruction: i18n.t('whichMore'),
            visual: `
                <div class="compare-container">
                    <div class="compare-side left">${emoji.repeat(num1)}</div>
                    <div class="vs">VS</div>
                    <div class="compare-side right">${emoji.repeat(num2)}</div>
                </div>
            `,
            // Changed to standard buttons for Quiz compatibility
            options: [
                { value: 'left', display: '⬅️', correct: correct === 'left' },
                { value: 'right', display: '➡️', correct: correct === 'right' }
            ],
            tts: i18n.t('whichMore')
        };
    }
};