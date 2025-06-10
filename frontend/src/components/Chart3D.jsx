import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const COLORS = [
  '#4F81BD', '#C0504D', '#9BBB59', '#8064A2', '#F79646', 
  '#2C4D75', '#C00000', '#00B050', '#7030A0', '#FF9900'
];

function getColor(idx) {
  return COLORS[idx % COLORS.length];
}

function getUnique(arr) {
  return Array.from(new Set(arr));
}

// Simple OrbitControls implementation
class SimpleOrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.enabled = true;
    this.enableDamping = true;
    this.dampingFactor = 0.05;
    this.minDistance = 5;
    this.maxDistance = 50;
    this.maxPolarAngle = Math.PI / 2;
    this.minPolarAngle = Math.PI / 6;
    
    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();
    this.scale = 1;
    this.panOffset = new THREE.Vector3();
    this.zoomChanged = false;
    
    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();
    
    this.panStart = new THREE.Vector2();
    this.panEnd = new THREE.Vector2();
    this.panDelta = new THREE.Vector2();
    
    this.dollyStart = new THREE.Vector2();
    this.dollyEnd = new THREE.Vector2();
    this.dollyDelta = new THREE.Vector2();
    
    this.target = new THREE.Vector3();
    this.isMouseDown = false;
    this.mouseButton = -1;
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
    this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }
  
  onMouseDown(event) {
    if (!this.enabled) return;
    event.preventDefault();
    
    this.isMouseDown = true;
    this.mouseButton = event.button;
    
    if (event.button === 0) { // left mouse button
      this.rotateStart.set(event.clientX, event.clientY);
    } else if (event.button === 2) { // right mouse button
      this.panStart.set(event.clientX, event.clientY);
    }
  }
  
  onMouseMove(event) {
    if (!this.enabled || !this.isMouseDown) return;
    event.preventDefault();
    
    if (this.mouseButton === 0) { // rotate
      this.rotateEnd.set(event.clientX, event.clientY);
      this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(0.01);
      
      this.sphericalDelta.theta -= this.rotateDelta.x;
      this.sphericalDelta.phi -= this.rotateDelta.y;
      
      this.rotateStart.copy(this.rotateEnd);
    } else if (this.mouseButton === 2) { // pan
      this.panEnd.set(event.clientX, event.clientY);
      this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(0.01);
      
      this.pan(this.panDelta.x, this.panDelta.y);
      this.panStart.copy(this.panEnd);
    }
  }
  
  onMouseUp() {
    this.isMouseDown = false;
    this.mouseButton = -1;
  }
  
  onMouseWheel(event) {
    if (!this.enabled) return;
    event.preventDefault();
    
    if (event.deltaY < 0) {
      this.dollyOut(0.95);
    } else {
      this.dollyIn(1.05);
    }
  }
  
  onContextMenu(event) {
    event.preventDefault();
  }
  
  dollyIn(dollyScale) {
    this.scale *= dollyScale;
  }
  
  dollyOut(dollyScale) {
    this.scale *= dollyScale;
  }
  
  pan(deltaX, deltaY) {
    const offset = new THREE.Vector3();
    offset.copy(this.camera.position).sub(this.target);
    
    let targetDistance = offset.length();
    targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0);
    
    const panLeft = new THREE.Vector3();
    const panUp = new THREE.Vector3();
    
    panLeft.setFromMatrixColumn(this.camera.matrix, 0);
    panLeft.multiplyScalar(-2 * deltaX * targetDistance / this.domElement.clientHeight);
    
    panUp.setFromMatrixColumn(this.camera.matrix, 1);
    panUp.multiplyScalar(2 * deltaY * targetDistance / this.domElement.clientHeight);
    
    this.panOffset.add(panLeft).add(panUp);
  }
  
  update() {
    const offset = new THREE.Vector3();
    const quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
    const quatInverse = quat.clone().invert();
    
    offset.copy(this.camera.position).sub(this.target);
    offset.applyQuaternion(quat);
    
    this.spherical.setFromVector3(offset);
    
    if (this.enableDamping) {
      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
    } else {
      this.spherical.theta += this.sphericalDelta.theta;
      this.spherical.phi += this.sphericalDelta.phi;
    }
    
    this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
    this.spherical.makeSafe();
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
    
    this.target.add(this.panOffset);
    
    offset.setFromSpherical(this.spherical);
    offset.applyQuaternion(quatInverse);
    
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
    
    if (this.enableDamping) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
    }
    
    this.scale = 1;
    this.panOffset.set(0, 0, 0);
  }
  
  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.domElement.removeEventListener('contextmenu', this.onContextMenu);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}

