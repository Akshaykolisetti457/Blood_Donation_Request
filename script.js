// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 45;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2.5 + 1.5;
        this.color = Math.random() > 0.4 ? 'rgba(255, 51, 75, 0.12)' : 'rgba(79, 70, 229, 0.08)';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 51, 75, ${0.07 * (1 - dist / 100)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// ===== GLOBAL APP DATA =====
let donors = [
    { name: 'Dhana Lakshmi', type: 'O+', age: 25, phone: '+91 98765 43210', location: 'Madhapur, Hyd', distance: 1.2 },
    { name: 'Priya Sharma', type: 'A+', age: 29, phone: '+91 87654 32109', location: 'Secunderabad, Hyd', distance: 2.4 },
    { name: 'Rajesh Kumar', type: 'B+', age: 31, phone: '+91 76543 21098', location: 'Gachibowli, Hyd', distance: 3.8 },
    { name: 'Kiran Reddy', type: 'O-', age: 27, phone: '+91 65432 10987', location: 'Jubilee Hills, Hyd', distance: 5.1 }
];

let requests = [
    { name: 'Ravi Kumar', type: 'AB+', units: 2, hospital: 'Care Hospital', location: 'Banjara Hills', urgency: 'normal', time: '10 min ago' },
    { name: 'Sumit Sen', type: 'A-', units: 4, hospital: 'Yashoda Hospital', location: 'Somajiguda', urgency: 'urgent', time: '23 min ago' },
    { name: 'Baby of Anitha', type: 'O-', units: 3, hospital: 'Apollo Hospital', location: 'Jubilee Hills', urgency: 'critical', time: '5 min ago' }
];

const bloodStock = {
    'O+': 85, 'A+': 60, 'B+': 45, 'AB+': 95,
    'O-': 12, 'A-': 30, 'B-': 22, 'AB-': 8
};

const donutData = [
    { label: 'O+', value: 38, color: '#ff334b' },
    { label: 'A+', value: 26, color: '#4f46e5' },
    { label: 'B+', value: 18, color: '#10b981' },
    { label: 'O-', value: 8, color: '#f59e0b' },
    { label: 'Others', value: 10, color: '#64748b' }
];

const activityLogs = [
    { title: 'New Donor Registered', desc: 'Suresh V. registered as O+ donor in Gachibowli', time: 'Just now', icon: 'fa-user-plus', type: 'purple' },
    { title: 'Blood Request Filled', desc: '3 units of A+ delivered to Yashoda Hospital', time: '15 min ago', icon: 'fa-check', type: 'green' },
    { title: 'Urgent Request Posted', desc: 'O- needed at Apollo Hospital, Hyderabad', time: '30 min ago', icon: 'fa-triangle-exclamation', type: 'red' },
    { title: 'Donation Completed', desc: 'Rani K. completed her quarterly donation drive', time: '1 hr ago', icon: 'fa-syringe', type: 'green' }
];

const historyLogs = [
    { hospital: 'Yashoda Hospital', date: '12 Apr 2026', units: 1 },
    { hospital: 'Apollo Hospital', date: '04 Jan 2026', units: 1 },
    { hospital: 'Red Cross Society', date: '21 Sep 2025', units: 1 }
];

const achievements = [
    { title: 'Life Saver', desc: 'Donated blood more than 5 times', icon: 'fa-trophy' },
    { title: 'First Drop', desc: 'First blood donation registered', icon: 'fa-medal' },
    { title: 'Fast Responder', desc: 'Responded to an emergency within 10 min', icon: 'fa-circle-check' }
];


// ===== CLIENT-SIDE CRYPTOGRAPHY (E2E LOCAL DATA PROTECTION) =====
// Helper to convert Uint8Array to Hex string
function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper to convert Hex string to Uint8Array
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

// Derive a CryptoKey from password and salt using PBKDF2
async function deriveKey(password, saltHex) {
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    const saltBytes = hexToBytes(saltHex);
    
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        passwordBytes,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    
    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBytes,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// Encrypt payload object with password using AES-GCM (returns salt, iv, ciphertext in hex)
async function encryptData(data, password) {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(JSON.stringify(data));
    
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
    
    const saltHex = bytesToHex(saltBytes);
    const ivHex = bytesToHex(ivBytes);
    
    const key = await deriveKey(password, saltHex);
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: ivBytes
        },
        key,
        dataBytes
    );
    
    const ciphertextHex = bytesToHex(new Uint8Array(encryptedBuffer));
    
    return {
        salt: saltHex,
        iv: ivHex,
        ciphertext: ciphertextHex
    };
}

// Decrypt hex payload with password using AES-GCM (returns original parsed object)
async function decryptData(encryptedObj, password) {
    const saltHex = encryptedObj.salt;
    const ivHex = encryptedObj.iv;
    const ciphertextHex = encryptedObj.ciphertext;
    
    const ivBytes = hexToBytes(ivHex);
    const ciphertextBytes = hexToBytes(ciphertextHex);
    
    const key = await deriveKey(password, saltHex);
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivBytes
        },
        key,
        ciphertextBytes
    );
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
}

let sessionPassword = ""; // Keep password in memory for edit re-encryption

// Tab Switching
function switchLoginTab(tab) {
    const tabBtns = document.querySelectorAll('.login-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active-tab-content'));
    
    if (tab === 'login') {
        document.querySelectorAll('.login-tab-btn')[0].classList.add('active');
        document.getElementById('loginTabContent').classList.add('active-tab-content');
    } else {
        document.querySelectorAll('.login-tab-btn')[1].classList.add('active');
        document.getElementById('registerTabContent').classList.add('active-tab-content');
    }
}

