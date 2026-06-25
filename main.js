// ===== Loading Screen =====
(function injectLoadingCSS() {
    if (document.getElementById('loading-styles')) return;
    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
        #loading-screen {
            position: fixed;
            inset: 0;
            background: var(--bg-primary);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 32px;
            transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.8s;
        }
        #loading-screen.done {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        #loading-screen .loader {
            position: relative;
            width: 80px;
            height: 80px;
            transform: rotate(45deg);
            opacity: 0.9;
        }
        #loading-screen .loader-square {
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 22px;
            margin: 2px;
            border-radius: 3px;
            background: var(--accent);
            box-shadow: 0 0 8px var(--accent-dim);
            animation: square-animation 10s ease-in-out infinite both;
        }
        #loading-screen .loader-square:nth-of-type(1) { animation-delay: 0s; }
        #loading-screen .loader-square:nth-of-type(2) { animation-delay: -1.4286s; }
        #loading-screen .loader-square:nth-of-type(3) { animation-delay: -2.8571s; }
        #loading-screen .loader-square:nth-of-type(4) { animation-delay: -4.2857s; }
        #loading-screen .loader-square:nth-of-type(5) { animation-delay: -5.7143s; }
        #loading-screen .loader-square:nth-of-type(6) { animation-delay: -7.1429s; }
        #loading-screen .loader-square:nth-of-type(7) { animation-delay: -8.5714s; }
        #loading-screen .loading-text {
            color: var(--accent);
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            opacity: 0.7;
            animation: loadingPulse 1.5s ease-in-out infinite;
        }
        @keyframes loadingPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
        }
        @keyframes square-animation {
            0%, 10.5% { left: 0; top: 0; }
            12.5%, 23% { left: 26px; top: 0; }
            25%, 35.5% { left: 52px; top: 0; }
            37.5%, 48% { left: 52px; top: 26px; }
            50%, 60.5% { left: 26px; top: 26px; }
            62.5%, 73% { left: 26px; top: 52px; }
            75%, 85.5% { left: 0; top: 52px; }
            87.5%, 98% { left: 0; top: 26px; }
            100% { left: 0; top: 0; }
        }
    `;
    document.head.appendChild(style);

    const loader = document.createElement('div');
    loader.id = 'loading-screen';
    loader.innerHTML = `
        <div class="loader">
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
            <div class="loader-square"></div>
        </div>
        <div class="loading-text">Loading</div>
    `;
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('done');
            setTimeout(() => loader.remove(), 900);
        }, 1200);
    });
})();

// ===== Noise Texture Overlay =====
(function injectNoiseCSS() {
    if (document.getElementById('noise-styles')) return;
    const style = document.createElement('style');
    style.id = 'noise-styles';
    style.textContent = `
        .noise-overlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.025;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 256px 256px;
        }
    `;
    document.head.appendChild(style);
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    document.body.appendChild(noise);
})();

// ===== Scroll Progress Bar =====
(function injectProgressCSS() {
    if (document.getElementById('progress-styles')) return;
    const style = document.createElement('style');
    style.id = 'progress-styles';
    style.textContent = `
        #scroll-progress {
            position: fixed;
            top: 0; left: 0;
            width: 0%;
            height: 2px;
            background: var(--gradient-accent);
            z-index: 10001;
            transition: width 0.1s linear;
            box-shadow: 0 0 10px var(--accent-glow);
        }
    `;
    document.head.appendChild(style);
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    }, { passive: true });
})();

// ===== Magnetic Buttons =====
(function injectMagneticCSS() {
    if (document.getElementById('magnetic-styles')) return;
    const style = document.createElement('style');
    style.id = 'magnetic-styles';
    style.textContent = `
        .magnetic {
            transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
    `;
    document.head.appendChild(style);

    const magneticTargets = '.btn, .project-link, .filter-btn, .control-btn';
    const magneticEls = [];

    function initMagnetic() {
        document.querySelectorAll(magneticTargets).forEach(el => {
            if (el.classList.contains('magnetic')) return;
            el.classList.add('magnetic');
            magneticEls.push(el);
        });
    }

    document.addEventListener('mousemove', e => {
        magneticEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            const maxDist = 80;
            if (dist < maxDist) {
                const force = (1 - dist / maxDist) * 12;
                const dx = (e.clientX - cx) / dist * force;
                const dy = (e.clientY - cy) / dist * force;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            } else {
                el.style.transform = '';
            }
        });
    });

    const observer = new MutationObserver(initMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });
    initMagnetic();
})();

// ===== Project 3D Tilt =====
(function injectTiltCSS() {
    if (document.getElementById('tilt-styles')) return;
    const style = document.createElement('style');
    style.id = 'tilt-styles';
    style.textContent = `
        .project-card {
            transform-style: preserve-3d;
            perspective: 800px;
        }
        .project-card .tilt-inner {
            transition: transform 0.15s ease-out;
            transform-style: preserve-3d;
        }
        .project-card:hover .tilt-inner {
            transition: transform 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
})();