export default function Chart3D({ data = sampleData, xAxis = 'category', yAxis = 'value', zAxis = 'series' }) {
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const [legend, setLegend] = useState([]);
  const [hovered, setHovered] = useState(null);
  
  // Refs for Three.js objects
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);
  const columnsRef = useRef([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Data processing
    const xCategories = getUnique(data.map(d => d[xAxis])).sort();
    const zCategories = getUnique(data.map(d => d[zAxis])).sort();
    setLegend(zCategories);
    
    const yValues = data.map(d => d[yAxis]);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yRange = Math.max(yMax - yMin, 0.1);

    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = 480;
    
    // Clear previous scene children
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }
    
    sceneRef.current.background = new THREE.Color('#f9fafb');

    // Camera setup
    cameraRef.current = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    cameraRef.current.position.set(
      -xCategories.length * 1.2,
      yMax * 0.15,
      zCategories.length * 1.5
    );
    cameraRef.current.lookAt(0, yMax * 0.1, 0);

    // Renderer
    if (rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
    
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Controls
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
    
    controlsRef.current = new SimpleOrbitControls(cameraRef.current, rendererRef.current.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambient);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    sceneRef.current.add(dirLight);

    // Floor
    const planeSize = Math.max(xCategories.length, zCategories.length) * 2;
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.1 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.01;
    plane.receiveShadow = true;
    sceneRef.current.add(plane);

    // Grid
    const gridSize = Math.max(xCategories.length, zCategories.length) * 1.5;
    const gridDivisions = Math.max(xCategories.length, zCategories.length);
    const grid = new THREE.GridHelper(gridSize, gridDivisions, '#e5e7eb', '#e5e7eb');
    grid.position.y = 0;
    sceneRef.current.add(grid);

    // Columns
    const colWidth = 0.6;
    const xSpacing = 1.2;
    const zSpacing = 1.0;
    const baseHeight = 0.01;
    const heightScale = 0.1;
    
    columnsRef.current = [];
    const group = new THREE.Group();
    
    xCategories.forEach((xCat, xi) => {
      zCategories.forEach((zCat, zi) => {
        const d = data.find(row => row[xAxis] === xCat && row[zAxis] === zCat);
        const yVal = d ? d[yAxis] : 0;
        const normalizedHeight = ((yVal - yMin) / yRange) || 0;
        
        const geometry = new THREE.BoxGeometry(colWidth, baseHeight, colWidth);
        const color = getColor(zi);
        const material = new THREE.MeshPhongMaterial({ 
          color, 
          shininess: 60,
          transparent: true, 
          opacity: 0.9 
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        mesh.position.x = (xi - (xCategories.length - 1)/2) * xSpacing;
        mesh.position.z = (zi - (zCategories.length - 1)/2) * zSpacing;
        mesh.position.y = baseHeight / 2;
        
        mesh.userData = { 
          xCat, 
          zCat, 
          yVal, 
          color,
          targetHeight: normalizedHeight * heightScale * yRange + baseHeight
        };
        
        mesh.scale.y = 0.001;
        group.add(mesh);
        columnsRef.current.push(mesh);
      });
    });
    
    sceneRef.current.add(group);

    // Labels
    function createAxisLabel(text, position, rotation = [0, 0, 0], color = '#333') {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.font = 'Bold 24px Arial';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, canvas.width/2, canvas.height/2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(1, 0.5, 1);
      sprite.position.set(...position);
      sprite.rotation.set(...rotation);
      return sprite;
    }

    // X-axis labels
    xCategories.forEach((cat, i) => {
      const xPos = (i - (xCategories.length - 1)/2) * xSpacing;
      const label = createAxisLabel(
        cat, 
        [xPos, -1, -zCategories.length/2 * zSpacing - 1]
      );
      sceneRef.current.add(label);
    });

    // Z-axis labels
    zCategories.forEach((cat, i) => {
      const zPos = (i - (zCategories.length - 1)/2) * zSpacing;
      const label = createAxisLabel(
        cat,
        [-xCategories.length/2 * xSpacing - 1.5, -1, zPos],
        [0, Math.PI/2, 0]
      );
      sceneRef.current.add(label);
    });

    // Y-axis indicator
    const yIndicator = createAxisLabel(
      yAxis,
      [-xCategories.length/2 * xSpacing - 2, yMax * heightScale / 2, 0],
      [0, 0, 0],
      '#666'
    );
    sceneRef.current.add(yIndicator);

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function onPointerMove(event) {
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    rendererRef.current.domElement.addEventListener('pointermove', onPointerMove);

    // Animation loop
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      controlsRef.current.update();
      
      // Animate columns
      columnsRef.current.forEach(mesh => {
        const { targetHeight } = mesh.userData;
        if (mesh.scale.y < targetHeight) {
          mesh.scale.y += (targetHeight - mesh.scale.y) * 0.05;
          mesh.position.y = mesh.scale.y / 2;
        }
      });
      
      // Hover detection
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(columnsRef.current);
      
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        setHovered(obj.userData);
        
        columnsRef.current.forEach(mesh => {
          mesh.material.opacity = mesh === obj ? 1 : 0.7;
          mesh.material.needsUpdate = true;
        });
      } else {
        setHovered(null);
        columnsRef.current.forEach(mesh => {
          mesh.material.opacity = 0.9;
          mesh.material.needsUpdate = true;
        });
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    
    animate();

    // Resize handler
    function handleResize() {
      const width = mountRef.current.clientWidth;
      const height = 480;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      rendererRef.current?.domElement.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(animationIdRef.current);
      controlsRef.current?.dispose();
      if (rendererRef.current && mountRef.current?.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [data, xAxis, yAxis, zAxis]);

  return (
    <div className="relative w-full" style={{ minHeight: 480 }}>
      <div ref={mountRef} style={{ width: '100%', height: 480, borderRadius: 12 }} />
      
      {/* Legend */}
      {legend.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 rounded-lg shadow p-3 flex flex-col space-y-2 border border-gray-200 z-10">
          <div className="font-semibold text-gray-700 mb-1">Legend</div>
          {legend.map((cat, i) => (
            <div key={cat} className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded" style={{ background: getColor(i) }} />
              <span className="text-gray-700 text-sm">{cat}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Tooltip */}
      {hovered && (
        <div
          ref={tooltipRef}
          className="absolute z-20 px-3 py-2 bg-white border border-gray-300 rounded shadow text-sm text-gray-800 pointer-events-none"
          style={{
            left: '50%',
            top: 60,
            transform: 'translateX(-50%)',
            minWidth: 120
          }}
        >
          <div className="font-semibold" style={{ color: hovered.color }}>
            {hovered.zCat}
          </div>
          <div><b>{xAxis}:</b> {hovered.xCat}</div>
          <div><b>{yAxis}:</b> {hovered.yVal.toFixed(2)}</div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow p-2 text-xs text-gray-600 border border-gray-200">
        <div>🖱️ Left click + drag: Rotate</div>
        <div>🖱️ Right click + drag: Pan</div>
        <div>🖱️ Scroll: Zoom</div>
      </div>
    </div>
  );
}

// Sample data for demonstration
const sampleData = [
  { category: 'A', value: 10, series: 'Series 1' },
  { category: 'A', value: 15, series: 'Series 2' },
  { category: 'A', value: 8, series: 'Series 3' },
  { category: 'B', value: 20, series: 'Series 1' },
  { category: 'B', value: 12, series: 'Series 2' },
  { category: 'B', value: 18, series: 'Series 3' },
  { category: 'C', value: 16, series: 'Series 1' },
  { category: 'C', value: 22, series: 'Series 2' },
  { category: 'C', value: 14, series: 'Series 3' },
  { category: 'D', value: 8, series: 'Series 1' },
  { category: 'D', value: 25, series: 'Series 2' },
  { category: 'D', value: 20, series: 'Series 3' },
];