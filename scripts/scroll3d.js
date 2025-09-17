// 3D Scroll Experience inspired by Neverland.agency
// Creates a triangle-themed journey through 3D space

let scene, camera, renderer, triangle;
let scrollProgress = 0;
let targetScrollProgress = 0;
let sections = [];
let currentSection = 0;
let particles;
let carousels = {};
let autoScrollIntervals = {};

window.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    initThreeJS();
    populateContent();
    setupNavigation();
    animate();
    
    // Show initial section
    showSection(0);
});

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    // Create animated triangle geometry
    const triangleGeometry = new THREE.ConeGeometry(2, 4, 3);
    const triangleMaterial = new THREE.MeshPhongMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    scene.add(triangle);

    // Add particles for atmosphere
    createParticles();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x38bdf8, 1, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Initial camera position
    camera.position.z = 10;

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Position particles in a large sphere around the scene
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        // Give each particle a small random velocity
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending // Makes particles glow
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

function populateContent() {
    // Get section elements - reordered so groups comes before companies
    sections = [
        document.getElementById('intro'),
        document.getElementById('events'),
        document.getElementById('groups'),
        document.getElementById('companies')
    ];

    // Populate events - show all at once
    const eventsContent = document.getElementById('events-content');
    if (events && eventsContent) {
        createEventsGrid(eventsContent);
    }

    // Populate groups with horizontal auto-scrolling carousel
    const groupsContent = document.getElementById('groups-content');
    if (groups && groupsContent) {
        createHorizontalCarousel(groupsContent, groups, 'groups');
    }

    // Populate companies with single horizontal auto-scrolling carousel
    const companiesContent = document.getElementById('companies-content');
    if (companiesContent) {
        console.log('Physical companies:', companiesWithPhysicalPresence);
        console.log('Remote companies:', companiesWithRemotePresence);
        
        if (companiesWithPhysicalPresence && companiesWithRemotePresence) {
            // Combine all companies into one array
            const allCompanies = [...companiesWithPhysicalPresence, ...companiesWithRemotePresence];
            createHorizontalCarousel(companiesContent, allCompanies, 'companies');
        } else {
            console.error('Companies data not found');
            companiesContent.innerHTML = '<p style="color: #ff6b6b;">Error: Companies data not loaded</p>';
        }
    } else {
        console.error('Companies content element not found');
    }
}

function createEventsGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'events-grid';
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    `;
    
    // Find the next upcoming event
    const now = new Date();
    let nextEventIndex = -1;
    let closestDate = null;
    
    events.forEach((event, index) => {
        const eventDate = new Date(event.date);
        if (eventDate >= now && (!closestDate || eventDate < closestDate)) {
            closestDate = eventDate;
            nextEventIndex = index;
        }
    });
    
    events.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        // Highlight the next event
        if (index === nextEventIndex) {
            card.style.cssText += `
                border: 2px solid #fbbf24;
                box-shadow: 0 5px 20px rgba(251, 191, 36, 0.3);
                transform: scale(1.05);
            `;
        }
        
        card.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${event.date} ${index === nextEventIndex ? '🎯 Next Event!' : ''}</p>
            <p>${event.description}</p>
            <a href="${event.link}" target="_blank">Learn More →</a>
        `;
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

function createHorizontalCarousel(container, items, carouselId) {
    console.log(`Creating carousel ${carouselId} with ${items ? items.length : 0} items`);
    
    if (!items || items.length === 0) {
        console.error(`No items provided for carousel ${carouselId}`);
        container.innerHTML = '<p style="color: #ff6b6b;">No items to display</p>';
        return;
    }
    
    // Start at random index
    const randomIndex = Math.floor(Math.random() * items.length);
    carousels[carouselId] = { items: items, currentIndex: randomIndex };
    
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
    
    // IMPORTANT: Add to DOM first, then create items
    container.appendChild(carouselContainer);
    
    // Use setTimeout to ensure DOM is updated before creating items
    setTimeout(() => {
        createCarouselItems(carouselId);
        // Show first arrangement and start auto-scroll
        updateHorizontalCarousel(carouselId);
        startAutoScroll(carouselId);
    }, 10);
}

