import { I18n } from './core_i18n.js';
import { AudioEngine } from './core_audio.js';
import { Storage } from './core_storage.js';
import { GAMES } from './games_registry.js';
import { GameEngine } from './engine.js';
import { Album } from './feature_album.js';
import { QuizFeature } from './feature_quiz.js';
import { ReportFeature } from './feature_report.js';
import { getPetHTML } from './feature_pet.js';
import { ColoringFeature } from './feature_coloring.js';
import { DailyFeature } from './feature_daily.js';
import { StoryFeature } from './feature_story.js';
import { MemoryFeature } from './feature_memory.js';
import { TracingFeature } from './feature_tracing.js';
import { BadgesFeature } from './feature_badges.js';

class MathApp {
    constructor() {
        this.i18n = new I18n();
        this.storage = Storage;
        this.engine = new GameEngine(this);
        this.album = new Album(this);
        this.quiz = new QuizFeature(this);
        this.report = new ReportFeature(this);
        this.coloring = new ColoringFeature(this);
        this.daily = new DailyFeature(this);
        this.story = new StoryFeature(this);
        this.memory = new MemoryFeature(this);
        this.tracing = new TracingFeature(this);
        this.badges = new BadgesFeature(this);
        this.parentGatePassed = false;
        this.init();
    }

