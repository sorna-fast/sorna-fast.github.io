
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
const HAS_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ===== Loading Screen =====
(function injectLoadingCSS() {
    if (document.getElementById('loading-styles')) return;
    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
        #loading-screen {
            position: fixed; inset: 0;
            background: var(--bg-primary); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            flex-direction: column; gap: 32px;
            transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.8s;
        }
        #loading-screen.done { opacity: 0; visibility: hidden; pointer-events: none; }
        #loading-screen .loader {
            position: relative; width: 80px; height: 80px;
            transform: rotate(45deg); opacity: 0.9;
        }
        #loading-screen .loader-square {
            position: absolute; top: 0; left: 0;
            width: 22px; height: 22px; margin: 2px;
            border-radius: 3px; background: var(--accent);
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
            color: var(--accent); font-size: 0.85rem;
            font-weight: 500; letter-spacing: 0.15em;
            text-transform: uppercase; opacity: 0.7;
            animation: loadingPulse 1.5s ease-in-out infinite;
        }
        @keyframes loadingPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
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
            <div class="loader-square"></div><div class="loader-square"></div>
            <div class="loader-square"></div><div class="loader-square"></div>
            <div class="loader-square"></div><div class="loader-square"></div>
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

// ===== Noise Texture =====
(function injectNoiseCSS() {
    if (document.getElementById('noise-styles')) return;
    const style = document.createElement('style');
    style.id = 'noise-styles';
    style.textContent = `
        .noise-overlay {
            position: fixed; inset: 0;
            pointer-events: none; z-index: 9998;
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
            position: fixed; top: 0; left: 0;
            width: 0%; height: 2px;
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

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = pct + '%';
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
})();

// ===== Magnetic Buttons =====
(function injectMagneticCSS() {
    if (document.getElementById('magnetic-styles')) return;
    const style = document.createElement('style');
    style.id = 'magnetic-styles';
    style.textContent = `.magnetic { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }`;
    document.head.appendChild(style);

    const magneticTargets = '.btn, .project-link, .control-btn';
    const magneticEls = [];

    function initMagnetic() {
        document.querySelectorAll(magneticTargets).forEach(el => {
            if (el.classList.contains('magnetic')) return;
            el.classList.add('magnetic');
            magneticEls.push(el);
        });
    }

    let magneticRaf = null;
    document.addEventListener('mousemove', e => {
        if (magneticRaf) return;
        magneticRaf = requestAnimationFrame(() => {
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
            magneticRaf = null;
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
        .project-card { transform-style: preserve-3d; perspective: 800px; }
        .project-card .tilt-inner { transition: transform 0.15s ease-out; transform-style: preserve-3d; }
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
            if (card._tiltRaf) cancelAnimationFrame(card._tiltRaf);
            card._tiltRaf = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (y - 0.5) * -12;
                const rotateY = (x - 0.5) * 12;
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
                card._tiltRaf = null;
            });
        });
        card.addEventListener('mouseleave', () => {
            if (card._tiltRaf) cancelAnimationFrame(card._tiltRaf);
            inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== Stars =====
function generateStars() {
    document.querySelectorAll('#about .stars, #contact .stars').forEach(container => {
        container.innerHTML = '';
        const section = container.closest('section');
        const w = section.offsetWidth || window.innerWidth;
        const h = section.offsetHeight || 600;
        const count = Math.floor((w * h) / 6000);
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            const sizes = ['small', 'small', 'small', 'small', 'medium', 'medium', 'large'];
            star.className = `star ${sizes[Math.floor(Math.random() * sizes.length)]}`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            container.appendChild(star);
        }
    });
}

// ===== Smooth Scroll =====
(function injectSmoothScrollCSS() {
    if (document.getElementById('smooth-scroll-styles')) return;
    const style = document.createElement('style');
    style.id = 'smooth-scroll-styles';
    style.textContent = `html { scroll-behavior: smooth; } @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`;
    document.head.appendChild(style);
})();

// ===== Scroll Reveal =====
(function injectRevealCSS() {
    if (document.getElementById('reveal-styles')) return;
    const style = document.createElement('style');
    style.id = 'reveal-styles';
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            will-change: opacity, transform; filter: blur(3px);
        }
        .reveal-hidden[data-reveal="fade-up"] { transform: translateY(30px); }
        .reveal-hidden[data-reveal="fade-down"] { transform: translateY(-30px); }
        .reveal-hidden[data-reveal="fade-left"] { transform: translateX(-30px); }
        .reveal-hidden[data-reveal="fade-right"] { transform: translateX(30px); }
        .reveal-hidden[data-reveal="scale-in"] { transform: scale(0.92); filter: blur(3px); }
        .reveal-hidden[data-reveal="fade-in"] { transform: translate(0); filter: blur(5px); }
        .reveal-hidden[data-reveal="slide-left"] { transform: translateX(40px); }
        .reveal-hidden[data-reveal="slide-right"] { transform: translateX(-40px); }
        .reveal-hidden[data-reveal="tilt-up"] { transform: perspective(800px) rotateX(15deg) translateY(40px); filter: blur(4px); }
        .reveal-hidden[data-reveal="clip-circle"] { clip-path: circle(0% at 50% 50%); filter: blur(6px); }
        .reveal-hidden[data-reveal="clip-reveal"] { clip-path: inset(0 100% 0 0); filter: blur(4px); }

        .reveal-visible {
            opacity: 1 !important;
            transform: translate(0) scale(1) rotateX(0) !important;
            filter: blur(0) !important;
            clip-path: circle(100% at 50% 50%) !important;
        }
        .reveal-visible[data-reveal="clip-reveal"] { clip-path: inset(0 0% 0 0) !important; }

        .section-title.reveal-hidden { opacity: 0; transform: translateY(20px); filter: blur(2px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .section-title.reveal-visible { opacity: 1 !important; transform: translateY(0) !important; filter: blur(0) !important; animation: glitchText 0.4s ease 0.1s; }
        @keyframes glitchText {
            0%, 100% { text-shadow: none; }
            20% { text-shadow: 2px 0 var(--accent), -2px 0 #ff6b6b; }
            40% { text-shadow: -2px 0 var(--accent), 2px 0 #ffc107; }
            60% { text-shadow: 1px 0 var(--accent), -1px 0 #ff6b6b; }
        }
        .section-title.reveal-hidden::after { transform: scaleX(0); transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s; }
        .section-title.reveal-visible::after { transform: scaleX(1) !important; }

        .timeline::before { transform-origin: top center; transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
        .timeline.reveal-hidden::before { transform: scaleY(0); }
        .timeline.reveal-visible::before { transform: scaleY(1) !important; }

        .bio-line { display: block; opacity: 0; transform: translateY(15px); filter: blur(2px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .bio-line.reveal-visible { opacity: 1 !important; transform: translateY(0) !important; filter: blur(0) !important; }

        .contact-item.reveal-hidden { transform: translateY(40px); opacity: 0; filter: blur(3px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .contact-item.reveal-visible { opacity: 1 !important; transform: translateY(0) !important; filter: blur(0) !important; }

        .filter-btn.reveal-hidden { transform: perspective(400px) rotateY(-90deg); opacity: 0; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease; }
        .filter-btn.reveal-visible { transform: perspective(400px) rotateY(0) !important; opacity: 1 !important; }

        @media (prefers-reduced-motion: reduce) {
            .reveal-hidden, .bio-line.reveal-hidden, .filter-btn.reveal-hidden,
            .timeline-marker.reveal-hidden, .section-title.reveal-hidden,
            .timeline.reveal-hidden::before, .timeline-item.reveal-hidden::before {
                opacity: 1 !important; transform: none !important;
                filter: none !important; clip-path: none !important;
                animation: none !important; transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
})();

class ScrollReveal {
    constructor(options = {}) {
        this.defaults = { threshold: 0.12, rootMargin: '0px 0px -30px 0px', once: true };
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
                if (stagger > 0) el.style.transitionDelay = `${Math.min(i * stagger, 500)}ms`;
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
                entry.target.classList.add('reveal-visible');
                entry.target.classList.remove('reveal-hidden');
                if (this.options.once) this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===== i18n - Multi Language System =====
const translations = {
    en: {
        dir: 'ltr',
        pageTitle: 'Masoud Ghasemi',
        nav: { home: 'Home', experience: 'Experience', projects: 'Projects', certificates: 'Certificates', about: 'About', contact: 'Contact' },
        hero: {
            name: 'Masoud Ghasemi',
            title: 'Python Backend & AI Engineer',
            subtitle: 'Building scalable APIs and AI models',
            cta1: 'Work Experience',
            cta2: 'GitHub'
        },
        experience: {
            title: 'Work Experience',
            item1: { title: 'Django Backend Developer', company: 'Papurasan Company', date: '2025', desc: 'Developed a comprehensive workflow management system using Django, implementing automated processes that increased operational efficiency by 25%.', link: 'View Project: SornaFlow' },
            item2: { title: 'Django Backend Developer', company: 'Royal Clinic', date: '2025', desc: 'Designed and developed a complete online appointment booking system for a medical clinic with HIPAA-compliant data handling.', link: 'View Project: Royal Clinic' },
            item3: { title: 'AI Instructor', company: 'Perjestegan Institute', date: '2025', desc: 'Teaching AI and Python programming courses. Developed comprehensive curriculum covering ML fundamentals, neural networks, and practical implementations.', link: 'Sample Project: Real Estate Prediction' }
        },
        projects: {
            title: 'Projects', viewAll: 'More Projects →', viewCode: 'View Code →',
            items: [
                { name: 'utkface-deep-learning-service', desc: 'A facial recognition project to predict age, gender, race, etc....the project is under construction.', tags: ['Deep Learning', 'TensorFlow', 'CNN', 'Fastapi'], url: 'https://github.com/sorna-fast/utkface-deep-learning-service' },
                { name: 'TB Chest X-Ray Classifier', desc: 'Deep learning model for Tuberculosis detection using CNN architecture with 99.5% accuracy and 0.999 AUC score.', tags: ['Deep Learning', 'TensorFlow', 'Tuberculosis detection', 'Computer vision', 'Medical AI', 'CNN', 'chest-xray', 'Fastapi'], url: 'https://github.com/sorna-fast/tb-chest-xray-classifier' },
                { name: 'super-resolution-cnn-cifar10', desc: 'Transform 16×16 low-resolution images to 32×32 high-quality versions using deep learning. Achieves PSNR 28.13 dB with lightweight CNN architecture', tags: ['computer-vision', 'deep-learning', 'super-resolution', 'tensorflow/cnn'], url: 'https://github.com/sorna-fast/super-resolution-cnn-cifar10' },
                { name: 'EuroSAT CNN Classifier', desc: 'Satellite Image Classification using CNN - EuroSAT Dataset Deep Learning model achieving 96.4% accuracy in land use recognition TensorFlow implementation with comprehensive analysis and visualizations', tags: ['Python', 'TensorFlow', 'CNN', 'Data Augmentation', 'Image Processing'], url: 'https://github.com/sorna-fast/eurosat-cnn-classifier' },
                { name: 'Fraud-detection', desc: 'Predicting transaction fraud using classification problems such as Guardian Boosting as well as user interfaces using Streamlite, Accuracy: 98% AUC-ROC', tags: ['numpy', 'pandas-dataframe', 'gradientboostingclassifier', 'randomforestclassifier', 'xgbclassifier', 'adaboostclassifier', 'streamlit-webapp'], url: 'https://github.com/sorna-fast/fraud-detection' },
                { name: 'Django Online Shop', desc: 'Website project focusing on BKD programming with various features', tags: ['Django', 'ajax', 'mysql database', 'html css'], url: 'https://github.com/sorna-fast/django-online-shop' },
                { name: 'media-database-cs50sql', desc: 'Final project for CS50 SQL – A normalized media database to manage movies, series, contributors, users, comments, and views.', tags: ['SQL', 'SQL-SERVER', 'SQL-Queries', 'SQL-Schema'], url: 'https://github.com/sorna-fast/media-database-cs50sql' },
                { name: 'food-store-database-mongodb', desc: 'Food store database with all orders and database records', tags: ['MongoDB', 'NoSQL Database', 'NoSQL Queries', 'Nosql store'], url: 'https://github.com/sorna-fast/food-store-database-mongodb' }
            ]
        },
        certificates: { title: 'Certificates', pause: '⏸ Pause', play: '▶ Play', speed: '⚡ Speed Up', slow: '🐢 Slow Down', viewAll: 'View All Certificates on GitHub →', allBtn: 'All Certificates', error: '⚠️ Certificate Loading Error', notFound: 'No certificates found', tryAll: 'Try selecting "All Certificates"' },
        about: {
            title: 'About Me', role: 'Backend & AI Developer',
            bio: 'Implementing scalable APIs, database management, and developing robust architectures using Python.<br>Proven track record in building machine learning models with over 98% accuracy in image processing and medical diagnostics, utilizing TensorFlow, Keras, and Scikit-learn.<br>Eager to collaborate in innovative teams to develop intelligent and scalable systems in the fields of data analytics and backend services.',
            education: { title: 'University Education', degree: 'Computer Engineering Student', university: 'Payam Noor University', level: "Bachelor's Degree (B.Sc.) - In Progress", period: '2023 - Present' },
            skillsTitle: 'Key Skills',
            skills: ['Python', 'Django', 'FastAPI', 'Ajax', 'TensorFlow/Keras', 'Scikit-Learn', 'SQL/SQLAlchemy', 'MongoDB', 'Pandas', 'NumPy', 'Data Analysis', 'Git', 'Docker']
        },
        contact: { title: 'Contact', email: 'Email', phone: 'Phone' },
        footer: { text: '© 2025 Masoud Ghasemi (sorna-fast).' }
    },
    fa: {
        dir: 'rtl',
        pageTitle: 'مسعود قاسمی',
        nav: { home: 'خانه', experience: 'تجربیات', projects: 'پروژه‌ها', certificates: 'گواهینامه‌ها', about: 'درباره من', contact: 'تماس' },
        hero: {
            name: 'مسعود قاسمی',
            title: 'مهندس بک‌اند پایتون و هوش مصنوعی',
            subtitle: 'ساخت APIهای مقیاس‌پذیر و مدل‌های هوش مصنوعی',
            cta1: 'تجربیات کاری',
            cta2: 'گیت‌هاب'
        },
        experience: {
            title: 'تجربیات کاری',
            item1: { title: 'توسعه‌دهنده بک‌اند جنگو', company: 'شرکت پایورآسانبر', date: '۲۰۲۵', desc: 'توسعه یک سیستم جامع مدیریت گردش کار با استفاده از جنگو، پیاده‌سازی فرآیندهای خودکار که کارایی عملیاتی را ۲۵٪ افزایش داد.', link: 'مشاهده پروژه: سورنا فلو' },
            item2: { title: 'توسعه‌دهنده بک‌اند جنگو', company: 'کلینیک رویال', date: '۲۰۲۵', desc: 'طراحی و توسعه یک سیستم کامل نوبت‌دهی آنلاین برای کلینیک پزشکی با مدیریت داده‌های منطبق بر HIPAA.', link: 'مشاهده پروژه: کلینیک رویال' },
            item3: { title: 'مدرس هوش مصنوعی', company: 'مؤسسه برجستگان', date: '۲۰۲۵', desc: 'تدریس دوره‌های هوش مصنوعی و برنامه‌نویسی پایتون. توسعه سرفصل‌های جامع شامل مبانی یادگیری ماشین، شبکه‌های عصبی و پیاده‌سازی‌های عملی برای اخذ دکترا.', link: 'پروژه نمونه: پیش‌بینی املاک' }
        },
        projects: {
            title: 'پروژه‌ها', viewAll: '← پروژه‌های بیشتر', viewCode: '← مشاهده کد',
            items: [
                { name: 'سرویس یادگیری عمیق چهره', desc: 'پروژه تشخیص چهره برای پیش‌بینی سن، جنسیت، نژاد و... پروژه در حال ساخت است.', tags: ['یادگیری عمیق', 'تنسورفلو', 'CNN', 'FastAPI'], url: 'https://github.com/sorna-fast/utkface-deep-learning-service' },
                { name: 'دسته‌بند اشعه ایکس قفسه سینه', desc: 'مدل یادگیری عمیق برای تشخیص سل با معماری CNN با دقت ۹۹.۵٪ و امتیاز AUC ۰.۹۹۹.', tags: ['یادگیری عمیق', 'تنسورفلو', 'تشخیص سل', 'بینایی ماشین', 'هوش مصنوعی پزشکی', 'CNN'], url: 'https://github.com/sorna-fast/tb-chest-xray-classifier' },
                { name: 'افزایش وضوح تصویر با CNN', desc: 'تبدیل تصاویر ۱۶×۱۶ با وضوح پایین به نسخه‌های ۳۲×۳۲ با کیفیت بالا با استفاده از یادگیری عمیق.', tags: ['بینایی ماشین', 'یادگیری عمیق', 'افزایش وضوح', 'تنسورفلو'], url: 'https://github.com/sorna-fast/super-resolution-cnn-cifar10' },
                { name: 'دسته‌بند تصاویر ماهواره‌ای', desc: 'دسته‌بندی تصاویر ماهواره‌ای با CNN - مدل یادگیری عمیق روی دیتاست EuroSAT با دقت ۹۶.۴٪.', tags: ['پایتون', 'تنسورفلو', 'CNN', 'افزایش داده', 'پردازش تصویر'], url: 'https://github.com/sorna-fast/eurosat-cnn-classifier' },
                { name: 'تشخیص تقلب', desc: 'پیش‌بینی تقلب در تراکنش‌ها با استفاده از الگوریتم‌های دسته‌بندی مانند گرادیان بوستینگ، دقت: ۹۸٪ AUC-ROC.', tags: ['نامپای', 'پانداس', 'گرادیان بوستینگ', 'جنگل تصادفی', 'استریم‌لیت'], url: 'https://github.com/sorna-fast/fraud-detection' },
                { name: 'فروشگاه آنلاین جنگو', desc: 'پروژه وب‌سایت با تمرکز بر برنامه‌نویسی بک‌اند با امکانات متنوع.', tags: ['جنگو', 'آجاکس', 'دیتابیس MySQL', 'HTML/CSS'], url: 'https://github.com/sorna-fast/django-online-shop' },
                { name: 'دیتابیس رسانه CS50', desc: 'پروژه نهایی CS50 SQL – یک دیتابیس نرمال‌سازی شده برای مدیریت فیلم‌ها، سریال‌ها، مشارکت‌کنندگان، کاربران و نظرات.', tags: ['SQL', 'SQL-SERVER', 'کوئری‌های SQL', 'اسکیما'], url: 'https://github.com/sorna-fast/media-database-cs50sql' },
                { name: 'دیتابیس فروشگاه مواد غذایی', desc: 'دیتابیس فروشگاه مواد غذایی با تمام سفارشات و رکوردهای دیتابیس.', tags: ['مانگودی‌بی', 'دیتابیس NoSQL', 'کوئری‌های NoSQL'], url: 'https://github.com/sorna-fast/food-store-database-mongodb' }
            ]
        },
        certificates: { title: 'گواهینامه‌ها', pause: '⏸ توقف', play: '▶ پخش', speed: '⚡ افزایش سرعت', slow: '🐢 کاهش سرعت', viewAll: '← مشاهده همه گواهینامه‌ها در گیت‌هاب', allBtn: 'همه گواهینامه‌ها', error: '⚠️ خطا در بارگذاری', notFound: 'گواهینامه‌ای یافت نشد', tryAll: '«همه گواهینامه‌ها» را انتخاب کنید' },
        about: {
            title: 'درباره من', role: 'توسعه‌دهنده بک‌اند و هوش مصنوعی',
            bio: 'پیاده‌سازی APIهای مقیاس‌پذیر، مدیریت دیتابیس و توسعه معماری‌های قدرتمند با استفاده از پایتون.<br>سابقه اثبات‌شده در ساخت مدل‌های یادگیری ماشین با دقت بیش از ۹۸٪ در پردازش تصویر و تشخیص پزشکی، با استفاده از تنسورفلو، کراس و سایکیت‌لرن.<br>مشتاق همکاری در تیم‌های نوآور برای توسعه سیستم‌های هوشمند و مقیاس‌پذیر در حوزه‌های تحلیل داده و سرویس‌های بک‌اند.',
            education: { title: 'تحصیلات دانشگاهی', degree: 'دانشجوی مهندسی کامپیوتر', university: 'دانشگاه پیام نور', level: 'کارشناسی - در حال تحصیل', period: '۱۴۰۲ - اکنون' },
            skillsTitle: 'مهارت‌های کلیدی',
            skills: ['Python', 'Django', 'FastAPI', 'Ajax', 'TensorFlow/Keras', 'Scikit-Learn', 'SQL/SQLAlchemy', 'MongoDB', 'Pandas', 'NumPy', 'Data Analysis', 'Git', 'Docker']
        },
        contact: { title: 'تماس', email: 'ایمیل', phone: 'تلفن' },
        footer: { text: '© ۲۰۲۵ مسعود قاسمی (sorna-fast).' }
    },
    de: {
        dir: 'ltr',
        pageTitle: 'Masoud Ghasemi',
        nav: { home: 'Startseite', experience: 'Erfahrung', projects: 'Projekte', certificates: 'Zertifikate', about: 'Über mich', contact: 'Kontakt' },
        hero: {
            name: 'Masoud Ghasemi',
            title: 'Python Backend & KI-Ingenieur',
            subtitle: 'Entwicklung skalierbarer APIs und KI-Modelle',
            cta1: 'Berufserfahrung',
            cta2: 'GitHub'
        },
        experience: {
            title: 'Berufserfahrung',
            item1: { title: 'Django Backend-Entwickler', company: 'Papurasan Unternehmen', date: '2025', desc: 'Entwicklung eines umfassenden Workflow-Management-Systems mit Django, Implementierung automatisierter Prozesse, die die operative Effizienz um 25% steigerten.', link: 'Projekt ansehen: SornaFlow' },
            item2: { title: 'Django Backend-Entwickler', company: 'Royal Clinic', date: '2025', desc: 'Entwurf und Entwicklung eines kompletten Online-Terminbuchungssystems für eine medizinische Klinik mit HIPAA-konformer Datenverarbeitung.', link: 'Projekt ansehen: Royal Clinic' },
            item3: { title: 'KI-Dozent', company: 'Perjestegan Institut', date: '2025', desc: 'Unterrichten von KI- und Python-Programmierkursen. Entwicklung umfassender Lehrpläne zu ML-Grundlagen, neuronalen Netzen und praktischen Implementierungen.', link: 'Beispielprojekt: Immobilienpreisvorhersage' }
        },
        projects: {
            title: 'Projekte', viewAll: 'Mehr Projekte →', viewCode: 'Code ansehen →',
            items: [
                { name: 'utkface-deep-learning-service', desc: 'Ein Gesichtserkennungsprojekt zur Vorhersage von Alter, Geschlecht, Ethnie usw. Das Projekt ist im Aufbau.', tags: ['Deep Learning', 'TensorFlow', 'CNN', 'FastAPI'], url: 'https://github.com/sorna-fast/utkface-deep-learning-service' },
                { name: 'TB Röntgen-Thorax-Klassifikator', desc: 'Deep-Learning-Modell zur Tuberkulose-Erkennung mit CNN-Architektur, 99,5% Genauigkeit und 0,999 AUC-Wert.', tags: ['Deep Learning', 'TensorFlow', 'Tuberkulose', 'Computer Vision', 'Medizinische KI', 'CNN'], url: 'https://github.com/sorna-fast/tb-chest-xray-classifier' },
                { name: 'super-resolution-cnn-cifar10', desc: 'Transformation von 16×16 niedrigauflösenden Bildern in 32×32 hochqualitative Versionen mit Deep Learning.', tags: ['Computer Vision', 'Deep Learning', 'Super-Resolution', 'TensorFlow'], url: 'https://github.com/sorna-fast/super-resolution-cnn-cifar10' },
                { name: 'EuroSAT CNN-Klassifikator', desc: 'Satellitenbildklassifikation mit CNN - EuroSAT-Dataset Deep-Learning-Modell mit 96,4% Genauigkeit bei der Landnutzungserkennung.', tags: ['Python', 'TensorFlow', 'CNN', 'Data Augmentation', 'Bildverarbeitung'], url: 'https://github.com/sorna-fast/eurosat-cnn-classifier' },
                { name: 'Betrugserkennung', desc: 'Vorhersage von Transaktionsbetrug mit Klassifikationsverfahren wie Gradient Boosting. Genauigkeit: 98% AUC-ROC.', tags: ['NumPy', 'Pandas', 'Gradient Boosting', 'Random Forest', 'Streamlit'], url: 'https://github.com/sorna-fast/fraud-detection' },
                { name: 'Django Online-Shop', desc: 'Website-Projekt mit Fokus auf Backend-Programmierung mit verschiedenen Funktionen.', tags: ['Django', 'Ajax', 'MySQL', 'HTML/CSS'], url: 'https://github.com/sorna-fast/django-online-shop' },
                { name: 'media-database-cs50sql', desc: 'Abschlussprojekt für CS50 SQL – Eine normalisierte Mediendatenbank zur Verwaltung von Filmen, Serien, Mitwirkenden, Nutzern und Kommentaren.', tags: ['SQL', 'SQL-SERVER', 'SQL-Queries', 'SQL-Schema'], url: 'https://github.com/sorna-fast/media-database-cs50sql' },
                { name: 'food-store-database-mongodb', desc: 'Lebensmittelgeschäft-Datenbank mit allen Bestellungen und Datenbankeinträgen.', tags: ['MongoDB', 'NoSQL-Datenbank', 'NoSQL-Queries'], url: 'https://github.com/sorna-fast/food-store-database-mongodb' }
            ]
        },
        certificates: { title: 'Zertifikate', pause: '⏸ Pause', play: '▶ Abspielen', speed: '⚡ Schneller', slow: '🐢 Langsamer', viewAll: 'Alle Zertifikate auf GitHub ansehen →', allBtn: 'Alle Zertifikate', error: '⚠️ Fehler beim Laden', notFound: 'Keine Zertifikate gefunden', tryAll: 'Wählen Sie „Alle Zertifikate"' },
        about: {
            title: 'Über mich', role: 'Backend & KI-Entwickler',
            bio: 'Implementierung skalierbarer APIs, Datenbankmanagement und Entwicklung robuster Architekturen mit Python.<br>Nachgewiesene Erfahrung beim Aufbau von Machine-Learning-Modellen mit über 98% Genauigkeit in Bildverarbeitung und medizinischer Diagnostik mit TensorFlow, Keras und Scikit-learn.<br>Interessiert an der Zusammenarbeit in innovativen Teams zur Entwicklung intelligenter und skalierbarer Systeme in den Bereichen Datenanalyse und Backend-Dienste.',
            education: { title: 'Hochschulbildung', degree: 'Student der Informatik', university: 'Payam Noor Universität', level: 'Bachelor (B.Sc.) - Laufend', period: '2023 - Gegenwart' },
            skillsTitle: 'Kernkompetenzen',
            skills: ['Python', 'Django', 'FastAPI', 'Ajax', 'TensorFlow/Keras', 'Scikit-Learn', 'SQL/SQLAlchemy', 'MongoDB', 'Pandas', 'NumPy', 'Datenanalyse', 'Git', 'Docker']
        },
        contact: { title: 'Kontakt', email: 'E-Mail', phone: 'Telefon' },
        footer: { text: '© 2025 Masoud Ghasemi (sorna-fast).' }
    }
};

let currentLang = localStorage.getItem('site-lang') || 'en';

function getTranslation(key) {
    const keys = key.split('.');
    let obj = translations[currentLang];
    for (const k of keys) {
        if (obj && obj[k] !== undefined) {
            obj = obj[k];
        } else {
            obj = translations['en'];
            for (const ek of keys) {
                if (obj && obj[ek] !== undefined) {
                    obj = obj[ek];
                } else {
                    return key;
                }
            }
            return obj;
        }
    }
    return obj;
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site-lang', lang);

    const dir = translations[lang].dir;
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);

    // 🔧 تغییر عنوان تب مرورگر
    document.title = translations[lang].pageTitle || 'Masoud Ghasemi';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 🔧 به‌روزرسانی data-text برای hero subtitle
    const heroP = document.querySelector('.hero p[data-i18n="hero.subtitle"]');
    if (heroP) {
        heroP.setAttribute('data-text', getTranslation('hero.subtitle'));
    }

    populateContent();
    generateStars();

    const pauseBtn = document.getElementById('pauseBtn');
    const speedBtn = document.getElementById('speedBtn');
    if (pauseBtn && window._certSliderInstance) {
        pauseBtn.textContent = window._certSliderInstance.isPaused
            ? getTranslation('certificates.play')
            : getTranslation('certificates.pause');
    }
    if (speedBtn && window._certSliderInstance) {
        speedBtn.textContent = window._certSliderInstance.speed === 90
            ? getTranslation('certificates.speed')
            : getTranslation('certificates.slow');
    }

    // 🔧 به‌روزرسانی انیمیشن گواهی‌ها
    if (window._certSliderInstance) {
        window._certSliderInstance.updateAnimation();
    }
}

function initLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyLanguage(btn.dataset.lang);
        });
    });
    applyLanguage(currentLang);
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
        window._certSliderInstance = this;
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
        allBtn.textContent = getTranslation('certificates.allBtn');
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
            pauseBtn.textContent = this.isPaused
                ? getTranslation('certificates.play')
                : getTranslation('certificates.pause');
            this.updateAnimation();
        });
        if (speedBtn) speedBtn.addEventListener('click', () => {
            this.speed = this.speed === 90 ? 35 : 90;
            speedBtn.textContent = this.speed === 90
                ? getTranslation('certificates.speed')
                : getTranslation('certificates.slow');
            this.updateAnimation();
        });
    }
    filter(org) {
        this.filteredCertificates = org === 'all' ? [...this.allCertificates] : this.allCertificates.filter(c => c.org.toLowerCase() === org);
        this.render();
    }
    render() {
        if (this.errorMessage) {
            this.slider.innerHTML = `<div style="text-align:center;padding:40px;color:var(--accent);background:rgba(100,255,218,0.05);border-radius:10px;"><h3>${getTranslation('certificates.error')}</h3><p>${this.errorMessage}</p></div>`;
            return;
        }
        if (!this.filteredCertificates.length) {
            this.slider.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary);"><h3>${getTranslation('certificates.notFound')}</h3><p>${getTranslation('certificates.tryAll')}</p></div>`;
            return;
        }
        this.speed = Math.max(35, this.filteredCertificates.length * 4);
        const html = this.filteredCertificates.map(c => {
            const preview = c.downloadUrl ? `<img src="${c.downloadUrl}" alt="${c.name}" loading="lazy" decoding="async">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;"><span style="font-size:1.5rem;color:var(--accent);">📄</span><span style="font-size:0.75rem;color:var(--text-muted);">PDF</span></div>`;
            return `<div class="certificate-card" onclick="window.open('${c.url}','_blank')"><div class="cert-preview">${preview}</div><span class="org-tag">${c.org.toUpperCase()}</span><h4>${c.name}</h4><span class="cert-type">${c.type.toUpperCase()}</span></div>`;
        }).join('');
        this.slider.innerHTML = html + html;
        this.updateAnimation();
    }
    updateAnimation() {
        this.slider.style.animation = `slideRTL ${this.speed}s linear infinite`;
        this.slider.style.animationDirection = 'normal';
        this.slider.style.animationPlayState = this.isPaused ? 'paused' : 'running';
    }
}