// User Registration with E2E Client-side Encryption
async function registerUser() {
    const fullName = document.getElementById('regFullName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const age = document.getElementById('regAge').value.trim();
    const gender = document.getElementById('regGender').value;
    const bloodGroup = document.getElementById('regBloodGroup').value;
    const weight = document.getElementById('regWeight').value.trim();
    const lastDonation = document.getElementById('regLastDonation').value;
    const password = document.getElementById('regPassword').value;

    if (!fullName || !phone || !age || !gender || !bloodGroup || !weight || !password) {
        showToast('Please fill out all registration fields.');
        return;
    }

    if (phone.length < 10) {
        showToast('Please enter a valid 10-digit phone number.');
        return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 18 || ageNum > 65) {
        showToast('Age must be between 18 and 65 for blood donation.');
        return;
    }

    const weightNum = parseFloat(weight);
    if (weightNum < 45) {
        showToast('Weight must be at least 45 kg to donate blood.');
        return;
    }

    const userData = {
        fullName,
        phone,
        age: ageNum,
        gender,
        bloodGroup,
        weight: weightNum,
        lastDonation
    };

    try {
        showToast('Encrypting and registering...');
        const encrypted = await encryptData(userData, password);
        localStorage.setItem('user_data_' + phone, JSON.stringify(encrypted));
        
        sessionPassword = password;
        window.currentUserDetails = userData;
        
        // Dynamic UI Updates
        updateAvatarUI(fullName);
        
        // Proceed to app
        enterAppDashboard();
        showToast('Registration & Encryption Successful!');
        
        // Clear fields
        document.getElementById('regFullName').value = '';
        document.getElementById('regPhone').value = '';
        document.getElementById('regAge').value = '';
        document.getElementById('regGender').value = '';
        document.getElementById('regBloodGroup').value = '';
        document.getElementById('regWeight').value = '';
        document.getElementById('regPassword').value = '';
    } catch (e) {
        console.error("Encryption/Registration failed:", e);
        showToast('Registration failed due to encryption error.');
    }
}

// User Login with Decryption
async function loginUser() {
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!phone || !password) {
        showToast('Please enter Phone Number and Password');
        return;
    }

    const encryptedDataStr = localStorage.getItem('user_data_' + phone);
    if (!encryptedDataStr) {
        showToast('Account not found. Please register first.');
        return;
    }

    try {
        const encryptedObj = JSON.parse(encryptedDataStr);
        showToast('Decrypting profile securely...');
        const decrypted = await decryptData(encryptedObj, password);
        
        // Validated successfully
        sessionPassword = password;
        window.currentUserDetails = decrypted;
        
        // Dynamic UI Updates
        updateAvatarUI(decrypted.fullName);
        
        enterAppDashboard();
        showToast('Login & Decryption Successful!');
        
        // Clear fields
        document.getElementById('loginPhone').value = '';
        document.getElementById('loginPassword').value = '';
    } catch (e) {
        console.error("Decryption/Login failed:", e);
        showToast('Incorrect password.');
    }
}

function updateAvatarUI(name) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const avatarElems = document.querySelectorAll('.top-avatar');
    avatarElems.forEach(el => el.innerText = initials);
    
    // Also update dropdown name and profile info if they exist
    const dName = document.getElementById('dropdownName');
    if (dName) dName.innerText = name;
    const dpAvatar = document.getElementById('dropdownAvatar');
    if (dpAvatar) dpAvatar.innerText = initials;
}

function enterAppDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    const mainApp = document.getElementById('mainApp');
    mainApp.style.display = 'block';
    setTimeout(() => {
        mainApp.style.opacity = '1';
        initializePageFeatures();
    }, 50);
}

// ===== NAVIGATION & TRANSITIONS =====
function openDashboard() {
    const splash = document.getElementById('splash');
    const mainApp = document.getElementById('mainApp');
    
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    document.getElementById('loginPage').style.display = 'flex';
    return;
    mainApp.style.display = 'block';
    setTimeout(() => {
        mainApp.style.opacity = '1';
        initializePageFeatures();
    }, 50);
}

function showPage(pageId, element) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active-page');
    });

    const targetPage = document.getElementById(pageId);
    targetPage.classList.add('active-page');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active-nav');
    });
    
    if (element) {
        element.classList.add('active-nav');
    }

    // Trigger counters and page-specific animations
    triggerCounters(targetPage);
    
    if (pageId === 'homePage') {
        animateStockChart();
    } else if (pageId === 'dashPage') {
        renderDonutChart();
        renderActivityFeed();
    } else if (pageId === 'donorPage') {
        renderDonorGrid();
    } else if (pageId === 'requestPage') {
        renderRequestsList();
    } else if (pageId === 'profilePage') {
        renderProfileContent();
    }
}

// Global page initializer
function initializePageFeatures() {
    // Initial load setup
    animateStockChart();
    setBloodType(document.querySelector('.blood-types-mini .bt.active'), 'O+', 'Universal');
    checkCompat();
    triggerCounters(document.getElementById('homePage'));
}


// ===== TOAST & NOTIFICATIONS =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
    toast.style.right = '20px';
    
    setTimeout(() => {
        toast.style.right = '-400px';
    }, 4000);
}

function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    const isVisible = window.getComputedStyle(panel).display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        document.getElementById('avatarDropdown').style.display = 'none';
    }
}

function toggleAvatarDropdown() {
    const panel = document.getElementById('avatarDropdown');
    const isVisible = window.getComputedStyle(panel).display !== 'none';
    panel.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
        document.getElementById('notifPanel').style.display = 'none';
    }
}

function logoutUser() {
    sessionPassword = "";
    window.currentUserDetails = null;
    
    document.getElementById('avatarDropdown').style.display = 'none';
    
    document.getElementById('mainApp').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
    }, 400);
    
    showToast("Logged out successfully");
}

