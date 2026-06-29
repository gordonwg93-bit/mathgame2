import { getAIImage } from './core_ai.js';
import { AudioEngine } from './core_audio.js';

export class ColoringFeature {
    constructor(app) { this.app = app; this.ctx = null; this.color = '#FF0000'; }

    start(container) {
        const themes = ['cute puppy', 'happy dinosaur', 'magical unicorn', 'fast rocket', 'sweet cake'];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        
        // AI Prompt for clean coloring page
        const prompt = `black and white line art coloring page for kids, cute ${theme}, no shading, thick lines, simple, white background`;
        const imgUrl = getAIImage(prompt, 800, 800);

        container.innerHTML = `
            <div class="coloring-screen fade-in">
                <h2 class="instruction">🎨 ${this.app.i18n.t('coloring')}</h2>
                <div class="canvas-wrapper">
                    <canvas id="color-canvas" width="400" height="400"></canvas>
                    <img id="color-bg" src="${imgUrl}" crossorigin="anonymous" style="display:none;" />
                </div>
                <div class="color-palette">
                    ${['#FF0000', '#0000FF', '#00CC00', '#FFD700', '#FF69B4', '#8A2BE2', '#000000'].map(c => 
                        `<div class="color-swatch" style="background:${c};" data-color="${c}"></div>`
                    ).join('')}
                </div>
                <div class="canvas-actions">
                    <button class="action-btn clear" id="clear-canvas">🗑️</button>
                    <button class="action-btn done" id="done-coloring">✅</button>
                </div>
            </div>
        `;

        const canvas = document.getElementById('color-canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.lineWidth = 15;
        this.ctx.lineCap = 'round';
        this.isDrawing = false;

        const bgImg = document.getElementById('color-bg');
        bgImg.onload = () => {
            // Draw white background first
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw AI image
            this.ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        };

        // Touch/Mouse Events
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const touch = e.touches ? e.touches[0] : e;
            return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
        };

        const startDraw = (e) => { e.preventDefault(); this.isDrawing = true; const p = getPos(e); this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); };
        const draw = (e) => { if(!this.isDrawing) return; e.preventDefault(); const p = getPos(e); this.ctx.strokeStyle = this.color; this.ctx.lineTo(p.x, p.y); this.ctx.stroke(); };
        const stopDraw = () => { this.isDrawing = false; };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDraw);

        // Palette & Actions
        container.querySelectorAll('.color-swatch').forEach(s => {
            s.onclick = () => { this.color = s.dataset.color; AudioEngine.playSfx('pop'); };
        });

        document.getElementById('clear-canvas').onclick = () => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            if(bgImg.complete) this.ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        };

        document.getElementById('done-coloring').onclick = () => {
            AudioEngine.playSfx('success');
            this.app.addStar();
            this.app.showConfetti();
            this.app.renderHome();
        };
    }
}