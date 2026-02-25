/* =============================================
   Arogya Mithra — Floating Chatbot JS
   Logic for role-based responses and multi-language support
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Language & Role State
    let currentLang = localStorage.getItem('arogya_lang') || 'en';
    let role = 'patient';
    const path = window.location.pathname;
    if (path.includes('asha-dashboard')) role = 'asha';
    else if (path.includes('doctor-dashboard')) role = 'doctor';
    else if (path.includes('district-dashboard')) role = 'district';
    else if (path.includes('index.html') || path === '/' || path.endsWith('/')) role = 'public';

    const storedRole = sessionStorage.getItem('ha_role');
    if (storedRole && role !== 'public') role = storedRole;

    // 2. Multi-language Translations
    const translations = {
        en: {
            title: 'Arogya Mithra Assistant',
            status: 'Online',
            inputPlaceholder: 'Ask me anything...',
            disclaimer: 'Arogya Mithra Assistant. Smart decision support.',
            roles: {
                public: {
                    welcome: 'Welcome to Arogya Mithra! I am your health companion. How can I help you learn about our services today?',
                    quickReplies: ['About Platform', 'Our Impact', 'Login Help', 'Contact Us'],
                    responses: {
                        'about': 'Arogya Mithra is India\'s smart rural health platform connecting villages to quality care.',
                        'impact': 'We cover 500+ villages with smart triage and telemedicine support.',
                        'login': 'Click the "Login / Register" button in the top bar to access your dashboard.',
                        'contact': 'You can reach us at support@arogyaraksha.gov.in or call our helpline 108.'
                    },
                    fallback: 'I can help with general information about the platform. What would you like to know?'
                },
                patient: {
                    welcome: 'Hello! I am your health companion. How can I help you today?',
                    quickReplies: ['Check Symptoms', 'Find ASHA', 'My Vitals', 'Blood Bank'],
                    responses: {
                        'symptoms': 'Use the Smart Symptom Checker in your dashboard for an instant assessment.',
                        'asha': 'Sunita Bai is your assigned ASHA worker. Contact her via the Support section.',
                        'vitals': 'Your last BP was 120/80. Looking good!',
                        'blood': 'Nearest blood bank: District Hospital (12km).'
                    },
                    fallback: 'I can help with health tips or explaining your stats. Ask me anything.'
                },
                asha: {
                    welcome: 'Namaste! Ready for your village visits? I can help with protocols or prioritizing cases.',
                    quickReplies: ['Today\'s Route', 'Risk Protocols', 'Vaccine Due', 'Emergency'],
                    responses: {
                        'route': '8 visits planned today. Start with high-risk cases first.',
                        'protocols': 'Red: Refer to PHC. Yellow: Monitor. Green: Routine care.',
                        'vaccine': '6 children are due for vaccination today in your area.',
                        'emergency': 'Call 108 and use the Emergency Referral tab immediately.'
                    },
                    fallback: 'I am here for on-field support. How can I help?'
                },
                doctor: {
                    welcome: 'Welcome back, Doctor. Need help with patient summaries or clinical references?',
                    quickReplies: ['Priority Queue', 'Drug Info', 'Lab Values', 'Consult Help'],
                    responses: {
                        'priority': 'Arun Yadav (22, M) is next in your queue with acute symptoms.',
                        'drug': 'I can check the National Formulary for you. Please name the drug.',
                        'lab': 'Normal Hb: 13-17 (M), 12-15 (F). Glucose: <100 mg/dL.',
                        'consult': 'Ensure your video connection is stable for the next call.'
                    },
                    fallback: 'I can assist with clinical data and queue management.'
                }
            }
        },
        hi: {
            title: 'आरोग्य सहायक',
            status: 'ऑनलाइन',
            inputPlaceholder: 'कुछ भी पूछें...',
            disclaimer: 'आरोग्य रक्षा सहायक। स्मार्ट निर्णय समर्थन।',
            roles: {
                public: {
                    welcome: 'आरोग्य रक्षा में आपका स्वागत है! मैं आपका स्वास्थ्य मित्र हूं। मैं आज आपकी कैसे सहायता कर सकता हूं?',
                    quickReplies: ['प्लेटफ़ॉर्म के बारे में', 'हमारा प्रभाव', 'लॉगिन सहायता', 'संपर्क करें'],
                    responses: {
                        'बारे': 'आरोग्य रक्षा भारत का स्मार्ट ग्रामीण स्वास्थ्य मंच है जो गांवों को गुणवत्तापूर्ण देखभाल से जोड़ता है।',
                        'प्रभाव': 'हम स्मार्ट ट्राइएज और टेलीमेडिसिन सहायता के साथ 500+ गांवों को कवर करते हैं।',
                        'लॉगिन': 'अपने डैशबोर्ड तक पहुंचने के लिए टॉप बार में "लॉगिन / रजिस्टर" बटन पर क्लिक करें।',
                        'संपर्क': 'आप हमसे support@arogyaraksha.gov.in पर संपर्क कर सकते हैं या हमारे हेल्पलाइन 108 पर कॉल कर सकते हैं।'
                    },
                    fallback: 'मैं प्लेटफ़ॉर्म के बारे में सामान्य जानकारी में मदद कर सकता हूं। आप क्या जानना चाहेंगे?'
                },
                patient: {
                    welcome: 'नमस्ते! मैं आपका स्वास्थ्य मित्र हूं। आज मैं आपकी कैसे मदद कर सकता हूँ?',
                    quickReplies: ['लक्षण जांचें', 'आशा कार्यकर्ता', 'मेरे वाइटल्स', 'ब्लड बैंक'],
                    responses: {
                        'लक्षण': 'त्वरित मूल्यांकन के लिए अपने डैशबोर्ड में स्मार्ट लक्षण चेकर का उपयोग करें।',
                        'आशा': 'सुनीता बाई आपकी निर्धारित आशा कार्यकर्ता हैं। सपोर्ट सेक्शन के माध्यम से उनसे संपर्क करें।',
                        'वाइटल्स': 'आपका पिछला बीपी 120/80 था। सब ठीक लग रहा है!',
                        'ब्लड': 'निकटतम ब्लड बैंक: जिला अस्पताल (12 किमी)।'
                    },
                    fallback: 'मैं स्वास्थ्य युक्तियों या आपके आंकड़ों को समझाने में मदद कर सकता हूं।'
                },
                asha: {
                    welcome: 'नमस्ते! क्या आप आज के दौरों के लिए तैयार हैं? मैं प्रोटोकॉल या प्राथमिकता में मदद कर सकता हूं।',
                    quickReplies: ['आज का रूट', 'जोखिम नियम', 'टीकाकरण', 'आपातकालीन'],
                    responses: {
                        'रूट': 'आज 8 दौरे निर्धारित हैं। उच्च जोखिम वाले मामलों से शुरू करें।',
                        'नियम': 'लाल: PHC भेजें। पीला: निगरानी करें। हरा: सामान्य देखभाल।',
                        'टीका': 'आज आपके क्षेत्र में 6 बच्चों का टीकाकरण होना है।',
                        'आपात': '108 पर कॉल करें और तुरंत आपातकालीन रेफरल टैब का उपयोग करें।'
                    },
                    fallback: 'मैं ऑन-फील्ड सहायता के लिए यहां हूं। मैं कैसे मदद कर सकता हूं?'
                }
            }
        },
        te: {
            title: 'ఆరోగ్య సహాయకుడు',
            status: 'ఆన్‌లైన్',
            inputPlaceholder: 'ఏదైనా అడగండి...',
            disclaimer: 'ఆరోగ్య రక్ష అసిస్టెంట్. స్మార్ట్ నిర్ణయ మద్దతు.',
            roles: {
                public: {
                    welcome: 'ఆరోగ్య రక్షకు స్వాగతం! నేను మీ ఆరోగ్య సహచరుడిని. ఈరోజు మా సేవల గురించి తెలుసుకోవడానికి నేను మీకు ఎలా సహాయపడగలను?',
                    quickReplies: ['వేదిక గురించి', 'మా ప్రభావం', 'లాగిన్ సహాయం', 'మమ్మల్ని సంప్రదించండి'],
                    responses: {
                        'గురించి': 'ఆరోగ్య రక్ష అనేది గ్రామాలను నాణ్యమైన సంరక్షణకు అనుసంధానించే భారతదేశపు స్మార్ట్ గ్రామీణ ఆరోగ్య వేదిక.',
                        'ప్రభావం': 'మేము స్మార్ట్ ట్రయేజ్ మరియు టెలిమెడిసిన్ మద్దతుతో 500+ గ్రామాలను కవర్ చేస్తున్నాము.',
                        'లాగిన్': 'మీ డ్యాష్‌బోర్డ్‌ను యాక్సెస్ చేయడానికి టాప్ బార్‌లోని "లాగిన్ / రిజిస్టర్" బటన్‌పై క్లిక్ చేయండి.',
                        'సంప్రదించండి': 'మీరు మమ్మల్ని support@arogyaraksha.gov.inలో సంప్రదించవచ్చు లేదా మా హెల్ప్‌లైన్ 108కి కాల్ చేయవచ్చు.'
                    },
                    fallback: 'నేను ప్లాట్‌ఫారమ్ గురించి సాధారణ సమాచారంతో సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?'
                },
                patient: {
                    welcome: 'నమస్కారం! నేను మీ ఆరోగ్య సహచరుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',
                    quickReplies: ['లక్షణాలు తనిఖీ', 'ఆశా కార్యకర్త', 'నా వైటల్స్', 'బ్లడ్ బ్యాంక్'],
                    responses: {
                        'లక్షణాలు': 'తక్షణ అంచనా కోసం మీ డ్యాష్‌బోర్డ్‌లో స్మార్ట్ సింప్టమ్ చెకర్‌ని ఉపయోగించండి.',
                        'ఆశా': 'సునీత బాయి మీకు కేటాయించబడిన ఆశా కార్యకర్త. మద్దతు విభాగం ద్వారా ఆమెను సంప్రదించండి.',
                        'వైటల్స్': 'మీ చివరి బీపీ 120/80. అంతా బాగుంది!',
                        'బ్లడ్': 'సమీప బ్లడ్ బ్యాంక్: జిల్లా ఆసుపత్రి (12 కి.మీ).'
                    },
                    fallback: 'నేను ఆరోగ్య చిట్కాలతో లేదా మీ గణాంకాలను వివరించడంలో సహాయం చేయగలను.'
                },
                asha: {
                    welcome: 'నమస్కారం! ఈరోజు మీ గ్రామ సందర్శనలకు సిద్ధంగా ఉన్నారా? సందర్శనల ప్రాధాన్యత లేదా ప్రోటోకాల్‌లలో నేను సహాయపడగలను.',
                    quickReplies: ['నేటి మార్గం', 'రిస్క్ ప్రోటోకాల్స్', 'టీకా గడువు', 'అత్యవసర పరిస్థితి'],
                    responses: {
                        'మార్గం': 'ఈరోజు 8 సందర్శనలు ప్లాన్ చేయబడ్డాయి. అధిక రిస్క్ ఉన్న కేసులతో ప్రారంభించండి.',
                        'ప్రోటోకాల్స్': 'ఎరుపు: వెంటనే PHCకి పంపండి. పసుపు: పర్యవేక్షించండి. ఆకుపచ్చ: సాధారణ సంరక్షణ.',
                        'టీకా': 'ఈరోజు మీ ప్రాంతంలో 6 మంది పిల్లలకు టీకాలు వేయాల్సి ఉంది.',
                        'అత్యవసర': '108కి కాల్ చేయండి మరియు అత్యవసర రిఫరల్ ట్యాబ్‌ను వెంటనే ఉపయోగించండి.'
                    },
                    fallback: 'క్షేత్రస్థాయి మద్దతు కోసం నేను ఇక్కడ ఉన్నాను. నేను ఎలా సహాయపడగలను?'
                }
            }
        }
    };

    // 3. Inject HTML
    const chatbotHtml = `
        <button class="chatbot-fab" id="chatFab">
            <span class="fab-icon"><i class="fa-solid fa-comment-medical"></i></span>
            <span class="fab-badge">1</span>
        </button>
        <div class="chatbot-window" id="chatWindow">
            <div class="cb-header">
                <div class="cb-header-avatar" id="cbAvatar">🏥</div>
                <div class="cb-header-info">
                    <div class="cb-header-name" id="cbTitle">Arogya Mithra Assistant</div>
                    <div class="cb-header-status"><span class="dot"></span> <span id="cbStatus">Online</span></div>
                </div>
                <div class="cb-lang-mini">
                    <select id="chatLang" style="font-size: 0.6rem; border-radius: 4px; border: none; padding: 2px;">
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>EN</option>
                        <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>हिं</option>
                        <option value="te" ${currentLang === 'te' ? 'selected' : ''}>తె</option>
                    </select>
                </div>
                <button class="cb-close" id="chatClose"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cb-messages" id="chatMsgs"></div>
            <div class="cb-input-area">
                <input type="text" class="cb-input" id="chatInput" placeholder="Ask me anything...">
                <button class="cb-send" id="chatSend"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
            <div class="cb-disclaimer" id="cbDisclaimer">
                Arogya Mithra Assistant. Smart decision support.
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = chatbotHtml;
    document.body.appendChild(div);

    // 4. UI References & Logic
    const fab = document.getElementById('chatFab');
    const win = document.getElementById('chatWindow');
    const close = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const msgs = document.getElementById('chatMsgs');
    const langSel = document.getElementById('chatLang');

    let isTyping = false;

    function updateLanguage() {
        localStorage.setItem('arogya_lang', currentLang);
        const t = translations[currentLang];
        document.getElementById('cbTitle').textContent = t.title;
        document.getElementById('cbStatus').textContent = t.status;
        document.getElementById('cbDisclaimer').innerText = t.disclaimer;
        input.placeholder = t.inputPlaceholder;

        // Clear and reload welcome if window is open
        if (win.classList.contains('open')) {
            msgs.innerHTML = '';
            const roleData = t.roles[role] || t.roles.public || translations.en.roles.public;
            document.getElementById('cbAvatar').textContent = sideIcon(role);
            setTimeout(() => addMessage(roleData.welcome, 'bot', true), 300);
        }
    }

    function sideIcon(r) {
        if (r === 'asha') return '📋';
        if (r === 'doctor') return '🩺';
        if (r === 'district') return '📊';
        return '🏥';
    }

    langSel.onchange = (e) => {
        currentLang = e.target.value;
        updateLanguage();
    };

    function toggleChat() {
        win.classList.toggle('open');
        fab.classList.toggle('active');
        if (win.classList.contains('open')) {
            input.focus();
            if (msgs.children.length === 0) {
                updateLanguage();
            }
        }
    }

    fab.onclick = toggleChat;
    close.onclick = toggleChat;

    function addMessage(text, side, showQuick = false) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = `cb-msg ${side}`;

        const avatar = side === 'bot' ? sideIcon(role) : '👤';

        msgDiv.innerHTML = `
            <div class="cb-msg-avatar">${avatar}</div>
            <div class="cb-msg-content">
                <div class="cb-msg-bubble">${text}</div>
                <span class="cb-msg-time">${time}</span>
            </div>
        `;
        msgs.appendChild(msgDiv);

        const t = translations[currentLang];
        const roleData = t.roles[role] || t.roles.public || translations.en.roles.public;

        if (showQuick && roleData.quickReplies) {
            const quickDiv = document.createElement('div');
            quickDiv.className = 'cb-quick-replies';
            roleData.quickReplies.forEach(txt => {
                const btn = document.createElement('button');
                btn.className = 'cb-quick-btn';
                btn.textContent = txt;
                btn.onclick = () => {
                    input.value = txt;
                    handleSend();
                };
                quickDiv.appendChild(btn);
            });
            msgs.appendChild(quickDiv);
        }
        msgs.scrollTop = msgs.scrollHeight;
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text || isTyping) return;

        addMessage(text, 'user');
        input.value = '';
        isTyping = true;

        const t = translations[currentLang];
        const roleData = t.roles[role] || t.roles.public || translations.en.roles.public;

        const typing = document.createElement('div');
        typing.className = 'cb-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(typing);
        msgs.scrollTop = msgs.scrollHeight;

        setTimeout(() => {
            typing.remove();
            isTyping = false;

            const lowText = text.toLowerCase();
            let response = roleData.fallback;

            for (const key in roleData.responses) {
                if (lowText.includes(key.toLowerCase())) {
                    response = roleData.responses[key];
                    break;
                }
            }
            addMessage(response, 'bot');
        }, 1200);
    }

    send.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
});