// Language Translations Dictionary
const appTranslations = {
    en: {
        logo: '<i class="fa-solid fa-heart-pulse"></i> HemoBridge',
        navHome: '<i class="fa-solid fa-house"></i><span>Home</span>',
        navDonors: '<i class="fa-solid fa-droplet"></i><span>Donors</span>',
        navRequest: '<div class="nav-center-btn"><i class="fa-solid fa-hospital"></i></div><span>Request</span>',
        navAnalytics: '<i class="fa-solid fa-chart-line"></i><span>Analytics</span>',
        navProfile: '<i class="fa-solid fa-user"></i><span>Profile</span>',
        lblLanguage: 'Select Language',
        lblLogout: 'Logout',
        donorHeader: '<i class="fa-solid fa-droplet"></i> Donor Registration',
        requestHeader: '<i class="fa-solid fa-hospital"></i> Request Blood',
        analyticsHeader: '<i class="fa-solid fa-chart-line"></i> Analytics Dashboard',
        toastLang: 'Language changed to English'
    },
    hi: {
        logo: '<i class="fa-solid fa-heart-pulse"></i> हीमोब्रिज',
        navHome: '<i class="fa-solid fa-house"></i><span>होम</span>',
        navDonors: '<i class="fa-solid fa-droplet"></i><span>दाता</span>',
        navRequest: '<div class="nav-center-btn"><i class="fa-solid fa-hospital"></i></div><span>अनुरोध</span>',
        navAnalytics: '<i class="fa-solid fa-chart-line"></i><span>विश्लेषण</span>',
        navProfile: '<i class="fa-solid fa-user"></i><span>प्रोफ़ाइल</span>',
        lblLanguage: 'भाषा चुनें',
        lblLogout: 'लॉग आउट',
        donorHeader: '<i class="fa-solid fa-droplet"></i> रक्तदाता पंजीकरण',
        requestHeader: '<i class="fa-solid fa-hospital"></i> रक्त का अनुरोध',
        analyticsHeader: '<i class="fa-solid fa-chart-line"></i> विश्लेषण डैशबोर्ड',
        toastLang: 'भाषा बदलकर हिंदी कर दी गई है'
    },
    te: {
        logo: '<i class="fa-solid fa-heart-pulse"></i> హీమోబ్రిడ్జ్',
        navHome: '<i class="fa-solid fa-house"></i><span>హోమ్</span>',
        navDonors: '<i class="fa-solid fa-droplet"></i><span>దాతలు</span>',
        navRequest: '<div class="nav-center-btn"><i class="fa-solid fa-hospital"></i></div><span>అభ్యర్థన</span>',
        navAnalytics: '<i class="fa-solid fa-chart-line"></i><span>విశ్లేషణ</span>',
        navProfile: '<i class="fa-solid fa-user"></i><span>ప్రొఫైల్</span>',
        lblLanguage: 'భాష ఎంచుకోండి',
        lblLogout: 'లాగ్అవుట్',
        donorHeader: '<i class="fa-solid fa-droplet"></i> దాత నమోదు',
        requestHeader: '<i class="fa-solid fa-hospital"></i> రక్తం అభ్యర్థన',
        analyticsHeader: '<i class="fa-solid fa-chart-line"></i> విశ్లేషణ డాష్‌బోర్డ్',
        toastLang: 'భాష తెలుగులోకి మార్చబడింది'
    }
};

function changeLanguage(lang) {
    const t = appTranslations[lang];
    if (!t) return;
    
    document.querySelector('.top-logo').innerHTML = t.logo;
    
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    if (navItems.length === 5) {
        navItems[0].innerHTML = t.navHome;
        navItems[1].innerHTML = t.navDonors;
        navItems[2].innerHTML = t.navRequest;
        navItems[3].innerHTML = t.navAnalytics;
        navItems[4].innerHTML = t.navProfile;
    }
    
    document.getElementById('lblLanguage').innerText = t.lblLanguage;
    document.querySelector('.btn-logout span').innerText = t.lblLogout;
    
    const donorPageTitle = document.querySelector('#donorPage .page-header h1');
    if (donorPageTitle) donorPageTitle.innerHTML = t.donorHeader;
    
    const requestPageTitle = document.querySelector('#requestPage .page-header h1');
    if (requestPageTitle) requestPageTitle.innerHTML = t.requestHeader;
    
    const dashPageTitle = document.querySelector('#dashPage .page-header h1');
    if (dashPageTitle) dashPageTitle.innerHTML = t.analyticsHeader;
    
    showToast(t.toastLang);
}

// Close panels when clicking outside
document.addEventListener('click', (e) => {
    const notifPanel = document.getElementById('notifPanel');
    const notifBell = document.getElementById('notifBell');
    if (notifPanel && notifBell && !notifPanel.contains(e.target) && !notifBell.contains(e.target)) {
        notifPanel.style.display = 'none';
    }
    
    const avatarDropdown = document.getElementById('avatarDropdown');
    const topAvatar = document.getElementById('topAvatar');
    if (avatarDropdown && topAvatar && !avatarDropdown.contains(e.target) && !topAvatar.contains(e.target)) {
        avatarDropdown.style.display = 'none';
    }
});

function clearNotifs() {
    document.getElementById('notifList').innerHTML = `<div style="padding:25px; text-align:center; color:var(--text-muted); font-size:13px;">No notifications</div>`;
    document.getElementById('notifDot').style.display = 'none';
    showToast('Notifications cleared');
}


// ===== STATS COUNTER =====
function triggerCounters(container) {
    const counters = container.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 40; // divide by frames
        
        counter.innerText = '0';
        const update = () => {
            if (count < target) {
                count += speed;
                counter.innerText = Math.ceil(count) + (target > 1000 ? '+' : '');
                setTimeout(update, 20);
            } else {
                counter.innerText = target + (target > 1000 ? '+' : '');
            }
        };
        update();
    });

    // Also trigger stat progress bar fills
    const fills = container.querySelectorAll('.stat-fill');
    fills.forEach(fill => {
        const originalWidth = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = originalWidth;
        }, 150);
    });
}


// ===== HOME PAGE DYNAMICS =====

// Circular Progress
function setBloodType(element, type, description) {
    // Button active class
    const buttons = document.querySelectorAll('.blood-types-mini .bt');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    // Update ring label
    document.getElementById('ringType').innerText = type;
    document.querySelector('.ring-center small').innerText = description;

    // Animate circular stock progress fill
    const fillPercent = bloodStock[type] || 50;
    const ringFill = document.getElementById('ringFill');
    const circumference = 314; // 2 * pi * 50
    const offset = circumference - (circumference * fillPercent) / 100;
    ringFill.style.strokeDashoffset = offset;
}