function createCarouselItems(carouselId) {
    console.log(`Creating items for carousel: ${carouselId}`);
    
    const carousel = carousels[carouselId];
    const carouselElement = document.getElementById(`carousel-${carouselId}`);
    
    if (!carousel) {
        console.error(`Carousel data not found for ${carouselId}. Available carousels:`, Object.keys(carousels));
        return;
    }
    
    if (!carouselElement) {
        console.error(`Carousel element not found for ${carouselId}. Looking for: carousel-${carouselId}`);
        return;
    }
    
    // Clear existing content
    carouselElement.innerHTML = '';
    
    // Create items 3 times for infinite scroll (before, main, after)
    const tripleItems = [...carousel.items, ...carousel.items, ...carousel.items];
    carousel.tripleItems = tripleItems;
    carousel.itemsPerSet = carousel.items.length;
    
    tripleItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carousel-item';
        itemElement.id = `item-${carouselId}-${index}`;
        
        let content = '';
        if (carouselId === 'companies-physical' || carouselId === 'companies-remote' || carouselId === 'companies') {
            content = `
                <div class="content-card">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <a href="${item.url}" target="_blank">Visit Website →</a>
                </div>
            `;
        } else if (carouselId === 'groups') {
            content = `
                <div class="content-card">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="meta-info">
                        <span class="location">${item.location}</span>
                        <span class="type">${item.type}</span>
                    </div>
                    ${item.url ? `<a href="${item.url}" target="_blank">Learn More →</a>` : ''}
                </div>
            `;
        }
        
        itemElement.innerHTML = content;
        carouselElement.appendChild(itemElement);
    });
    
    console.log(`Created ${tripleItems.length} items for ${carouselId}`);
}

function updateHorizontalCarousel(carouselId) {
    const carousel = carousels[carouselId];
    const indicator = document.getElementById(`indicator-${carouselId}`);
    
    if (!carousel || !carousel.tripleItems) {
        console.error(`Carousel data not found for ${carouselId}`);
        return;
    }
    
    // Update classes for all items based on their position relative to current
    carousel.tripleItems.forEach((item, index) => {
        const itemElement = document.getElementById(`item-${carouselId}-${index}`);
        if (!itemElement) return; // Skip if element doesn't exist
        
        const distance = Math.abs(index - carousel.currentIndex);
        
        itemElement.classList.remove('center', 'side', 'far');
        
        if (index === carousel.currentIndex) {
            itemElement.classList.add('center');
        } else if (distance === 1) {
            itemElement.classList.add('side');
        } else {
            itemElement.classList.add('far');
        }
    });
    
    // Center the current item
    const track = document.getElementById(`track-${carouselId}`);
    if (track && track.parentElement) {
        const container = track.parentElement;
        const itemWidth = 280 + 32; // Updated item width + gap
        const containerWidth = container.offsetWidth;
        const offset = -(carousel.currentIndex * itemWidth) + (containerWidth / 2) - (140); // 140 = half item width
        track.style.transform = `translateX(${offset}px)`;
    }
    
    // Show indicator based on position within the original set
    if (indicator && carousel.itemsPerSet) {
        const displayIndex = ((carousel.currentIndex - carousel.itemsPerSet) % carousel.itemsPerSet) + 1;
        indicator.textContent = `${displayIndex} / ${carousel.itemsPerSet}`;
    }
}

function startAutoScroll(carouselId) {
    stopAutoScroll(carouselId); // Clear any existing interval
    autoScrollIntervals[carouselId] = setInterval(() => {
        navigateCarousel(carouselId, 1);
    }, 3000); // Auto-scroll every 3 seconds
}

function stopAutoScroll(carouselId) {
    if (autoScrollIntervals[carouselId]) {
        clearInterval(autoScrollIntervals[carouselId]);
        delete autoScrollIntervals[carouselId];
    }
}

