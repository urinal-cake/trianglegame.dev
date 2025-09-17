// Global variables
let scene, camera, renderer, triangle, particles;
const carousels = {};
const autoScrollIntervals = {};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Initialize Three.js
    initThreeJS();
    
    // Populate content
    populateContent();
    
    // Setup navigation
    setupNavigation();
    
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
            <h3>${event.name}</h3>
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
    
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'carousel-nav';
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
    
    carouselContainer.appendChild(leftArrow);
    carouselContainer.appendChild(horizontalCarousel);
    carouselContainer.appendChild(rightArrow);
    carouselContainer.appendChild(indicator);
    
    container.appendChild(carouselContainer);
    
    // Create carousel items
    createCarouselItems(carouselId);
    
    // Initialize display and auto-scroll
    updateCarousel(carouselId);
    startAutoScroll(carouselId);
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
        
        let content = '';
        if (carouselId === 'companies') {
            content = `
                <a href="${item.url}" target="_blank" class="card-link">
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
                <a href="${item.url}" target="_blank" class="card-link">
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
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.scroll-section');
    
    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const sectionIndex = parseInt(button.getAttribute('data-section'));
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            if (sections[sectionIndex]) {
                sections[sectionIndex].classList.add('active');
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (triangle) {
        triangle.rotation.y += 0.005;
        triangle.rotation.x += 0.002;
    }
    
    if (particles) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
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