// Blood Stock Chart
function animateStockChart() {
    const barsContainer = document.getElementById('chartBars');
    const labelsContainer = document.getElementById('chartLabels');
    
    barsContainer.innerHTML = '';
    labelsContainer.innerHTML = '';

    Object.keys(bloodStock).forEach(type => {
        const value = bloodStock[type];
        
        // Bar block
        const barBlock = document.createElement('div');
        barBlock.className = 'chart-bar-container';
        
        const barFill = document.createElement('div');
        barFill.className = 'chart-bar-fill';
        barFill.setAttribute('data-value', value);
        barFill.style.height = '0%';
        
        barBlock.appendChild(barFill);
        barsContainer.appendChild(barBlock);

        // Label block
        const label = document.createElement('span');
        label.innerText = type;
        labelsContainer.appendChild(label);

        // Animate scale height
        setTimeout(() => {
            barFill.style.height = `${value}%`;
        }, 100);
    });
}

// Compatibility Checker logic
function checkCompat() {
    const donor = document.getElementById('donorType').value;
    const recipient = document.getElementById('recipientType').value;
    const resultBox = document.getElementById('compatResult');
    const resultText = document.getElementById('compatText');

    let compatible = false;

    // Matching rules
    if (donor === 'O-') {
        compatible = true; // Universal donor
    } else if (recipient === 'AB+') {
        compatible = true; // Universal recipient
    } else if (donor === 'O+') {
        compatible = ['O+', 'A+', 'B+', 'AB+'].includes(recipient);
    } else if (donor === 'A-') {
        compatible = ['A-', 'A+', 'AB-', 'AB+'].includes(recipient);
    } else if (donor === 'A+') {
        compatible = ['A+', 'AB+'].includes(recipient);
    } else if (donor === 'B-') {
        compatible = ['B-', 'B+', 'AB-', 'AB+'].includes(recipient);
    } else if (donor === 'B+') {
        compatible = ['B+', 'AB+'].includes(recipient);
    } else if (donor === 'AB-') {
        compatible = ['AB-', 'AB+'].includes(recipient);
    }

    if (compatible) {
        resultBox.className = 'compat-result';
        resultBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span id="compatText">Compatible! ${donor} can donate to ${recipient}</span>`;
    } else {
        resultBox.className = 'compat-result not-compatible';
        resultBox.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span id="compatText">Not Compatible. ${donor} cannot donate to ${recipient}</span>`;
    }
}

// Emergency Response Handlers
function sendAlert() {
    showToast('Emergency request accepted! Contact details sent.');
}

function shareAlert() {
    if (navigator.share) {
        navigator.share({
            title: 'Urgent Blood Needed',
            text: 'O- Blood Required at Apollo Hospital, Hyderabad.',
            url: window.location.href
        }).then(() => {
            showToast('Alert shared successfully!');
        }).catch(() => {
            showToast('Copied alert link to clipboard!');
        });
    } else {
        showToast('Alert link copied to clipboard!');
    }
}


// ===== DONOR REGISTRATION & SEARCH =====
let activeSortCriteria = 'distance';

function renderDonorGrid() {
    const grid = document.getElementById('donorGrid');
    const countBadge = document.getElementById('donorCount');
    const searchVal = document.getElementById('donorSearch').value.toLowerCase();
    const filterVal = document.getElementById('bloodFilter').value;

    grid.innerHTML = '';

    // Filter
    let filtered = donors.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchVal) || d.location.toLowerCase().includes(searchVal);
        const matchesBlood = filterVal === '' || d.type === filterVal;
        return matchesSearch && matchesBlood;
    });

    // Sort
    if (activeSortCriteria === 'distance') {
        filtered.sort((a, b) => a.distance - b.distance);
    } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    countBadge.innerText = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; padding:40px; text-align:center; color:var(--text-muted)">No donors found matching criteria.</div>`;
        return;
    }


}

function filterDonors() {
    renderDonorGrid();
}

function sortDonors(criteria, element) {
    activeSortCriteria = criteria;
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    renderDonorGrid();
}


function checkEligibility() {

    const age = document.getElementById('ageEligible').value;
    const weight = document.getElementById('weightEligible').value;
    const recent = document.getElementById('recentDonation').value;

    const result = document.getElementById('eligibilityResult');
    const progress = document.getElementById('eligibilityProgress');
    const step = document.getElementById('eligibilityStep');
    document.getElementById("donorRegisterForm").style.display = "none";

    if (!age || !weight || !recent) {

    progress.style.width = "0%";

    step.innerHTML =
    "Complete all eligibility questions";

    result.innerHTML =
    "⚠️ Please answer all questions";

    result.style.color = "#f59e0b";

    return;
}

    if (
        age === "yes" &&
        weight === "yes" &&
        recent === "no"
    ) {

        result.innerHTML = "✅ Eligible To Donate";
        result.style.color = "#22c55e";
        progress.style.width = "100%";

        step.innerHTML = "All checks completed successfully";

        document.getElementById(
        "donorRegisterForm"
        ).style.display = "block";
        
        document.getElementById("donorRegisterForm").scrollIntoView({behavior: "smooth"});

    } else {

        result.innerHTML = "❌ Not Eligible To Donate";
        result.style.color = "#ef4444";
        progress.style.width = "100%";

        step.innerHTML = "Eligibility requirements not met";

        document.getElementById(
        "donorRegisterForm"
        ).style.display = "none";
    }
}

function registerDonor() {
    const name = document.getElementById('dName').value.trim();
    const type = document.getElementById('dBlood').value;
    const age = document.getElementById('dAge').value;
    const phone = document.getElementById('dPhone').value.trim();
    const location = document.getElementById('dLocation').value.trim();
    const eligibilityText = document.getElementById('eligibilityResult').innerText;

    if (
        eligibilityText !== '✅ Eligible To Donate'
    ) {
        showToast(
        'Please pass Eligibility Check first.'
        );
        return;
    }

    if (!name || !type || !age || !phone || !location) {
        showToast('Please fill out all registration fields.');
        return;
    }

    if (age < 18 || age > 65) {
        showToast('Donor age must be between 18 and 65.');
        return;
    }

    // Add donor
    const newDonor = {
        name,
        type,
        age: parseInt(age),
        phone,
        location,
        distance: parseFloat((Math.random() * 5 + 0.5).toFixed(1))
    };

    donors.push(newDonor);
    showToast('Registration successful! Thank you.');
    
    // Clear fields
    document.getElementById('dName').value = '';
    document.getElementById('dBlood').value = '';
    document.getElementById('dAge').value = '';
    document.getElementById('dPhone').value = '';
    document.getElementById('dLocation').value = '';

    renderDonorGrid();
}

