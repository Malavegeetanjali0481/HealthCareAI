document.addEventListener('DOMContentLoaded', () => {

    const actionButtons = document.querySelectorAll('.action-stack button');

    // Handle button actions instantly (NO simulated loads)
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = btn.textContent.trim();
            const row = btn.closest('tr');

            if (text === 'Confirm Slot') {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Confirmed';
                btn.classList.remove('btn-primary', 'btn-warning-theme', 'bg-secondary-light', 'text-secondary');
                btn.classList.add('bg-secondary-light', 'text-secondary');
                btn.style.borderColor = 'transparent';
                btn.disabled = true;

                // Hide reschedule button
                const nextBtn = btn.nextElementSibling;
                if (nextBtn) nextBtn.style.display = 'none';

                // Fade out row slightly to show it's confirmed
                row.style.opacity = '0.7';

                // ── Firestore: save confirmed slot to telemedicine_queue ──
                if (window.saveTelemedicineEntry) {
                    const patientName = row.querySelector('td:nth-child(2) strong')?.textContent || 'Unknown';
                    const riskBadge = row.querySelector('.badge')?.textContent || '';
                    const priority = riskBadge.toLowerCase().includes('high') ? 'High'
                        : riskBadge.toLowerCase().includes('med') ? 'Medium' : 'Low';
                    const doctor = row.querySelector('.slot-doc')?.textContent?.trim() || 'Unassigned';
                    const riskScoreStr = riskBadge.match(/(\d+)\/100/);
                    const riskScore = riskScoreStr ? parseInt(riskScoreStr[1]) : 0;
                    window.saveTelemedicineEntry({
                        patientName,
                        riskScore,
                        priority,
                        assignedDoctor: doctor,
                        status: 'Waiting'
                    });
                }
            }
            else if (text === 'Reschedule') {
                // Remove row to simulate reschedule
                row.style.transition = 'all 0.3s ease';
                row.style.transform = 'translateX(50px)';
                row.style.opacity = '0';
                setTimeout(() => { row.remove(); }, 300);
            }
        });
    });

    // Interactive Doctor Slots (Visual only)
    const slotPills = document.querySelectorAll('.slot-pill:not(.disabled)');
    slotPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active from siblings
            const siblings = pill.parentElement.querySelectorAll('.slot-pill');
            siblings.forEach(s => s.classList.remove('active'));
            // Set active
            pill.classList.add('active');
        });
    });

});
