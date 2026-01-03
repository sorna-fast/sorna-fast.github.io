// main.js - Certificate Slider with Raw URLs (No API Rate Limits)

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
        console.log("📂 Loading certificates from GitHub Raw URLs...");

        // ✅ ساختار دقیق فولدرها و فایل‌های شما
        const certificatesData = [
            {
                org: 'Harvard',
                folder: 'CS50',
                files: [{ name: 'CS50 Certificate', file: 'CS50 Certificate.jpg' }]
            },
            {
                org: 'Daneshjooyar',
                folder: 'Daneshjooyar',
                files: [{ name: 'Daneshjooyar Certificate', file: 'certificate.jpg' }]
            },
            {
                org: 'Faraders',
                folder: 'Faraders',
                files: [{ name: 'Faraders Certificate', file: 'certificate.png' }]
            },
            {
                org: 'Iran Digital',
                folder: 'IRAN-DIGITAL',
                files: [{ name: 'Iran Digital Certificate', file: 'certificate.jpg' }]
            },
            {
                org: 'TVTO',
                folder: 'Iran-Technical-and-Vocational-Training-Organization-(TVTO)',
                files: [{ name: 'TVTO Certificate', file: 'TVTO Certificate.pdf' }]
            },
            {
                org: 'Kaggle',
                folder: 'Kaggle',
                files: [
                    { name: 'Kaggle Certificate 1', file: 'certificate1.jpg' },
                    { name: 'Kaggle Certificate 2', file: 'certificate2.jpg' }
                ]
            },
            {
                org: 'LinkedIn',
                folder: 'LINKEDIN-LEARNING',
                files: [
                    { name: 'LinkedIn Certificate 1', file: 'LinkedIn Certificate 1.jpg' },
                    { name: 'LinkedIn Certificate 2', file: 'LinkedIn Certificate 2.jpg' }
                ]
            },
            {
                org: 'MSRT',
                folder: 'MSRT-of-Iran',
                files: [{ name: 'MSRT Certificate', file: 'MSRT Certificate.png' }]
            },
            {
                org: 'Urbino',
                folder: 'Urbino-Carlo',
                files: [{ name: 'Urbino Certificate', file: 'Urbino Certificate.jpeg' }]
            },
            {
                org: 'Intellipaat',
                folder: 'intellipaat',
                files: [{ name: 'Intellipaat Certificate', file: 'certificate.jpg' }]
            }
        ];

        try {
            const allCerts = [];
            const baseRawUrl = 'https://raw.githubusercontent.com/sorna-fast/sorna-fast/master/Certificate';
            const baseHtmlUrl = 'https://github.com/sorna-fast/sorna-fast/blob/master/Certificate';

            for (const orgData of certificatesData) {
                for (const fileData of orgData.files) {
                    const fileExtension = fileData.file.split('.').pop().toLowerCase();
                    const isPdf = fileExtension === 'pdf';

                    const rawUrl = `${baseRawUrl}/${orgData.folder}/${fileData.file}`;
                    const htmlUrl = `${baseHtmlUrl}/${orgData.folder}/${fileData.file}`;

                    allCerts.push({
                        name: fileData.name,
                        url: htmlUrl,
                        downloadUrl: rawUrl,
                        type: isPdf ? 'pdf' : 'image',
                        org: orgData.org,
                        fullPath: `Certificate/${orgData.folder}/${fileData.file}`
                    });
                }
            }

            if (allCerts.length === 0) {
                this.errorMessage = "No certificates found in structure";
                console.warn("⚠️", this.errorMessage);
                return;
            }

            console.log(`✅ Total: ${allCerts.length} certificates loaded`);
            this.allCertificates = allCerts;
            this.filteredCertificates = [...allCerts];

        } catch (error) {
            this.errorMessage = `Failed to load certificates: ${error.message}`;
            console.error("❌ Fatal error:", error);
        }
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
                <div style="text-align:center;padding:40px;color:var(--accent);background:rgba(100,255,218,0.05);border-radius:10px;border:1px solid rgba(100,255,218,0.2);">
                    <h3 style="color:var(--accent);margin-bottom:15px;">❌ Error Loading Certificates</h3>
                    <p style="color:var(--white);font-size:1.1rem;">${this.errorMessage}</p>
                    <p style="margin-top:15px;font-size:0.9rem;color:var(--text);">
                        Please check the console (F12) for more details or visit GitHub directly:
                    </p>
                    <a href="https://github.com/sorna-fast/sorna-fast/tree/master/Certificate" target="_blank" style="color:var(--accent);text-decoration:underline;font-weight:600;">
                        View Certificates on GitHub
                    </a>
                </div>
            `;
            return;
        }

        if (this.filteredCertificates.length === 0) {
            this.slider.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--text);">
                    <h3>No certificates found for this filter</h3>
                    <p>Try selecting "All Certificates" or check if files exist in GitHub</p>
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

// Mobile Menu Toggle with Hamburger Animation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM ready, starting CertificateSlider...");
    new CertificateSlider();
});