function callDonor(name) {
    showToast(`Connecting call to ${name}...`);
}


// ===== REQUESTS FLOW & OTP =====
let currentUrgency = 'normal';

function setUrgency(element, level) {
    const btns = document.querySelectorAll('.urgency-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    currentUrgency = level;
}

function renderRequestsList() {
    const list = document.getElementById('requestsList');
    const urgentCount = document.querySelector('.urgent-count');
    
    list.innerHTML = '';
    
    let criticalUrgentCount = 0;
    requests.forEach(r => {
        if (r.urgency === 'critical' || r.urgency === 'urgent') {
            criticalUrgentCount++;
        }

        const item = document.createElement('div');
        item.className = 'request-item';
        item.innerHTML = `
            <div class="request-item-left">
                <div class="request-blood-badge ${r.urgency === 'critical' ? 'critical-badge' : ''}">${r.type}</div>
                <div class="request-info">
                    <span class="request-patient">${r.name}</span>
                    <span class="request-hospital"><i class="fa-solid fa-hospital"></i> ${r.hospital} · ${r.location}</span>
                </div>
            </div>
            <div class="request-item-right">
                <span class="request-units">${r.units} Units</span>
                <span class="urgency-indicator ${r.urgency}">${r.urgency}</span>
            </div>
        `;
        list.appendChild(item);
    });

    urgentCount.innerText = criticalUrgentCount;
}

// Request submission
let pendingRequestData = null;

function submitRequest() {
    const name = document.getElementById('rName').value.trim();
    const type = document.getElementById('rBlood').value;
    const units = document.getElementById('rUnits').value;
    const phone = document.getElementById('rPhone').value.trim();
    const hospital = document.getElementById('rHospital').value.trim();
    const location = document.getElementById('rLocation').value.trim();

    if (!name || !type || !units || !phone || !hospital || !location) {
        showToast('Please fill out all request fields.');
        return;
    }

    pendingRequestData = { name, type, units: parseInt(units), phone, hospital, location, urgency: currentUrgency, time: 'Just now' };

    // Slide up OTP container
    const otpCard = document.getElementById('otpCard');
    otpCard.style.display = 'block';
    
    // Smooth scroll to OTP Card
    otpCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Clear digits and focus first
    const digits = document.querySelectorAll('.otp-input');
    digits.forEach(d => d.value = '');
    digits[0].focus();
    
    showToast('OTP sent to phone number.');
}

function otpNext(element) {
    if (element.value.length === 1) {
        const next = element.nextElementSibling;
        if (next && next.classList.contains('otp-input')) {
            next.focus();
        }
    }
}

function verifyOTP() {
    const digits = document.querySelectorAll('.otp-input');
    let otp = '';
    digits.forEach(d => otp += d.value);

    if (otp.length < 4) {
        showToast('Please enter the full 4-digit code.');
        return;
    }

    // Success
    requests.unshift(pendingRequestData);
    showToast('OTP Verified! Emergency Request Published.');

    // Reset Form
    document.getElementById('rName').value = '';
    document.getElementById('rBlood').value = '';
    document.getElementById('rUnits').value = '';
    document.getElementById('rPhone').value = '';
    document.getElementById('rHospital').value = '';
    document.getElementById('rLocation').value = '';
    
    document.getElementById('otpCard').style.display = 'none';
    pendingRequestData = null;

    renderRequestsList();
}

function resendOTP() {
    showToast('New OTP verification code sent.');
    const digits = document.querySelectorAll('.otp-input');
    digits.forEach(d => d.value = '');
    digits[0].focus();
}


// ===== DASHBOARD STATS & SVGS =====
function renderDonutChart() {
    const svg = document.getElementById('donutSvg');
    const legend = document.getElementById('donutLegend');
    
    svg.innerHTML = '';
    legend.innerHTML = '';

    let accumulatedPercent = 0;
    const radius = 70;
    const circumference = 2 * Math.PI * radius; // ~439.8

    donutData.forEach(item => {
        const value = item.value;
        const offset = circumference - (circumference * value) / 100;
        const angle = (accumulatedPercent / 100) * 360;

        // SVG circle segment
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke', item.color);
        circle.setAttribute('stroke-width', '18');
        circle.setAttribute('stroke-dasharray', circumference.toString());
        circle.setAttribute('stroke-dashoffset', circumference.toString()); // Starts at 0
        circle.setAttribute('transform', `rotate(${angle - 90} 100 100)`);
        circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        circle.style.cursor = 'pointer';

        // Add hover labels
        circle.addEventListener('mouseenter', () => {
            document.getElementById('donutVal').innerText = `${item.label}`;
            document.querySelector('.donut-center small').innerText = `${item.value}% Available`;
            circle.setAttribute('stroke-width', '24');
        });
        circle.addEventListener('mouseleave', () => {
            document.getElementById('donutVal').innerText = 'O+';
            document.querySelector('.donut-center small').innerText = 'Most Common';
            circle.setAttribute('stroke-width', '18');
        });

        svg.appendChild(circle);

        // Render legend item
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-label-wrap">
                <span class="legend-color" style="background:${item.color}"></span>
                <span>${item.label}</span>
            </div>
            <span>${item.value}%</span>
        `;
        legend.appendChild(legendItem);

        // Animate stroke load
        setTimeout(() => {
            circle.setAttribute('stroke-dashoffset', offset.toString());
        }, 100);

        accumulatedPercent += value;
    });
}

function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    feed.innerHTML = '';

    activityLogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = `
            <div class="feed-icon ${log.type}"><i class="fa-solid ${log.icon}"></i></div>
            <div class="feed-content">
                <span class="feed-title">${log.title}</span>
                <span>${log.desc}</span>
                <span class="feed-time"><i class="fa-regular fa-clock"></i> ${log.time}</span>
            </div>
        `;
        feed.appendChild(item);
    });
}


// ===== PROFILE RENDERS =====
function renderProfileContent() {
    // Render logged-in user profile details if available
    if (window.currentUserDetails) {
        const u = window.currentUserDetails;
        const initials = u.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        // Update hero elements
        document.querySelector('.profile-avatar').innerText = initials;
        document.querySelector('.profile-hero h2').innerText = u.fullName;
        document.querySelector('.profile-blood-badge').innerText = u.bloodGroup;
        
        // Update details card
        document.getElementById('profFullName').innerText = u.fullName;
        document.getElementById('profPhone').innerText = u.phone;
        document.getElementById('profAge').innerText = u.age;
        document.getElementById('profGender').innerText = u.gender;
        document.getElementById('profBlood').innerText = u.bloodGroup;
        document.getElementById('profWeight').innerText = u.weight + " kg";
        document.getElementById('profLastDonation').innerText = u.lastDonation === 'yes' ? 'Yes' : 'No';
    }

    // Donation History
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    historyLogs.forEach(h => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-item-left">
                <div class="history-icon"><i class="fa-solid fa-circle-check"></i></div>
                <div class="history-info">
                    <span class="history-hospital">${h.hospital}</span>
                    <span class="history-date">${h.date}</span>
                </div>
            </div>
            <span class="history-units">+${h.units} Unit</span>
        `;
        list.appendChild(item);
    });

    // Achievements Grid
    const achGrid = document.getElementById('achievementsGrid');
    achGrid.innerHTML = '';
    achievements.forEach(a => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.innerHTML = `
            <div class="ach-icon"><i class="fa-solid ${a.icon}"></i></div>
            <div class="ach-info">
                <span class="ach-title">${a.title}</span>
                <span class="ach-desc">${a.desc}</span>
            </div>
        `;
        achGrid.appendChild(card);
    });
}