    init() {
        document.addEventListener('touchstart', () => AudioEngine.init(), { once: true });
        
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) langToggle.onclick = () => this.handleSettingsClick();

        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) homeBtn.onclick = () => this.renderHome();

        const albumBtn = document.getElementById('album-btn');
        if (albumBtn) albumBtn.onclick = () => this.album.render(document.getElementById('game-container'));

        const reportBtn = document.getElementById('report-btn');
        if (reportBtn) reportBtn.onclick = () => this.handleReportClick();
        
        this.updateStars();
        this.renderHome();
    }

    updateStars() { 
        const starCount = document.getElementById('star-count');
        if (starCount) {
            starCount.innerText = this.storage.getStars(); 
        }
    }

    addStar() {
        const current = this.storage.getStars() + 1;
        this.storage.setStars(current);
        this.updateStars();
        if(current % 5 === 0) this.earnSticker();
    }

    earnSticker() {
        const themes = ['cute kawaii cat', 'happy dinosaur', 'magical unicorn', 'space rocket', 'friendly robot'];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(theme + ' sticker vector white background')}?width=512&height=512&nologo=true&seed=${Math.random()}`;
        this.storage.addSticker(url, theme);
        AudioEngine.speak(this.i18n.t('newSticker'), this.i18n.lang);
    }

    showConfetti() {
        const emojis = ['🎉', '🎊', '🌟', '✨', '🎈'];
        for(let i=0; i<20; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            c.style.left = Math.random() * 100 + 'vw';
            c.style.animationDuration = (Math.random() * 2 + 1) + 's';
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 3000);
        }
    }

    handleSettingsClick() {
        if(this.parentGatePassed) {
            this.i18n.setLang(this.i18n.lang === 'zh-CN' ? 'en-US' : 'zh-CN');
            this.renderHome();
        } else {
            this.showParentGate(() => this.handleSettingsClick());
        }
    }

    handleReportClick() {
        if(this.parentGatePassed) {
            this.report.render(document.getElementById('game-container'));
        } else {
            this.showParentGate(() => this.report.render(document.getElementById('game-container')));
        }
    }

    showParentGate(callback) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-box">
                <h3>Parent Gate</h3>
                <p>12 + 15 = ?</p>
                <input type="number" id="gate-input">
                <br><br>
                <button class="option-btn" id="gate-submit">✅</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        const gateSubmit = document.getElementById('gate-submit');
        if (gateSubmit) {
            gateSubmit.onclick = () => {
                const gateInput = document.getElementById('gate-input');
                if(gateInput && gateInput.value == '27') {
                    this.parentGatePassed = true;
                    modal.remove();
                    if(callback) callback();
                }
            };
        }
    }

    renderHome() {
        const c = document.getElementById('game-container');
        if (!c) return;
        c.style.backgroundImage = ''; 
        
        // Render games dynamically with safety fallbacks for values
        const gamesHTML = (GAMES && Array.isArray(GAMES)) ? GAMES.map(game => {
            if (!game) return '';
            const locked = game.requires && this.storage.getLevel(game.requires.game) < game.requires.level;
            const isNew = !locked && this.storage.getLevel(game.id) === 1; 
            const titleText = (game.title && game.title[this.i18n.lang]) ? game.title[this.i18n.lang] : (game.id || 'Math Game');
            return `
                <div class="menu-card ${locked ? 'locked' : ''}" data-id="${game.id || ''}">
                    ${isNew ? '<div class="new-badge">NEW</div>' : ''}
                    <div class="card-icon">${game.icon || '🎮'}</div>
                    <div class="card-text">${titleText}</div>
                </div>
            `;
        }).join('') : '';

        c.innerHTML = `
            ${getPetHTML ? getPetHTML(this) : ''}
            <h1 class="app-title" style="font-size: 2.5rem; text-shadow: 2px 2px 0px white; margin-bottom: 1rem;">${this.i18n.t('appTitle')}</h1>
            
            <h3 class="section-header">🎮 ${this.i18n.t('games')}</h3>
            <div class="menu-grid">
                ${gamesHTML}
            </div>
            
            <h3 class="section-header">✨ ${this.i18n.t('activities')}</h3>
            <div class="menu-grid">
                <div class="menu-card special coloring" id="coloring-card">
                    <div class="card-icon">🎨</div>
                    <div class="card-text">${this.i18n.t('coloring')}</div>
                </div>
                <div class="menu-card special tracing" id="tracing-card">
                    <div class="card-icon">✏️</div>
                    <div class="card-text">${this.i18n.t('tracing')}</div>
                </div>
                <div class="menu-card special memory" id="memory-card">
                    <div class="card-icon">🧠</div>
                    <div class="card-text">${this.i18n.t('memory')}</div>
                </div>
            </div>
            
            <h3 class="section-header">🏆 ${this.i18n.t('challenges')}</h3>
            <div class="menu-grid">
                <div class="menu-card special daily" id="daily-card">
                    <div class="card-icon">⚡</div>
                    <div class="card-text">${this.i18n.t('dailyChallenge')}</div>
                </div>
                <div class="menu-card quiz" id="quiz-card">
                    <div class="card-icon">🏆</div>
                    <div class="card-text">${this.i18n.t('quiz')}</div>
                </div>
                <div class="menu-card special story" id="story-card">
                    <div class="card-icon">🌙</div>
                    <div class="card-text">${this.i18n.t('bedtimeStory')}</div>
                </div>
                <div class="menu-card special badges" id="badges-card">
                    <div class="card-icon">🏅</div>
                    <div class="card-text">${this.i18n.t('badges')}</div>
                </div>
            </div>
        `;

        // Safe Pet Logic Event Target Binding
        const feedPetBtn = document.getElementById('feed-pet');
        if (feedPetBtn) {
            feedPetBtn.onclick = () => {
                if(this.storage.getStars() >= 5) {
                    this.storage.setStars(this.storage.getStars() - 5);
                    this.updateStars();
                    Storage.feedPet();
                    AudioEngine.playSfx('success');
                    AudioEngine.speak(this.i18n.t('yum'), this.i18n.lang);
                    this.renderHome();
                } else {
                    AudioEngine.playSfx('fail');
                    AudioEngine.speak(this.i18n.t('needStars'), this.i18n.lang);
                }
            };
        }

        // Safe Game Grid Interactivity Click Handling
        c.querySelectorAll('.menu-card:not(.locked):not(.special):not(.quiz)').forEach(card => {
            card.onclick = () => {
                const gameConfig = GAMES.find(g => g && g.id === card.dataset.id);
                if (gameConfig) {
                    AudioEngine.playSfx('pop');
                    this.engine.start(gameConfig);
                }
            };
        });

        // Safe Special Features Event Interactivity Bindings
        const coloringCard = document.getElementById('coloring-card');
        if (coloringCard) coloringCard.onclick = () => { AudioEngine.playSfx('pop'); this.coloring.start(c); };

        const tracingCard = document.getElementById('tracing-card');
        if (tracingCard) tracingCard.onclick = () => { AudioEngine.playSfx('pop'); this.tracing.start(c); };

        const memoryCard = document.getElementById('memory-card');
        if (memoryCard) memoryCard.onclick = () => { AudioEngine.playSfx('pop'); this.memory.start(c); };

        const dailyCard = document.getElementById('daily-card');
        if (dailyCard) dailyCard.onclick = () => { AudioEngine.playSfx('pop'); this.daily.start(c); };

        const storyCard = document.getElementById('story-card');
        if (storyCard) storyCard.onclick = () => { AudioEngine.playSfx('pop'); this.story.start(c); };

        const badgesCard = document.getElementById('badges-card');
        if (badgesCard) badgesCard.onclick = () => { AudioEngine.playSfx('pop'); this.badges.render(c); };

        const quizCard = document.getElementById('quiz-card');
        if (quizCard) quizCard.onclick = () => { AudioEngine.playSfx('pop'); this.quiz.start(c); };
    }
}
const app = new MathApp();