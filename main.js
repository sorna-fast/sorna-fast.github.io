// main.js - Original API-based Certificate Loading (FIXED)

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
            console.log(`📡 Fetching: ${mainApi}`);
            const response = await fetch(mainApi);

            if (response.status === 403) {
                const errorData = await response.json().catch(() => ({}));
                this.errorMessage = `GitHub API Rate Limit (403): ${errorData.message || 'Try again in 1 hour'}`;
                console.error("❌ 403 Error:", this.errorMessage);
                return;
            }

            if (!response.ok) {
                this.errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                console.error("❌ HTTP Error:", this.errorMessage);
                return;
            }

            const folders = await response.json();
            console.log(`✅ Found ${folders.length} folders`);

            if (folders.length === 0) {
                this.errorMessage = "No certificate folders found";
                console.warn("⚠️", this.errorMessage);
                return;
            }

            const allCerts = [];

            for (const folder of folders) {
                if (folder.type === 'dir') {
                    console.log(`📂 Processing folder: ${folder.name}`);
                    const folderApi = `https://api.github.com/repos/sorna-fast/sorna-fast/contents/${folder.path}`;

                    try {
                        const folderResponse = await fetch(folderApi);
                        const files = await folderResponse.json();

                        const certs = files
                            .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|pdf)$/i))
                            .map(file => ({
                                name: file.name.replace(/\.[^/.]+$/, ""),
                                url: file.html_url,
                                downloadUrl: file.download_url,
                                type: file.name.endsWith('.pdf') ? 'pdf' : 'image',
                                org: this.normalizeOrgName(folder.name),
                                fullPath: file.path
                            }));

                        console.log(`  ✅ ${certs.length} certificates in ${folder.name}`);
                        allCerts.push(...certs);
                    } catch (error) {
                        console.warn(`  ⚠️ Failed ${folder.name}:`, error.message);
                    }
                }
            }

            if (allCerts.length === 0) {
                this.errorMessage = "No PDF/Image files found in any folder";
                console.warn("⚠️", this.errorMessage);
                return;
            }

            console.log(`✅ ${allCerts.length} total certificates loaded`);
            this.allCertificates = allCerts;
            this.filteredCertificates = [...allCerts];

        } catch (error) {
            this.errorMessage = `Failed to load certificates: ${error.message}`;
            console.error("❌ Fatal error:", error);
        }
    }

    normalizeOrgName(folderName) {
        const nameMap = {
            'Iran-Technical-and-Vocational-Training-Organization-(TVTO)': 'TVTO',
            'LINKEDIN-LEARNING': 'LinkedIn',
            'MSRT-of-Iran': 'MSRT',
            'CS50': 'Harvard',
            'IRAN-DIGITAL': 'Iran Digital',
            'Urbino-Carlo': 'Urbino',
            'intellipaat': 'Intellipaat',
            'Daneshjooyar': 'Daneshjooyar',
            'Faraders': 'Faraders',
            'Kaggle': 'Kaggle'
        };
        return nameMap[folderName] || folderName.replace(/[-_]/g, ' ');
    }

    setupFilters() {
        if (!this.allCertificates.length) return;

        const uniqueOrgs = [...new Set(this.allCertificates.map(cert => cert.org))];
        const filterContainer = document.querySelector('.filter-buttons');
        filterContainer.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.dataset.org = 'all';
        allBtn.textContent = 'All Certificates';
        filterContainer.appendChild(allBtn);

        uniqueOrgs.forEach(org => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.org = org.toLowerCase();
            btn.textContent = org;
            filterContainer.appendChild(btn);
        });

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filter(e.target.dataset.org);
            }
        });
    }

    setupControls() {
        const pauseBtn = document.getElementById('pauseBtn');
        const speedBtn = document.getElementById('speedBtn');

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.isPaused = !this.isPaused;
                pauseBtn.textContent = this.isPaused ? ' Play' : ' Pause';
                this.updateAnimation();
            });
        }

        if (speedBtn) {
            speedBtn.addEventListener('click', () => {
                this.speed = this.speed === 90 ? 35 : 90;
                speedBtn.textContent = this.speed === 90 ? ' Slow Down' : '⚡ Speed Up';
                this.updateAnimation();
            });
        }
    }

    filter(org) {
        if (org === 'all') {
            this.filteredCertificates = [...this.allCertificates];
        } else {
            this.filteredCertificates = this.allCertificates.filter(cert => cert.org.toLowerCase() === org);
        }
        this.render();
    }

    render() {
        if (this.errorMessage) {
            this.slider.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--accent);background:rgba(100,255,218,0.05);border-radius:10px;">
                    <h3>❌ Certificate Loading Error</h3>
                    <p>${this.errorMessage}</p>
                    <p style="font-size:0.9rem;margin-top:15px;">
                        If rate limited: wait 1 hour or add GitHub token
                    </p>
                </div>
            `;
            return;
        }

        if (this.filteredCertificates.length === 0) {
            this.slider.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--text);">
                    <h3>No certificates found</h3>
                    <p>Try selecting "All Certificates"</p>
                </div>
            `;
            return;
        }

        this.speed = Math.max(35, this.filteredCertificates.length * 4);

        const certificatesHTML = this.filteredCertificates.map(cert => {
            const previewHTML = cert.downloadUrl
                ? `<img src="${cert.downloadUrl}" alt="${cert.name}" loading="lazy">`
                : `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;">
                     <span style="font-size:1.5rem;color:var(--accent);margin-bottom:10px;">DOCUMENT</span>
                     <span style="font-size:0.8rem;color:var(--text);">PDF FILE</span>
                   </div>`;

            return `
                <div class="certificate-card" onclick="window.open('${cert.url}', '_blank')">
                    <div class="cert-preview">
                        ${previewHTML}
                    </div>
                    <span class="org-tag">${cert.org.toUpperCase()}</span>
                    <h4>${cert.name}</h4>
                    <span class="cert-type">${cert.type.toUpperCase()}</span>
                </div>
            `;
        }).join('');

        this.slider.innerHTML = certificatesHTML + certificatesHTML;
        this.updateAnimation();
    }

    updateAnimation() {
        this.slider.style.animation = `slideRTL ${this.speed}s linear infinite`;
        this.slider.style.animationPlayState = this.isPaused ? 'paused' : 'running';
    }
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
let scrollPosition = 0;
hamburger.addEventListener('click', () => {
    const isMenuOpening = !navLinks.classList.contains('active');

    if (isMenuOpening) {
        // وقتی منو رو باز می‌کنه
        scrollPosition = window.pageYOffset; // موقعیت فعلی رو ذخیره کن
        document.body.classList.add('menu-open'); // کلاس اضافه کن
    } else {
        // وقتی منو رو می‌بنده
        document.body.classList.remove('menu-open'); // کلاس رو حذف کن
        window.scrollTo(0, scrollPosition); // برگرد به موقعیت قبلی
    }

    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// وقتی روی لینک منو کلیک می‌کنه
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        window.scrollTo(0, scrollPosition); // برگرد به موقعیت قبلی
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM ready, starting CertificateSlider...");
    new CertificateSlider();
});


