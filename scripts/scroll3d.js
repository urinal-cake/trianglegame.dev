// Configuration constants
const CONFIG = {
    PARTICLE_COUNT: 100,
    AUTO_SCROLL_INTERVAL: 4000, // 4 seconds
    PYRAMID_SCALE: 2,
    MONTHS_TO_SHOW: 3,
    // Animation timing constants
    SECTION_LEAVE_DURATION: 400,  // ms for section leaving animation
    SECTION_ENTER_DURATION: 600,  // ms for section entering animation
    TRANSITION_BUFFER: 50,        // ms buffer for transition completion
    PYRAMID_PHASE2_DELAY: 400     // ms delay before pyramid phase 2 starts
};

// Global variables
let scene, camera, renderer, triangle, particles;
const carousels = {};
const autoScrollIntervals = {};
let isTransitioning = false;
let originalTriangleY = 0;
// motionOverride: 'on' | 'off' (default On)
let motionOverride = 'on';
let currentSectionIndex = 0; // 0=intro, 1=events, 2=groups, 3=schools, 4=companies

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCarouselConfig(carouselId) {
    if (carouselId === 'companies') {
        return { itemsPerView: 5, percentagePerItem: 20 };
    } else if (carouselId === 'groups') {
        return { itemsPerView: 3, percentagePerItem: 33.333 };
    } else {
        return { itemsPerView: 4, percentagePerItem: 25 }; // schools
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js
    initThreeJS();
    
    // Populate content
    populateContent();
    
    // Setup navigation
    setupNavigation();

    // Setup motion toggle
    setupMotionToggle();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle page unload for cleanup
    window.addEventListener('beforeunload', cleanup);
});

function cleanup() {
    // Clean up Three.js resources
    if (renderer) {
        renderer.dispose();
    }
    if (triangle && triangle.geometry) {
        triangle.geometry.dispose();
    }
    if (triangle && triangle.material) {
        triangle.material.dispose();
    }
    if (particles && particles.geometry) {
        particles.geometry.dispose();
    }
    if (particles && particles.material) {
        particles.material.dispose();
    }
    
    // Stop all auto-scroll intervals
    Object.values(autoScrollIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
    });
}

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add to DOM
    const container = document.getElementById('scene-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }
    
    // Create triangular pyramid (tetrahedron)
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    
    triangle = new THREE.Mesh(geometry, material);
    triangle.scale.set(CONFIG.PYRAMID_SCALE, CONFIG.PYRAMID_SCALE, CONFIG.PYRAMID_SCALE);
    originalTriangleY = triangle.position.y; // Store original position
    scene.add(triangle);
    
    // Create particles
    createParticles();
}

