import { Storage } from './core_storage.js';
import { AudioEngine } from './core_audio.js';

export class StoryFeature {
    constructor(app) { this.app = app; }

    start(container) {
        const todayStickers = Storage.getTodayStickers();
        
        if(todayStickers.length === 0) {
            container.innerHTML = `
                <div class="game-screen fade-in">
                    <h1 style="font-size:4rem;">🌙</h1>
                    <h2 class="instruction">${this.app.i18n.t('noStickersToday')}</h2>
                    <p style="font-size:1.2rem;">${this.app.i18n.t('playToEarnStory')}</p>
                </div>
            `;
            return;
        }

        // Pick up to 3 stickers for the story
        const chars = todayStickers.slice(0, 3).map(s => s.prompt || 'cute animal');
        
        let storyText = '';
        if(this.app.i18n.lang === 'zh-CN') {
            storyText = `从前，有一个可爱的${chars[0]}。有一天，它去森林里玩，遇到了${chars[1]}。他们一起找到了${chars[2]}，开心地玩了一整天。天黑了，他们互道晚安，甜甜地睡着了。`;
        } else {
            storyText = `Once upon a time, there was a lovely ${chars[0]}. One day, it went to the forest and met a ${chars[1]}. Together, they found a ${chars[2]} and played happily all day. When it got dark, they said goodnight and fell fast asleep.`;
        }

        container.innerHTML = `
            <div class="story-screen fade-in">
                <h1 style="font-size:4rem;">🌙</h1>
                <h2 class="instruction">${this.app.i18n.t('bedtimeStory')}</h2>
                <div class="story-box">
                    <p class="story-text">${storyText}</p>
                </div>
                <button class="action-btn play-story" id="play-story-btn">🔊 ${this.app.i18n.t('readAloud')}</button>
                <button class="action-btn stop-story" id="stop-story-btn" style="display:none;">🛑 ${this.app.i18n.t('stop')}</button>
            </div>
        `;

        const playBtn = document.getElementById('play-story-btn');
        const stopBtn = document.getElementById('stop-story-btn');

        playBtn.onclick = () => {
            AudioEngine.speak(storyText, this.app.i18n.lang);
            playBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
        };

        stopBtn.onclick = () => {
            window.speechSynthesis.cancel();
            playBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
        };
    }
}