function initTilt() {
    document.querySelectorAll('.project-card').forEach(card => {
        if (card.querySelector('.tilt-inner')) return;
        const inner = document.createElement('div');
        inner.className = 'tilt-inner';
        while (card.firstChild) inner.appendChild(card.firstChild);
        card.appendChild(inner);

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (y - 0.5) * -12;
            const rotateY = (x - 0.5) * 12;
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== FIXED Static Twinkling Stars (NO parallax) =====
function generateStars() {
    document.querySelectorAll('#about .stars, #contact .stars').forEach(container => {
        container.innerHTML = '';
        const section = container.closest('section');
        const w = section.offsetWidth || window.innerWidth;
        const h = section.offsetHeight || 600;
        // Good density for visibility
        const count = Math.floor((w * h) / 6000);
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            const sizes = ['small', 'small', 'small', 'small', 'medium', 'medium', 'large'];
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
            star.className = `star ${sizeClass}`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            // Random twinkle timing for natural effect
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            container.appendChild(star);
        }
    });
}

// ===== Smooth Scroll (CSS-based) =====
(function injectSmoothScrollCSS() {
    if (document.getElementById('smooth-scroll-styles')) return;
    const style = document.createElement('style');
    style.id = 'smooth-scroll-styles';
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
        }
    `;
    document.head.appendChild(style);
})();

// ===== Scroll Reveal Animation =====
(function injectRevealCSS() {
    if (document.getElementById('reveal-styles')) return;
    const style = document.createElement('style');
    style.id = 'reveal-styles';
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                        filter 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                        clip-path 0.8s cubic-bezier(0.22, 1, 0.36, 1);
            will-change: opacity, transform, filter, clip-path;
            filter: blur(3px);
        }
        .reveal-hidden[data-reveal="fade-up"]      { transform: translateY(30px); }
        .reveal-hidden[data-reveal="fade-down"]    { transform: translateY(-30px); }
        .reveal-hidden[data-reveal="fade-left"]     { transform: translateX(-30px); }
        .reveal-hidden[data-reveal="fade-right"]    { transform: translateX(30px); }
        .reveal-hidden[data-reveal="scale-in"]      { transform: scale(0.92); filter: blur(3px); }
        .reveal-hidden[data-reveal="fade-in"]       { transform: translate(0); filter: blur(5px); }
        .reveal-hidden[data-reveal="slide-left"]    { transform: translateX(40px); }
        .reveal-hidden[data-reveal="slide-right"]   { transform: translateX(-40px); }
        .reveal-hidden[data-reveal="tilt-up"]       { transform: perspective(800px) rotateX(15deg) translateY(40px); filter: blur(4px); }
        .reveal-hidden[data-reveal="clip-circle"]   { clip-path: circle(0% at 50% 50%); filter: blur(6px); }
        .reveal-hidden[data-reveal="clip-reveal"]    { clip-path: inset(0 100% 0 0); filter: blur(4px); }

        .reveal-visible {
            opacity: 1 !important;
            transform: translate(0) scale(1) rotateX(0) !important;
            filter: blur(0) !important;
            clip-path: circle(100% at 50% 50%) !important;
        }
        .reveal-visible[data-reveal="clip-reveal"] {
            clip-path: inset(0 0% 0 0) !important;
        }

        .section-title.reveal-hidden {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(2px);
            transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
        }
        .section-title.reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
            filter: blur(0) !important;
            animation: glitchText 0.4s ease 0.1s;
        }
        @keyframes glitchText {
            0%, 100% { text-shadow: none; }
            20% { text-shadow: 2px 0 var(--accent), -2px 0 #ff6b6b; }
            40% { text-shadow: -2px 0 var(--accent), 2px 0 #ffc107; }
            60% { text-shadow: 1px 0 var(--accent), -1px 0 #ff6b6b; }
        }
        .section-title.reveal-hidden::after {
            transform: scaleX(0);
            transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
        }
        .section-title.reveal-visible::after {
            transform: scaleX(1) !important;
        }

        .timeline::before {
            transform-origin: top center;
            transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .timeline.reveal-hidden::before {
            transform: scaleY(0);
        }
        .timeline.reveal-visible::before {
            transform: scaleY(1) !important;
        }

        .timeline-marker.reveal-hidden {
            transform: translateX(-50%) scale(0) !important;
            filter: blur(2px);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s,
                        filter 0.4s ease 0.3s, opacity 0.4s ease 0.3s;
        }
        .timeline-marker.reveal-visible {
            transform: translateX(-50%) scale(1) !important;
            filter: blur(0) !important;
        }

        .timeline-item::before {
            transform-origin: left center;
            transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
        }
        .timeline-item.reveal-hidden::before {
            transform: scaleX(0);
        }
        .timeline-item.reveal-visible::before {
            transform: scaleX(1);
        }

        .bio-line {
            display: block;
            opacity: 0;
            transform: translateY(15px);
            filter: blur(2px);
            transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
        }
        .bio-line.reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
            filter: blur(0) !important;
        }

        .contact-item.reveal-hidden {
            transform: translateY(40px);
            opacity: 0;
            filter: blur(3px);
            transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
        }
        .contact-item.reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
            filter: blur(0) !important;
        }

        .filter-btn.reveal-hidden {
            transform: perspective(400px) rotateY(-90deg);
            opacity: 0;
            transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
        }
        .filter-btn.reveal-visible {
            transform: perspective(400px) rotateY(0) !important;
            opacity: 1 !important;
        }

        @media (prefers-reduced-motion: reduce) {
            .reveal-hidden, .bio-line.reveal-hidden, .filter-btn.reveal-hidden,
            .timeline-marker.reveal-hidden, .section-title.reveal-hidden,
            .timeline.reveal-hidden::before, .timeline-item.reveal-hidden::before {
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
                clip-path: none !important;
                animation: none !important;
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
})();

class ScrollReveal {
    constructor(options = {}) {
        this.defaults = {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px',
            once: true
        };
        this.options = { ...this.defaults, ...options };
        this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
        this.init();
    }

    init() {
        document.querySelectorAll('[data-reveal]').forEach(el => this.observe(el));
        this.autoApply();
        this.setupBioLines();
    }

    setupBioLines() {
        const bioP = document.querySelector('.about-text > p');
        if (!bioP) return;
        const html = bioP.innerHTML;
        const lines = html.split('<br>');
        bioP.innerHTML = '';
        lines.forEach((line, i) => {
            const span = document.createElement('span');
            span.className = 'bio-line';
            span.innerHTML = line;
            span.style.transitionDelay = `${i * 120}ms`;
            bioP.appendChild(span);
            this.observe(span);
        });
    }

    autoApply() {
        const map = [
            { sel: '.section-title', anim: 'fade-up', stagger: 0 },
            { sel: '.timeline', anim: 'fade-in', stagger: 0 },
            { sel: '.timeline-item', anim: 'fade-up', stagger: 120 },
            { sel: '.timeline-marker', anim: 'scale-in', stagger: 120 },
            { sel: '.timeline-content', anim: 'fade-up', stagger: 120 },
            { sel: '.timeline-header', anim: 'fade-up', stagger: 0 },
            { sel: '.timeline-desc', anim: 'fade-up', stagger: 60 },
            { sel: '.timeline-links', anim: 'fade-up', stagger: 100 },
            { sel: '.project-card', anim: 'tilt-up', stagger: 80 },
            { sel: '.certificate-card', anim: 'slide-left', stagger: 60 },
            { sel: '.contact-item', anim: 'fade-up', stagger: 80 },
            { sel: '.profile-img', anim: 'scale-in', stagger: 0 },
            { sel: '.about-text > h3', anim: 'fade-up', stagger: 0 },
            { sel: '.education-item', anim: 'fade-left', stagger: 100 },
            { sel: '.skill-item', anim: 'scale-in', stagger: 50 },
            { sel: '.about-content', anim: 'fade-up', stagger: 0 },
            { sel: '.filter-btn', anim: 'scale-in', stagger: 40 },
            { sel: '.view-all-link', anim: 'fade-up', stagger: 0 },
            { sel: '.slider-controls', anim: 'fade-up', stagger: 0 },
        ];

        map.forEach(({ sel, anim, stagger }) => {
            document.querySelectorAll(sel).forEach((el, i) => {
                if (el.hasAttribute('data-reveal')) return;
                el.setAttribute('data-reveal', anim);
                if (stagger > 0) {
                    el.style.transitionDelay = `${Math.min(i * stagger, 500)}ms`;
                }
                this.observe(el);
            });
        });
    }

    observe(el) {
        el.classList.add('reveal-hidden');
        this.observer.observe(el);
    }

    onIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('reveal-visible');
                el.classList.remove('reveal-hidden');
                if (this.options.once) {
                    this.observer.unobserve(el);
                }
            }
        });
    }
}

// ===== Certificate Slider =====
class CertificateSlider {
    constructor() {
        this.slider = document.getElementById('certSlider');
        this.isPaused = false;
        this.speed = 90;
        this.allCertificates = [];
        this.filteredCertificates = [];
        this.errorMessage = null;
        this.init();
    }
    async init() {
        await this.loadCertificates();
        this.setupFilters();
        this.setupControls();
        this.render();
    }
    async loadCertificates() {
        const mainApi = 'https://api.github.com/repos/sorna-fast/sorna-fast/contents/Certificate';
        try {
            const response = await fetch(mainApi);
            if (response.status === 403) {
                const err = await response.json().catch(() => ({}));
                this.errorMessage = `GitHub API Rate Limit (403): ${err.message || 'Try again in 1 hour'}`;
                return;
            }
            if (!response.ok) { this.errorMessage = `HTTP ${response.status}`; return; }
            const folders = await response.json();
            if (!folders.length) { this.errorMessage = "No certificate folders found"; return; }
            const allCerts = [];
            for (const folder of folders) {
                if (folder.type !== 'dir') continue;
                try {
                    const fr = await fetch(`https://api.github.com/repos/sorna-fast/sorna-fast/contents/${folder.path}`);
                    const files = await fr.json();
                    const certs = files.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|pdf)$/i)).map(f => ({
                        name: f.name.replace(/\.[^/.]+$/, ""),
                        url: f.html_url,
                        downloadUrl: f.download_url,
                        type: f.name.endsWith('.pdf') ? 'pdf' : 'image',
                        org: this.normalizeOrg(folder.name),
                        fullPath: f.path
                    }));
                    allCerts.push(...certs);
                } catch (e) { console.warn(`Failed ${folder.name}:`, e.message); }
            }
            if (!allCerts.length) { this.errorMessage = "No PDF/Image files found"; return; }
            this.allCertificates = allCerts;
            this.filteredCertificates = [...allCerts];
        } catch (e) { this.errorMessage = `Failed: ${e.message}`; }
    }
    normalizeOrg(name) {
        const map = { 'Iran-Technical-and-Vocational-Training-Organization-(TVTO)': 'TVTO', 'LINKEDIN-LEARNING': 'LinkedIn', 'MSRT-of-Iran': 'MSRT', 'CS50': 'Harvard', 'IRAN-DIGITAL': 'Iran Digital', 'Urbino-Carlo': 'Urbino', 'intellipaat': 'Intellipaat', 'Daneshjooyar': 'Daneshjooyar', 'Faraders': 'Faraders', 'Kaggle': 'Kaggle' };
        return map[name] || name.replace(/[-_]/g, ' ');
    }
    setupFilters() {
        if (!this.allCertificates.length) return;
        const uniqueOrgs = [...new Set(this.allCertificates.map(c => c.org))];
        const fc = document.querySelector('.filter-buttons');
        fc.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.org = 'all';
        allBtn.textContent = 'All Certificates';
        fc.appendChild(allBtn);
        uniqueOrgs.forEach(org => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.org = org.toLowerCase();
            btn.textContent = org;
            fc.appendChild(btn);
        });
        fc.addEventListener('click', e => {
            if (e.target.classList.contains('filter-btn')) {
                fc.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filter(e.target.dataset.org);
            }
        });
    }
    setupControls() {
        const pauseBtn = document.getElementById('pauseBtn');
        const speedBtn = document.getElementById('speedBtn');
        if (pauseBtn) pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            pauseBtn.textContent = this.isPaused ? '▶ Play' : '⏸ Pause';
            this.updateAnimation();
        });
        if (speedBtn) speedBtn.addEventListener('click', () => {
            this.speed = this.speed === 90 ? 35 : 90;
            speedBtn.textContent = this.speed === 90 ? '🐢 Slow Down' : '⚡ Speed Up';
            this.updateAnimation();
        });
    }
    filter(org) {
        this.filteredCertificates = org === 'all' ? [...this.allCertificates] : this.allCertificates.filter(c => c.org.toLowerCase() === org);
        this.render();
    }
    render() {
        if (this.errorMessage) {
            this.slider.innerHTML = `<div style="text-align:center;padding:40px;color:var(--accent);background:rgba(100,255,218,0.05);border-radius:10px;"><h3>⚠️ Certificate Loading Error</h3><p>${this.errorMessage}</p></div>`;
            return;
        }
        if (!this.filteredCertificates.length) {
            this.slider.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary);"><h3>No certificates found</h3><p>Try selecting "All Certificates"</p></div>`;
            return;
        }
        this.speed = Math.max(35, this.filteredCertificates.length * 4);
        const html = this.filteredCertificates.map(c => {
            const preview = c.downloadUrl ? `<img src="${c.downloadUrl}" alt="${c.name}" loading="lazy">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;"><span style="font-size:1.5rem;color:var(--accent);">📄</span><span style="font-size:0.75rem;color:var(--text-muted);">PDF</span></div>`;
            return `<div class="certificate-card" onclick="window.open('${c.url}','_blank')"><div class="cert-preview">${preview}</div><span class="org-tag">${c.org.toUpperCase()}</span><h4>${c.name}</h4><span class="cert-type">${c.type.toUpperCase()}</span></div>`;
        }).join('');
        this.slider.innerHTML = html + html;
        this.updateAnimation();
    }
    updateAnimation() {
        this.slider.style.animation = `slideRTL ${this.speed}s linear infinite`;
        this.slider.style.animationPlayState = this.isPaused ? 'paused' : 'running';
    }
}

