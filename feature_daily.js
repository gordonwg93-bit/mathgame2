import { GAMES } from './games_registry.js';
import { Storage } from './core_storage.js';
import { AudioEngine } from './core_audio.js';

export class DailyFeature {
    constructor(app) { this.app = app; }

    start(container) {
        const today = new Date().toDateString();
        let daily = Storage.getDailyChallenge();
        
        // Reset if it's a new day
        if (daily.date !== today) {
            daily = { date: today, completed: false, perfect: false };
            Storage.setDailyChallenge(daily);
        }

        if (daily.completed) {
            container.innerHTML = `
                <div class="game-screen fade-in">
                    <h1 style="font-size:5rem;">${daily.perfect ? '🏆' : '✅'}</h1>
                    <h2 class="instruction">${this.app.i18n.t('dailyDone')}</h2>
                    <p style="font-size:1.5rem;">${this.app.i18n.t('comeBackTomorrow')}</p>
                </div>
            `;
            return;
        }

        // Generate 5 Boss Questions (slightly higher level)
        const unlockedGames = GAMES.filter(g => !g.requires || Storage.getLevel(g.requires.game) >= g.requires.level);
        this.questions = [];
        for(let i=0; i<5; i++) {
            const game = unlockedGames[Math.floor(Math.random() * unlockedGames.length)];
            const currentLvl = Storage.getLevel(game.id);
            const state = game.generate(currentLvl + 2, this.app.i18n); // Boss mode: +2 levels harder!
            this.questions.push({ ...state, gameId: game.id, gameTitle: game.title[this.app.i18n.lang] });
        }

        this.currentIndex = 0;
        this.score = 0;
        this.renderQuestion(container);
    }

    renderQuestion(container) {
        if(this.currentIndex >= this.questions.length) return this.finish(container);
        
        const q = this.questions[this.currentIndex];
        container.innerHTML = `
            <div class="game-screen fade-in">
                <div class="quiz-progress daily-progress">${this.currentIndex + 1} / 5 ⚡</div>
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
                if(opt.correct) { this.score++; AudioEngine.playSfx('success'); } 
                else { AudioEngine.playSfx('fail'); }
                
                setTimeout(() => { this.currentIndex++; this.renderQuestion(container); }, 1000);
            };
        });
    }

    finish(container) {
        const daily = Storage.getDailyChallenge();
        daily.completed = true;
        const isPerfect = this.score === 5;
        daily.perfect = isPerfect;
        Storage.setDailyChallenge(daily);

        if(isPerfect) {
            // Award Golden Trophy
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent('shiny golden trophy cup 3d render white background')}?width=512&height=512&nologo=true&seed=${Math.random()}`;
            Storage.addSticker(url, 'golden trophy');
            this.app.showConfetti();
            AudioEngine.speak(this.app.i18n.t('perfectDaily'), this.app.i18n.lang);
        }

        // Award stars
        for(let i=0; i<this.score * 2; i++) setTimeout(() => this.app.addStar(), i * 200);

        container.innerHTML = `
            <div class="game-screen fade-in">
                <h1 style="font-size:5rem;">${isPerfect ? '🏆' : '🎖️'}</h1>
                <h2 class="instruction">${this.score} / 5</h2>
                <p style="font-size:1.5rem;">${isPerfect ? this.app.i18n.t('perfectDaily') : this.app.i18n.t('goodJobDaily')}</p>
            </div>
        `;
    }
}