// Open Edit Profile Modal
function openEditProfileModal() {
    if (!window.currentUserDetails) {
        showToast("Please log in first.");
        return;
    }
    const u = window.currentUserDetails;
    
    const contentHtml = `
        <div class="modal-form-title">
            <i class="fa-solid fa-user-pen"></i> Edit Profile Details
        </div>
        <div class="modal-form-body">
            <div class="input-group">
                <label>Full Name</label>
                <input type="text" id="editFullName" value="${u.fullName}">
            </div>
            
            <div class="modal-form-row">
                <div class="input-group">
                    <label>Age</label>
                    <input type="number" id="editAge" min="18" max="65" value="${u.age}">
                </div>
                <div class="input-group">
                    <label>Gender</label>
                    <select id="editGender">
                        <option value="Male" ${u.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${u.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${u.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
            </div>
            
            <div class="modal-form-row">
                <div class="input-group">
                    <label>Blood Group</label>
                    <select id="editBloodGroup">
                        <option ${u.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                        <option ${u.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                        <option ${u.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                        <option ${u.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                        <option ${u.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                        <option ${u.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                        <option ${u.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                        <option ${u.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Weight (kg)</label>
                    <input type="number" id="editWeight" value="${u.weight}">
                </div>
            </div>
            
            <div class="input-group">
                <label>Donated in last 3 months?</label>
                <select id="editLastDonation">
                    <option value="no" ${u.lastDonation === 'no' ? 'selected' : ''}>No</option>
                    <option value="yes" ${u.lastDonation === 'yes' ? 'selected' : ''}>Yes</option>
                </select>
            </div>
            
            <button class="btn-primary full-btn" onclick="saveProfileEdit()">
                <i class="fa-solid fa-floppy-disk"></i> Save Changes
            </button>
        </div>
    `;
    openModal(contentHtml);
}

// Save Profile Edit Changes (with local E2E re-encryption)
async function saveProfileEdit() {
    const fullName = document.getElementById('editFullName').value.trim();
    const age = document.getElementById('editAge').value.trim();
    const gender = document.getElementById('editGender').value;
    const bloodGroup = document.getElementById('editBloodGroup').value;
    const weight = document.getElementById('editWeight').value.trim();
    const lastDonation = document.getElementById('editLastDonation').value;

    if (!fullName || !age || !gender || !bloodGroup || !weight) {
        showToast('Please fill out all fields.');
        return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 18 || ageNum > 65) {
        showToast('Age must be between 18 and 65.');
        return;
    }

    const weightNum = parseFloat(weight);
    if (weightNum < 45) {
        showToast('Weight must be at least 45 kg.');
        return;
    }

    const u = window.currentUserDetails;
    const updatedData = {
        fullName,
        phone: u.phone,
        age: ageNum,
        gender,
        bloodGroup,
        weight: weightNum,
        lastDonation
    };

    try {
        showToast("Re-encrypting profile updates...");
        const encrypted = await encryptData(updatedData, sessionPassword);
        localStorage.setItem('user_data_' + u.phone, JSON.stringify(encrypted));
        
        window.currentUserDetails = updatedData;
        closeModal();
        
        renderProfileContent();
        updateAvatarUI(fullName);
        showToast("Profile updated and encrypted successfully!");
    } catch (e) {
        console.error("Re-encryption failed:", e);
        showToast("Failed to save changes due to encryption error.");
    }
}


// ===== MODAL OVERLAYS =====
function openModal(contentHtml) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    content.innerHTML = contentHtml;
    overlay.classList.add('active-modal');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active-modal');
}

// Connect modal close keys
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});


// ==========================================
// ===== LIVE LOCATION TRACKER SYSTEM =======
// ==========================================

const areaCoordinates = {
    'Madhapur, Hyd': { lat: 17.4483, lon: 78.3741 },
    'Secunderabad, Hyd': { lat: 17.4399, lon: 78.4983 },
    'Gachibowli, Hyd': { lat: 17.4401, lon: 78.3489 },
    'Jubilee Hills, Hyd': { lat: 17.4325, lon: 78.4070 }
};

let currentLat = null;
let currentLon = null;
let currentAddress = "Not tracked";
let watchId = null;

// Haversine formula to compute distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
}

// Map Lat/Lon to map coordinate percentages for visual movement
function updateMapCenter(lat, lon) {
    const minLat = 17.40;
    const maxLat = 17.48;
    const minLon = 78.30;
    const maxLon = 78.55;
    
    // Invert Y axis percentage because CSS absolute top runs top-to-bottom
    let leftPct = ((lon - minLon) / (maxLon - minLon)) * 100;
    let topPct = 100 - (((lat - minLat) / (maxLat - minLat)) * 100);
    
    leftPct = Math.max(5, Math.min(95, leftPct));
    topPct = Math.max(5, Math.min(95, topPct));
    
    const mapCenter = document.querySelector('.map-center');
    if (mapCenter) {
        mapCenter.style.left = `${leftPct}%`;
        mapCenter.style.top = `${topPct}%`;
        mapCenter.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }
}