function createParticles() {
    const particleCount = CONFIG.PARTICLE_COUNT;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function populateContent() {
    // Populate events with calendar view
    const eventsContent = document.getElementById('events-content');
    if (eventsContent && typeof events !== 'undefined') {
        createEventsCalendar(eventsContent);
    }
    
    // Populate groups
    const groupsContent = document.getElementById('groups-content');
    if (groupsContent && typeof groups !== 'undefined') {
        createHorizontalCarousel(groupsContent, groups, 'groups');
    }
    
    // Populate schools
    const schoolsContent = document.getElementById('schools-content');
    if (schoolsContent && typeof schools !== 'undefined') {
        createHorizontalCarousel(schoolsContent, schools, 'schools');
    }

    // Populate companies
    const companiesContent = document.getElementById('companies-content');
    if (companiesContent && typeof companies !== 'undefined') {
        createHorizontalCarousel(companiesContent, companies, 'companies');
    }
}

function createEventsCalendar(container) {
    const calendarWrapper = document.createElement('div');
    calendarWrapper.className = 'calendar-wrapper';
    
    // Get current date info
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Create calendar for current month and next months
    for (let i = 0; i < CONFIG.MONTHS_TO_SHOW; i++) {
        const monthDate = new Date(currentYear, currentMonth + i, 1);
        const monthCalendar = createMonthCalendar(monthDate, events);
        calendarWrapper.appendChild(monthCalendar);
    }
    
    container.appendChild(calendarWrapper);
}

function createMonthCalendar(monthDate, events) {
    const monthContainer = document.createElement('div');
    monthContainer.className = 'month-calendar';
    
    // Month header
    const monthHeader = document.createElement('h3');
    monthHeader.className = 'calendar-month-header';
    monthHeader.textContent = monthDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    monthContainer.appendChild(monthHeader);
    
    // Days of week header
    const daysHeader = document.createElement('div');
    daysHeader.className = 'calendar-days-header';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day-name';
        dayElement.textContent = day;
        daysHeader.appendChild(dayElement);
    });
    monthContainer.appendChild(daysHeader);
    
    // Calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';
    
    // Month names array
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get month info
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Filter events for this month
    const monthEvents = events.filter(event => {
        const eventDate = parseLocalDate(event.date);
        return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
    
    // Create events lookup by date
    const eventsByDate = {};
    monthEvents.forEach(event => {
        const eventDate = parseLocalDate(event.date);
        const dateKey = eventDate.getDate();
        if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add events for this day
        if (eventsByDate[day]) {
            dayElement.classList.add('has-events');
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            // Add day click handler for multiple events
            dayElement.addEventListener('click', (e) => {
                // Show events popup for any click on the day (including dots)
                showDayEventsPopup(eventsByDate[day], day, monthNames[month], year);
            });

            eventsByDate[day].forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                eventDot.title = `${event.name} - ${event.time}`;
                
                // Event dots are just visual indicators - no click handlers
                
                eventsContainer.appendChild(eventDot);
            });
            
            dayElement.appendChild(eventsContainer);
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    monthContainer.appendChild(calendarGrid);
    return monthContainer;
}

// Show day events popup with carousel
function showDayEventsPopup(dayEvents, day, monthName, year) {
    // Hide the calendar
    const calendarWrapper = document.querySelector('.calendar-wrapper');
    if (calendarWrapper) {
        calendarWrapper.classList.add('popup-open');
    }
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'event-popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'event-popup day-events-popup';
    
    const dayTitle = `${monthName} ${day}, ${year}`;
    
    // Determine if we need navigation (more than 1 event)
    const showNavigation = dayEvents.length > 1;
    
    popup.innerHTML = `
        <div class="popup-header">
            <h4>Events on ${dayTitle}</h4>
            <button class="popup-close" aria-label="Close">&times;</button>
        </div>
        <div class="popup-content">
            <div class="day-events-carousel" id="day-events-carousel">
                <!-- Events will be inserted here -->
            </div>
            ${showNavigation ? `
            <div class="carousel-navigation" id="day-events-nav">
                <span class="carousel-indicator" id="day-events-indicator">1 of ${dayEvents.length}</span>
            </div>
            ` : ''}
        </div>
    `;
    
    // Add navigation arrows outside the popup if needed
    if (showNavigation) {
        const prevArrow = document.createElement('button');
        prevArrow.className = 'carousel-nav prev';
        prevArrow.id = 'day-events-prev';
        prevArrow.setAttribute('aria-label', 'Previous event');
        prevArrow.innerHTML = '‹';
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'carousel-nav next';
        nextArrow.id = 'day-events-next';
        nextArrow.setAttribute('aria-label', 'Next event');
        nextArrow.innerHTML = '›';
        
        overlay.appendChild(prevArrow);
        overlay.appendChild(nextArrow);
    }
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Initialize the events carousel
    const carouselContainer = popup.querySelector('#day-events-carousel');
    createDayEventsCarousel(carouselContainer, dayEvents);
    
    // Function to close popup and show calendar
    function closePopup() {
        // Show the calendar again
        if (calendarWrapper) {
            calendarWrapper.classList.remove('popup-open');
        }
        document.body.removeChild(overlay);
    }
    
    // Close handlers
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', closePopup);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });
    
    // ESC key handler
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Create carousel for day events
function createDayEventsCarousel(container, events) {
    if (!events || events.length === 0) {
        container.textContent = 'No events found for this day.';
        return;
    }
    
    let currentIndex = 0;
    
    function renderCurrentEvent() {
        const event = events[currentIndex];
        const eventDate = parseLocalDate(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const eventHTML = `
            <div class="day-event-card">
                <h5>${escapeHtml(event.name || 'Untitled Event')}</h5>
                <div class="popup-organizer">by ${escapeHtml(event.organizer || 'Unknown Organizer')}</div>
                <div class="popup-datetime">
                    <span>📅 ${formattedDate}</span>
                    <span>🕐 ${escapeHtml(event.time || 'Time TBD')}</span>
                </div>
                <div class="popup-location">📍 ${escapeHtml(event.location || 'Location TBD')}</div>
                <div class="popup-description">${escapeHtml(event.description || 'No description available')}</div>
                <a href="${escapeHtml(event.url || '#')}" target="_blank" class="popup-link">View Event Details</a>
            </div>
        `;
        
        container.innerHTML = eventHTML;
        
        // Update indicator
        const indicator = document.querySelector('#day-events-indicator');
        if (indicator) {
            indicator.textContent = `${currentIndex + 1} of ${events.length}`;
        }
        
        // Update navigation buttons
        const prevBtn = document.querySelector('#day-events-prev');
        const nextBtn = document.querySelector('#day-events-next');
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === events.length - 1;
    }
    
    // Navigation handlers
    const prevBtn = document.querySelector('#day-events-prev');
    const nextBtn = document.querySelector('#day-events-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderCurrentEvent();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < events.length - 1) {
                currentIndex++;
                renderCurrentEvent();
            }
        });
    }
    
    // Keyboard navigation
    const keyHandler = (e) => {
        if (document.querySelector('.day-events-popup')) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                renderCurrentEvent();
            } else if (e.key === 'ArrowRight' && currentIndex < events.length - 1) {
                currentIndex++;
                renderCurrentEvent();
            }
        }
    };
    
    document.addEventListener('keydown', keyHandler);
    
    // Clean up event listener when popup is closed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                for (let node of mutation.removedNodes) {
                    if (node.classList && node.classList.contains('event-popup-overlay')) {
                        document.removeEventListener('keydown', keyHandler);
                        observer.disconnect();
                        break;
                    }
                }
            }
        });
    });
    observer.observe(document.body, { childList: true });
    
    // Initial render
    renderCurrentEvent();
}

