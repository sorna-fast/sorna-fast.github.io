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

// ===== Stars =====
function generateStars() {
    document.querySelectorAll('#about .stars, #contact .stars').forEach(container => {
        container.innerHTML = '';
        const section = container.closest('section');
        const w = window.innerWidth;
        const h = section.offsetHeight || 600;
        const count = Math.floor((w * h) / 3500);
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            const sizes = ['small', 'small', 'small', 'medium', 'medium', 'large'];
            star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]}`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 4}s`;
            container.appendChild(star);
        }
    });
}

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

document.addEventListener('DOMContentLoaded', () => {
    populateContent();
    generateStars();
    new CertificateSlider();
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(generateStars, 300);
});
