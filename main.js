// main.js - Certificate Slider with Error Messages in UI

class CertificateSlider {
    constructor() {
        this.slider = document.getElementById('certSlider');
        this.isPaused = false;
        this.speed = 90;
        this.allCertificates = [];
        this.filteredCertificates = [];
        this.errorMessage = null; // ذخیره پیام خطا
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

            // ⭐ چک کردن خطاها
            if (response.status === 403) {
                const errorData = await response.json().catch(() => ({}));
                this.errorMessage = `HTTP 403: ${errorData.message || 'Access denied (sanctions/rate limit)'}`;
                console.error("❌ 403 Error:", this.errorMessage);
                return; // متوقف کردن
            }

            if (!response.ok) {
                this.errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                console.error("❌ HTTP Error:", this.errorMessage);
                return;
            }

            const folders = await response.json();
            console.log(`✅ Folders: ${folders.length}`);

            if (folders.length === 0) {
                this.errorMessage = "No certificate folders found in repository";
                console.warn("⚠️", this.errorMessage);
                return;
            }

            const allCerts = [];

            for (const folder of folders) {
                if (folder.type === 'dir') {
                    console.log(`📂 Folder: ${folder.name}`);
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
                this.errorMessage = "No PDF/Image files found in any certificate folder";
                console.warn("⚠️", this.errorMessage);
                return;
            }

            console.log(`✅ Total: ${allCerts.length} certificates`);
            this.allCertificates = allCerts;
            this.filteredCertificates = [...allCerts];

        } catch (error) {
            this.errorMessage = error.message;
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
            'Urbino-Carlo': 'Urbino'
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
        console.log("🎨 render() called");

        // نمایش پیام خطا اگر وجود داشت
        if (this.errorMessage) {
            console.log("❌ Showing error:", this.errorMessage);
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

        // پیدا نکردن گواهی
        if (this.filteredCertificates.length === 0) {
            console.log("⚠️ No certificates after filter");
            this.slider.innerHTML = `
                <div style="text-align:center;padding:40px;color:var(--text);">
                    <h3>No certificates found for this filter</h3>
                    <p>Try selecting "All Certificates" or check if files exist in GitHub</p>
                </div>
            `;
            return;
        }

        console.log(`✅ Rendering ${this.filteredCertificates.length} certificates`);

        this.speed = Math.max(35, this.filteredCertificates.length * 4);

        const certificatesHTML = this.filteredCertificates.map(cert => {
            console.log("  📄 Adding certificate:", cert.name);
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

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM ready, starting CertificateSlider...");
    new CertificateSlider();
});