// ===== Mobile Menu (بدون پرش اسکرول) =====
const body = document.body;
const html = document.documentElement;
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
let scrollPosition = 0;

function lockBody() {
    scrollPosition = window.pageYOffset;
    body.style.position = 'fixed';
    body.style.top = `-${scrollPosition}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
}

function unlockBody() {
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = '';
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, scrollPosition);
    requestAnimationFrame(() => {
        html.style.scrollBehavior = prevBehavior;
    });
}

function openMenu() {
    lockBody();
    navLinks.classList.add('active');
    hamburger.classList.add('active');
}

function closeMenu() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    unlockBody();
}

hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// ===== Nav scroll effect =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// ===== Populate dynamic content =====
function populateContent() {
    const skills = ['Python', 'Django', 'FastAPI', 'Ajax', 'TensorFlow/Keras', 'Scikit-Learn', 'SQL/SQLAlchemy', 'MongoDB', 'Pandas', 'NumPy', 'Data Analysis', 'Git', 'Docker'];
    const skillsList = document.getElementById('skillsList');
    if (skillsList) skillsList.innerHTML = skills.map(s => `<span class="skill-item">${s}</span>`).join('');

    const projects = [
        { name: 'SornaFlow', desc: 'Workflow management system with automated processes', tags: ['Django', 'PostgreSQL', 'Docker'], url: 'https://github.com/sorna-fast/SornaFlow' },
        { name: 'Royal Clinic', desc: 'Online appointment booking for medical clinics', tags: ['Django', 'Social Auth', 'HIPAA'], url: 'https://github.com/sorna-fast/royal-clinic-project' },
        { name: 'Real Estate AI', desc: 'Price prediction using Artificial Neural Networks', tags: ['TensorFlow', 'Keras', 'Pandas'], url: 'https://github.com/sorna-fast/real-estate-price-prediction-ann' },
    ];
    const grid = document.getElementById('projectsGrid');
    if (grid) grid.innerHTML = projects.map(p => `
                <div class="project-card">
                    <h3>${p.name}</h3><p>${p.desc}</p>
                    <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <a href="${p.url}" target="_blank" class="project-link">View Code →</a>
                </div>`).join('');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    populateContent();
    generateStars();
    initTilt();
    new CertificateSlider();
    new ScrollReveal();
});


