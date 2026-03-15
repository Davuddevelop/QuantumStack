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
        insights: typeof APP_DATA !== 'undefined' ? [...APP_DATA.insights] : []
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
                window.location.href = './onboarding.html';
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