function createHorizontalCarousel(container, items, carouselId) {
    if (!items || items.length === 0) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#ff6b6b';
        errorMsg.textContent = 'No items to display';
        container.appendChild(errorMsg);
        return;
    }
    
    // Initialize carousel data
    carousels[carouselId] = { 
        items: items, 
        currentIndex: 0 
    };
    
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'carousel-nav';
    leftArrow.setAttribute('aria-label', 'Previous');
    leftArrow.innerHTML = '←';
    leftArrow.onclick = () => {
        stopAutoScroll(carouselId);
        navigateCarousel(carouselId, -1);
        startAutoScroll(carouselId);
    };
    
    // Horizontal carousel area
    const horizontalCarousel = document.createElement('div');
    horizontalCarousel.className = 'horizontal-carousel';
    horizontalCarousel.id = `carousel-${carouselId}`;
    horizontalCarousel.setAttribute('role', 'region');
    horizontalCarousel.setAttribute('aria-roledescription', 'carousel');
    horizontalCarousel.setAttribute('aria-label', `${carouselId} carousel`);
    horizontalCarousel.setAttribute('tabindex', '0');
    
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'carousel-nav';
    rightArrow.setAttribute('aria-label', 'Next');
    rightArrow.innerHTML = '→';
    rightArrow.onclick = () => {
        stopAutoScroll(carouselId);
        navigateCarousel(carouselId, 1);
        startAutoScroll(carouselId);
    };
    
    // Indicator
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator';
    indicator.id = `indicator-${carouselId}`;
    indicator.setAttribute('aria-live', 'polite');
    
    carouselContainer.appendChild(leftArrow);
    carouselContainer.appendChild(horizontalCarousel);
    carouselContainer.appendChild(rightArrow);
    carouselContainer.appendChild(indicator);
    
    container.appendChild(carouselContainer);
    
    // Create carousel items
    createCarouselItems(carouselId);
    
    // Initialize display and auto-scroll
    updateCarousel(carouselId);
    if (shouldAnimate()) {
        startAutoScroll(carouselId);
    }

    // Pause auto-scroll when interacting with carousel
    carouselContainer.addEventListener('mouseenter', () => stopAutoScroll(carouselId));
    carouselContainer.addEventListener('mouseleave', () => {
        if (shouldAnimate()) startAutoScroll(carouselId);
    });
    carouselContainer.addEventListener('focusin', () => stopAutoScroll(carouselId));
    carouselContainer.addEventListener('focusout', () => {
        if (shouldAnimate()) startAutoScroll(carouselId);
    });

    // Keyboard navigation for carousel region
    horizontalCarousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stopAutoScroll(carouselId);
            navigateCarousel(carouselId, -1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            stopAutoScroll(carouselId);
            navigateCarousel(carouselId, 1);
        }
    });
}

