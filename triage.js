document.addEventListener('DOMContentLoaded', () => {
    const triageForm = document.getElementById('triageForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');
    const resetBtn = document.getElementById('resetBtn');
    const voiceToggleBtn = document.getElementById('voiceToggleBtn');

    // DOM Elements for Results
    const riskCard = document.getElementById('riskCard');
    const riskIndicator = document.getElementById('riskIndicator');
    const riskTitle = document.getElementById('riskTitle');
    const riskDescription = document.getElementById('riskDescription');

    const recommendationTitle = document.getElementById('recommendationTitle');
    const guidanceContent = document.getElementById('guidanceContent');
    const guidanceAction = document.getElementById('guidanceAction');

    const xaiFactors = document.getElementById('xaiFactors');

    // Mock Voice Toggle
    voiceToggleBtn.addEventListener('click', () => {
        const isActive = voiceToggleBtn.classList.toggle('active');
        const span = voiceToggleBtn.querySelector('span');

        if (isActive) {
            span.textContent = "Listening... Speak now";
            // Simulate voice recognition briefly
            setTimeout(() => {
                document.getElementById('patientAge').value = '65';
                document.getElementById('patientGender').value = 'male';
                document.getElementById('symptomSob').checked = true;

                voiceToggleBtn.classList.remove('active');
                span.textContent = "Enable Voice Input";
            }, 3000);
        } else {
            span.textContent = "Enable Voice Input";
        }
    });

    triageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide analyze button, show loader
        analyzeBtn.classList.add('hidden');
        loadingState.classList.remove('hidden');
        resultsSection.classList.add('hidden');

        // Extract Form Data
        const age = parseInt(document.getElementById('patientAge').value, 10);
        const spo2Input = document.getElementById('patientSpo2').value;
        const spo2 = spo2Input ? parseInt(spo2Input, 10) : null;

        const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(cb => cb.value);

        // Simulate AI Processing Time (1.5 seconds)
        setTimeout(() => {
            const assessment = performMockAiAssessment(age, spo2, selectedSymptoms);
            renderResults(assessment);

            // ── Firestore: save triage record on user action ──
            const gender = document.getElementById('patientGender').value;
            if (window.saveTriage) {
                window.saveTriage({
                    role: sessionStorage.getItem('ha_role') || 'unknown',
                    age: age,
                    gender: gender,
                    symptoms: selectedSymptoms,
                    riskLevel: assessment.level   // 'LOW' | 'MEDIUM' | 'HIGH'
                });
            }

            // UI Switch
            loadingState.classList.add('hidden');
            analyzeBtn.classList.remove('hidden');
            resultsSection.classList.remove('hidden');

            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }, 1500);
    });

    resetBtn.addEventListener('click', () => {
        triageForm.reset();
        resultsSection.classList.add('hidden');

        // Scroll back up
        document.querySelector('.triage-header').scrollIntoView({ behavior: 'smooth' });
    });

    /**
     * Mock AI Triage Logic
     * Returns: { level: 'LOW'|'MEDIUM'|'HIGH', factors: string[], symptoms: string[] }
     */
    function performMockAiAssessment(age, spo2, symptoms) {
        let riskLevel = 'LOW';
        let factors = [];

        factors.push(`Age: ${age}`);
        if (symptoms.length > 0) {
            factors.push(`Symptoms observed: ${symptoms.join(', ').replace(/_/g, ' ')}`);
        } else {
            factors.push('No specific symptoms selected.');
        }

        // Extremely critical indicators
        if (spo2 !== null && spo2 < 92) {
            riskLevel = 'HIGH';
            factors.push(`Critical SpO2 level detected (${spo2}%) - below safe threshold of 92%.`);
        }
        else if (symptoms.includes('shortness_of_breath') && age > 60) {
            riskLevel = 'HIGH';
            factors.push('Shortness of breath paired with advanced age (>60) strongly indicates high risk.');
        }
        else if (symptoms.includes('shortness_of_breath') || symptoms.includes('vomiting_diarrhea') && symptoms.length > 2) {
            riskLevel = 'MEDIUM';
            factors.push('Presence of specific warning symptoms (breathlessness or severe gastrointestinal) necessitates clinical review.');
        }
        else if (symptoms.length >= 3) {
            riskLevel = 'MEDIUM';
            factors.push('Multiple symptom clusters detected, suggesting systemic issue.');
        }
        else if (age < 2 || age > 75) {
            if (symptoms.length > 0) riskLevel = 'MEDIUM';
            factors.push('Patient falls into vulnerable age group, elevating baseline risk.');
        }
        else {
            riskLevel = 'LOW';
            factors.push('Reported symptoms do not align with known high-risk critical patterns.');
        }

        return { level: riskLevel, factors: factors, symptoms: symptoms };
    }

    /**
     * Updates the DOM with assessment results
     */
    function renderResults(assessment) {
        // Reset Card Classes
        riskCard.className = 'card risk-card text-center mb-4';
        const level = assessment.level;

        // XAI Injection
        xaiFactors.innerHTML = '';
        assessment.factors.forEach(factor => {
            const li = document.createElement('li');
            li.textContent = factor;
            xaiFactors.appendChild(li);
        });

        if (level === 'LOW') {
            riskCard.classList.add('risk-low');
            riskIndicator.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            riskTitle.textContent = "LOW RISK";
            riskDescription.textContent = "Patient symptoms suggest a mild or non-critical condition.";

            recommendationTitle.textContent = "Home Care & Monitoring";
            guidanceContent.innerHTML = `
                <ul class="guidance-list">
                    <li>Advise rest and adequate hydration.</li>
                    <li>Use over-the-counter medication for symptom relief as per broad guidelines.</li>
                    <li>Patient should isolate if symptoms suggest contagious infection.</li>
                </ul>
                <div class="warning-box mt-3">
                    <strong>Warning signs to watch for:</strong> If symptoms worsen, fever persists for >3 days, or breathing becomes difficult, return to center.
                </div>
            `;
            guidanceAction.innerHTML = `
                <button type="button" class="btn btn-outline w-100">
                    <i class="fa-solid fa-print"></i> Print Care Instructions
                </button>
            `;

        } else if (level === 'MEDIUM') {
            riskCard.classList.add('risk-medium');
            riskIndicator.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            riskTitle.textContent = "MEDIUM RISK";
            riskDescription.textContent = "Patient requires formal clinical assessment.";

            recommendationTitle.textContent = "Telemedicine Consultation";
            guidanceContent.innerHTML = `
                <ul class="guidance-list">
                    <li>Schedule an immediate tele-consultation with a district medical officer.</li>
                    <li>Continue monitoring vitals (temperature, SpO2) every 2 hours.</li>
                    <li>Keep patient in observation area until consult is complete.</li>
                </ul>
            `;
            guidanceAction.innerHTML = `
                <button type="button" class="btn btn-warning w-100">
                    <i class="fa-solid fa-video"></i> Schedule Teleconsultation
                </button>
            `;

        } else if (level === 'HIGH') {
            riskCard.classList.add('risk-high');
            riskIndicator.innerHTML = '<i class="fa-solid fa-truck-medical"></i>';
            riskTitle.textContent = "HIGH RISK";
            riskDescription.textContent = "CRITICAL: Patient requires immediate hospital intervention.";

            recommendationTitle.textContent = "Immediate Hospital Referral";
            guidanceContent.innerHTML = `
                <ul class="guidance-list text-danger fw-600">
                    <li>Initiate emergency transfer to nearest secondary/tertiary care facility immediately.</li>
                    <li>Do not delay for tele-consultation.</li>
                    <li>Administer basic life support or oxygen if available and trained.</li>
                </ul>
            `;
            guidanceAction.innerHTML = `
                <button type="button" class="btn btn-danger btn-lg w-100 bounce">
                    <i class="fa-solid fa-hospital"></i> Refer to Nearest Health Facility
                </button>
            `;
        }
    }
});
