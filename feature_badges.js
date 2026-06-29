import { Storage } from './core_storage.js';

export class BadgesFeature {
    constructor(app) { this.app = app; }
    
    render(container) {
        const stats = Storage.getStats();
        const stars = Storage.getStars();
        const stickers = Storage.getStickers();
        const pet = Storage.getPet();
        
        const badges = [
            { id: 'first_star', icon: '⭐', title: { 'zh-CN': '第一颗星', 'en-US': 'First Star' }, condition: stars >= 1 },
            { id: 'star_10', icon: '🌟', title: { 'zh-CN': '十星达人', 'en-US': '10 Stars' }, condition: stars >= 10 },
            { id: 'star_50', icon: '💫', title: { 'zh-CN': '五十星大师', 'en-US': '50 Stars' }, condition: stars >= 50 },
            { id: 'collector', icon: '🎁', title: { 'zh-CN': '贴纸收藏家', 'en-US': 'Collector' }, condition: stickers.length >= 10 },
            { id: 'pet_lover', icon: '🐾', title: { 'zh-CN': '宠物爱好者', 'en-US': 'Pet Lover' }, condition: pet.xp >= 5 },
            { id: 'counter', icon: '🔢', title: { 'zh-CN': '数数高手', 'en-US': 'Counter' }, condition: Storage.getLevel('counting') >= 5 },
            { id: 'adder', icon: '➕', title: { 'zh-CN': '加法小能手', 'en-US': 'Adder' }, condition: Storage.getLevel('addition') >= 5 },
            { id: 'quiz_master', icon: '🏆', title: { 'zh-CN': '测验冠军', 'en-US': 'Quiz Master' }, condition: stats.answered >= 50 }
        ];
        
        container.innerHTML = `
            <div class="badges-screen fade-in">
                <h2 class="instruction">🏅 ${this.app.i18n.t('badges')}</h2>
                <div class="badges-grid">
                    ${badges.map(b => `
                        <div class="badge-card ${b.condition ? 'unlocked' : 'locked'}">
                            <div class="badge-icon">${b.icon}</div>
                            <div class="badge-title">${b.title[this.app.i18n.lang]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}