// ===== Mobile Menu =====
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
    requestAnimationFrame(() => { html.style.scrollBehavior = prevBehavior; });
}

function openMenu() { lockBody(); navLinks.classList.add('active'); hamburger.classList.add('active'); }
function closeMenu() { navLinks.classList.remove('active'); hamburger.classList.remove('active'); unlockBody(); }

hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) closeMenu();
    else openMenu();
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
});

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// ===== Populate dynamic content =====
function populateContent() {
    const t = translations[currentLang];

    const skillsList = document.getElementById('skillsList');
    if (skillsList) {
        const skills = translations.en.about.skills;
        skillsList.innerHTML = skills.map(s => `<span class="skill-item">${s}</span>`).join('');
        requestAnimationFrame(() => {
            skillsList.querySelectorAll('.skill-item').forEach(item => {
                item.style.animation = 'none';
                requestAnimationFrame(() => { item.style.animation = ''; });
            });
        });
    }

    const grid = document.getElementById('projectsGrid');
    if (grid) {
        grid.innerHTML = t.projects.items.map(p => `
            <div class="project-card">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="tags">${p.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <a href="${p.url}" target="_blank" class="project-link">${t.projects.viewCode}</a>
            </div>
        `).join('');
        initTilt();
    }
}

// ===== CursorGrid =====
(function initCursorGrid() {
    const experienceSection = document.querySelector('.experience');
    if (!experienceSection) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-grid-canvas';
    canvas.style.cssText = `
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        z-index: 0; pointer-events: none;
        border-radius: inherit;
    `;
    experienceSection.insertBefore(canvas, experienceSection.firstChild);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.25 : 2);

    const CONFIG = {
        cellSize: IS_MOBILE ? 100 : 70, color: '#64ffda',
        radius: 180, falloff: 'smooth',
        holdTime: 400, fadeDuration: 800,
        lineWidth: 1.2, maxOpacity: 0.5,
        fillOpacity: 0.03, gridOpacity: 0.04,
        cellRadius: 0, clickPulse: true, pulseSpeed: 600
    };

    const FALLOFF_CURVES = {
        linear: t => t,
        smooth: t => t * t * (3 - 2 * t),
        sharp: t => t * t * t
    };

    const hexToRgb = hex => {
        const h = hex.replace('#', '');
        const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
        const num = parseInt(v.slice(0, 6), 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };

    let cols = 0, rows = 0, offX = 0, offY = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    let w = 0, h = 0;
    const pulses = [];
    let raf = 0, running = false, lastFrame = 0;

    const rebuild = () => {
        w = experienceSection.offsetWidth;
        h = experienceSection.offsetHeight;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cols = Math.ceil(w / CONFIG.cellSize) + 1;
        rows = Math.ceil(h / CONFIG.cellSize) + 1;
        offX = (w - cols * CONFIG.cellSize) / 2;
        offY = (h - rows * CONFIG.cellSize) / 2;
        alphas = new Float32Array(cols * rows);
        touched = new Float64Array(cols * rows);
    };

    const cellCenter = i => {
        const cx = offX + (i % cols) * CONFIG.cellSize + CONFIG.cellSize / 2;
        const cy = offY + Math.floor(i / cols) * CONFIG.cellSize + CONFIG.cellSize / 2;
        return [cx, cy];
    };

    const energize = (x, y, boost) => {
        const r = Math.max(CONFIG.radius, 1);
        const ease = FALLOFF_CURVES[CONFIG.falloff] ?? FALLOFF_CURVES.linear;
        const now = performance.now();
        const minCol = Math.max(0, Math.floor((x - r - offX) / CONFIG.cellSize));
        const maxCol = Math.min(cols - 1, Math.floor((x + r - offX) / CONFIG.cellSize));
        const minRow = Math.max(0, Math.floor((y - r - offY) / CONFIG.cellSize));
        const maxRow = Math.min(rows - 1, Math.floor((y + r - offY) / CONFIG.cellSize));
        for (let cRow = minRow; cRow <= maxRow; cRow++) {
            for (let cCol = minCol; cCol <= maxCol; cCol++) {
                const i = cRow * cols + cCol;
                const [cx, cy] = cellCenter(i);
                const dist = Math.hypot(cx - x, cy - y);
                if (dist > r) continue;
                const level = ease(1 - dist / r) * CONFIG.maxOpacity * (boost ?? 1);
                if (level > alphas[i]) { alphas[i] = level; touched[i] = now; }
                else if (level > 0) { touched[i] = now; }
            }
        }
    };

    const draw = now => {
        const dt = Math.min(now - lastFrame, 50);
        lastFrame = now;
        ctx.clearRect(0, 0, w, h);
        const [cr, cg, cb] = hexToRgb(CONFIG.color);

        if (CONFIG.gridOpacity > 0) {
            ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${CONFIG.gridOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let cCol = 0; cCol <= cols; cCol++) {
                const x = Math.round(offX + cCol * CONFIG.cellSize) + 0.5;
                ctx.moveTo(x, 0); ctx.lineTo(x, h);
            }
            for (let cRow = 0; cRow <= rows; cRow++) {
                const y = Math.round(offY + cRow * CONFIG.cellSize) + 0.5;
                ctx.moveTo(0, y); ctx.lineTo(w, y);
            }
            ctx.stroke();
        }

        for (let pi = pulses.length - 1; pi >= 0; pi--) {
            const pulse = pulses[pi];
            const age = (now - pulse.t0) / 1000;
            const ringR = age * CONFIG.pulseSpeed;
            if (ringR > Math.hypot(w, h)) { pulses.splice(pi, 1); continue; }
            const band = CONFIG.cellSize;
            const minCol = Math.max(0, Math.floor((pulse.x - ringR - band - offX) / CONFIG.cellSize));
            const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - offX) / CONFIG.cellSize));
            const minRow = Math.max(0, Math.floor((pulse.y - ringR - band - offY) / CONFIG.cellSize));
            const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - offY) / CONFIG.cellSize));
            for (let cRow = minRow; cRow <= maxRow; cRow++) {
                for (let cCol = minCol; cCol <= maxCol; cCol++) {
                    const i = cRow * cols + cCol;
                    const [cx, cy] = cellCenter(i);
                    const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
                    if (Math.abs(dist - ringR) < band / 2 && CONFIG.maxOpacity > alphas[i]) {
                        alphas[i] = CONFIG.maxOpacity; touched[i] = now;
                    }
                }
            }
        }

        let anyVisible = pulses.length > 0;
        const fadeStep = dt / Math.max(CONFIG.fadeDuration, 16);
        const half = CONFIG.cellSize / 2;

        for (let i = 0; i < alphas.length; i++) {
            let a = alphas[i];
            if (a <= 0) continue;
            if (now - touched[i] > CONFIG.holdTime) {
                a = Math.max(0, a - fadeStep);
                alphas[i] = a;
                if (a <= 0) continue;
            }
            anyVisible = true;

            const [cx, cy] = cellCenter(i);
            const gradient = ctx.createRadialGradient(cx, cy, half * 0.1, cx, cy, CONFIG.cellSize);
            gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a})`);
            gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

            const x = cx - half + 0.5;
            const y = cy - half + 0.5;
            const s = CONFIG.cellSize - 1;

            ctx.beginPath();
            if (CONFIG.cellRadius > 0) ctx.roundRect(x, y, s, s, CONFIG.cellRadius);
            else ctx.rect(x, y, s, s);
            if (CONFIG.fillOpacity > 0) {
                ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * CONFIG.fillOpacity})`;
                ctx.fill();
            }
            ctx.strokeStyle = gradient;
            ctx.lineWidth = CONFIG.lineWidth;
            ctx.stroke();
        }

        if (anyVisible) { raf = requestAnimationFrame(draw); }
        else {
            running = false;
            if (CONFIG.gridOpacity <= 0) ctx.clearRect(0, 0, w, h);
        }
    };

    const wake = () => {
        if (running) return;
        running = true;
        lastFrame = performance.now();
        raf = requestAnimationFrame(draw);
    };

    const toLocal = e => {
        const rect = experienceSection.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onPointerMove = e => { const [x, y] = toLocal(e); energize(x, y); wake(); };
    const onPointerDown = e => {
        if (!CONFIG.clickPulse) return;
        const [x, y] = toLocal(e);
        pulses.push({ x, y, t0: performance.now() });
        wake();
    };

    const ro = new ResizeObserver(() => { rebuild(); wake(); });
    ro.observe(experienceSection);
    rebuild();

    experienceSection.addEventListener('pointermove', onPointerMove);
    experienceSection.addEventListener('pointerdown', onPointerDown);

    window.addEventListener('unload', () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        experienceSection.removeEventListener('pointermove', onPointerMove);
        experienceSection.removeEventListener('pointerdown', onPointerDown);
    });
})();

