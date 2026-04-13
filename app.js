document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LENIS SMOOTH SCROLL
    // ==========================================
    const openingIsActiveOnLoad = document.body.classList.contains('opening-active');
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    let lenisEnabled = !openingIsActiveOnLoad;
    gsap.ticker.add((time) => {
        if (!lenisEnabled) return;
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    gsap.registerPlugin(ScrollTrigger);

    const localeCandidates = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || 'en'];
    const isTurkish = localeCandidates.some((locale) => String(locale).toLowerCase().startsWith('tr'));
    const autoLang = isTurkish ? 'tr' : 'en';

    const i18n = {
        tr: {
            pageTitle: 'Dexter Studio Entertainment',
            metaDescription: 'Do\u011fas\u0131 gere\u011fi ba\u011f\u0131ms\u0131z, vizyonuyla rafine. Ba\u011f\u0131ms\u0131z m\u00fczik label.',
            navAbout: '(Hakk\u0131nda)',
            navPhilosophy: '(Felsefe)',
            navWorks: '(Mekanizma)',
            navContact: '(\u0130leti\u015fim)',
            heroLeft: 'Do\u011fas\u0131 gere\u011fi ba\u011f\u0131ms\u0131z,<br>vizyonuyla rafine.',
            heroRight: 'Sesi \u015fekillendiren,<br>k\u00fclt\u00fcr\u00fc y\u00f6nlendiren.',
            heroLocation: '\u0130stanbul, T\u00fcrkiye',
            philosophyBody: 'M\u00fczi\u011fe olan tutkumuzu zor yoldan \u00f6\u011frendik; dinmeyen bir merakla, g\u00f6rmezden gelinemeyecek hatalarla ve durmak bilmeyen bir tekrarla. Bizi \u00e7eken \u015fey hi\u00e7bir zaman sadece y\u00fczey olmad\u0131, onun alt\u0131ndaki mekanizma oldu. Kal\u0131plar, ritmler, melodiler, geri kalan her \u015feyi m\u00fcmk\u00fcn k\u0131lan mant\u0131k.',
            vennLabelVision: 'Vizyon',
            vennLabelTechnique: 'Teknik',
            vennLabelEmotion: 'Duygu',
            vennKicker: '(Kesi\u015fim Noktas\u0131)',
            vennTitle: 'Frekans<br>Mimarl\u0131\u011f\u0131',
            vennDesc: 'Geleneksel st\u00fcdyo s\u0131n\u0131rlar\u0131n\u0131 a\u015f\u0131yoruz. Sanatsal vizyonu, kusursuz teknik metodolojiyi ve saf duygunun birle\u015fti\u011fi o nadir denge noktas\u0131.',
            worksTitle: 'Merak, s\u00fcrt\u00fcnme, tekrar:<br>Sesimizin mekanizmas\u0131.',
            cardMusicTitle: 'M\u00fczik<br>Prod\u00fcksiyon',
            cardMusicBody: 'St\u00fcdyo kay\u0131t, mix, mastering ve sanat\u00e7\u0131 geli\u015ftirme.',
            cardArtistTitle: 'Sanat\u00e7\u0131<br>Y\u00f6netimi',
            cardArtistBody: 'Kariyer planlamas\u0131, marka stratejisi ve i\u015f birli\u011fi koordinasyonu.',
            cardDistributionTitle: 'Da\u011f\u0131t\u0131m &<br>Yay\u0131n',
            cardDistributionBody: 'Global dijital da\u011f\u0131t\u0131m ve playlist yerle\u015ftirme stratejileri.',
            cardVisualTitle: 'G\u00f6rsel &<br>\u0130\u00e7erik',
            cardVisualBody: 'M\u00fczik videolar\u0131, kapak tasar\u0131m\u0131 ve sosyal medya i\u00e7erikleri.',
            footerTagline: 'Do\u011fas\u0131 gere\u011fi ba\u011f\u0131ms\u0131z,<br>vizyonuyla rafine.',
            footerContactLabel: '\u0130\u015f birli\u011fi i\u00e7in:'
        },
        en: {
            pageTitle: 'Dexter Studio Entertainment',
            metaDescription: 'Independent by nature, refined in vision. Independent music label.',
            navAbout: '(About)',
            navPhilosophy: '(Philosophy)',
            navWorks: '(Mechanism)',
            navContact: '(Contact)',
            heroLeft: 'Independent by nature,<br>refined in vision.',
            heroRight: 'Shaping sound,<br>directing culture.',
            heroLocation: 'Istanbul, Turkey',
            philosophyBody: 'We learned our passion for music the hard way: through relentless curiosity, undeniable mistakes, and endless repetition. What drew us in was never just the surface, but the mechanism beneath it. Patterns, rhythms, melodies, the logic that makes everything else possible.',
            vennLabelVision: 'Vision',
            vennLabelTechnique: 'Technique',
            vennLabelEmotion: 'Emotion',
            vennKicker: '(Point of Intersection)',
            vennTitle: 'Frequency<br>Architecture',
            vennDesc: 'We push beyond traditional studio limits. A rare balance point where artistic vision, precise technical methodology, and pure emotion converge.',
            worksTitle: 'Curiosity, friction, repetition:<br>The mechanism of our sound.',
            cardMusicTitle: 'Music<br>Production',
            cardMusicBody: 'Studio recording, mixing, mastering, and artist development.',
            cardArtistTitle: 'Artist<br>Management',
            cardArtistBody: 'Career planning, brand strategy, and collaboration coordination.',
            cardDistributionTitle: 'Distribution &<br>Publishing',
            cardDistributionBody: 'Global digital distribution and playlist placement strategies.',
            cardVisualTitle: 'Visual &<br>Content',
            cardVisualBody: 'Music videos, cover design, and social media content.',
            footerTagline: 'Independent by nature,<br>refined in vision.',
            footerContactLabel: 'For collaborations:'
        }
    };

    const siteLang = autoLang;
    const setText = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    };
    const setHTML = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = value;
    };
    const setMetaDescription = (value) => {
        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) descriptionMeta.setAttribute('content', value);
    };

    const applyLanguage = (lang) => {
        const nextLang = lang === 'tr' ? 'tr' : 'en';
        const t = i18n[nextLang];
        if (!t) return;

        document.documentElement.lang = nextLang;
        document.title = t.pageTitle;
        setMetaDescription(t.metaDescription);

        setText('.v-nav a:nth-child(1)', t.navAbout);
        setText('.v-nav a:nth-child(2)', t.navPhilosophy);
        setText('.v-nav a:nth-child(3)', t.navWorks);
        setText('.v-nav a:nth-child(4)', t.navContact);

        setHTML('.hero-side-left p', t.heroLeft);
        setHTML('.hero-side-right p', t.heroRight);
        setText('.coord-center', t.heroLocation);

        setText('.philosophy-text p', t.philosophyBody);

        setText('.cl-vizyon', t.vennLabelVision);
        setText('.cl-teknik', t.vennLabelTechnique);
        setText('.cl-duygu', t.vennLabelEmotion);
        setText('.venn-label', t.vennKicker);
        setHTML('.venn-title', t.vennTitle);
        setText('.venn-desc', t.vennDesc);

        setHTML('.works-intro-title', t.worksTitle);
        setHTML('.f-card-1 h4', t.cardMusicTitle);
        setText('.f-card-1 .tiny', t.cardMusicBody);
        setHTML('.f-card-2 h4', t.cardArtistTitle);
        setText('.f-card-2 .tiny', t.cardArtistBody);
        setHTML('.f-card-3 h4', t.cardDistributionTitle);
        setText('.f-card-3 .tiny', t.cardDistributionBody);
        setHTML('.f-card-4 h4', t.cardVisualTitle);
        setText('.f-card-4 .tiny', t.cardVisualBody);

        setHTML('.footer-tagline', t.footerTagline);
        setText('.footer-label', t.footerContactLabel);
    };

    applyLanguage(siteLang);

    // ==========================================
    // 2. OPENING: Visionary Montage + Hero Typo Reveal
    // ==========================================
    const introSection = document.querySelector('.intro-section');
    const introLogo = document.querySelector('.intro-logo');
    const introWrapper = document.querySelector('.intro-photo-wrapper');
    const introPhotoContainer = document.querySelector('.intro-photo');
    const introImages = Array.from(document.querySelectorAll('.intro-photo .intro-img'));

    // Prepare Hero Typo (Hidden, will be revealed by chrome3D shader)
    gsap.set('.hero-bg-typo', { opacity: 0 });

    const revealChromeWhenReady = (onReady) => {
        const start = performance.now();

        const tryStart = () => {
            if (window.chrome3D) {
                if (typeof window.chrome3D.setPaused === 'function') {
                    window.chrome3D.setPaused(false);
                }
                // Gizli şekilde shader compile etmesi için opacity 0 ver
                window.chrome3D.reveal({ opacity: 0 });
                
                // Shader compile edip 1 frame çizmesi için çok kısa süre tanı, 
                // sonra Timeline devam ederken WebGL'i DURDUR (PAUSE). Yoksa arkada boşa kasıp cihazı ağlatır!
                setTimeout(() => { 
                    if (typeof window.chrome3D.setPaused === 'function') {
                        window.chrome3D.setPaused(true); 
                    }
                    if (onReady) onReady(); 
                }, 180);
                return;
            }

            if (performance.now() - start > 3000) {
                if (onReady) onReady();
                return;
            }

            setTimeout(tryStart, 50);
        };

        tryStart();
    };

    const completeOpening = () => {
        document.body.classList.remove('opening-active');
        lenisEnabled = true;
        ScrollTrigger.refresh();

        if (window.chrome3D) {
            if (typeof window.chrome3D.setPaused === 'function') {
                window.chrome3D.setPaused(false);
            }
            window.chrome3D.reveal({ opacity: 0.95 });
        }

        if (!introSection) return;
        introSection.classList.add('hidden');
        setTimeout(() => { introSection.style.display = 'none'; }, 350);
    };

    if (introSection && openingIsActiveOnLoad && introPhotoContainer && introWrapper && introImages.length > 0) {
        window.scrollTo(0, 0);

        const lockScrollWhileOpening = () => {
            if (document.body.classList.contains('opening-active')) {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('scroll', lockScrollWhileOpening, { passive: true });

        const sources = introImages.map((img) => img.getAttribute('src')).filter(Boolean);
        const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
        const cycles = isMobileViewport ? 3 : 4;
        const slideSrcs = [];

        for (let i = 0; i < cycles; i++) {
            for (const src of sources) slideSrcs.push(src);
        }

        introPhotoContainer.innerHTML = '';

        const slideTrack = document.createElement('div');
        slideTrack.className = 'intro-slide-track';
        slideTrack.style.height = `${slideSrcs.length * 100}%`;

        const frameHeightPercent = 100 / slideSrcs.length;

        slideSrcs.forEach((src, index) => {
            const frame = document.createElement('img');
            frame.className = 'intro-slide-frame';
            frame.src = src;
            frame.alt = `Intro Slide ${index + 1}`;
            frame.decoding = 'async';
            frame.loading = 'eager';
            frame.style.height = `${frameHeightPercent}%`;
            frame.style.flex = `0 0 ${frameHeightPercent}%`;
            slideTrack.appendChild(frame);
        });

        introPhotoContainer.appendChild(slideTrack);

        gsap.set(introWrapper, { transformOrigin: '50% 50%', scale: 0.08, force3D: true });
        gsap.set(introPhotoContainer, { opacity: 0 });
        if (introLogo) gsap.set(introLogo, { opacity: 0, scale: 1, force3D: false });

        gsap.set('.hero-section', { scale: 1.08, filter: 'none' });
        gsap.set('.hero-bg-typo', { opacity: 1 });
        gsap.set(introSection, { backgroundColor: '#f5f5f5' });

        const slideCount = slideSrcs.length;
        const slideEndYPercent = -((slideCount - 1) / slideCount) * 100;

        const wrapperRect = introWrapper.getBoundingClientRect();
        const targetScaleX = Math.max(1, window.innerWidth / Math.max(1, wrapperRect.width));
        const targetScaleY = Math.max(1, window.innerHeight / Math.max(1, wrapperRect.height));

        const introGrowDuration = isMobileViewport ? 0.85 : 0.95;
        const slideDuration = isMobileViewport ? 2.4 : 2.9;
        const slideStart = introGrowDuration + 0.12;
        const revealTime = slideStart + slideDuration + 0.04;
        const expandStart = revealTime + 0.22;
        const expandDuration = isMobileViewport ? 0.9 : 1.05;

        const openingTL = gsap.timeline({
            paused: true, // Beklemede başla, arkadaki her matematik bittiğinde çalışacak.
            onComplete: () => {
                window.removeEventListener('scroll', lockScrollWhileOpening);
                completeOpening();
            }
        });

        openingTL.to(introWrapper, {
            scale: 1,
            duration: introGrowDuration,
            ease: 'expo.out',
            force3D: true
        }, 0);

        openingTL.to(introPhotoContainer, {
            opacity: 1,
            duration: 0.45,
            ease: 'sine.out'
        }, 0.22);

        if (introLogo) {
            openingTL.to(introLogo, {
                opacity: 1,
                duration: 0.42,
                ease: 'sine.out'
            }, 0.35);

            openingTL.to(introLogo, {
                opacity: 0,
                duration: 0.3,
                ease: 'sine.inOut'
            }, slideStart + 0.55);
        }

        openingTL.to(slideTrack, {
            yPercent: slideEndYPercent,
            duration: slideDuration,
            ease: 'none',
            force3D: true
        }, slideStart);

        // IntroSection (beyaz maske) silinirken WebGL'in uyanması ve aydınlanması lazım!
        openingTL.to(introSection, {
            backgroundColor: 'rgba(245,245,245,0)',
            duration: 0.28,
            ease: 'power1.out',
            onStart: () => {
                // IntroSection (beyaz maske) silinirken WebGL'in uyanması ve aydınlanması lazım!
                if (window.chrome3D) {
                    if (typeof window.chrome3D.setPaused === 'function') {
                        window.chrome3D.setPaused(false);
                    }
                    window.chrome3D.reveal({ opacity: 0.95 });
                }
            }
        }, revealTime - 0.05);

        openingTL.to(introPhotoContainer, {
            opacity: 0,
            duration: 0.32,
            ease: 'power2.inOut'
        }, revealTime);

        openingTL.to(introWrapper, {
            scaleX: targetScaleX,
            scaleY: targetScaleY,
            borderRadius: 0,
            duration: expandDuration,
            ease: 'expo.inOut',
            force3D: true
        }, expandStart);

        openingTL.to('.hero-section', {
            scale: 1,
            duration: expandDuration,
            ease: 'expo.inOut',
            force3D: true
        }, expandStart);

        openingTL.to(introSection, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        }, expandStart + 1.0);

        revealChromeWhenReady(() => {
            openingTL.play();
        });
    } else {
        gsap.set('.hero-bg-typo', { opacity: 1 });
        revealChromeWhenReady();
        completeOpening();
    }

    // ==========================================
    // 3. HERO
    // ==========================================
    // .hero-bg-typo stays locked in place now.
    gsap.from('.hero-center', {
        opacity: 0, y: 30,
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.hero-section', start: 'top 80%' }
    });
    gsap.from('.hero-side-left', {
        opacity: 0, x: -30,
        duration: 1, ease: 'power3.out', delay: 0.3,
        scrollTrigger: { trigger: '.hero-section', start: 'top 80%' }
    });
    gsap.from('.hero-side-right', {
        opacity: 0, x: 30,
        duration: 1, ease: 'power3.out', delay: 0.3,
        scrollTrigger: { trigger: '.hero-section', start: 'top 80%' }
    });
    gsap.from('.hero-coords span', {
        opacity: 0, y: 10,
        duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.5,
        scrollTrigger: { trigger: '.hero-section', start: 'top 80%' }
    });

    // ==========================================
    // 4. PHILOSOPHY TEXT HIGHLIGHT (PINNED)
    // ==========================================
    const highlightContainer = document.querySelector('.js-text-highlight p');
    if (highlightContainer) {
        const text = highlightContainer.innerText;
        const words = text.split(/(\s+)/);
        highlightContainer.innerHTML = '';

        words.forEach(word => {
            if (word.trim() === '') {
                highlightContainer.appendChild(document.createTextNode(word));
            } else {
                const span = document.createElement('span');
                span.className = 'word-inner';
                span.textContent = word;
                highlightContainer.appendChild(span);
            }
        });

        const wordElements = document.querySelectorAll('.word-inner');
        gsap.to(wordElements, {
            color: '#e8e8e8',
            stagger: { each: 1 / wordElements.length },
            ease: 'none',
            scrollTrigger: {
                trigger: '.philosophy-section',
                start: 'top top',
                end: '+=2000',
                scrub: 0.5,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
            }
        });
    }
    // ==========================================
    // 5. VENN CIRCLES — Cosmic Constellation
    // ==========================================
    gsap.from('.venn-content', {
        opacity: 0, x: 50, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });

    // Circles fade in with scale
    gsap.from('.venn-diagram', {
        scale: 0.85, opacity: 0,
        duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });

    // Labels fade in
    gsap.from('.venn-clabel', {
        opacity: 0, y: 10,
        duration: 1, stagger: 0.15, ease: 'power2.out', delay: 0.5,
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });

    // Core reveal
    gsap.from('.venn-core-dot', {
        scale: 0, opacity: 0,
        duration: 1.2, ease: 'back.out(1.7)', delay: 0.6,
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });
    gsap.from('.venn-core-ring', {
        scale: 0, opacity: 0,
        duration: 1.5, stagger: 0.2, ease: 'power3.out', delay: 0.8,
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });

    // Constellation lines draw in
    gsap.from('.const-line', {
        attr: { 'stroke-opacity': 0 },
        opacity: 0, duration: 1.5, stagger: 0.1, ease: 'power2.out', delay: 0.3,
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });

    // Stars twinkle in
    gsap.from('.venn-star', {
        scale: 0, opacity: 0,
        duration: 0.8, stagger: 0.08, ease: 'back.out(2)', delay: 0.4,
        scrollTrigger: { trigger: '.venn-section', start: 'top 70%' }
    });

    // Subtle, slow circle rotation — dreamy, not aggressive
    gsap.to('.c1', { rotation: 360, duration: 90, ease: 'none', repeat: -1, transformOrigin: '50% 65%' });
    gsap.to('.c2', { rotation: -360, duration: 75, ease: 'none', repeat: -1, transformOrigin: '60% 40%' });
    gsap.to('.c3', { rotation: 360, duration: 100, ease: 'none', repeat: -1, transformOrigin: '40% 45%' });

    // Star twinkling — gentle pulse
    gsap.to('.venn-star', {
        opacity: 0.08, duration: 2.5, yoyo: true, repeat: -1,
        ease: 'sine.inOut', stagger: { each: 0.4, from: 'random' }
    });

    // ==========================================
    // 6. WORKS (Floating Cards) — Living Motion
    // ==========================================
    gsap.from('.works-intro-title', {
        opacity: 0, y: 40,
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.works-intro-section', start: 'top 70%' }
    });
    gsap.from('.f-card-1', {
        opacity: 0, x: -80, rotation: -8,
        duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.floating-cards', start: 'top 80%' }
    });
    gsap.from('.f-card-2', {
        opacity: 0, x: 80, rotation: 8,
        duration: 1.4, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: '.floating-cards', start: 'top 80%' }
    });
    gsap.from('.f-card-3', {
        opacity: 0, y: 60, rotation: -4,
        duration: 1.4, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: '.floating-cards', start: 'top 80%' }
    });
    gsap.from('.f-card-4', {
        opacity: 0, y: 60, rotation: 4,
        duration: 1.4, ease: 'power3.out', delay: 0.3,
        scrollTrigger: { trigger: '.floating-cards', start: 'top 80%' }
    });

    // ---- Continuous floating / levitation ----
    // Each card floats gently at its own rhythm
    gsap.to('.f-card-1', {
        y: -12, rotation: '-=1.5',
        duration: 3.2, yoyo: true, repeat: -1,
        ease: 'sine.inOut'
    });
    gsap.to('.f-card-2', {
        y: -10, rotation: '+=1',
        duration: 3.8, yoyo: true, repeat: -1,
        ease: 'sine.inOut', delay: 0.5
    });
    gsap.to('.f-card-3', {
        y: -14, rotation: '+=1.2',
        duration: 4.0, yoyo: true, repeat: -1,
        ease: 'sine.inOut', delay: 1.0
    });
    gsap.to('.f-card-4', {
        y: -9, rotation: '-=0.8',
        duration: 3.5, yoyo: true, repeat: -1,
        ease: 'sine.inOut', delay: 0.8
    });

    // ---- Mouse Parallax for depth ----
    const cardsContainer = document.querySelector('.floating-cards');
    if (cardsContainer) {
        const cards = document.querySelectorAll('.f-card');
        const depths = [0.03, 0.02, 0.025, 0.015]; // Different depth multipliers per card

        cardsContainer.addEventListener('mousemove', (e) => {
            const rect = cardsContainer.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left - centerX;
            const mouseY = e.clientY - rect.top - centerY;

            cards.forEach((card, i) => {
                const depth = depths[i] || 0.02;
                const direction = i % 2 === 0 ? 1 : -1; // Alternate direction for variety
                gsap.to(card, {
                    x: mouseX * depth * direction,
                    y: mouseY * depth * 0.5,
                    rotationY: mouseX * depth * 0.3 * direction,
                    rotationX: -mouseY * depth * 0.2,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
        });

        cardsContainer.addEventListener('mouseleave', () => {
            cards.forEach((card) => {
                gsap.to(card, {
                    x: 0, rotationY: 0, rotationX: 0,
                    duration: 1.2, ease: 'elastic.out(1, 0.4)',
                    overwrite: 'auto'
                });
            });
        });
    }

    // ==========================================
    // 8. FOOTER
    // ==========================================
    gsap.from('.arch-shape', {
        opacity: 0, y: 100, scale: 0.9,
        duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-section', start: 'top 70%' }
    });
    gsap.from('.footer-tagline', {
        opacity: 0, y: 40,
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-content', start: 'top 80%' }
    });
    gsap.from('.footer-contact', {
        opacity: 0, y: 20,
        duration: 1, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: '.footer-content', start: 'top 80%' }
    });
    gsap.from('.footer-socials a', {
        opacity: 0, y: 10,
        duration: 0.8, stagger: 0.08, ease: 'power2.out', delay: 0.3,
        scrollTrigger: { trigger: '.footer-socials', start: 'top 90%' }
    });

});
