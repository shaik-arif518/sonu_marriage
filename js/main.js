/* ================================================================
   FALLING PARTICLES — Flowers, Petals, Hearts & Sparkles Engine
================================================================ */
(function initParticleEngine() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PETAL_COLORS = ['#D4806A', '#E8C07A', '#C9963E', '#B85940', '#EEDDD3', '#F5E4C0', '#E75480'];
    const HEART_COLORS = ['#B85940', '#D4806A', '#E75480', '#C9963E', '#FF69B4'];
    const COUNT = window.innerWidth < 600 ? 32 : 55;
    const particles = [];

    class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height * 1.5 - canvas.height * 0.5 : -25;
            this.size = 6 + Math.random() * 8;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = 0.6 + Math.random() * 1.3;
            this.rot = Math.random() * Math.PI * 2;
            this.drot = (Math.random() - 0.5) * 0.04;
            this.alpha = 0.55 + Math.random() * 0.4;
            this.swaySpeed = 0.01 + Math.random() * 0.02;
            
            const rand = Math.random();
            if (rand < 0.45) {
                this.type = 'petal';
                this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            } else if (rand < 0.75) {
                this.type = 'heart';
                this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
            } else if (rand < 0.90) {
                this.type = 'flower';
                this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            } else {
                this.type = 'sparkle';
                this.color = '#FFF8F3';
            }
        }

        update() {
            this.x += this.vx + Math.sin(this.y * this.swaySpeed) * 0.6;
            this.y += this.vy;
            this.rot += this.drot;
            if (this.y > canvas.height + 30) this.reset(false);
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.globalAlpha = this.alpha;

            if (this.type === 'petal') {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'heart') {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const s = this.size * 0.6;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.2, s * 0.5, 0, s * 1.3);
                ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.6, 0, s * 0.3);
                ctx.fill();
            } else if (this.type === 'flower') {
                ctx.fillStyle = this.color;
                const petalsCount = 5;
                for (let i = 0; i < petalsCount; i++) {
                    ctx.rotate((Math.PI * 2) / petalsCount);
                    ctx.beginPath();
                    ctx.ellipse(0, this.size * 0.4, this.size * 0.3, this.size * 0.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = '#E8C07A';
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'sparkle') {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        raf = requestAnimationFrame(loop);
    }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else loop();
    });
    loop();
})();

/* ================================================================
   COUNTDOWN TIMER LOGIC
================================================================ */
let countdownInterval;
function startCountdown() {
    const weddingDate = new Date("August 27, 2026 21:00:00").getTime();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    const container = document.getElementById('countdown-container');

    if (!daysEl || !hoursEl || !minsEl || !secsEl || !container) return;

    function updateTimer() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minsEl.innerText = "00";
            secsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? "0" + days : days;
        hoursEl.innerText = hours < 10 ? "0" + hours : hours;
        minsEl.innerText = minutes < 10 ? "0" + minutes : minutes;
        secsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
    }
    
    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
    container.classList.add('revealed');
}

/* ================================================================
   3 HEARTS SCRATCH TO REVEAL LOGIC
================================================================ */
class ScratchHeart {
    constructor(canvasId, containerId, onReveal) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.container = document.getElementById(containerId);
        this.onReveal = onReveal;
        this.isDrawing = false;
        this.revealed = false;
        this.init();
    }
    init() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.ctx.fillStyle = '#B85940';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = 'rgba(255,255,255,0.75)';
        this.ctx.font = "12px 'Tenor Sans', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("SCRATCH", this.width / 2, this.height / 2 + 4);

        this.canvas.addEventListener('mousedown', (e) => { this.isDrawing = true; this.scratch(e); });
        this.canvas.addEventListener('touchstart', (e) => { this.isDrawing = true; this.scratch(e); }, { passive: false });
        window.addEventListener('mouseup', () => { this.isDrawing = false; });
        window.addEventListener('touchend', () => { this.isDrawing = false; });
        this.canvas.addEventListener('mousemove', (e) => this.scratch(e));
        this.canvas.addEventListener('touchmove', (e) => this.scratch(e), { passive: false });
    }
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }
    scratch(e) {
        if (!this.isDrawing || this.revealed) return;
        if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
        const pos = this.getMousePos(e);
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.width * 0.22, 0, Math.PI * 2);
        this.ctx.fill();
        if (Math.random() > 0.2) this.checkProgress();
    }
    checkProgress() {
        if (this.revealed) return;
        const sampleRate = 32; 
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        for (let i = 3; i < pixels.length; i += sampleRate) {
            if (pixels[i] < 128) transparentPixels++;
        }
        const totalPixels = pixels.length / sampleRate;
        if ((transparentPixels / totalPixels) * 100 > 45) {
            this.revealAll();
        }
    }
    revealAll() {
        this.revealed = true;
        this.canvas.style.opacity = '0';
        setTimeout(() => {
            this.canvas.style.display = 'none';
            if (typeof this.onReveal === 'function') this.onReveal();
        }, 1000);
    }
}