// ===== ClickSpark =====
(function initClickSpark() {
    const CONFIG = {
        sparkColor: '#64ffda', sparkSize: 12,
        sparkRadius: 25, sparkCount: 10,
        duration: 500, lineWidth: 2, easing: 'ease-out'
    };

    const easeFuncs = {
        'linear': t => t,
        'ease-in': t => t * t,
        'ease-in-out': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        'ease-out': t => t * (2 - t)
    };
    const easeFunc = easeFuncs[CONFIG.easing] || easeFuncs['ease-out'];

    const canvas = document.createElement('canvas');
    canvas.id = 'click-spark-canvas';
    canvas.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none; z-index: 99998;
        display: block; user-select: none;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.25 : 2);
    const sparks = [];
    let animationId = null;
    let isAnimating = false;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = (timestamp) => {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        for (let i = sparks.length - 1; i >= 0; i--) {
            const spark = sparks[i];
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= CONFIG.duration) { sparks.splice(i, 1); continue; }

            const progress = elapsed / CONFIG.duration;
            const eased = easeFunc(progress);
            const distance = eased * CONFIG.sparkRadius;
            const lineLength = CONFIG.sparkSize * (1 - eased);
            const opacity = 1 - eased;

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

            ctx.strokeStyle = CONFIG.sparkColor;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = CONFIG.lineWidth;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        if (sparks.length > 0) animationId = requestAnimationFrame(draw);
        else { isAnimating = false; cancelAnimationFrame(animationId); }
    };

    const startAnimation = () => {
        if (!isAnimating) {
            isAnimating = true;
            animationId = requestAnimationFrame(draw);
        }
    };

    const handleClick = (e) => {
        const x = e.clientX; const y = e.clientY;
        const now = performance.now();
        const newSparks = Array.from({ length: CONFIG.sparkCount }, (_, i) => ({
            x, y, angle: (2 * Math.PI * i) / CONFIG.sparkCount, startTime: now
        }));
        sparks.push(...newSparks);
        startAnimation();
    };

    document.addEventListener('click', handleClick);

    window.addEventListener('unload', () => {
        cancelAnimationFrame(animationId);
        document.removeEventListener('click', handleClick);
        window.removeEventListener('resize', resizeCanvas);
    });
})();

