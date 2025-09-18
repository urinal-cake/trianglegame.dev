// Global variables
let scene, camera, renderer, triangle, particles;
const carousels = {};
const autoScrollIntervals = {};
let isTransitioning = false;
let originalTriangleY = 0;
// motionOverride: 'on' | 'off' (default On)
let motionOverride = 'on';
let currentSectionIndex = 0; // 0=intro, 1=events, 2=groups, 3=companies

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
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
});

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
    triangle.scale.set(2, 2, 2);
    originalTriangleY = triangle.position.y; // Store original position
    scene.add(triangle);
    
    // Create particles
    createParticles();
}

function createParticles() {
    const particleCount = 100;
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
    // Populate events
    const eventsContent = document.getElementById('events-content');
    if (eventsContent && typeof events !== 'undefined') {
        createEventsGrid(eventsContent);
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

function createEventsGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'events-grid';
    
    events.forEach((event, index) => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        eventCard.innerHTML = `
            <h3><a href="${event.url}" target="_blank" class="event-title-link">${event.name}</a></h3>
            <div class="event-organizer">Hosted by ${event.organizer}</div>
            <div class="event-meta">
                <span>📅 ${formattedDate}</span>
                <span>🕐 ${event.time}</span>
                <span>📍 ${event.location}</span>
            </div>
            <div class="event-description">${event.description}</div>
        `;
        
        grid.appendChild(eventCard);
    });
    
    container.appendChild(grid);
}

function createHorizontalCarousel(container, items, carouselId) {
    if (!items || items.length === 0) {
        container.innerHTML = '<p style="color: #ff6b6b;">No items to display</p>';
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
        console.error(`Carousel not found: ${carouselId}`);
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
            content = `
                <a href="${item.url}" target="_blank" class="card-link" aria-label="${item.name} - ${item.locationType}">
                    <div class="content-card company-card">
                        <div class="company-logo">
                            <img src="${item.logo}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div class="logo-fallback" style="display:none;">${item.name.charAt(0)}</div>
                        </div>
                        <h3>${item.name}</h3>
                    </div>
                    <div class="location-tag ${item.locationType.toLowerCase().replace(' ', '-')}">${item.locationType}</div>
                </a>
            `;
        } else if (carouselId === 'groups') {
            content = `
                <a href="${item.url}" target="_blank" class="card-link" aria-label="${item.name} - ${item.type}">
                    <div class="content-card group-card">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="group-type-tag">${item.type}</div>
                </a>
            `;
        } else if (carouselId === 'schools') {
            content = `
                <a href="${item.url}" target="_blank" class="card-link" aria-label="${item.name} - ${item.type}">
                    <div class="content-card group-card">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="group-type-tag">${item.type}</div>
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
    
    // Determine items per view and percentage per item based on carousel type
    const itemsPerView = carouselId === 'companies' ? 5 : 4;
    const percentagePerItem = carouselId === 'companies' ? 20 : 25;
    
    // Move the track using translateX
    const translateX = -carousel.currentIndex * percentagePerItem;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update indicator - show the leftmost visible item number
    if (indicator) {
        const leftmostVisible = carousel.currentIndex + 1;
        const rightmostVisible = Math.min(carousel.currentIndex + itemsPerView, carousel.items.length);
        indicator.textContent = `${leftmostVisible}-${rightmostVisible} / ${carousel.items.length}`;
        indicator.setAttribute('aria-label', `Showing items ${leftmostVisible} to ${rightmostVisible} of ${carousel.items.length}`);
    }
}

function navigateCarousel(carouselId, direction) {
    const carousel = carousels[carouselId];
    if (!carousel) return;
    
    carousel.currentIndex += direction;
    
    // Calculate the maximum index based on carousel type
    const itemsPerView = carouselId === 'companies' ? 5 : 4;
    const maxIndex = Math.max(0, carousel.items.length - itemsPerView);
    
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
    }, 4000);
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
                
                // Start phase 2 after leaving section completes (400ms)
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
                }, phase2StartDelay);
                
                animatePyramidPhase1();
            }
            
            function startSectionTransition(currentActive, nextSection) {
                console.log('Starting section transition:', currentActive.id, '→', nextSection.id);
                
                // Start leaving animation immediately
                currentActive.classList.remove('active');
                currentActive.classList.add('leaving');
                console.log('Applied leaving to:', currentActive.id, 'classes:', currentActive.className);
                
                // Start entering section with animation class
                nextSection.classList.add('entering', 'active');
                console.log('Applied entering + active to:', nextSection.id, 'classes:', nextSection.className);

                // Clean up leaving section after its animation finishes (400ms)
                setTimeout(() => {
                    currentActive.classList.remove('leaving');
                    console.log('Cleaned up leaving from:', currentActive.id);
                }, 400);
                
                // Clean up entering section after its animation finishes (600ms)
                setTimeout(() => {
                    nextSection.classList.remove('entering');
                    console.log('Cleaned up entering from:', nextSection.id);
                }, 600);
            }
            
            function checkTransitionComplete() {
                // End transition after both animations complete
                // Longest duration is entering section (600ms) + small buffer
                setTimeout(() => {
                    isTransitioning = false;
                }, 650);
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
function prefersReducedMotion() { return false; }

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