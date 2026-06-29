import { Storage } from './core_storage.js';

export function getPetHTML(app) {
    const pet = Storage.getPet();
    // 5 Evolution stages: Egg -> Chick -> Baby Bird -> Bird -> Eagle
    const stages = ['🥚', '🐣', '🐥', '🐔', '🦅'];
    const stageIndex = Math.min(Math.floor(pet.xp / 5), stages.length - 1);
    const petEmoji = stages[stageIndex];
    
    return `
        <div class="pet-container">
            <div class="pet-visual">${petEmoji}</div>
            <div class="pet-stats">
                <div class="stat-bar"><div class="stat-fill hunger" style="width: ${pet.hunger}%"></div></div>
                <span>🍎 ${pet.hunger}%</span>
            </div>
            <button class="feed-btn" id="feed-pet">${app.i18n.t('feed')} (5 ⭐)</button>
        </div>
    `;
}