// ===== Pixel Card Effect for Education Item =====
(function initEducationPixelCard() {
    const educationItem = document.querySelector('.education-item');
    if (!educationItem) return;

    // تنظیمات - مچ با رنگ‌های سایت
    const CONFIG = {
        gap: IS_MOBILE ? 10 : 6,
        speed: 25,
        colors: [
            '#e6f1ff', '#e6f1ff', '#e6f1ff', '#e6f1ff', '#e6f1ff', '#e6f1ff',  // ۶۰٪ - رنگ اصلی
            '#94a3b8', '#94a3b8',  // ۲۰٪ - خاکستری متوسط
            '#64748b', '#64748b'   // ۲۰٪ - خاکستری تیره
        ],
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    class Pixel {
        constructor(canvas, ctx, x, y, color, speed, delay) {
            this.width = canvas.width;
            this.height = canvas.height;
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.color = color;
            this.speed = this.getRandomValue(0.1, 0.9) * speed;
            this.size = 0;
            this.sizeStep = Math.random() * 0.4;
            this.minSize = 0.5;
            this.maxSizeInteger = 2;
            this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
            this.delay = delay;
            this.counter = 0;
            this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
            this.isIdle = false;
            this.isReverse = false;
            this.isShimmer = false;
        }

        getRandomValue(min, max) {
            return Math.random() * (max - min) + min;
        }

        draw() {
            const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
        }

        appear() {
            this.isIdle = false;
            if (this.counter <= this.delay) {
                this.counter += this.counterStep;
                return;
            }
            if (this.size >= this.maxSize) {
                this.isShimmer = true;
            }
            if (this.isShimmer) {
                this.shimmer();
            } else {
                this.size += this.sizeStep;
            }
            this.draw();
        }

        disappear() {
            this.isShimmer = false;
            this.counter = 0;
            if (this.size <= 0) {
                this.isIdle = true;
                return;
            } else {
                this.size -= 0.1;
            }
            this.draw();
        }

        shimmer() {
            if (this.size >= this.maxSize) {
                this.isReverse = true;
            } else if (this.size <= this.minSize) {
                this.isReverse = false;
            }
            if (this.isReverse) {
                this.size -= this.speed;
            } else {
                this.size += this.speed;
            }
        }
    }

    // ایجاد canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'pixel-canvas';
    canvas.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
    `;

    // آماده‌سازی container
    educationItem.style.position = 'relative';
    educationItem.style.overflow = 'hidden';
    educationItem.insertBefore(canvas, educationItem.firstChild);

    // اطمینان از اینکه محتوا بالای canvas قرار بگیرد
    Array.from(educationItem.children).forEach(child => {
        if (child !== canvas) {
            child.style.position = 'relative';
            child.style.zIndex = '1';
        }
    });

    const ctx = canvas.getContext('2d');
    let pixels = [];
    let animationId = null;
    let timePrevious = performance.now();

    const initPixels = () => {
        const rect = educationItem.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const pxs = [];
        for (let x = 0; x < width; x += CONFIG.gap) {
            for (let y = 0; y < height; y += CONFIG.gap) {
                const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
                const dx = x - width / 2;
                const dy = y - height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delay = CONFIG.reducedMotion ? 0 : distance;
                const speed = CONFIG.reducedMotion ? 0 : CONFIG.speed * 0.001;

                pxs.push(new Pixel(canvas, ctx, x, y, color, speed, delay));
            }
        }
        pixels = pxs;
    };

    const doAnimate = (fnName) => {
        animationId = requestAnimationFrame(() => doAnimate(fnName));
        const timeNow = performance.now();
        const timePassed = timeNow - timePrevious;
        const timeInterval = 1000 / 60;

        if (timePassed < timeInterval) return;
        timePrevious = timeNow - (timePassed % timeInterval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let allIdle = true;
        for (let i = 0; i < pixels.length; i++) {
            pixels[i][fnName]();
            if (!pixels[i].isIdle) allIdle = false;
        }
        if (allIdle) cancelAnimationFrame(animationId);
    };

    const handleAnimation = (name) => {
        if (CONFIG.reducedMotion) return;
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(() => doAnimate(name));
    };

    // Event listeners - پشتیبانی از موس و تاچ
    educationItem.addEventListener('mouseenter', () => handleAnimation('appear'));
    educationItem.addEventListener('mouseleave', () => handleAnimation('disappear'));
    educationItem.addEventListener('focusin', () => handleAnimation('appear'));
    educationItem.addEventListener('focusout', (e) => {
        if (!educationItem.contains(e.relatedTarget)) handleAnimation('disappear');
    });

    // 🔧 پشتیبانی از لمس در موبایل
    educationItem.addEventListener('touchstart', (e) => {
        e.preventDefault(); // جلوگیری از اسکرول ناخواسته
        handleAnimation('appear');
    }, { passive: false });

    educationItem.addEventListener('touchend', () => {
        // کمی تاخیر تا کاربر افکت رو ببینه
        setTimeout(() => handleAnimation('disappear'), 800);
    }, { passive: true });

    // پشتیبانی از Pointer Events (ترکیبی از موس و تاچ)
    educationItem.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return; // قبلاً با touchstart هندل شده
        handleAnimation('appear');
    });

    educationItem.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'touch') return;
        handleAnimation('disappear');
    });
    // Init با تاخیر کوتاه برای اطمینان از بارگذاری کامل DOM
    setTimeout(initPixels, 100);

    // Resize handler
    const observer = new ResizeObserver(() => {
        initPixels();
    });
    observer.observe(educationItem);

    // Cleanup
    window.addEventListener('unload', () => {
        observer.disconnect();
        cancelAnimationFrame(animationId);
    });
})();


// ===== Ghost Fibers Background for Certificates Section =====
function initGhostFibers() {
    const certSection = document.getElementById('certificates');
    if (!certSection) return;

    // بهینه‌سازی برای موبایل
    const mobile = window.innerWidth <= 768;

    const CONFIG = {
        // رنگ‌ها مچ با سایت (سبز-آبی)
        lineColor: '#0d2b26',       // سبز تیره
        glowColor: '#1a6b5f',       // سبز آبی درخشان
        backgroundColor: '#0c1222', // پس‌زمینه تیره سایت
        speed: mobile ? 0.15 : 0.2,
        scale: mobile ? 2.5 : 2,
        rotation: 0,
        rotationSpeed: mobile ? 0.15 : 0.25,
        layers: mobile ? 3 : 4,
        waveAmplitude: mobile ? 0.01 : 0.015,
        waveFrequency: mobile ? 2.5 : 3,
        waveSpeed: mobile ? 0.1 : 0.15,
        layerSpeed: mobile ? 0.06 : 0.08,
        twist: mobile ? 0.08 : 0.1,
        twistFrequency: mobile ? 4 : 5,
        twistSpeed: mobile ? 1 : 1.2,
        lineFrequency: mobile ? 4 : 5,
        lineSpacing: mobile ? 1.5 : 2,
        lineSharpness: mobile ? 12 : 16,
        glowFalloff: mobile ? 8 : 10,
        glowIntensity: mobile ? 1.2 : 1.6,
        brightness: mobile ? 1.5 : 2,
        blueBoost: 1.1,
        vignette: mobile ? 0.9 : 0.8,
        grain: mobile ? 0.02 : 0.04,
        fps: mobile ? 30 : 60
    };

    const hexToRgb = hex => {
        const value = hex.trim().replace(/^#/, '');
        const normalized = value.length === 3 ? value.replace(/./g, ch => ch + ch) : value;
        const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
        if (!match) return [1, 1, 1];
        return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255];
    };

    const vertexShaderSource = `#version 300 es
        in vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision highp float;

        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uRotation;
        uniform float uLayers;
        uniform float uWaveAmplitude;
        uniform float uWaveFrequency;
        uniform float uWaveSpeed;
        uniform float uLayerSpeed;
        uniform float uTwist;
        uniform float uTwistFrequency;
        uniform float uTwistSpeed;
        uniform float uLineFrequency;
        uniform float uLineSpacing;
        uniform float uLineSharpness;
        uniform float uGlowFalloff;
        uniform float uGlowIntensity;
        uniform float uBrightness;
        uniform float uBlueBoost;
        uniform float uVignette;
        uniform float uGrain;
        uniform float uRotationSpeed;
        uniform vec3 uLineColor;
        uniform vec3 uGlowColor;
        uniform vec3 uBgColor;

        out vec4 fragColor;

        #define MAX_LAYERS 10

        mat2 rotate2d(float angle) {
            float sine = sin(angle);
            float cosine = cos(angle);
            return mat2(cosine, -sine, sine, cosine);
        }

        float grainHash(vec2 point) {
            point = floor(point);
            float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
            return fract(hash);
        }

        float layeredGrain(vec2 fragmentPixel) {
            vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
            vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
            float grain = 0.0;
            grain += 0.40 * grainHash(rotated);
            grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
            grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
            grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
            grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
            return grain;
        }

        void main() {
            vec2 resolution = max(uResolution, vec2(1.0));
            vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
            float time = uTime * uSpeed;

            vec3 backdrop = uBgColor;
            vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
            vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;

            vec2 p = uv;
            p /= max(uScale, 0.05);
            p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;

            vec3 color = vec3(0.0);
            float fiberField = 0.0;

            for (int index = 0; index < MAX_LAYERS; index++) {
                float fi = float(index) + 1.0;
                if (fi > uLayers) break;

                p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

                float radius = length(p);
                float polarAngle = atan(p.y, p.x);
                polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
                p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

                float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
                lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
                fiberField += lines / fi;
                color += uLineColor * lines / fi;

                float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
                color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
            }

            float center = exp(-2.2 * dot(uv, uv));
            color += centerTone * center;

            float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
            color += cloudTone * cloud;

            float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
            color *= mix(1.0 - uVignette, 1.0, vignette);
            color = 1.0 - exp(-color * uBrightness);
            color.b *= uBlueBoost;

            vec3 outputColor = backdrop + color;

            float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
            outputColor = clamp(outputColor + noise, 0.0, 1.0);
            fragColor = vec4(outputColor, 1.0);
        }
    `;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'ghost-fibers-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
        opacity: ${mobile ? 0.4 : 0.6};
    `;

    // Prepare section
    certSection.style.position = 'relative';
    certSection.style.overflow = 'hidden';

    // Insert canvas as FIRST child
    certSection.insertBefore(canvas, certSection.firstChild);

    // Ensure ALL direct children except canvas are above it
    Array.from(certSection.children).forEach(child => {
        if (child !== canvas) {
            child.style.position = 'relative';
            child.style.zIndex = '1';
        }
    });

    // WebGL2 Context
    const gl = canvas.getContext('webgl2', { antialias: false });

    if (!gl) {
        console.warn('WebGL2 not supported, skipping GhostFibers');
        canvas.remove();
        return;
    }

    const compileShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) {
        canvas.remove();
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        canvas.remove();
        return;
    }

    gl.useProgram(program);

    // Fullscreen triangle
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const u = {
        uResolution: gl.getUniformLocation(program, 'uResolution'),
        uTime: gl.getUniformLocation(program, 'uTime'),
        uSpeed: gl.getUniformLocation(program, 'uSpeed'),
        uScale: gl.getUniformLocation(program, 'uScale'),
        uRotation: gl.getUniformLocation(program, 'uRotation'),
        uRotationSpeed: gl.getUniformLocation(program, 'uRotationSpeed'),
        uLayers: gl.getUniformLocation(program, 'uLayers'),
        uWaveAmplitude: gl.getUniformLocation(program, 'uWaveAmplitude'),
        uWaveFrequency: gl.getUniformLocation(program, 'uWaveFrequency'),
        uWaveSpeed: gl.getUniformLocation(program, 'uWaveSpeed'),
        uLayerSpeed: gl.getUniformLocation(program, 'uLayerSpeed'),
        uTwist: gl.getUniformLocation(program, 'uTwist'),
        uTwistFrequency: gl.getUniformLocation(program, 'uTwistFrequency'),
        uTwistSpeed: gl.getUniformLocation(program, 'uTwistSpeed'),
        uLineFrequency: gl.getUniformLocation(program, 'uLineFrequency'),
        uLineSpacing: gl.getUniformLocation(program, 'uLineSpacing'),
        uLineSharpness: gl.getUniformLocation(program, 'uLineSharpness'),
        uGlowFalloff: gl.getUniformLocation(program, 'uGlowFalloff'),
        uGlowIntensity: gl.getUniformLocation(program, 'uGlowIntensity'),
        uBrightness: gl.getUniformLocation(program, 'uBrightness'),
        uBlueBoost: gl.getUniformLocation(program, 'uBlueBoost'),
        uVignette: gl.getUniformLocation(program, 'uVignette'),
        uGrain: gl.getUniformLocation(program, 'uGrain'),
        uLineColor: gl.getUniformLocation(program, 'uLineColor'),
        uGlowColor: gl.getUniformLocation(program, 'uGlowColor'),
        uBgColor: gl.getUniformLocation(program, 'uBgColor')
    };

    const lineRgb = hexToRgb(CONFIG.lineColor);
    const glowRgb = hexToRgb(CONFIG.glowColor);
    const bgRgb = hexToRgb(CONFIG.backgroundColor);

    // Set static uniforms
    const setStaticUniforms = () => {
        gl.uniform1f(u.uSpeed, CONFIG.speed);
        gl.uniform1f(u.uScale, CONFIG.scale);
        gl.uniform1f(u.uRotation, CONFIG.rotation);
        gl.uniform1f(u.uRotationSpeed, CONFIG.rotationSpeed);
        gl.uniform1f(u.uLayers, Math.min(Math.max(Math.round(CONFIG.layers), 1), 10));
        gl.uniform1f(u.uWaveAmplitude, CONFIG.waveAmplitude);
        gl.uniform1f(u.uWaveFrequency, CONFIG.waveFrequency);
        gl.uniform1f(u.uWaveSpeed, CONFIG.waveSpeed);
        gl.uniform1f(u.uLayerSpeed, CONFIG.layerSpeed);
        gl.uniform1f(u.uTwist, CONFIG.twist);
        gl.uniform1f(u.uTwistFrequency, CONFIG.twistFrequency);
        gl.uniform1f(u.uTwistSpeed, CONFIG.twistSpeed);
        gl.uniform1f(u.uLineFrequency, CONFIG.lineFrequency);
        gl.uniform1f(u.uLineSpacing, CONFIG.lineSpacing);
        gl.uniform1f(u.uLineSharpness, CONFIG.lineSharpness);
        gl.uniform1f(u.uGlowFalloff, CONFIG.glowFalloff);
        gl.uniform1f(u.uGlowIntensity, CONFIG.glowIntensity);
        gl.uniform1f(u.uBrightness, CONFIG.brightness);
        gl.uniform1f(u.uBlueBoost, CONFIG.blueBoost);
        gl.uniform1f(u.uVignette, CONFIG.vignette);
        gl.uniform1f(u.uGrain, CONFIG.grain);
        gl.uniform3fv(u.uLineColor, lineRgb);
        gl.uniform3fv(u.uGlowColor, glowRgb);
        gl.uniform3fv(u.uBgColor, bgRgb);
    };

    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 0.5), IS_MOBILE ? 1 : 2);

    // Resize function that renders immediately
    const resize = () => {
        const rect = certSection.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        setStaticUniforms();
        gl.uniform2fv(u.uResolution, [canvas.width, canvas.height]);
        // Render one frame immediately after resize
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();

    // ResizeObserver to keep canvas covering the full section
    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    resizeObserver.observe(certSection);

    // Render loop
    let frameId = null;
    let elapsed = 0;
    let previousTime = performance.now();
    let lastRenderTime = 0;
    let running = false;
    let isVisible = false;
    let isPageVisible = !document.hidden;
    const frameRate = CONFIG.fps;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const canAnimate = () => isVisible && isPageVisible && !reducedMotion.matches;

    const stop = () => {
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
        running = false;
    };

    const loop = (now) => {
        if (!running || !canAnimate()) {
            stop();
            return;
        }

        frameId = requestAnimationFrame(loop);

        const delta = Math.min((now - previousTime) / 1000, 0.1);
        previousTime = now;
        elapsed += delta;

        if (now - lastRenderTime >= 1000 / frameRate - 0.5) {
            gl.uniform1f(u.uTime, elapsed);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            lastRenderTime = now;
        }
    };

    const start = () => {
        if (running || !canAnimate()) return;
        running = true;
        previousTime = performance.now();
        frameId = requestAnimationFrame(loop);
    };

    // IntersectionObserver to only run when section is in viewport
    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (canAnimate()) start();
            else stop();
        });
    }, { threshold: 0 });

    intersectionObserver.observe(certSection);

    // Pause when tab is hidden
    const handleVisibility = () => {
        isPageVisible = !document.hidden;
        if (canAnimate()) start();
        else stop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Handle reduced motion changes
    const handleReducedMotion = () => {
        if (canAnimate()) start();
        else {
            stop();
            resize(); // Render one static frame
        }
    };
    reducedMotion.addEventListener('change', handleReducedMotion);

    // Cleanup
    window.addEventListener('unload', () => {
        stop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', handleVisibility);
        reducedMotion.removeEventListener('change', handleReducedMotion);
    });
}
// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    populateContent();
    generateStars();
    initTilt();
    initLanguageSwitcher();
    new CertificateSlider();
    new ScrollReveal();
    initGhostFibers();
});