// Update donor distances dynamically based on tracked coords
function updateDonorDistances() {
    if (currentLat === null || currentLon === null) return;
    
    donors.forEach(donor => {
        let areaCoords = areaCoordinates[donor.location];
        if (!areaCoords) {
            // Fallback checking
            const locLower = donor.location.toLowerCase();
            if (locLower.includes('madhapur')) areaCoords = areaCoordinates['Madhapur, Hyd'];
            else if (locLower.includes('secunderabad')) areaCoords = areaCoordinates['Secunderabad, Hyd'];
            else if (locLower.includes('gachibowli')) areaCoords = areaCoordinates['Gachibowli, Hyd'];
            else if (locLower.includes('jubilee')) areaCoords = areaCoordinates['Jubilee Hills, Hyd'];
            else {
                // Fallback to custom stable random coordinate nearby
                areaCoords = {
                    lat: currentLat + 0.02,
                    lon: currentLon - 0.015
                };
            }
        }
        donor.distance = calculateDistance(currentLat, currentLon, areaCoords.lat, areaCoords.lon);
    });
    
    // Rerender lists
    renderDonorGrid();
    updateMapTooltips();
}

// Update home page map tooltips with dynamic distances
function updateMapTooltips() {
    const pulses = document.querySelectorAll('#mapContainer .map-pulse');
    pulses.forEach((pulse, index) => {
        if (index < donors.length) {
            const donor = donors[index];
            const tooltip = pulse.querySelector('.map-tooltip');
            if (tooltip) {
                const nameOnly = donor.name.split(' ')[0];
                tooltip.innerText = `${nameOnly} · ${donor.type} (${donor.distance} km)`;
            }
        }
    });
}

// Call Google Geocoding API (with fallback to OpenStreetMap Nominatim reverse geocoding API)
function reverseGeocode(lat, lon) {
    const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GEMINI_API_KEY}`;
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    
    fetch(googleUrl)
    .then(res => {
        if (!res.ok) throw new Error("Google Maps Geocoding response not OK");
        return res.json();
    })
    .then(data => {
        if (data.status === "OK" && data.results && data.results[0]) {
            const fullAddress = data.results[0].formatted_address;
            const parts = fullAddress.split(', ');
            let shortAddress = parts.slice(0, 3).join(', ');
            document.getElementById('locAddress').innerText = shortAddress;
            currentAddress = shortAddress;
            console.log("Location resolved using Google Geocoding API.");
        } else {
            console.warn("Google Maps Geocoding failed status:", data.status, "Falling back to Nominatim...");
            throw new Error("Google API Status: " + data.status);
        }
    })
    .catch(err => {
        console.warn("Google Geocoding failed, trying Nominatim fallback:", err.message);
        // Fallback to Nominatim
        fetch(nominatimUrl, {
            headers: {
                'Accept-Language': 'en',
                'User-Agent': 'HemoBridgeApp/1.0'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.display_name) {
                const fullAddress = data.display_name;
                const parts = fullAddress.split(', ');
                let shortAddress = parts.slice(0, 3).join(', ');
                if (parts.length > 3) {
                    shortAddress += `, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
                }
                document.getElementById('locAddress').innerText = shortAddress;
                currentAddress = shortAddress;
            } else {
                document.getElementById('locAddress').innerText = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                currentAddress = `Hyderabad, coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            }
        })
        .catch(e => {
            console.error("Nominatim fallback also failed:", e);
            document.getElementById('locAddress').innerText = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            currentAddress = `Hyderabad (Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)})`;
        });
    });
}

// Geolocation watch controller
function toggleLocationTracking() {
    const trackBtn = document.getElementById('trackLocBtn');
    const liveBadge = document.getElementById('locationLiveBadge');
    
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        trackBtn.innerHTML = `<i class="fa-solid fa-location-arrow"></i> Track My Location`;
        trackBtn.className = 'btn-primary';
        liveBadge.innerHTML = `<i class="fa-solid fa-circle"></i> Off`;
        liveBadge.style.background = '#fee2e2';
        liveBadge.style.color = 'var(--primary)';
        showToast("Live location tracking paused.");
    } else {
        if (!navigator.geolocation) {
            showToast("Geolocation is not supported by your browser.");
            return;
        }
        
        trackBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Locating...`;
        
        // Reset simulate dropdown
        document.getElementById('locSimulate').value = "";
        
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                
                document.getElementById('locCoords').innerText = `${currentLat.toFixed(5)}, ${currentLon.toFixed(5)} (Accuracy: ${position.coords.accuracy.toFixed(0)}m)`;
                
                liveBadge.innerHTML = `<i class="fa-solid fa-circle" style="color:var(--success)"></i> Live`;
                liveBadge.style.background = '#d1fae5';
                liveBadge.style.color = '#065f46';
                
                trackBtn.innerHTML = `<i class="fa-solid fa-circle-stop"></i> Stop Tracking`;
                trackBtn.className = 'btn-outline';
                
                reverseGeocode(currentLat, currentLon);
                updateMapCenter(currentLat, currentLon);
                updateDonorDistances();
            },
            (error) => {
                console.error("Location error callback:", error);
                showToast("Could not locate device. Use Simulation Mode.");
                trackBtn.innerHTML = `<i class="fa-solid fa-location-arrow"></i> Track My Location`;
                trackBtn.className = 'btn-primary';
                watchId = null;
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    }
}

