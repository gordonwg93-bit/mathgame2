import { GAMES } from './games_registry.js';
import { Storage } from './core_storage.js';
import { AudioEngine } from './core_audio.js';

export class QuizFeature {
    constructor(app) { this.app = app; }
    
    start(container) {
        const unlockedGames = GAMES.filter(g => {
            if(!g.requires) return true;
            return Storage.getLevel(g.requires.game) >= g.requires.level;
        });
        
        if(unlockedGames.length === 0) {
            container.innerHTML = `<h2 class="instruction">Play more games to unlock the Quiz!</h2>`;
            return;
        }
        
        this.questions = [];
        for(let i=0; i<25; i++) {
            const game = unlockedGames[Math.floor(Math.random() * unlockedGames.length)];
            const state = game.generate(Storage.getLevel(game.id), this.app.i18n);
            this.questions.push({ ...state, gameId: game.id, gameTitle: game.title[this.app.i18n.lang] });
        }
        
        this.currentIndex = 0;
        this.score = 0;
        this.renderQuestion(container);
    }
    
    renderQuestion(container) {
        if(this.currentIndex >= this.questions.length) {
            this.showResults(container);
            return;
        }
        
        const q = this.questions[this.currentIndex];
        container.innerHTML = `
            <div class="game-screen fade-in">
                <div class="quiz-progress">${this.currentIndex + 1} / 25</div>
                <h2 class="instruction">${q.instruction}</h2>
                <div class="visual-area">${q.visual}</div>
                <div class="options-area">
                    ${q.options.map(opt => `<button class="option-btn" data-val="${opt.value}">${opt.display}</button>`).join('')}
                </div>
            </div>
        `;
        
        AudioEngine.speak(q.tts, this.app.i18n.lang);
        
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                const opt = q.options.find(o => o.value == btn.dataset.val);
                this.handleAnswer(opt, q, container);
            };
        });
    }
    
    handleAnswer(opt, q, container) {
        // --- UPDATED: Pass the gameId ---
        Storage.updateStats(q.gameId, opt.correct);
        
        if(opt.correct) {
            this.score++;
            AudioEngine.playSfx('success');
            this.app.showConfetti();
        } else {
            AudioEngine.playSfx('fail');
            Storage.addMistake({
                game: q.gameTitle,
                question: q.instruction,
                visual: q.visual,
                correctAnswer: q.options.find(o => o.correct).display
            });
        }
        
        setTimeout(() => {
            this.currentIndex++;
            this.renderQuestion(container);
        }, 1500);
    }
    
    showResults(container) {
        container.innerHTML = `
            <div class="game-screen fade-in">
                <h1 style="font-size:4rem;">🏆</h1>
                <h2 class="instruction">${this.score} / 25</h2>
                <p style="font-size:1.5rem;">${this.app.i18n.t('quizDone')}</p>
            </div>
        `;
        AudioEngine.speak(`You got ${this.score} out of 25 correct!`, this.app.i18n.lang);
        
        for(let i=0; i<this.score; i++) {
            setTimeout(() => this.app.addStar(), i * 300);
        }
    }
}