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


// ===== NAVIGATION & TRANSITIONS =====
function openDashboard() {
    const splash = document.getElementById('splash');
    const mainApp = document.getElementById('mainApp');
    
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    
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
}

// Close notifications when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notifPanel');
    const bell = document.getElementById('notifBell');
    if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
        panel.style.display = 'none';
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

    filtered.forEach(d => {
        const card = document.createElement('div');
        card.className = 'donor-card';
        card.innerHTML = `
            <div class="top">
                <div class="avatar">${d.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="info">
                    <span class="name">${d.name}</span>
                    <span class="details">Age: ${d.age} · ${d.location}</span>
                </div>
            </div>
            <div class="bottom">
                <span class="blood-type">${d.type}</span>
                <span class="distance"><i class="fa-solid fa-location-dot"></i> ${d.distance} km</span>
                <button class="call-btn" onclick="callDonor('${d.name}')"><i class="fa-solid fa-phone"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
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

function registerDonor() {
    const name = document.getElementById('dName').value.trim();
    const type = document.getElementById('dBlood').value;
    const age = document.getElementById('dAge').value;
    const phone = document.getElementById('dPhone').value.trim();
    const location = document.getElementById('dLocation').value.trim();

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

// Call OpenStreetMap Nominatim reverse geocoding API
function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    
    fetch(url, {
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
            // Fetch clean shorter city/area representation
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
    .catch(err => {
        console.error("Geocoding fetch failed:", err);
        document.getElementById('locAddress').innerText = `Location coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        currentAddress = `Hyderabad (Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)})`;
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