// ===== Lightfall WebGL Background for Hero Section =====
(function initLightfall() {
    const heroSection = document.querySelector('#home');
    if (!heroSection) return;

    // تنظیمات - مچ با رنگ‌های سایت (بدون موس)
    const CONFIG = {
        colors: ['#64ffda', '#48c9b0', '#38b2a0', '#64ffda', '#48c9b0', '#38b2a0', '#64ffda', '#e6f1ff'],
        backgroundColor: '#0a192f',
        speed: 0.5,
        streakCount: 3,
        streakWidth: 1,
        streakLength: 1,
        glow: 1,
        density: 0.6,
        twinkle: 1,
        zoom: 3,
        backgroundGlow: 0.5,
        opacity: 0.55
    };

    const MAX_COLORS = 8;

    const hexToRGB = hex => {
        const c = hex.replace('#', '').padEnd(6, '0');
        return [
            parseInt(c.slice(0, 2), 16) / 255,
            parseInt(c.slice(2, 4), 16) / 255,
            parseInt(c.slice(4, 6), 16) / 255
        ];
    };

    const prepColors = input => {
        const base = (input && input.length ? input : ['#64ffda', '#48c9b0', '#38b2a0']).slice(0, MAX_COLORS);
        const count = base.length;
        const arr = [];
        for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
        return { arr, count };
    };

    const vertexShaderSource = `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;

        uniform vec3  iResolution;
        uniform float iTime;

        uniform vec3  uColor0;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        uniform vec3  uColor3;
        uniform vec3  uColor4;
        uniform vec3  uColor5;
        uniform vec3  uColor6;
        uniform vec3  uColor7;
        uniform int   uColorCount;

        uniform vec3  uBgColor;
        uniform float uSpeed;
        uniform int   uStreakCount;
        uniform float uStreakWidth;
        uniform float uStreakLength;
        uniform float uGlow;
        uniform float uDensity;
        uniform float uTwinkle;
        uniform float uZoom;
        uniform float uBgGlow;
        uniform float uOpacity;

        varying vec2 vUv;

        vec3 palette(float h) {
            int count = uColorCount;
            if (count < 1) count = 1;
            int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
            if (idx <= 0) return uColor0;
            if (idx == 1) return uColor1;
            if (idx == 2) return uColor2;
            if (idx == 3) return uColor3;
            if (idx == 4) return uColor4;
            if (idx == 5) return uColor5;
            if (idx == 6) return uColor6;
            return uColor7;
        }

        vec3 tanhv(vec3 x) {
            vec3 e = exp(-2.0 * x);
            return (1.0 - e) / (1.0 + e);
        }

        vec2 sceneC(vec2 frag, vec2 r) {
            vec2 P = (frag + frag - r) / r.x;
            float z = 0.0;
            float d = 1e3;
            vec4 O = vec4(0.0);
            for (int k = 0; k < 39; k++) {
                if (d <= 1e-4) break;
                O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
                d = 1.0 - sqrt(length(O * O));
                z += d;
            }
            return vec2(O.x, atan(O.z, O.y));
        }

        void mainImage(out vec4 o, vec2 C) {
            vec2 r = iResolution.xy;
            vec2 uv0 = (C + C - r) / r.x;
            float T = 0.1 * iTime * uSpeed + 9.0;
            float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
            vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

            vec2 c0 = sceneC(C, r);
            vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
            vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
            vec2 dCx = cdx - c0;
            vec2 dCy = cdy - c0;
            dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
            dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
            vec2 fw = abs(dCx) + abs(dCy);
            C = c0;

            vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
            vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

            float zr = 5e-4 * uStreakWidth;
            vec2 rr = vec2(max(length(fw), 1e-5));
            float tail = 19.0 / max(uStreakLength, 0.05);

            for (int m = 0; m < 16; m++) {
                if (m >= uStreakCount) break;
                float jf = float(m) + 1.0;
                float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
                vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
                Pp -= floor(Pp / Y + 0.5) * Y;
                float h = fract(8663.0 * ic);
                vec3 col = palette(h);
                float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
                vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
                vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
                O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
                C.x += Y.x / 8.0;
            }

            vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
            o = vec4(colr, uOpacity);
        }

        void main() {
            vec4 color;
            mainImage(color, vUv * iResolution.xy);
            gl_FragColor = color;
        }
    `;

    // ایجاد canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'lightfall-canvas';
    canvas.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
    `;

    heroSection.style.position = 'relative';
    heroSection.style.overflow = 'hidden';
    heroSection.insertBefore(canvas, heroSection.firstChild);

    // اطمینان از اینکه محتوا بالاتر از canvas قرار بگیرد
    const container = heroSection.querySelector('.container');
    if (container) {
        container.style.position = 'relative';
        container.style.zIndex = '1';
    }

    const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false
    });

    if (!gl) {
        console.warn('WebGL not supported');
        canvas.remove();
        return;
    }

    // compile shaders
    const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
        canvas.remove();
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        canvas.remove();
        return;
    }

    gl.useProgram(program);

    // Fullscreen quad
    const positions = new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]);
    const uvs = new Float32Array([
        0, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 1
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations (بدون موس)
    const { arr, count } = prepColors(CONFIG.colors);
    const uniforms = {
        iResolution: gl.getUniformLocation(program, 'iResolution'),
        iTime: gl.getUniformLocation(program, 'iTime'),
        uBgColor: gl.getUniformLocation(program, 'uBgColor'),
        uSpeed: gl.getUniformLocation(program, 'uSpeed'),
        uStreakCount: gl.getUniformLocation(program, 'uStreakCount'),
        uStreakWidth: gl.getUniformLocation(program, 'uStreakWidth'),
        uStreakLength: gl.getUniformLocation(program, 'uStreakLength'),
        uGlow: gl.getUniformLocation(program, 'uGlow'),
        uDensity: gl.getUniformLocation(program, 'uDensity'),
        uTwinkle: gl.getUniformLocation(program, 'uTwinkle'),
        uZoom: gl.getUniformLocation(program, 'uZoom'),
        uBgGlow: gl.getUniformLocation(program, 'uBgGlow'),
        uOpacity: gl.getUniformLocation(program, 'uOpacity')
    };

    const colorLocs = [];
    for (let i = 0; i < MAX_COLORS; i++) {
        colorLocs.push(gl.getUniformLocation(program, `uColor${i}`));
    }
    const colorCountLoc = gl.getUniformLocation(program, 'uColorCount');

    // ست کردن uniforms ثابت (بدون هیچ موسی)
    const setStaticUniforms = () => {
        for (let i = 0; i < MAX_COLORS; i++) {
            gl.uniform3fv(colorLocs[i], arr[i]);
        }
        gl.uniform1i(colorCountLoc, count);
        gl.uniform3fv(uniforms.uBgColor, hexToRGB(CONFIG.backgroundColor));
        gl.uniform1f(uniforms.uSpeed, CONFIG.speed);
        gl.uniform1i(uniforms.uStreakCount, Math.max(1, Math.min(16, Math.round(CONFIG.streakCount))));
        gl.uniform1f(uniforms.uStreakWidth, CONFIG.streakWidth);
        gl.uniform1f(uniforms.uStreakLength, CONFIG.streakLength);
        gl.uniform1f(uniforms.uGlow, CONFIG.glow);
        gl.uniform1f(uniforms.uDensity, CONFIG.density);
        gl.uniform1f(uniforms.uTwinkle, CONFIG.twinkle);
        gl.uniform1f(uniforms.uZoom, CONFIG.zoom);
        gl.uniform1f(uniforms.uBgGlow, CONFIG.backgroundGlow);
        gl.uniform1f(uniforms.uOpacity, CONFIG.opacity);
    };

    const dpr = Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.25 : 2);

    const resize = () => {
        const rect = heroSection.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        setStaticUniforms();
        gl.uniform3fv(uniforms.iResolution, [canvas.width, canvas.height, 1]);
    };

    resize();

    // Render loop (بدون منطق موس)
    let rafId = null;
    let running = false;

    const render = t => {
        if (!running) return;
        rafId = requestAnimationFrame(render);
        gl.uniform1f(uniforms.iTime, t * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const start = () => {
        if (running) return;
        running = true;
        rafId = requestAnimationFrame(render);
    };

    const stop = () => {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
    };

    // فقط وقتی hero در viewport هست اجرا کن (بهینه‌سازی)
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) start();
            else stop();
        });
    }, { threshold: 0.05 });

    observer.observe(heroSection);

    // Resize با throttle
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
    });

    // Cleanup
    window.addEventListener('unload', () => {
        stop();
        observer.disconnect();
    });
})();