function createCarouselItems(carouselId) {
    const carousel = carousels[carouselId];
    const carouselElement = document.getElementById(`carousel-${carouselId}`);
    
    if (!carousel || !carouselElement) {
        return;
    }
    
    // Clear existing content and create track
    carouselElement.innerHTML = '';
    
    const track = document.createElement('div');
    track.className = 'carousel-track';
    track.id = `track-${carouselId}`;
    
    carousel.items.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'carousel-item';
    itemElement.id = `item-${carouselId}-${index}`;
    itemElement.setAttribute('role', 'group');
    itemElement.setAttribute('aria-roledescription', 'slide');
    itemElement.setAttribute('aria-label', `${index + 1} of ${carousel.items.length}`);
        
        let content = '';
        if (carouselId === 'companies') {
            const locationType = item.locationType || 'Unknown';
            const locationClass = locationType.toLowerCase().replace(' ', '-');
            content = `
                <a href="${escapeHtml(item.url || '#')}" target="_blank" class="card-link" aria-label="${escapeHtml(item.name || 'Company')} - ${escapeHtml(locationType)}">
                    <div class="content-card company-card">
                        <div class="company-logo">
                            <img src="${escapeHtml(item.logo || '')}" alt="${escapeHtml(item.name || 'Company')}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div class="logo-fallback" style="display:none;">${escapeHtml((item.name || 'C').charAt(0))}</div>
                        </div>
                        <h3>${escapeHtml(item.name || 'Unknown Company')}</h3>
                        <div class="location-tag ${escapeHtml(locationClass)}">${escapeHtml(locationType)}</div>
                    </div>
                </a>
            `;
        } else if (carouselId === 'groups') {
            // Special handling for Triangle Area Supper Club and Triangle Interactive Arts Collective
            const itemName = item.name || 'Unknown Group';
            const isTASC = itemName === "TASC";
            const isTIAC = itemName === "Triangle Interactive";
            let titleClass = "";
            if (isTASC) titleClass = "tasc-logo";
            if (isTIAC) titleClass = "tiac-logo";
            
            // Check if group has a logo
            const logoHtml = item.logo ? `
                <div class="group-logo">
                    <img src="${escapeHtml(item.logo)}" alt="${escapeHtml(itemName)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="logo-fallback" style="display:none;">${escapeHtml(itemName.charAt(0))}</div>
                </div>
            ` : '';
            
            content = `
                <a href="${escapeHtml(item.url || '#')}" target="_blank" class="card-link" aria-label="${escapeHtml(itemName)} - ${escapeHtml(item.type || 'Group')}">
                    <div class="content-card group-card">
                        ${logoHtml}
                        <h3 class="${titleClass}">${escapeHtml(itemName)}</h3>
                        <p>${escapeHtml(item.description || 'No description available')}</p>
                        <div class="group-type-tag">${escapeHtml(item.type || 'Group')}</div>
                    </div>
                </a>
            `;
        } else if (carouselId === 'schools') {
            content = `
                <a href="${escapeHtml(item.url || '#')}" target="_blank" class="card-link" aria-label="${escapeHtml(item.name || 'School')} - ${escapeHtml(item.type || 'School')}">
                    <div class="content-card group-card">
                        <h3>${escapeHtml(item.name || 'Unknown School')}</h3>
                        <p>${escapeHtml(item.description || 'No description available')}</p>
                        <div class="school-type-tag">${escapeHtml(item.type || 'School')}</div>
                    </div>
                </a>
            `;
        }
        
        itemElement.innerHTML = content;
        track.appendChild(itemElement);
    });
    
    carouselElement.appendChild(track);
}