// Simulation selector handler
function simulateLocationChange(value) {
    if (!value) {
        document.getElementById('locCoords').innerText = "Not tracked";
        document.getElementById('locAddress').innerText = "Click 'Track My Location' or select a simulated area";
        currentLat = null;
        currentLon = null;
        updateDonorDistances();
        
        // Reset map center pin
        const mapCenter = document.querySelector('.map-center');
        if (mapCenter) {
            mapCenter.style.left = '50%';
            mapCenter.style.top = '50%';
        }
        return;
    }
    
    // Stop live tracking if enabled
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        const trackBtn = document.getElementById('trackLocBtn');
        trackBtn.innerHTML = `<i class="fa-solid fa-location-arrow"></i> Track My Location`;
        trackBtn.className = 'btn-primary';
    }
    
    const liveBadge = document.getElementById('locationLiveBadge');
    liveBadge.innerHTML = `<i class="fa-solid fa-circle" style="color:var(--warning)"></i> Sim`;
    liveBadge.style.background = '#fef3c7';
    liveBadge.style.color = '#92400e';
    
    let lat, lon, name;
    switch(value) {
        case 'madhapur':
            lat = 17.4483; lon = 78.3741;
            name = "Madhapur, Hyderabad, Telangana, India";
            break;
        case 'jubileehills':
            lat = 17.4325; lon = 78.4070;
            name = "Jubilee Hills, Hyderabad, Telangana, India";
            break;
        case 'gachibowli':
            lat = 17.4401; lon = 78.3489;
            name = "Gachibowli, Hyderabad, Telangana, India";
            break;
        case 'secunderabad':
            lat = 17.4399; lon = 78.4983;
            name = "Secunderabad, Hyderabad, Telangana, India";
            break;
    }
    
    currentLat = lat;
    currentLon = lon;
    currentAddress = name;
    
    document.getElementById('locCoords').innerText = `${lat.toFixed(5)}, ${lon.toFixed(5)} (Simulated)`;
    document.getElementById('locAddress').innerText = name;
    
    updateMapCenter(lat, lon);
    updateDonorDistances();
    showToast(`Simulation set to ${value.toUpperCase()}`);
}

// Form integration
function autofillLocation(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (currentAddress && currentAddress !== "Not tracked" && currentAddress !== "Click 'Track My Location' or select a simulated area") {
        input.value = currentAddress;
        showToast("Location input autofilled!");
    } else {
        showToast("Please enable Location tracking or Simulation first!");
    }
}


// ==========================================
// ========== AI GEMINI CHATBOT =============
// ==========================================

const GEMINI_API_KEY = "AIzaSyAulWwbPvPRavn8zQt34YL_UW33TskFTdI";
let chatOpen = false;
let chatHistory = [];

function toggleChatbot() {
    const panel = document.getElementById('chatPanel');
    const badge = document.getElementById('chatBadge');
    
    chatOpen = !chatOpen;
    if (chatOpen) {
        panel.style.display = 'flex';
        badge.style.display = 'none';
        
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            document.getElementById('chatInput').focus();
        }, 100);
    } else {
        panel.style.display = 'none';
    }
}

function handleChatKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function parseMarkdown(text) {
    let html = escapeHTML(text);
    // Simple markdown formatting translations
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\*\s+(.*?)$/gm, '• $1<br>');
    html = html.replace(/^-\s+(.*?)$/gm, '• $1<br>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function addChatMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = `
        <div class="msg-bubble">${sender === 'bot' ? parseMarkdown(text) : escapeHTML(text)}</div>
        <span class="msg-time">${timeStr}</span>
    `;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing-indicator';
    typingDiv.id = 'chatTypingIndicator';
    
    typingDiv.innerHTML = `
        <div class="msg-bubble">
            <div class="typing-indicator-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) indicator.remove();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    addChatMessage('user', text);
    input.value = '';
    
    showTypingIndicator();
    
    // System contextual instructions containing application state
    const systemPrompt = `You are HemoBot, a friendly virtual assistant for Hemo-Bridge. Hemo-Bridge is India's fastest blood matching network that connects donors and patients instantly during emergencies.
Your goal is to answer users' questions about blood donation, donor eligibility, compatibility, and Hemo-Bridge features.

Here is the CURRENT LIVE STATE of the application:
- Blood Stock Levels: ${JSON.stringify(bloodStock)}
- Registered Donors: ${JSON.stringify(donors.map(d => ({ name: d.name, type: d.type, age: d.age, location: d.location, distance_km: d.distance })))}
- Emergency Requests: ${JSON.stringify(requests.map(r => ({ patient: r.name, type: r.type, units: r.units, hospital: r.hospital, location: r.location, urgency: r.urgency })))}
- User Current Address: ${currentAddress ? currentAddress : "Not tracked"}
- User Coordinates: ${currentLat ? `${currentLat}, ${currentLon}` : "Not tracked"}

Rules:
1. Be helpful, concise, and empathetic.
2. If the user asks for nearest donors, list them sorted by their distance. Suggest contacting them via the 'Donors' page.
3. If there are emergency requests, mention them (especially critical or urgent ones).
4. If asked about compatibility, explain correctly. Keep in mind: O- is the universal donor, AB+ is the universal recipient.
5. Do not hallucinate data that is not in the live state. Refer to the registered donors and active requests directly.
`;

    chatHistory.push({ role: 'user', parts: [{ text: text }] });
    
    const requestBody = {
        contents: [...chatHistory],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
        }
    };
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        removeTypingIndicator();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const botResponse = data.candidates[0].content.parts[0].text;
            addChatMessage('bot', botResponse);
            chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });
        } else {
            console.error("Gemini response structure invalid:", data);
            addChatMessage('bot', "I ran into a bit of trouble connecting to my brain. Please try messaging me again!");
        }
    } catch (err) {
        console.error("Gemini API call failed:", err);
        removeTypingIndicator();
        addChatMessage('bot', "I'm having trouble connecting right now. Please verify your internet connection or check back in a moment.");
    }
}

function sendQuickQuery(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

// Seed default user (Akshay Kumar) into localStorage on load
async function seedDefaultUser() {
    const defaultPhone = "9876543210";
    if (!localStorage.getItem('user_data_' + defaultPhone)) {
        const defaultUser = {
            fullName: "Akshay Kumar",
            phone: defaultPhone,
            age: 28,
            gender: "Male",
            bloodGroup: "O+",
            weight: 75,
            lastDonation: "no"
        };
        try {
            const encrypted = await encryptData(defaultUser, "password");
            localStorage.setItem('user_data_' + defaultPhone, JSON.stringify(encrypted));
            console.log("Default user seeded successfully.");
        } catch (e) {
            console.error("Failed to seed default user:", e);
        }
    }
}
seedDefaultUser();