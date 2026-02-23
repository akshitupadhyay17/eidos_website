document.addEventListener('DOMContentLoaded', () => {
    // --- 0. GSAP Setup ---
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Brand Section Reveal ---
    // Ensuring the hero text still has a subtle parallax/fade out if desired, 
    // but the section itself stays static.
    gsap.to(".text-side", {
        scrollTrigger: {
            trigger: "#tropic-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        opacity: 0,
        y: -100,
        ease: "none"
    });

    // Reveal Brand Intro
    // --- 1. Brand Section Reveal (Simultaneous & Premium) ---
    const brandTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#brand-intro",
            start: "top 85%", // Triggers when the section is clearly in view
            once: true
        }
    });

    // Reveal all elements together
    brandTl.fromTo([
        ".eyebrow-line",
        "#reveal-bottle",
        ".text-reveal-side > *",
        ".pill",
        ".glow-effect"
    ],
        {
            y: 60,
            autoAlpha: 0,
            rotate: 0
        },
        {
            y: 0,
            autoAlpha: 1,
            duration: 2,
            stagger: 0.1, // Minimal stagger for a sophisticated feel while appearing simultaneous
            ease: "expo.out",
            onComplete: () => {
                // Start the hover after entrance is done
                gsap.to("#reveal-bottle", {
                    y: "-=20",
                    duration: 4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
                // Pulse the glow
                gsap.to(".glow-effect", {
                    scale: 1.15,
                    duration: 5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        })
        // Tilt the bottle as it finishes appearing
        .to("#reveal-bottle", {
            rotate: -12,
            duration: 1.8,
            ease: "power2.inOut"
        }, "-=1.2");

    // Botanical Shadows Subtle Drift
    gsap.to(".botanical-shadow", {
        scrollTrigger: {
            trigger: "#brand-intro",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        },
        y: -150,
        x: 50,
        rotation: 10,
        opacity: 0.15
    });

    // --- 2. Corporate Section Parallax & Reveal ---
    gsap.to(".corporate-bg-parallax img", {
        scrollTrigger: {
            trigger: "#corporate-gateway",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: "20%",
        ease: "none"
    });

    gsap.fromTo(".corporate-glass-card",
        {
            y: 100,
            autoAlpha: 0,
            scale: 0.95
        },
        {
            scrollTrigger: {
                trigger: "#corporate-gateway",
                start: "top 75%",
                once: true
            },
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 2.2,
            ease: "expo.out"
        }
    );

    // --- 2. Mouse Follow 3D Tilt (Hero Bottle) ---
    const heroSection = document.getElementById('tropic-hero');
    const bottle = document.getElementById('hero-bottle');

    if (heroSection && bottle) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 30;
            const rotateY = (x - centerX) / 30;

            bottle.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            bottle.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    }

    // --- 3. Intersection Observer for Fade-In Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .science-card, .product-item, .vision-box').forEach(el => {
        observer.observe(el);
    });

    // --- 4. Product Gallery Modal ---
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-modal');

    const productDetails = {
        'shampoo-300': {
            title: 'Strengthening Shampoo (300ml)',
            desc: 'Our flagship formula. Advanced scalp science meets botanical care. Enriched with high-potency rosemary extract and caffeine to stimulate hair follicles and reduce hair fall.',
            img: 'assets/tropic23_300ml.png'
        },
        'masque': {
            title: 'Hair Repair Masque',
            desc: 'Deeply nourishing hair repair masque. Uses microfilm technology to seal moisture into the hair shaft, restoring shine and elasticity to damaged strands.',
            img: 'assets/tropic23_masque.png'
        },
        'shampoo-100': {
            title: 'Travel Shampoo (100ml)',
            desc: 'The same powerful strengthening formula in a travel-friendly size. Perfect for maintaining your hair care routine on the go.',
            img: 'assets/tropic23_100ml.png'
        }
    };

    window.openDetail = (id) => {
        const product = productDetails[id];
        if (product) {
            modalBody.innerHTML = `
                <div class="modal-flex">
                    <img src="${product.img}" style="${product.style || ''} max-height:450px; width:auto;">
                    <div class="modal-text">
                        <h2 style="font-size:2.5rem; margin-bottom:1.5rem; color:var(--accent-color);">${product.title}</h2>
                        <div style="font-size:1.1rem; line-height:1.8; color:#ccc;">${product.desc}</div>
                    </div>
                </div>
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    // --- 5. Precise Smooth Scroll with Offset ---
    document.querySelectorAll('.nav-links a, #logo-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = 100; // Increased offset for higher landing
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
