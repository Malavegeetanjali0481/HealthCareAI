/* =============================================
   ASHA WORKER DASHBOARD JS — Arogya Mithra
   ============================================= */

// ===== CLOCK & GREETING =====
function updateClock() {
    var now = new Date();
    var time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    var el = document.getElementById('topbarTime');
    if (el) el.textContent = time + ' | ' + dateStr;
}

function setGreeting() {
    var hour = new Date().getHours();
    var el = document.getElementById('tbGreeting');
    if (!el) return;
    var g = 'Good Morning';
    if (hour >= 12 && hour < 17) g = 'Good Afternoon';
    else if (hour >= 17) g = 'Good Evening';
    el.textContent = g + ', Sunita';
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

// ===== PANEL NAVIGATION =====
function switchPanel(panelId) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Show target panel
    const target = document.getElementById('panel-' + panelId);
    if (target) target.classList.add('active');

    // Activate nav item
    const navItem = document.getElementById('nav-' + panelId);
    if (navItem) navItem.classList.add('active');

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== MAP TAB SWITCH =====
function switchMapTab(btn, type) {
    document.querySelectorAll('.map-tab').forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');
    showToast('🗺️ Map view: ' + btn.textContent.trim(), 'info');
}

// ===== SYMPTOM CHIP TOGGLE =====
function toggleChip(el) {
    el.classList.toggle('selected');
}

// ===== SYMPTOM CHECK =====
function runSymptomCheck() {
    var selected = document.querySelectorAll('.chip.selected');
    var patient = document.getElementById('symptomPatient').value;

    if (patient === '-- Choose Patient --' || !patient) {
        showToast('⚠️ Please select a patient first', 'warn');
        return;
    }
    if (selected.length === 0) {
        showToast('⚠️ Please select at least one symptom', 'warn');
        return;
    }

    var symptoms = [];
    selected.forEach(function (c) { symptoms.push(c.textContent.trim()); });

    var riskLevel = 'Low';
    var riskColor = '#059669';
    var advice = 'Monitor at home. Give ORS if needed. Revisit in 3 days.';

    var highSymptoms = ['Shortness of Breath', 'Chest Pain', 'Fever'];
    var medSymptoms = ['Cough', 'Headache', 'Vomiting', 'Body Pain', 'Diarrhoea'];

    var highCount = 0, medCount = 0;
    symptoms.forEach(function (s) {
        if (highSymptoms.some(function (h) { return s.indexOf(h) !== -1; })) highCount++;
        if (medSymptoms.some(function (m) { return s.indexOf(m) !== -1; })) medCount++;
    });

    if (highCount >= 2 || selected.length >= 5) {
        riskLevel = 'High';
        riskColor = '#DC2626';
        advice = '⚠️ REFER TO PHC immediately. Call 108 if condition worsens. Do not delay.';
    } else if (highCount >= 1 || medCount >= 2) {
        riskLevel = 'Medium';
        riskColor = '#F59E0B';
        advice = 'Schedule PHC visit within 24 hours. Give paracetamol if fever. Monitor closely.';
    }

    var resultHtml = '<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;">';
    resultHtml += '<div style="width:48px;height:48px;border-radius:50%;background:' + riskColor + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;">' + riskLevel.charAt(0) + '</div>';
    resultHtml += '<div><div style="font-size:1rem;font-weight:800;color:' + riskColor + ';">' + riskLevel + ' Risk</div><div style="font-size:.75rem;color:#64748B;">' + patient + '</div></div></div>';
    resultHtml += '<div style="font-size:.82rem;color:#1E293B;margin-bottom:.5rem;"><strong>Symptoms:</strong> ' + symptoms.join(', ') + '</div>';
    resultHtml += '<div style="font-size:.82rem;color:#1E293B;padding:.65rem;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><strong>Recommended Action:</strong> ' + advice + '</div>';

    var resultContainer = document.getElementById('symptomResultBody');
    if (resultContainer) {
        resultContainer.innerHTML = resultHtml;
        document.getElementById('symptomResult').style.display = 'block';
        document.getElementById('symptomResult').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== PATIENT FILTER =====
function filterPatients(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    document.querySelectorAll('.data-table tbody tr').forEach(function (row) {
        if (cat === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.getAttribute('data-cat') === cat ? '' : 'none';
        }
    });
}

// ===== URGENCY SELECT =====
function selectUrgency(btn) {
    document.querySelectorAll('.urg-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
}

// ===== SUBMIT REFERRAL =====
function submitReferral() {
    showToast('🚑 Referral submitted! PHC has been alerted. Ambulance dispatched.', 'success');
}

// ===== TOAST =====
function showToast(message, type) {
    var existing = document.getElementById('ashaToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'ashaToast';
    var colors = {
        success: { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7' },
        warn: { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
        info: { bg: '#f0fdfa', color: '#134e4a', border: '#99f6e4' },
        error: { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' }
    };
    var c = colors[type] || colors.info;
    toast.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:.85rem 1.25rem;border-radius:12px;font-family:Inter,sans-serif;font-size:.85rem;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.16);max-width:380px;display:flex;align-items:center;gap:.6rem;animation:toastSlide .35s ease forwards;background:' + c.bg + ';color:' + c.color + ';border:1.5px solid ' + c.border + ';';
    toast.textContent = message;
    document.body.appendChild(toast);

    if (!document.getElementById('toastAnim')) {
        var s = document.createElement('style');
        s.id = 'toastAnim';
        s.textContent = '@keyframes toastSlide{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}';
        document.head.appendChild(s);
    }

    setTimeout(function () { if (toast.parentNode) toast.remove(); }, 3500);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    setGreeting();
    setInterval(updateClock, 1000);
});
