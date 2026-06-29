import { AudioEngine } from './core_audio.js';

export class TracingFeature {
    constructor(app) { this.app = app; this.ctx = null; this.currentNum = 1; }
    
    start(container) {
        this.currentNum = Math.floor(Math.random() * 9) + 1;
        this.render(container);
    }
    
    render(container) {
        container.innerHTML = `
            <div class="tracing-screen fade-in">
                <h2 class="instruction">✏️ ${this.app.i18n.t('tracing')}</h2>
                <div class="canvas-wrapper tracing-wrapper">
                    <canvas id="trace-canvas" width="400" height="400"></canvas>
                    <div class="trace-bg">${this.currentNum}</div>
                </div>
                <div class="canvas-actions">
                    <button class="action-btn clear" id="clear-trace">🗑️</button>
                    <button class="action-btn next" id="next-trace">➡️</button>
                    <button class="action-btn done" id="done-trace">✅</button>
                </div>
            </div>
        `;
        
        const canvas = document.getElementById('trace-canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.lineWidth = 20;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#EF476F';
        this.isDrawing = false;
        
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const touch = e.touches ? e.touches[0] : e;
            return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
        };
        
        const startDraw = (e) => { e.preventDefault(); this.isDrawing = true; const p = getPos(e); this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); };
        const draw = (e) => { if(!this.isDrawing) return; e.preventDefault(); const p = getPos(e); this.ctx.lineTo(p.x, p.y); this.ctx.stroke(); };
        const stopDraw = () => { this.isDrawing = false; };
        
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDraw);
        
        document.getElementById('clear-trace').onclick = () => this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('next-trace').onclick = () => {
            this.currentNum = (this.currentNum % 9) + 1;
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.querySelector('.trace-bg').innerText = this.currentNum;
            AudioEngine.playSfx('pop');
        };
        document.getElementById('done-trace').onclick = () => {
            AudioEngine.playSfx('success');
            this.app.addStar();
            this.app.showConfetti();
            this.app.renderHome();
        };
    }
}