function navigateCarousel(carouselId, direction) {
    const carousel = carousels[carouselId];
    if (!carousel || !carousel.itemsPerSet) {
        console.error(`Carousel not properly initialized for ${carouselId}`);
        return;
    }
    
    carousel.currentIndex += direction;
    
    // Handle infinite scroll - check if we need to reset position
    const track = document.getElementById(`track-${carouselId}`);
    if (!track) {
        console.error(`Track not found for ${carouselId}`);
        return;
    }
    
    // If we've reached the end of the last set, instantly jump to the beginning of the middle set
    if (carousel.currentIndex >= carousel.itemsPerSet * 2) {
        carousel.currentIndex = carousel.itemsPerSet;
        track.style.transition = 'none'; // Disable transition for instant jump
        updateHorizontalCarousel(carouselId);
        // Re-enable transition after a frame
        requestAnimationFrame(() => {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        return;
    }
    
    // If we've reached the beginning of the first set, instantly jump to the end of the middle set
    if (carousel.currentIndex < carousel.itemsPerSet) {
        carousel.currentIndex = carousel.itemsPerSet * 2 - 1;
        track.style.transition = 'none'; // Disable transition for instant jump
        updateHorizontalCarousel(carouselId);
        // Re-enable transition after a frame
        requestAnimationFrame(() => {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        return;
    }
    
    updateHorizontalCarousel(carouselId);
}

function updateCarousel(carouselId) {
    // This function is now replaced by updateHorizontalCarousel for groups and companies
    updateHorizontalCarousel(carouselId);
}

function showSection(sectionIndex) {
    // Stop all auto-scrolling when switching sections
    Object.keys(autoScrollIntervals).forEach(stopAutoScroll);
    
    sections.forEach((section, index) => {
        if (index === sectionIndex) {
            section.classList.add('active');
            // Restart auto-scroll for carousels when their section becomes active
            if (index === 2) startAutoScroll('companies'); // Companies section
            if (index === 3) startAutoScroll('groups');    // Groups section
        } else {
            section.classList.remove('active');
        }
    });
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionIndex = parseInt(button.dataset.section);
            navigateToSection(sectionIndex);
        });
    });
}

function navigateToSection(sectionIndex) {
    currentSection = sectionIndex;
    targetScrollProgress = sectionIndex / (sections.length - 1);
    
    // Update active button
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        if (index === sectionIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    showSection(sectionIndex);
}

function showSection(sectionIndex) {
    // Stop all auto-scrolling when switching sections
    Object.keys(autoScrollIntervals).forEach(stopAutoScroll);
    
    sections.forEach((section, index) => {
        if (index === sectionIndex) {
            section.classList.add('active');
            // Restart auto-scroll for carousels when their section becomes active
            if (index === 2) startAutoScroll('groups');    // Groups section (now index 2)
            if (index === 3) {
                startAutoScroll('companies-physical'); // Physical presence carousel
                startAutoScroll('companies-remote');   // Remote presence carousel
            }
        } else {
            section.classList.remove('active');
        }
    });
}

function updateSections() {
    // This function is now handled by showSection() in navigation
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animate particles (stars)
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Move particles based on their velocity
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // Wrap particles around when they go too far
            if (positions[i] > 50) positions[i] = -50;
            if (positions[i] < -50) positions[i] = 50;
            if (positions[i + 1] > 50) positions[i + 1] = -50;
            if (positions[i + 1] < -50) positions[i + 1] = 50;
            if (positions[i + 2] > 50) positions[i + 2] = -50;
            if (positions[i + 2] < -50) positions[i + 2] = 50;
        }
        
        // Update the particle positions
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire particle system for extra movement
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
    }
    
    // Smooth interpolation between current and target scroll progress
    // Adjust the 0.08 value to make it smoother (lower) or more responsive (higher)
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
    
    if (triangle) {
        // Rotate triangle based on smooth scroll
        triangle.rotation.x = scrollProgress * Math.PI * 4;
        triangle.rotation.y = scrollProgress * Math.PI * 2;
        triangle.rotation.z = scrollProgress * Math.PI;
        
        // Move camera through the triangle
        camera.position.z = 10 - (scrollProgress * 15);
        camera.position.y = Math.sin(scrollProgress * Math.PI * 2) * 2;
        camera.position.x = Math.cos(scrollProgress * Math.PI * 2) * 2;
        
        // Scale triangle during journey
        const scale = 1 + (scrollProgress * 3);
        triangle.scale.set(scale, scale, scale);
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}