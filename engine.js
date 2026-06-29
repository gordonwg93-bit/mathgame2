import { AudioEngine } from './core_audio.js';
import { getAIImage } from './core_ai.js';

export class GameEngine {
    constructor(app) {
        this.app = app;
        this.container = document.getElementById('game-container');
        this.currentLevel = 1;
        this.streak = 0;
    }

    start(gameConfig) {
        this.config = gameConfig;
        this.currentLevel = this.app.storage.getLevel(gameConfig.id);
        this.nextRound();
    }

    nextRound() {
        const state = this.config.generate(this.currentLevel, this.app.i18n);
        this.render(state);
        
        const bgUrl = getAIImage(`soft pastel watercolor background for kids ${this.config.id} theme, minimal, bright`, 800, 1200);
        this.container.style.backgroundImage = `url(${bgUrl})`;
    }

    render(state) {
        this.container.innerHTML = `
            <div class="game-screen fade-in">
                <h2 class="instruction">${state.instruction}</h2>
                <div class="visual-area">${state.visual}</div>
                <div class="options-area">
                    ${state.uiType === 'visual' ? '' : this.generateButtons(state.options)}
                </div>
            </div>
        `;

        AudioEngine.speak(state.tts, this.app.i18n.lang);

        if (state.uiType === 'visual') {
            state.options.forEach(opt => {
                const el = this.container.querySelector(opt.element);
                if(el) el.onclick = () => this.handleAnswer(opt.correct);
            });
        } else {
            this.container.querySelectorAll('.option-btn').forEach(btn => {
                btn.onclick = () => {
                    const opt = state.options.find(o => o.value == btn.dataset.val);
                    this.handleAnswer(opt.correct);
                };
            });
        }
    }

    generateButtons(options) {
        return options.map(opt => `<button class="option-btn" data-val="${opt.value}">${opt.display}</button>`).join('');
    }

    handleAnswer(isCorrect) {
        // --- NEW: Track stats for the Parent Report Chart ---
        this.app.storage.updateStats(this.config.id, isCorrect);

        if (isCorrect) {
            this.streak++;
            if (this.streak % 3 === 0) {
                this.currentLevel++;
                this.app.storage.setLevel(this.config.id, this.currentLevel);
            }
            this.app.addStar();
            AudioEngine.playSfx('success');
            this.app.showConfetti();
            setTimeout(() => this.nextRound(), 1500);
        } else {
            this.streak = 0;
            AudioEngine.playSfx('fail');
            AudioEngine.speak(this.app.i18n.t('wrong'), this.app.i18n.lang);
            this.container.querySelector('.visual-area').classList.add('shake');
            setTimeout(() => this.container.querySelector('.visual-area').classList.remove('shake'), 500);
        }
    }
}