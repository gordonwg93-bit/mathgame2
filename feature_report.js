import { Storage } from './core_storage.js';
import { GAMES } from './games_registry.js';

export class ReportFeature {
    constructor(app) { this.app = app; }
    
    render(container) {
        const stats = Storage.getStats();
        const mistakes = Storage.getMistakes();
        const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
        
        // --- BUILD CHART ---
        let chartHTML = '';
        const byGame = stats.byGame || {};
        for(const gameId in byGame) {
            const g = byGame[gameId];
            const acc = g.answered > 0 ? Math.round((g.correct / g.answered) * 100) : 0;
            const gameConfig = GAMES.find(gm => gm.id === gameId);
            const title = gameConfig ? gameConfig.title[this.app.i18n.lang] : gameId;
            
            // Color code: Green > 80%, Yellow > 50%, Red < 50%
            const color = acc >= 80 ? 'var(--secondary)' : acc >= 50 ? 'var(--primary)' : 'var(--accent)';
            
            chartHTML += `
                <div class="chart-row">
                    <div class="chart-label">${title}</div>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${acc}%; background: ${color};"></div>
                    </div>
                    <div class="chart-val">${acc}%</div>
                </div>
            `;
        }
        if(!chartHTML) chartHTML = '<p>Play some games to see your progress chart!</p>';
        
        // --- BUILD MISTAKES ---
        let mistakesHTML = '';
        if(mistakes.length === 0) {
            mistakesHTML = `<p class="no-mistakes">${this.app.i18n.t('noMistakes')}</p>`;
        } else {
            mistakesHTML = mistakes.slice().reverse().map(m => `
                <div class="mistake-card">
                    <div class="mistake-game">${m.game}</div>
                    <div class="mistake-q">${m.question}</div>
                    <div class="mistake-visual">${m.visual}</div>
                    <div class="mistake-ans">${this.app.i18n.t('correctAns')}: <strong>${m.correctAnswer}</strong></div>
                </div>
            `).join('');
        }
        
        container.innerHTML = `
            <div class="report-screen fade-in">
                <h2 class="instruction">📊 ${this.app.i18n.t('parentReport')}</h2>
                
                <div class="stats-grid">
                    <div class="stat-box"><div class="stat-num">${Storage.getStars()}</div><div class="stat-label">${this.app.i18n.t('totalStars')}</div></div>
                    <div class="stat-box"><div class="stat-num">${stats.answered}</div><div class="stat-label">${this.app.i18n.t('questions')}</div></div>
                    <div class="stat-box"><div class="stat-num">${accuracy}%</div><div class="stat-label">${this.app.i18n.t('accuracy')}</div></div>
                </div>
                
                <h3 class="section-title">📈 ${this.app.i18n.lang === 'zh-CN' ? '能力图表' : 'Performance Chart'}</h3>
                <div class="chart-container">
                    ${chartHTML}
                </div>
                
                <h3 class="section-title">⚠️ ${this.app.i18n.t('weaknesses')} (${mistakes.length})</h3>
                <div class="mistakes-list">
                    ${mistakesHTML}
                </div>
                
                <button class="clear-btn" id="clear-mistakes">🗑️ ${this.app.i18n.t('clearHistory')}</button>
            </div>
        `;
        
        document.getElementById('clear-mistakes').onclick = () => {
            if(confirm('Clear all mistake history?')) {
                Storage.clearMistakes();
                this.render(container);
            }
        };
    }
}