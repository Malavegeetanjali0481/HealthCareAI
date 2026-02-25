/* =============================================
   DISTRICT DASHBOARD JS — Arogya Mithra
   ============================================= */

// ===== CLOCK & GREETING =====
function updateClock() {
    var now = new Date();
    var time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    var el = document.getElementById('topbarTime'); // Note: Added this ID to the HTML if missing
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

// ===== PANEL NAVIGATION =====
function switchPanel(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const target = document.getElementById('panel-' + panelId);
    if (target) target.classList.add('active');

    const navItem = document.getElementById('nav-' + panelId);
    if (navItem) navItem.classList.add('active');

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    setInterval(updateClock, 1000);
});
