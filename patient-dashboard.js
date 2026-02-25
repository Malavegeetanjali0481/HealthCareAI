/* =============================================
   PATIENT DASHBOARD JS — Arogya Mithra
   ============================================= */

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
    if (window.innerWidth <= 768) closeSidebar();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== MOBILE SIDEBAR =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
}

// ===== CLOCK / GREETING =====
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const el = document.getElementById('topbarTime');
    if (el) el.textContent = time + ' | ' + dateStr;
}

// ===== GREETING & NAME LOADING =====
function loadPatientName() {
    const savedName = localStorage.getItem('ha_patient_name');
    if (savedName) {
        // Update sidebar
        const sidebarName = document.getElementById('patientNameSidebar');
        if (sidebarName) sidebarName.textContent = savedName;

        // Update card
        const cardName = document.getElementById('patientNameCard');
        if (cardName) cardName.textContent = savedName;

        // Update profile
        const profileName = document.getElementById('patientNameProfile');
        if (profileName) profileName.textContent = savedName;

        // Update initials in mobile avatar if it exists
        const initials = savedName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const mobileAvatar = document.querySelector('.topbar-avatar');
        if (mobileAvatar) mobileAvatar.textContent = initials;
    }
    return savedName || 'Priya';
}

document.addEventListener('DOMContentLoaded', function () {
    const activeName = loadPatientName();

    // Symptom chip toggle
    document.querySelectorAll('.symptom-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            const cb = this.querySelector('input[type=checkbox]');
            if (cb) {
                cb.checked = !cb.checked;
                this.classList.toggle('selected', cb.checked);
            }
        });
    });

    // Clock
    updateClock();
    setGreeting(activeName);
    setInterval(updateClock, 1000);
});

function setGreeting(name = 'Priya') {
    const hour = new Date().getHours();
    const greetEl = document.getElementById('topbarGreeting');
    // If we're on a panel that shows a greeting in a header (like a home panel if added later), 
    // but here we primarily use the sidebar. However, the existing JS had a topbarGreeting.
    // Let's check where topbarGreeting is in the HTML.

    if (!greetEl) return;
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17) greeting = 'Good Evening';
    greetEl.textContent = greeting + ', ' + name + ' 👋';
}

// ===== VOICE INPUT =====
let voiceActive = false;
function toggleVoice() {
    const btn = document.getElementById('voiceBtn');
    const icon = document.getElementById('voiceIcon');
    const text = document.getElementById('voiceText');
    voiceActive = !voiceActive;

    if (voiceActive) {
        btn.classList.add('active');
        icon.className = 'fa-solid fa-microphone-slash';
        text.textContent = 'Listening... (tap to stop)';
        // Simulate voice: auto-select a couple chips after 2s
        setTimeout(function () {
            const chips = document.querySelectorAll('.symptom-chip');
            [0, 2].forEach(i => {
                if (chips[i]) {
                    chips[i].classList.add('selected');
                    const cb = chips[i].querySelector('input');
                    if (cb) cb.checked = true;
                }
            });
            toggleVoice(); // stop
        }, 2200);
    } else {
        btn.classList.remove('active');
        icon.className = 'fa-solid fa-microphone';
        text.textContent = 'Enable Voice Input';
    }
}

// ===== PHOTO UPLOAD =====
function handlePhotoUpload(input) {
    const msg = document.getElementById('uploadMsg');
    if (input.files && input.files.length > 0) {
        if (msg) msg.style.display = 'flex';
    }
}

// ===== ANALYZE SYMPTOMS =====
function analyzeSymptoms() {
    const selectedChips = document.querySelectorAll('.symptom-chip.selected');
    const btn = document.getElementById('analyzeBtn');
    const btnText = document.getElementById('btnText');

    if (selectedChips.length === 0) {
        showToast('⚠️ Please select at least one symptom before analyzing.', 'warn');
        return;
    }

    // Loading state
    btn.classList.add('loading');
    btnText.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>&nbsp; Assessing risk...';

    setTimeout(function () {
        btn.classList.remove('loading');
        btnText.innerHTML = '<i class="fa-solid fa-microchip"></i> Analyze My Symptoms';

        const symptoms = [];
        selectedChips.forEach(c => symptoms.push(c.getAttribute('data-symptom')));

        // Risk logic based on symptoms
        let risk = 'low';
        const severeSymptoms = ['chest', 'breathing'];
        const mediumSymptoms = ['fever', 'vomiting', 'headache', 'bodypain'];

        const hasSevere = symptoms.some(s => severeSymptoms.includes(s));
        const mediumCount = symptoms.filter(s => mediumSymptoms.includes(s)).length;

        if (hasSevere || symptoms.length >= 5) risk = 'high';
        else if (mediumCount >= 2 || symptoms.length >= 3) risk = 'medium';

        showRiskResult(risk, symptoms);
    }, 2400);
}