function updateCarousel(carouselId) {
    const carousel = carousels[carouselId];
    const indicator = document.getElementById(`indicator-${carouselId}`);
    const track = document.getElementById(`track-${carouselId}`);
    
    if (!carousel || !track) return;
    
    // Get carousel configuration
    const config = getCarouselConfig(carouselId);
    
    // Move the track using margin-left instead of transform to avoid blocking backdrop-filter
    const translateX = -carousel.currentIndex * config.percentagePerItem;
    track.style.marginLeft = `${translateX}%`;
    
    // Update indicator - show the leftmost visible item number
    if (indicator) {
        const leftmostVisible = carousel.currentIndex + 1;
        const rightmostVisible = Math.min(carousel.currentIndex + config.itemsPerView, carousel.items.length);
        indicator.textContent = `${leftmostVisible}-${rightmostVisible} / ${carousel.items.length}`;
        indicator.setAttribute('aria-label', `Showing items ${leftmostVisible} to ${rightmostVisible} of ${carousel.items.length}`);
    }
}

function navigateCarousel(carouselId, direction) {
    const carousel = carousels[carouselId];
    if (!carousel) return;
    
    carousel.currentIndex += direction;
    
    // Get carousel configuration
    const config = getCarouselConfig(carouselId);
    const maxIndex = Math.max(0, carousel.items.length - config.itemsPerView);
    
    if (carousel.currentIndex > maxIndex) {
        carousel.currentIndex = 0; // Wrap to beginning
    } else if (carousel.currentIndex < 0) {
        carousel.currentIndex = maxIndex; // Wrap to end
    }
    
    updateCarousel(carouselId);
}

function startAutoScroll(carouselId) {
    stopAutoScroll(carouselId);
    autoScrollIntervals[carouselId] = setInterval(() => {
        navigateCarousel(carouselId, 1);
    }, CONFIG.AUTO_SCROLL_INTERVAL);
}

function stopAutoScroll(carouselId) {
    if (autoScrollIntervals[carouselId]) {
        clearInterval(autoScrollIntervals[carouselId]);
        delete autoScrollIntervals[carouselId];
    }
}

