// Handle mock network status toggling
const simulateNetworkChanges = () => {
    const networkStatus = document.getElementById('networkStatus');
    const wifiIcon = document.getElementById('wifiIcon');
    const statusText = document.getElementById('statusText');
    const offlineBanner = document.getElementById('offlineBanner');

    // Randomly drop offline every 15-30 seconds for demo purposes
    setInterval(() => {
        const isCurrentlyOnline = statusText.textContent === 'Online';

        if (isCurrentlyOnline) {
            // Go offline
            wifiIcon.className = "fa-solid fa-wifi" // Remove specific color classes first
            wifiIcon.classList.add('text-gray');
            wifiIcon.classList.replace('fa-wifi', 'fa-wifi-slash'); // use disconnected icon
            statusText.textContent = "Offline";
            statusText.classList.add('text-gray');

            networkStatus.style.background = "rgba(0,0,0,0.4)";
            offlineBanner.classList.remove('hidden');
        } else {
            // Restore online
            wifiIcon.className = "fa-solid fa-wifi text-success";
            statusText.textContent = "Online";
            statusText.classList.remove('text-gray');

            networkStatus.style.background = "rgba(255,255,255,0.2)";
            offlineBanner.classList.add('hidden');
        }
    }, 20000); // toggle every 20s
};

// Handle translated explanations toggle 
const setupTranslationToggle = () => {
    const toggle = document.querySelector('.toggle-input');
    const label = toggle.parentElement.querySelector('span');
    const langSelect = document.getElementById('langSelect');

    toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            const currentLang = langSelect.options[langSelect.selectedIndex].text;
            label.textContent = `Explaining in ${currentLang}...`;
            label.classList.replace('text-primary', 'text-success');
        } else {
            label.textContent = `Explain to patient`;
            label.classList.replace('text-success', 'text-primary');
        }
    });

    langSelect.addEventListener('change', () => {
        if (toggle.checked) {
            const currentLang = langSelect.options[langSelect.selectedIndex].text;
            label.textContent = `Explaining in ${currentLang}...`;
        }
    });
};

// Audio Guidance Mock
window.playAudioMock = () => {
    const toast = document.getElementById('audioToast');
    const langSelect = document.getElementById('langSelect');
    const currentLangText = langSelect.options[langSelect.selectedIndex].text;

    toast.querySelector('.toast-text').textContent = `Playing audio guidance (${currentLangText})...`;

    // Show toast
    toast.classList.remove('hidden');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
};

// Simple smooth scroll utility for action cards
window.scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        // Offset for header
        const y = section.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Brief highlight effect on the header
        const title = section.querySelector('.section-title');
        title.style.color = "var(--primary-color)";
        setTimeout(() => {
            title.style.color = "var(--dark-dark)";
        }, 1500);
    }
};

// Handle Task completion visually
document.querySelectorAll('.task-action .btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        if (this.textContent.includes('Start')) {
            this.innerHTML = '<i class="fa-solid fa-check-double"></i> Done';
            this.classList.replace('btn-outline', 'bg-secondary-light');
            this.classList.add('text-secondary');
            this.style.borderColor = "transparent";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    simulateNetworkChanges();
    setupTranslationToggle();
});
