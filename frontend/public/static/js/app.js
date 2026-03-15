/**
 * CampusSync Shared Application Logic
 * 
 * This file manages the global state and initialization of the application.
 * It uses an event-driven architecture (appReady event) to synchronize
 * component rendering with data loading from Firebase.
 */

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

/**
 * Global Icon Set (SVG)
 */
const ICONS = {
    warning: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    connection: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    positive: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    suggestion: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    event: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
};

/**
 * Initializes the application state.
 * Fetches data from Firebase if an onboarding session is active.
 * Dispatches 'appReady' for component synchronization.
 */
async function initApp() {
    console.log("🚀 CampusSync: Initializing Core System...");
    
    // 1. Initialize Global State with Fallback Data
    window.state = {
        currentCommunity: typeof APP_DATA !== 'undefined' ? APP_DATA.communities[0] : null,
        communities: typeof APP_DATA !== 'undefined' ? [...APP_DATA.communities] : [],
        members: typeof APP_DATA !== 'undefined' ? [...APP_DATA.members] : [],
        events: typeof APP_DATA !== 'undefined' ? [...APP_DATA.events] : [],
        insights: typeof APP_DATA !== 'undefined' ? [...APP_DATA.insights] : [],
        messages: typeof APP_DATA !== 'undefined' ? [...APP_DATA.messages] : []
    };

    // 2. Fetch Active Firebase Community (Cloud Sync)
    const firebaseCommunityId = localStorage.getItem('firebase_community_id');
    if (firebaseCommunityId) {
        try {
            const res = await fetch(`/api/community?id=${firebaseCommunityId}`);
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            
            const data = await res.json();
            if (data.community) {
                const comm = data.community;
                window.state.currentCommunity = comm;
                window.state.members = data.members || [];
                
                // Merge into local communities list
                if (!window.state.communities.find(c => c.id === comm.id)) {
                    window.state.communities.push(comm);
                }
                console.log("🔥 CampusSync: Cloud Sync Successful -", comm.name);
            }
        } catch (e) {
            console.error("⚠️ CampusSync: Cloud Sync Failed -", e.message);
            // Non-fatal error: fall back to default state
        }
    }

    // 3. Setup Shared UI Elements
    setupEventListeners();
    renderGlobalElements();
    
    // 4. Lifecycle Completion
    // Components listen for 'appReady' to start rendering with synchronized state
    window.dispatchEvent(new CustomEvent('appReady', { detail: window.state }));
}

/**
 * Configures shared event listeners (e.g., Club Switcher).
 */
function setupEventListeners() {
    const switcher = document.getElementById('clubSwitcher');
    if (switcher) {
        switcher.addEventListener('change', (e) => {
            const communityId = e.target.value;
            if (communityId === 'new') {
                window.location.href = './settings.html';
                return;
            }
            
            const newComm = window.state.communities.find(c => c.id === communityId);
            if (newComm) {
                window.state.currentCommunity = newComm;
                window.dispatchEvent(new CustomEvent('communityChanged', { detail: newComm }));
                refreshPageData();
            }
        });
    }
}

/**
 * Handles global UI updates (Active links, navigation).
 */
function renderGlobalElements() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

/**
 * Global refresh trigger for pages when shared state changes.
 */
function refreshPageData() {
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderMembers === 'function') renderMembers();
}

/**
 * Utility: Formats large statistics into readable strings (e.g., 1.2k).
 */
function formatStat(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
}

window.formatStat = formatStat;

/* ============================================
   ANIMATION UTILITIES
   ============================================ */

/**
 * Scroll Reveal - Animates elements when they come into view
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/**
 * Animated Counter - Counts up numbers with easing
 * @param {HTMLElement} el - Element containing the target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(el, duration = 1500) {
    const target = parseInt(el.dataset.target || el.textContent);
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();

    const easing = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(target * easing(progress));
        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Initialize all counters on page
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

/**
 * Toast Notification System
 */
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:1000;display:flex;flex-direction:column;gap:0.75rem;';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 4000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '<svg width="20" height="20" fill="none" stroke="var(--sage)" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01" class="checkmark-animate"/></svg>',
            error: '<svg width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="20" height="20" fill="none" stroke="var(--teal)" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = `
            <span>${icons[type] || icons.info}</span>
            <span style="flex:1;font-size:0.9rem;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:0.25rem;">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        `;

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    },

    success(message, duration) { return this.show(message, 'success', duration); },
    error(message, duration) { return this.show(message, 'error', duration); },
    info(message, duration) { return this.show(message, 'info', duration); }
};

window.Toast = Toast;

/**
 * Add ripple effect to all buttons
 */
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
        `;

        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });

    // Add ripple keyframes if not present
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: translate(-50%, -50%) scale(15);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Parallax scroll effect for elements
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }, { passive: true });
}

/**
 * Magnetic hover effect for elements
 */
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Stagger animation helper
 */
function staggerAnimate(selector, animationClass = 'animate-in', delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, i) => {
        el.style.animationDelay = `${i * delay}ms`;
        el.classList.add(animationClass);
    });
}

window.staggerAnimate = staggerAnimate;

/**
 * Initialize all animation utilities
 */
function initAnimations() {
    initScrollReveal();
    initCounters();
    initRippleEffect();
    initParallax();
    initMagneticEffect();
}

// Run animations after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}
