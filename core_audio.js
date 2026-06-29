export const AudioEngine = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); },
    playSfx(type) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        if(type === 'pop') { osc.frequency.value = 800; gain.gain.setValueAtTime(0.1, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1); osc.start(); osc.stop(this.ctx.currentTime + 0.1); } 
        else if(type === 'success') { osc.type = 'triangle'; osc.frequency.setValueAtTime(523, this.ctx.currentTime); osc.frequency.setValueAtTime(783, this.ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.2, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5); osc.start(); osc.stop(this.ctx.currentTime + 0.5); } 
        else if(type === 'fail') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, this.ctx.currentTime); osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3); gain.gain.setValueAtTime(0.1, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3); osc.start(); osc.stop(this.ctx.currentTime + 0.3); }
    },
    speak(text, lang = 'zh-CN') {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; utterance.pitch = 1.3; utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
};