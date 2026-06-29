import { AudioEngine } from './core_audio.js';

export class MemoryFeature {
    constructor(app) { this.app = app; }
    
    start(container) {
        const emojis = ['🍎', '🍌', '🚗', '🐶', '🐱', '🌟', '🎈', '🦋'];
        const pairs = emojis.slice(0, 6); // 6 pairs = 12 cards
        let cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
        
        this.flipped = [];
        this.locked = false;
        
        container.innerHTML = `
            <div class="memory-screen fade-in">
                <h2 class="instruction">🧠 ${this.app.i18n.t('memory')}</h2>
                <div class="memory-grid">
                    ${cards.map((emoji, i) => `
                        <div class="memory-card" data-index="${i}" data-emoji="${emoji}">
                            <div class="card-inner">
                                <div class="card-front">❓</div>
                                <div class="card-back">${emoji}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.querySelectorAll('.memory-card').forEach(card => {
            card.onclick = () => this.flipCard(card);
        });
    }
    
    flipCard(card) {
        if(this.locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        AudioEngine.playSfx('pop');
        this.flipped.push(card);
        
        if(this.flipped.length === 2) {
            this.locked = true;
            const [c1, c2] = this.flipped;
            if(c1.dataset.emoji === c2.dataset.emoji) {
                c1.classList.add('matched');
                c2.classList.add('matched');
                AudioEngine.playSfx('success');
                this.flipped = [];
                this.locked = false;
                this.checkWin();
            } else {
                AudioEngine.playSfx('fail');
                setTimeout(() => {
                    c1.classList.remove('flipped');
                    c2.classList.remove('flipped');
                    this.flipped = [];
                    this.locked = false;
                }, 1000);
            }
        }
    }
    
    checkWin() {
        const allCards = document.querySelectorAll('.memory-card');
        const matchedCards = document.querySelectorAll('.memory-card.matched');
        if(allCards.length === matchedCards.length) {
            setTimeout(() => {
                this.app.addStar();
                this.app.showConfetti();
                AudioEngine.speak(this.app.i18n.t('correct'), this.app.i18n.lang);
                setTimeout(() => this.app.renderHome(), 2000);
            }, 500);
        }
    }
}