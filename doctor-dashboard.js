/* =============================================
   DOCTOR TELEMEDICINE DASHBOARD JS — Arogya Mithra
   ============================================= */

// ===== CLOCK =====
function updateClock() {
    var now = new Date();
    var time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    var el = document.getElementById('topbarTime');
    if (el) el.textContent = time + ' | ' + dateStr;
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// ===== STATUS TOGGLE =====
function toggleStatus() {
    const dot = document.querySelector('.status-dot');
    const badge = document.querySelector('.status-badge');
    const text = document.querySelector('.status-badge span');

    if (dot.classList.contains('online')) {
        dot.classList.remove('online');
        dot.style.background = '#94a3b8';
        dot.style.boxShadow = 'none';
        badge.style.background = '#f1f5f9';
        badge.style.color = '#475569';
        text.textContent = 'Offline';
    } else {
        dot.classList.add('online');
        dot.style.background = '#22c55e';
        dot.style.boxShadow = '0 0 8px rgba(34, 197, 94, 0.4)';
        badge.style.background = '#dcfce7';
        badge.style.color = '#166534';
        text.textContent = 'Online';
    }
}

// ===== PANEL NAVIGATION =====
function switchPanel(panelId) {
    // Basic navigation logic preserved
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

    // Auto-expand first case for demo purpose if desired
    // setTimeout(() => toggleSummary('sum-1'), 1000);
});