function initScratchHearts() {
    let revealedHeartsCount = 0;
    const totalHearts = 3;

    function checkAllRevealed() {
        revealedHeartsCount++;
        if (revealedHeartsCount === totalHearts) {
            const heartsRow = document.getElementById('heartsRow');
            if (heartsRow) heartsRow.classList.add('unlocked');
            
            const surpriseMsg = document.getElementById('surpriseMessage');
            if (surpriseMsg) {
                setTimeout(() => { 
                    surpriseMsg.classList.add('revealed');
                    startCountdown();
                }, 500);
            }

            setTimeout(() => {
                const duration = 3000;
                const end = Date.now() + duration;
                const colors = ['#B85940', '#C9963E', '#E8C07A', '#FFFFFF'];

                (function frame() {
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0, y: 0.6 },
                            colors: colors,
                            zIndex: 9999
                        });
                        confetti({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1, y: 0.6 },
                            colors: colors,
                            zIndex: 9999
                        });
                    }

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }, 800);
        }
    }

    new ScratchHeart('scratchCanvas1', 'heartContainer1', checkAllRevealed);
    new ScratchHeart('scratchCanvas2', 'heartContainer2', checkAllRevealed);
    new ScratchHeart('scratchCanvas3', 'heartContainer3', checkAllRevealed);
}

/* ================================================================
   ENTRY GATE & SCROLLING (S&R Custom Wax Seal Envelope Gate)
============================================================ */
const gate        = document.getElementById('entry-gate');
const envCard     = document.getElementById('envelope-card');
const waxSealBtn  = document.getElementById('wax-seal-btn');
const bgAudio     = document.getElementById('bg-audio');
const mainEl      = document.getElementById('main-content');
const petalCanvas = document.getElementById('petals-canvas');

let audioPlaying = false;
let mainRevealed = false;
let scratchInitialized = false;

function revealMain() {
    if (mainRevealed) return;
    mainRevealed = true;
    if (gate) {
        gate.classList.add('fade-out');
        setTimeout(() => { gate.style.display = 'none'; }, 900);
    }
    if (mainEl) mainEl.classList.add('visible', 'fade-in');
    if (petalCanvas) petalCanvas.classList.add('active');
    document.body.style.overflow = 'auto';
    initReveal();
    initEventAutoExpand(); 
    
    if (!scratchInitialized) {
        initScratchHearts();
        scratchInitialized = true;
    }
}

if (gate) {
    gate.addEventListener('click', async () => {
        if (mainRevealed) return;
        
        if (waxSealBtn) waxSealBtn.classList.add('breaking');
        if (envCard) envCard.classList.add('opening');
        
        try {
            if (bgAudio) {
                await bgAudio.play();
                audioPlaying = true;
                updateAudioIcon();
            }
        } catch(_) {}
        
        setTimeout(() => {
            revealMain();
        }, 650);
    });
}

document.body.style.overflow = 'hidden';

/* ================================================================
   AUDIO TOGGLE
================================================================ */
const audioBtn = document.getElementById('audio-btn');
const iconOn   = document.getElementById('icon-on');
const iconOff  = document.getElementById('icon-off');

function updateAudioIcon() {
    if (iconOn && iconOff) {
        iconOn.style.display  = audioPlaying ? '' : 'none';
        iconOff.style.display = audioPlaying ? 'none' : '';
    }
}

