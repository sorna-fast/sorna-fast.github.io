class CertificateSlider {
    constructor() {
        this.slider = document.getElementById('certSlider');
        this.isPaused = false;
        this.speed = 90; // سرعت پایه
        this.allCertificates = [];
        this.filteredCertificates = [];
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
            const folders = await response.json();
            const allCerts = [];

            for (const folder of folders) {
                if (folder.type === 'dir') {
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
                        allCerts.push(...certs);
                    } catch (error) {
                        console.warn(`Failed to load folder: ${folder.name}`);
                    }
                }
            }
            this.allCertificates = allCerts;
            this.filteredCertificates = [...allCerts];
        } catch (error) {
            this.slider.innerHTML = '<p style="color: var(--accent);">Error loading certificates</p>';
        }
    }

    normalizeOrgName(folderName) {
        const nameMap = {
            'Iran-Technical-and-Vocational-Training-Organization-(TVTO)': 'TVTO',
            'LINKEDIN-LEARNING': 'LinkedIn',
            'MSRT-of-Iran': 'MSRT',
            'CS50': 'Harvard',
            'IRAN-DIGITAL': 'Iran Digital',
            'Urbino-Carlo': 'Urbino'
        };
        return nameMap[folderName] || folderName.replace(/[-_]/g, ' ');
    }

    setupFilters() {
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
                // تغییر سرعت و آپدیت فوری
                this.speed = this.speed === 90 ? 35 : 90;
                speedBtn.textContent = this.speed === 90 ? ' Slow Down' : '⚡ Speed Up';
                this.updateAnimation(); // ✅ این خط سرعت رو اپدیت میکنه
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
        if (this.filteredCertificates.length === 0) {
            this.slider.innerHTML = '<p style="color: var(--accent); text-align: center; width: 100%;">No certificates found</p>';
            return;
        }

        // محاسبه سرعت بر اساس تعداد (فقط در رندر اولیه)
        this.speed = Math.max(40, this.filteredCertificates.length * 4);

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

        // تکرار برای افکت بی‌نهایت
        this.slider.innerHTML = certificatesHTML + certificatesHTML;
        this.updateAnimation();
    }

    updateAnimation() {
        // ⭐ فقط انیمیشن رو آپدیت میکنه، سرعت رو دوباره محاسبه نمیکنه
        this.slider.style.animation = `slideRTL ${this.speed}s linear infinite`;
        this.slider.style.animationPlayState = this.isPaused ? 'paused' : 'running';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Certificate Slider initializing...");
    new CertificateSlider();
});