// Generate dynamic stars for About and Contact sections
document.addEventListener('DOMContentLoaded', function () {
    const sections = ['about', 'contact'];

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const starsContainer = section.querySelector('.stars');
        if (!starsContainer) return;

        // Clear existing stars
        starsContainer.innerHTML = '';

        // Get section dimensions
        const width = window.innerWidth;
        const height = section.offsetHeight;

        // Generate stars based on screen size
        const starCount = Math.floor((width * height) / 4000); // Density factor

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');

            // Random position
            const left = Math.random() * 100; // percentage
            const top = Math.random() * 100;  // percentage

            // Random size class
            const sizes = ['small', 'small', 'small', 'medium', 'medium', 'large'];
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];

            // Random animation delay
            const delay = Math.random() * 3;
            const duration = 2 + Math.random() * 4;

            star.className = `star ${sizeClass}`;
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;

            starsContainer.appendChild(star);
        }
    });

    // Regenerate stars on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Trigger regeneration by re-running the star generation
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (!section) return;

                const starsContainer = section.querySelector('.stars');
                if (!starsContainer) return;

                starsContainer.innerHTML = '';

                const width = window.innerWidth;
                const height = section.offsetHeight;
                const starCount = Math.floor((width * height) / 4000);

                for (let i = 0; i < starCount; i++) {
                    const star = document.createElement('div');
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;
                    const sizes = ['small', 'small', 'small', 'medium', 'medium', 'large'];
                    const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
                    const delay = Math.random() * 3;
                    const duration = 2 + Math.random() * 4;

                    star.className = `star ${sizeClass}`;
                    star.style.left = `${left}%`;
                    star.style.top = `${top}%`;
                    star.style.animationDelay = `${delay}s`;
                    star.style.animationDuration = `${duration}s`;

                    starsContainer.appendChild(star);
                }
            });
        }, 250);
    });
});