if (audioBtn) {
    audioBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (audioPlaying) {
            if (bgAudio) bgAudio.pause();
            audioPlaying = false;
        } else {
            try {
                if (bgAudio) {
                    await bgAudio.play();
                    audioPlaying = true;
                }
            } catch(err) {}
        }
        updateAudioIcon();
    });
}

/* ================================================================
   SCROLL REVEAL & VIDEO AUTO-EXPAND
================================================================ */
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const io  = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
}

function initEventAutoExpand() {
    const wraps = document.querySelectorAll('.event-video-wrap');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('unlocked');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    wraps.forEach(w => io.observe(w));
}

/* ================================================================
   RSVP FORM & MODAL
================================================================ */
const rsvpForm  = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const btnText   = document.getElementById('btn-text');
const btnSpinner= document.getElementById('btn-spinner');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (submitBtn) submitBtn.disabled = true; 
        if (btnText) btnText.textContent = 'Sending...'; 
        if (btnSpinner) btnSpinner.style.display = 'inline';
        
        const formData = new FormData(e.target); 
        const data = {};
        
        for (let key of formData.keys()) {
            const values = formData.getAll(key);
            data[key] = values.length > 1 ? values.join(', ') : values[0];
        }
        
        data.couple = 'Shaik Sirajuddin & Shaik Rakhiba';

        setTimeout(() => {
            showModal('success');
            
            // Dynamically add new wish to the Wall of Blessings
            if (data.message && data.message.trim() !== '') {
                const wishGrid = document.getElementById('wishbook-grid');
                if (wishGrid) {
                    const newWishCard = document.createElement('div');
                    newWishCard.className = 'wish-card fade-in';
                    newWishCard.innerHTML = `
                        <div class="wish-card-heart">💌</div>
                        <p class="wish-card-text">"${data.message.trim()}"</p>
                        <span class="wish-card-author">— ${data.name ? data.name.trim() : 'Anonymous Guest'}</span>
                    `;
                    wishGrid.prepend(newWishCard);
                }
            }

            e.target.reset();
            if (submitBtn) submitBtn.disabled = false; 
            if (btnText) btnText.textContent = 'Send Love'; 
            if (btnSpinner) btnSpinner.style.display = 'none';
        }, 1000);
    });
}

const modal       = document.getElementById('rsvp-modal');
const modalTitle  = document.getElementById('modal-title');
const modalMsg    = document.getElementById('modal-msg');
const modalSucc   = document.getElementById('modal-success-svg');
const modalErr    = document.getElementById('modal-error-svg');
const modalIcon   = document.getElementById('modal-icon');
const modalClose  = document.getElementById('modal-close');

function showModal(type) {
    if (!modal) return;
    if (type === 'success') {
        if (modalTitle) modalTitle.textContent = 'Thank You!';
        if (modalMsg) modalMsg.textContent = "We can't wait to celebrate with you!";
        if (modalSucc) modalSucc.style.display = '';
        if (modalErr) modalErr.style.display = 'none';
        if (modalIcon) modalIcon.style.background = 'rgba(184,89,64,0.1)';
    } else {
        if (modalTitle) modalTitle.textContent = 'Oops!';
        if (modalMsg) modalMsg.textContent = 'There was an error submitting your RSVP. Please try again.';
        if (modalSucc) modalSucc.style.display = 'none';
        if (modalErr) modalErr.style.display = '';
        if (modalIcon) modalIcon.style.background = 'rgba(220,38,38,0.08)';
    }
    modal.classList.add('open');
}

function closeModal() {
    if (modal) modal.classList.remove('open');
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {}, 250);
});

/* ================================================================
   AUTOMATIC SLIDESHOW FOR "A GLIMPSE OF US"
================================================================ */
(function initGlimpseSlideshow() {
    const slides = document.querySelectorAll('.glimpse-slide');
    const dots = document.querySelectorAll('#slideshow-dots .dot');
    if (!slides.length) return;
    
    let currentIndex = 0;
    let slideTimer;

    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function startTimer() {
        slideTimer = setInterval(nextSlide, 3500);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideTimer);
            goToSlide(index);
            startTimer();
        });
    });

    startTimer();
})();