function showRiskResult(risk, symptoms) {
    const card = document.getElementById('resultCard');
    const badge = document.getElementById('riskBadge');
    const rec = document.getElementById('riskRec');
    const exp = document.getElementById('riskExp');
    const actions = document.getElementById('resultActions');

    const config = {
        low: {
            label: '🟢 Low Risk',
            rec: '🏠 Home Care Recommended',
            exp: 'Based on your symptoms and age profile, your condition appears mild. Rest well, stay hydrated, and monitor for any worsening. Your ASHA worker has been notified.',
            actions: `<button class="btn-action green" onclick="alert('Downloading home care instructions...')"><i class="fa-solid fa-house-medical"></i> View Care Instructions</button>
                      <button class="btn-action outline" onclick="switchPanel('asha')"><i class="fa-solid fa-user-nurse"></i> Contact ASHA Worker</button>`
        },
        medium: {
            label: '🟡 Medium Risk',
            rec: '📹 Teleconsultation Advised',
            exp: 'Your symptoms may need medical attention. A video consultation with a doctor is recommended. Your case summary has been prepared for the doctor.',
            actions: `<button class="btn-action primary" onclick="alert('Connecting to teleconsultation queue...')"><i class="fa-solid fa-video"></i> Talk to a Doctor</button>
                      <button class="btn-action outline" onclick="alert('Downloading care instructions...')"><i class="fa-solid fa-house-medical"></i> View Care Instructions</button>`
        },
        high: {
            label: '🔴 High Risk',
            rec: '🏥 Hospital Visit Urgently Required',
            exp: 'Your reported symptoms indicate a potentially serious condition. Please visit the nearest Primary Health Centre or hospital immediately. Call 108 for emergency ambulance.',
            actions: `<button class="btn-action primary" onclick="alert('Calling emergency: 108')"><i class="fa-solid fa-phone-volume"></i> Call 108 — Ambulance</button>
                      <button class="btn-action outline" onclick="alert('Opening map to nearest PHC...')"><i class="fa-solid fa-hospital"></i> Nearest PHC</button>`
        }
    };

    const c = config[risk];

    card.className = 'result-card-container active ' + risk;
    badge.className = 'risk-badge ' + risk;
    badge.innerHTML = c.label;
    rec.textContent = c.rec;
    exp.innerHTML = c.exp + '<br><small style="color:var(--muted);font-size:.75rem;margin-top:.5rem;display:block;">Based on symptoms and age (34 yrs) · ' + new Date().toLocaleDateString('en-IN') + '</small>';
    actions.innerHTML = c.actions;

    // Scroll to result
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

    showToast('AI analysis complete — ' + (risk === 'low' ? '🟢 Low Risk' : risk === 'medium' ? '🟡 Medium Risk' : '🔴 High Risk'), risk === 'high' ? 'warn' : 'success');
}

// ===== FAQ TOGGLE =====
function toggleFaq(el) {
    const item = el.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));

    // Open if was closed
    if (!isOpen) item.classList.add('open');
}

// ===== CHAT =====
function handleChatKey(e) {
    if (e.key === 'Enter') sendChatMsg();
}

function sendChatMsg() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    const chatUI = document.querySelector('.chat-ui');

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div><div class="chat-avatar user">P</div>`;
    chatUI.insertBefore(userMsg, document.querySelector('.chat-input-row'));

    input.value = '';

    // Bot reply after delay
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.innerHTML = `<div class="chat-avatar bot"><i class="fa-solid fa-robot"></i></div><div class="chat-bubble">${getBotReply(text)}</div>`;
        chatUI.insertBefore(botMsg, document.querySelector('.chat-input-row'));
        chatUI.scrollTop = chatUI.scrollHeight;
    }, 900);
}

function getBotReply(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('camp') || lower.includes('health camp')) return '🏕️ There are 3 upcoming health camps near Rampura. Check the <strong>Medical Camps</strong> section in the menu!';
    if (lower.includes('doctor') || lower.includes('teleconsult')) return '📹 If your symptom check shows medium or high risk, you\'ll see a "Talk to a Doctor" button. Your ASHA worker can also connect you.';
    if (lower.includes('asha')) return '👩‍⚕️ Your ASHA worker is <strong>Sunita Bai Meena</strong>. Next visit: Wed, 26 Feb 2026 at 10 AM. You can call her at +91 94255 88321.';
    if (lower.includes('emergency') || lower.includes('ambulance')) return '🚨 For emergencies, call <strong>108</strong> (Ambulance) or <strong>112</strong> (Police) immediately. Do not wait — go to the nearest PHC!';
    if (lower.includes('symptom') || lower.includes('check')) return '🩺 Go to <strong>Check Your Symptoms</strong> in the left menu. Select your symptoms and click "Analyze My Symptoms" for an AI risk assessment.';
    return '🤖 I\'m here to help! You can ask about health camps, symptom checking, your ASHA worker, or emergency contacts.';
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.getElementById('healthToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'healthToast';
    toast.style.cssText = `
        position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
        padding:.85rem 1.25rem; border-radius:12px;
        font-family:'Inter',sans-serif; font-size:.85rem; font-weight:600;
        box-shadow:0 8px 28px rgba(0,0,0,.16); max-width:320px;
        display:flex; align-items:center; gap:.6rem;
        animation:toastIn .35s cubic-bezier(.34,1.56,.64,1) forwards;
        background:${type === 'warn' ? '#fffbeb' : type === 'success' ? '#ecfdf5' : '#eff6ff'};
        color:${type === 'warn' ? '#92400e' : type === 'success' ? '#065f46' : '#1e3a8a'};
        border:1.5px solid ${type === 'warn' ? '#fde68a' : type === 'success' ? '#6ee7b7' : '#bfdbfe'};
    `;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    // Inject keyframe once
    if (!document.getElementById('toastStyle')) {
        const s = document.createElement('style');
        s.id = 'toastStyle';
        s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}';
        document.head.appendChild(s);
    }

    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
}