function setupNavigation() {
    // Only bind to section buttons, exclude the motion toggle
    const navButtons = document.querySelectorAll('.nav-btn[data-section]');
    const sections = document.querySelectorAll('.scroll-section');
    
    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (isTransitioning) return; // Prevent multiple clicks during transition
            
            const sectionIndex = parseInt(button.getAttribute('data-section'));
            
            // Start transition
            isTransitioning = true;
            
            // Update active button and aria-pressed immediately
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            // Get sections for transition
            const currentActive = document.querySelector('.scroll-section.active');
            const nextSection = sections[sectionIndex] || null;
            
            // Start both animations simultaneously if motion is enabled
            if (shouldAnimate()) {
                // Start pyramid animation
                if (triangle) {
                    startPyramidTransition();
                }
                
                // Start section content transition
                if (currentActive && nextSection && currentActive !== nextSection) {
                    startSectionTransition(currentActive, nextSection);
                } else {
                    // No content animation needed, just activate section
                    sections.forEach(section => section.classList.remove('active', 'entering', 'leaving'));
                    if (nextSection) nextSection.classList.add('active');
                }
                
                // Set transition completion
                checkTransitionComplete();
            } else {
                // Motion is off - just switch sections immediately
                sections.forEach(section => section.classList.remove('active', 'entering', 'leaving'));
                if (nextSection) nextSection.classList.add('active');
                isTransitioning = false;
            }
            
            // Manage carousel auto-scroll based on visibility
            handleSectionChange(currentSectionIndex, sectionIndex);
            currentSectionIndex = sectionIndex;
            
            function startPyramidTransition() {
                // Animate pyramid up and off-screen, then back from bottom
                const startY = triangle.position.y;
                const offScreenY = 15; // Move way up off-screen
                const finalY = originalTriangleY;
                const phase1Duration = 300; // 300ms to move off-screen
                const phase2Duration = 600; // 600ms to come back in
                const phase2StartDelay = 400; // Start phase 2 when leaving section finishes (400ms)
                const phase1StartTime = Date.now();
                
                function animatePyramidPhase1() {
                    const elapsed = Date.now() - phase1StartTime;
                    const progress = Math.min(elapsed / phase1Duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    
                    triangle.position.y = startY + (offScreenY - startY) * easeOut;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animatePyramidPhase1);
                    }
                }
                
                // Start phase 2 after leaving section completes
                setTimeout(() => {
                    triangle.position.y = -15; // Start from bottom
                    const phase2StartTime = Date.now();
                    
                    function animatePyramidPhase2() {
                        const elapsed = Date.now() - phase2StartTime;
                        const progress = Math.min(elapsed / phase2Duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        
                        triangle.position.y = -15 + (finalY + 15) * easeOut;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animatePyramidPhase2);
                        }
                    }
                    animatePyramidPhase2();
                }, CONFIG.PYRAMID_PHASE2_DELAY);
                
                animatePyramidPhase1();
            }
            
            function startSectionTransition(currentActive, nextSection) {
                // Start leaving animation immediately
                currentActive.classList.remove('active');
                currentActive.classList.add('leaving');
                
                // Start entering section with animation class
                nextSection.classList.add('entering', 'active');

                // Clean up leaving section after its animation finishes
                setTimeout(() => {
                    currentActive.classList.remove('leaving');
                }, CONFIG.SECTION_LEAVE_DURATION);
                
                // Clean up entering section after its animation finishes
                setTimeout(() => {
                    nextSection.classList.remove('entering');
                }, CONFIG.SECTION_ENTER_DURATION);
            }
            
            function checkTransitionComplete() {
                // End transition after both animations complete
                // Longest duration is entering section + small buffer
                setTimeout(() => {
                    isTransitioning = false;
                }, CONFIG.SECTION_ENTER_DURATION + CONFIG.TRANSITION_BUFFER);
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (triangle) {
        if (shouldAnimate()) {
            triangle.rotation.y += 0.005;
            triangle.rotation.x += 0.002;
        }
    }
    
    if (particles) {
        if (shouldAnimate()) {
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;
        }
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Motion helpers
// No OS preference integration; user toggle only

function loadMotionOverride() {
    try {
        const stored = localStorage.getItem('motionOverride');
        if (stored === 'on' || stored === 'off') {
            motionOverride = stored;
        }
    } catch (_) { /* ignore */ }
}

function saveMotionOverride() {
    try {
        localStorage.setItem('motionOverride', motionOverride);
    } catch (_) { /* ignore */ }
}

function shouldAnimate() {
    return motionOverride === 'on';
}

function setupMotionToggle() {
    loadMotionOverride();
    const btn = document.getElementById('motion-toggle');
    if (!btn) return;

    function renderState() {
        // Icon and aria based on state
        const icon = motionOverride === 'on' ? '✨' : '🚫';
        const label = motionOverride === 'on' ? 'Motion: On' : 'Motion: Off';
        btn.textContent = icon;
        btn.setAttribute('aria-label', label);
        btn.title = label;
        btn.setAttribute('aria-pressed', motionOverride === 'on' ? 'true' : 'false');
        // Reflect state on body to control CSS transitions
        document.body.classList.toggle('motion-on', motionOverride === 'on');
        document.body.classList.toggle('motion-off', motionOverride === 'off');
    }

    // Set initial body class state
    renderState();

    btn.addEventListener('click', () => {
        // Toggle On <-> Off
        motionOverride = motionOverride === 'on' ? 'off' : 'on';
        saveMotionOverride();
        renderState();

        // Apply to carousels (auto-scroll)
        Object.keys(autoScrollIntervals).forEach(id => stopAutoScroll(id));
        Object.keys(carousels).forEach(id => {
            if (shouldAnimate()) startAutoScroll(id);
        });
    });
}

// Stop/resume auto-scroll when sections change and ensure carousel DOM is ready
function handleSectionChange(prevIndex, nextIndex) {
    // Map section index to carousel IDs
    const prevId = indexToCarouselId(prevIndex);
    const nextId = indexToCarouselId(nextIndex);

    if (prevId) {
        stopAutoScroll(prevId);
    }
    if (nextId) {
        ensureCarouselReady(nextId);
        updateCarousel(nextId);
        if (shouldAnimate()) startAutoScroll(nextId);
    }
}

function indexToCarouselId(idx) {
    if (idx === 2) return 'groups';
    if (idx === 3) return 'schools';
    if (idx === 4) return 'companies';
    return null;
}

function ensureCarouselReady(carouselId) {
    const container = document.getElementById(`${carouselId}-content`);
    const track = document.getElementById(`track-${carouselId}`);
    if (!track && container && carousels[carouselId]) {
        // Rebuild items in case DOM was disrupted
        createCarouselItems(carouselId);
    }
}