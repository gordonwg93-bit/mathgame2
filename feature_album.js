export class Album {
    constructor(app) { this.app = app; }
    render(container) {
        const stickers = this.app.storage.getStickers();
        container.innerHTML = `
            <div class="game-screen fade-in">
                <h2 class="instruction">🎁 ${this.app.i18n.lang === 'zh-CN' ? '贴纸本' : 'Sticker Album'}</h2>
                <div class="album-grid">
                    ${stickers.map(s => `<img src="${s.url}" class="fade-in" />`).join('')}
                    ${stickers.length === 0 ? '<p>Keep playing to earn AI stickers!</p>' : ''}
                </div>
            </div>
        `;
    }
}