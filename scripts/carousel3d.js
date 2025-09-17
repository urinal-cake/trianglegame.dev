// 3D Carousel for companies using Three.js
// This is a minimal, visually impressive 3D carousel for company logos or names

// You can replace the company names with logos for even more visual impact
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('carousel-3d-container');
  if (!container || typeof companiesWithOffices === 'undefined') return;

  // Show loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = 'Loading 3D carousel...';
  loadingDiv.style.cssText = 'color:#38bdf8;text-align:center;padding-top:180px;font-size:1.3rem;';
  container.appendChild(loadingDiv);

  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    loadingDiv.textContent = 'Error: Three.js library not loaded. Please ensure scripts/three.min.js is present and correct.';
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  // Carousel parameters
  const radius = 6;
  const companyCount = companiesWithOffices.length;
  const meshes = [];

  // Create a 3D text mesh for each company
  const loader = new THREE.FontLoader();
  loader.load(
    'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/fonts/helvetiker_regular.typeface.json',
    function (font) {
      container.removeChild(loadingDiv);
      for (let i = 0; i < companyCount; i++) {
        const company = companiesWithOffices[i];
        const angle = (i / companyCount) * Math.PI * 2;
        const geometry = new THREE.TextGeometry(company.name, {
          font: font,
          size: 0.7,
          height: 0.2,
          curveSegments: 8,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.03,
          bevelOffset: 0,
          bevelSegments: 3
        });
        const material = new THREE.MeshPhongMaterial({ color: 0x38bdf8, shininess: 80 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.position.y = 0;
        mesh.lookAt(0, 0, 0);
        mesh.userData = { link: company.link };
        meshes.push(mesh);
        scene.add(mesh);
      }
    },
    undefined,
    function (err) {
      loadingDiv.textContent = 'Error loading 3D font. If you are running this site as a local file, try using a local server.';
    }
  );

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  camera.position.set(0, 2, 10);

  // Animation loop
  let angleOffset = 0;
  function animate() {
    requestAnimationFrame(animate);
    angleOffset += 0.005;
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      const angle = (i / companyCount) * Math.PI * 2 + angleOffset;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
  }
  animate();

  // Interactivity: click to open company link
  renderer.domElement.addEventListener('pointerdown', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      const url = intersects[0].object.userData.link;
      if (url) window.open(url, '_blank');
    }
  });
});
