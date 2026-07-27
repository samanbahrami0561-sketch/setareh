import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Sparkles, 
  BatteryCharging, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  PhoneCall, 
  RotateCw, 
  Maximize2, 
  Info, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  Eye,
  Award,
  Box,
  Wrench,
  Zap,
  Sliders,
  Share2,
  Check
} from 'lucide-react';
import { UsedPhone, Product } from '../types';
import { USED_PHONES_LIST } from '../data/usedPhonesData';

interface Showroom3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  onOpenInstallment?: (price: number) => void;
  usedPhones?: UsedPhone[];
}

export const Showroom3DModal: React.FC<Showroom3DModalProps> = ({
  isOpen,
  onClose,
  onAddToCart = () => {},
  onOpenInstallment = () => {},
  usedPhones = USED_PHONES_LIST
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [activePhoneIndex, setActivePhoneIndex] = useState<number>(0);
  const [selectedPhoneForModal, setSelectedPhoneForModal] = useState<UsedPhone | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [lightMode, setLightMode] = useState<'cyber' | 'gold' | 'neon'>('cyber');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [addedToCartToast, setAddedToCartToast] = useState<boolean>(false);

  // Filtered used phones
  const phonesList = useMemo(() => {
    const list = usedPhones && usedPhones.length > 0 ? usedPhones : USED_PHONES_LIST;
    if (selectedBrand === 'all') return list;
    return list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
  }, [selectedBrand, usedPhones]);

  const currentPhone = phonesList[activePhoneIndex] || phonesList[0];

  // Three.js References & State
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const phoneMeshesRef = useRef<{ mesh: THREE.Group; phoneSubGroup: THREE.Group; data: UsedPhone; index: number }[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationYRef = useRef<number>(0);

  // 360 Phone Rotation state
  const [individualPhoneRotationY, setIndividualPhoneRotationY] = useState<number>(0);
  const [is360AutoSpin, setIs360AutoSpin] = useState<boolean>(false);

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Realistic Studio Environment
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06080e);
    scene.fog = new THREE.FogExp2(0x06080e, 0.022);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 9.2);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // Renderer with Advanced Shadows & Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Clear previous children in container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // REALISTIC STORE LIGHTING & AMBIENT OCCLUSION SETUP
    // Ambient light simulating store interior fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Main Overhead Softbox Spotlight with Soft Dynamic Shadows
    const topSpot = new THREE.SpotLight(0xfff8ee, 6.0);
    topSpot.position.set(0, 13, 2);
    topSpot.angle = Math.PI / 3.2;
    topSpot.penumbra = 0.7;
    topSpot.castShadow = true;
    topSpot.shadow.mapSize.width = 2048;
    topSpot.shadow.mapSize.height = 2048;
    topSpot.shadow.camera.near = 0.5;
    topSpot.shadow.camera.far = 25;
    topSpot.shadow.bias = -0.0001;
    scene.add(topSpot);

    // Key Directional Light for Metallic Glint & AO effect
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Warm & Cool Studio Rim Accent Lights
    const warmRimLight = new THREE.PointLight(0xfacc15, 3.8, 20);
    warmRimLight.position.set(-7, 5, 4);
    scene.add(warmRimLight);

    const coolRimLight = new THREE.PointLight(0x38bdf8, 3.2, 20);
    coolRimLight.position.set(7, 5, -4);
    scene.add(coolRimLight);

    const centerGlowLight = new THREE.PointLight(0xffffff, 2.5, 12);
    centerGlowLight.position.set(0, 0.6, 0);
    scene.add(centerGlowLight);

    // REALISTIC REFLECTIVE STORE MARBLE/METALLIC FLOOR
    const floorGeo = new THREE.CircleGeometry(18, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.1,
      metalness: 0.92
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ambient Shadow Contact Plane on Floor (Fake Ambient Occlusion Bake)
    const aoFloorGeo = new THREE.RingGeometry(2.0, 10.0, 64);
    const aoFloorMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const aoFloor = new THREE.Mesh(aoFloorGeo, aoFloorMat);
    aoFloor.rotation.x = -Math.PI / 2;
    aoFloor.position.y = -0.49;
    scene.add(aoFloor);

    // Studio Outer Ring Specular Border
    const ringGeo = new THREE.RingGeometry(17.8, 18.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
    const outerRing = new THREE.Mesh(ringGeo, ringMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = -0.48;
    scene.add(outerRing);

    // Studio Floor Grid lines
    const grid = new THREE.GridHelper(36, 36, 0xfacc15, 0x1e293b);
    grid.position.y = -0.47;
    scene.add(grid);

    // 3D REALISTIC CURVED BACKDROP SHOWROOM WALL
    const backdropGeo = new THREE.CylinderGeometry(15, 15, 12, 64, 1, true);
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.25,
      metalness: 0.85,
      side: THREE.BackSide
    });
    const backdropWall = new THREE.Mesh(backdropGeo, backdropMat);
    backdropWall.position.set(0, 5.5, 0);
    scene.add(backdropWall);

    // NEON LED ACCENT STRIPS ALONG BACKDROP WALL
    const stripGeo = new THREE.RingGeometry(14.8, 14.95, 64);
    const topStripMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
    const topStrip = new THREE.Mesh(stripGeo, topStripMat);
    topStrip.rotation.x = Math.PI / 2;
    topStrip.position.set(0, 9.8, 0);
    scene.add(topStrip);

    const bottomStripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const bottomStrip = new THREE.Mesh(stripGeo, bottomStripMat);
    bottomStrip.rotation.x = Math.PI / 2;
    bottomStrip.position.set(0, -0.42, 0);
    scene.add(bottomStrip);

    // ARCHITECTURAL PILLARS WITH VERTICAL LED LIGHT BARS
    const pillarCount = 10;
    for (let p = 0; p < pillarCount; p++) {
      const pAngle = (p / pillarCount) * Math.PI * 2;
      const px = Math.sin(pAngle) * 14.7;
      const pz = Math.cos(pAngle) * 14.7;

      const pillarGeo = new THREE.BoxGeometry(0.5, 11.5, 0.5);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.2 });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.set(px, 5.2, pz);
      pillarMesh.rotation.y = pAngle;

      // Vertical LED Light Strip on Pillar
      const lightStripGeo = new THREE.BoxGeometry(0.08, 11.2, 0.08);
      const lightStripMat = new THREE.MeshBasicMaterial({ color: p % 2 === 0 ? 0xfacc15 : 0x38bdf8 });
      const lightStrip = new THREE.Mesh(lightStripGeo, lightStripMat);
      lightStrip.position.set(0, 0, 0.27);
      pillarMesh.add(lightStrip);

      scene.add(pillarMesh);
    }

    // SHOWROOM MAIN GROUP (CIRCULAR CAROUSEL)
    const showroomGroup = new THREE.Group();
    scene.add(showroomGroup);
    groupRef.current = showroomGroup;

    phoneMeshesRef.current = [];

    // PARTICLES IN BACKGROUND
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 140;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 22;
      posArray[i + 1] = Math.random() * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // BUILD PEDESTALS AND HIGH-DETAIL 3D PHONES IN CIRCLE
    const totalItems = phonesList.length;
    const radius = Math.max(3.5, totalItems * 0.85);

    phonesList.forEach((phone, idx) => {
      const angle = (idx / totalItems) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const itemGroup = new THREE.Group();
      itemGroup.position.set(x, 0, z);
      itemGroup.rotation.y = angle + Math.PI; // Face outwards/center

      // Pedestal Base (Cylinder)
      const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.6, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.9,
        roughness: 0.15
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.2;
      baseMesh.receiveShadow = true;
      baseMesh.castShadow = true;
      itemGroup.add(baseMesh);

      // Pedestal Contact AO Shadow disk
      const pedAoGeo = new THREE.CircleGeometry(0.88, 32);
      const pedAoMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
      const pedAoMesh = new THREE.Mesh(pedAoGeo, pedAoMat);
      pedAoMesh.rotation.x = -Math.PI / 2;
      pedAoMesh.position.y = 0.105;
      itemGroup.add(pedAoMesh);

      // Glowing Neon Ring around Pedestal Top
      const ringGeo = new THREE.TorusGeometry(0.86, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(phone['3dColorHex'] || 0xfacc15)
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.11;
      itemGroup.add(ringMesh);

      // Glass Top Surface
      const glassGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.02, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x1f2937,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.5
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.y = 0.11;
      itemGroup.add(glassMesh);

      // HIGH-DETAIL 3D PHONE MODEL ASSEMBLY WITH FULL 360 GEOMETRY
      const phoneGroup = new THREE.Group();
      phoneGroup.position.y = 1.0;

      // Phone Body Rails (Metallic Frame)
      const bodyWidth = 0.8;
      const bodyHeight = 1.6;
      const bodyDepth = 0.1;
      const phoneColor = new THREE.Color(phone['3dColorHex'] || '#1f2937');

      const phoneBodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
      const phoneBodyMat = new THREE.MeshStandardMaterial({
        color: phoneColor,
        metalness: 0.88,
        roughness: 0.18
      });
      const phoneBodyMesh = new THREE.Mesh(phoneBodyGeo, phoneBodyMat);
      phoneBodyMesh.castShadow = true;
      phoneGroup.add(phoneBodyMesh);

      // Front Glass Display Screen
      const screenGeo = new THREE.PlaneGeometry(bodyWidth * 0.94, bodyHeight * 0.95);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x030508,
        roughness: 0.05,
        metalness: 0.95
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = bodyDepth / 2 + 0.005;
      phoneGroup.add(screenMesh);

      // Glowing Screen Edge Wallpaper Glow
      const glowGeo = new THREE.PlaneGeometry(bodyWidth * 0.88, bodyHeight * 0.9);
      const glowMat = new THREE.MeshBasicMaterial({
        color: phoneColor,
        transparent: true,
        opacity: 0.4
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.z = bodyDepth / 2 + 0.007;
      phoneGroup.add(glowMesh);

      // Dynamic Island / Notch at top of screen
      const notchGeo = new THREE.BoxGeometry(0.22, 0.04, 0.002);
      const notchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const notchMesh = new THREE.Mesh(notchGeo, notchMat);
      notchMesh.position.set(0, bodyHeight * 0.42, bodyDepth / 2 + 0.008);
      phoneGroup.add(notchMesh);

      // BACK SIDE GEOMETRY FOR FULL 360 INSPECTION
      // Back Glass Panel
      const backGlassGeo = new THREE.PlaneGeometry(bodyWidth * 0.96, bodyHeight * 0.96);
      const backGlassMat = new THREE.MeshStandardMaterial({
        color: phoneColor,
        roughness: 0.15,
        metalness: 0.8
      });
      const backGlassMesh = new THREE.Mesh(backGlassGeo, backGlassMat);
      backGlassMesh.rotation.y = Math.PI; // Face backwards
      backGlassMesh.position.z = -bodyDepth / 2 - 0.005;
      phoneGroup.add(backGlassMesh);

      // Camera Island Bump (Back)
      const cameraBumpGeo = new THREE.BoxGeometry(0.35, 0.35, 0.04);
      const cameraBumpMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.92,
        roughness: 0.08
      });
      const cameraBumpMesh = new THREE.Mesh(cameraBumpGeo, cameraBumpMat);
      cameraBumpMesh.position.set(-0.18, 0.53, -bodyDepth / 2 - 0.02);
      cameraBumpMesh.castShadow = true;
      phoneGroup.add(cameraBumpMesh);

      // Multi-Lens Camera Array
      const lensGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.03, 24);
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x020305, metalness: 0.98, roughness: 0.02 });
      const lensRingGeo = new THREE.TorusGeometry(0.075, 0.008, 16, 32);
      const lensRingMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.1 });

      [
        { x: -0.24, y: 0.60 },
        { x: -0.24, y: 0.46 },
        { x: -0.12, y: 0.53 }
      ].forEach((pos) => {
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(pos.x, pos.y, -bodyDepth / 2 - 0.035);
        phoneGroup.add(lens);

        const ring = new THREE.Mesh(lensRingGeo, lensRingMat);
        ring.position.set(pos.x, pos.y, -bodyDepth / 2 - 0.036);
        phoneGroup.add(ring);
      });

      // Side Volume & Power Buttons for 360 Realism
      const btnGeo = new THREE.BoxGeometry(0.02, 0.12, 0.03);
      const btnMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.1 });
      
      const pwrBtn = new THREE.Mesh(btnGeo, btnMat);
      pwrBtn.position.set(bodyWidth / 2 + 0.005, 0.2, 0);
      phoneGroup.add(pwrBtn);

      const volBtnUp = new THREE.Mesh(btnGeo, btnMat);
      volBtnUp.position.set(-bodyWidth / 2 - 0.005, 0.3, 0);
      phoneGroup.add(volBtnUp);

      const volBtnDown = new THREE.Mesh(btnGeo, btnMat);
      volBtnDown.position.set(-bodyWidth / 2 - 0.005, 0.14, 0);
      phoneGroup.add(volBtnDown);

      // Stand angle / tilt for display
      phoneGroup.rotation.x = -0.15;
      itemGroup.add(phoneGroup);

      showroomGroup.add(itemGroup);

      phoneMeshesRef.current.push({
        mesh: itemGroup,
        phoneSubGroup: phoneGroup,
        data: phone,
        index: idx
      });
    });

    // MOUSE & TOUCH DRAG CONTROLS FOR SHOWROOM & INDIVIDUAL 360 ROTATION
    let isMouseDown = false;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || !showroomGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      showroomGroup.rotation.y += deltaX * 0.005;
      targetRotationYRef.current = showroomGroup.rotation.y;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // RAYCASTING ON CLICK
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClickCanvas = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(showroomGroup.children, true);

      if (intersects.length > 0) {
        let clickedObj: THREE.Object3D | null = intersects[0].object;
        while (clickedObj && clickedObj.parent && clickedObj.parent !== showroomGroup) {
          clickedObj = clickedObj.parent;
        }
        if (clickedObj) {
          const matched = phoneMeshesRef.current.find(item => item.mesh === clickedObj);
          if (matched) {
            setActivePhoneIndex(matched.index);
            setSelectedPhoneForModal(matched.data);
          }
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('click', onClickCanvas);

    // ANIMATION LOOP WITH DYNAMIC AO & 360 ROTATION SYNC
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation of showroom carousel if enabled
      if (autoRotate && !isMouseDown && showroomGroup) {
        showroomGroup.rotation.y += 0.003;
      }

      // Dynamically sync front-facing phone with specs card on rotation
      if (showroomGroup && phonesList.length > 0) {
        const totalItems = phonesList.length;
        let rotAngle = (-showroomGroup.rotation.y) % (Math.PI * 2);
        if (rotAngle < 0) rotAngle += Math.PI * 2;
        const frontIdx = Math.round((rotAngle / (Math.PI * 2)) * totalItems) % totalItems;
        if (frontIdx !== activePhoneIndex) {
          setActivePhoneIndex(frontIdx);
        }
      }

      // Gentle floating animation & 360 degree active phone orientation
      phoneMeshesRef.current.forEach((item, idx) => {
        const phoneSubGroup = item.phoneSubGroup;
        if (phoneSubGroup) {
          if (idx === activePhoneIndex) {
            // Active phone responds to manual 360° controls or 360 auto spin
            phoneSubGroup.position.y = 1.05 + Math.sin(elapsedTime * 2.5) * 0.04;
            
            if (is360AutoSpin) {
              phoneSubGroup.rotation.y += 0.025;
            } else {
              phoneSubGroup.rotation.y = THREE.MathUtils.lerp(
                phoneSubGroup.rotation.y,
                individualPhoneRotationY,
                0.15
              );
            }
          } else {
            // Inactive phones float subtly
            phoneSubGroup.position.y = 1.0 + Math.sin(elapsedTime * 2 + idx) * 0.05;
            phoneSubGroup.rotation.y = THREE.MathUtils.lerp(phoneSubGroup.rotation.y, 0, 0.1);
          }
        }
      });

      // Particle subtle motion
      if (particleSystem) {
        particleSystem.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLER
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('click', onClickCanvas);
      cancelAnimationFrame(animationFrameId);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [isOpen, phonesList, autoRotate, individualPhoneRotationY, is360AutoSpin, activePhoneIndex]);

  // Smoothly rotate 3D carousel when active index changes via buttons
  useEffect(() => {
    if (!groupRef.current || phonesList.length === 0) return;
    const totalItems = phonesList.length;
    const targetAngle = -(activePhoneIndex / totalItems) * Math.PI * 2;
    
    // Smooth transition
    const startAngle = groupRef.current.rotation.y;
    let progress = 0;
    const animateRotation = () => {
      if (progress < 1) {
        progress += 0.08;
        if (groupRef.current) {
          groupRef.current.rotation.y = THREE.MathUtils.lerp(startAngle, targetAngle, progress);
        }
        requestAnimationFrame(animateRotation);
      }
    };
    animateRotation();
  }, [activePhoneIndex, phonesList]);

  if (!isOpen) return null;

  const handleAddToCartClick = (phone: UsedPhone) => {
    const formattedProduct: Product = {
      id: phone.id,
      name: phone.name,
      persianName: phone.persianName,
      category: 'smartphones',
      brand: phone.brand as any,
      priceToman: phone.priceToman,
      originalPriceToman: phone.originalPriceToman,
      image: phone.image,
      colors: [{ name: phone.color, hex: phone.colorHex }],
      specs: phone.specs,
      rating: 4.9,
      reviewsCount: 18,
      stock: 1,
      warranty: phone.guarantee,
      description: phone.description
    };
    onAddToCart(formattedProduct);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  const handleSharePhone = (phone: UsedPhone) => {
    navigator.clipboard.writeText(`گوشی دست دوم ${phone.persianName} - قیمت: ${phone.priceToman.toLocaleString('fa-IR')} تومان | موبایل ستاره مبارکه`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md overflow-hidden font-sans text-right select-none animate-fadeIn">
      
      {/* BACKGROUND GRAPHICS & NEON AMBIENCE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* TOP HEADER OVERLAY */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex flex-wrap items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 text-slate-950 font-black flex items-center justify-center rounded-xl shadow-lg shadow-yellow-400/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                نمایشگاه ۳ بعدی <span className="text-yellow-400">گوشی‌های کارکرده</span>
              </h2>
              <span className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                Mobarakeh VIP Showroom
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              دستگاه‌های تست شده و کارکرده مغازه ستاره مبارکه با مهلت تست ۷ روزه
            </p>
          </div>
        </div>

        {/* Filter Brands & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Brand Selector Pill */}
          <div className="bg-slate-900/90 border border-slate-800 p-1 flex items-center gap-1 text-xs">
            {[
              { id: 'all', label: 'همه برندها' },
              { id: 'apple', label: 'آیفون' },
              { id: 'samsung', label: 'سامسونگ' },
              { id: 'xiaomi', label: 'شیائومی' }
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBrand(b.id);
                  setActivePhoneIndex(0);
                }}
                className={`px-3 py-1.5 font-bold transition rounded-lg ${
                  selectedBrand === b.id
                    ? 'bg-yellow-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              autoRotate
                ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="چرخش خودکار سه بعدی"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden md:inline">چرخش خودکار</span>
          </button>

          {/* Close Showroom */}
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-800 transition flex items-center justify-center rounded-xl"
            title="بستن نمایشگاه"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* THREE.JS CANVAS MOUNT CONTAINER */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
      />

      {/* FLOATING DIRECTORY CARD ON TOP OF 3D CANVAS */}
      <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-20 max-w-sm w-full bg-slate-900/90 backdrop-blur-xl border-2 border-slate-800 p-4 shadow-2xl text-white animate-slideUp">
        
        {currentPhone ? (
          <div className="space-y-3">
            
            {/* Top Row Badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                تست‌شده و تضمینی
              </span>

              <span className="bg-yellow-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded">
                سلامت باتری: {currentPhone.batteryHealth}٪
              </span>
            </div>

            {/* Title & Brand */}
            <div>
              <h3 className="font-black text-sm sm:text-base text-white line-clamp-1">
                {currentPhone.persianName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                پارت نامبر: {currentPhone.partNumber || 'اصلی'} | رنگ: {currentPhone.color}
              </p>
            </div>

            {/* Specs Tags */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2 border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 block">حافظه:</span>
                <span className="text-slate-200 font-bold">{currentPhone.storage}</span>
              </div>
              <div>
                <span className="text-slate-500 block">وضعیت بدنه:</span>
                <span className="text-yellow-400 font-bold">{currentPhone.conditionGrade} ({currentPhone.conditionText.slice(0, 15)}...)</span>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block">قیمت دست دوم ستاره:</span>
                <span className="text-lg font-black text-yellow-400">
                  {currentPhone.priceToman.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                </span>
              </div>

              <button
                onClick={() => setSelectedPhoneForModal(currentPhone)}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-4 py-2.5 text-xs flex items-center gap-1.5 transition rounded-xl shadow-lg shadow-yellow-400/20"
              >
                <Eye className="w-4 h-4" />
                <span>مشاهده جزئیات</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-400">
            هیچ گوشی کارکرده‌ای در این دسته‌بندی یافت نشد.
          </div>
        )}

        {/* PREV / NEXT CAROUSEL NAVIGATION */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => {
              setActivePhoneIndex((prev) => (prev > 0 ? prev - 1 : phonesList.length - 1));
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition"
          >
            <ChevronRight className="w-4 h-4" />
            <span>دستگاه قبلی</span>
          </button>

          <span className="font-mono text-slate-500 text-[11px]">
            {activePhoneIndex + 1} از {phonesList.length}
          </span>

          <button
            onClick={() => {
              setActivePhoneIndex((prev) => (prev < phonesList.length - 1 ? prev + 1 : 0));
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition"
          >
            <span>دستگاه بعدی</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* HELPER HINT & 360 PHONE ROTATION CONTROL PANEL IN TOP LEFT/RIGHT */}
      <div className="absolute top-20 right-4 sm:right-6 z-20 bg-slate-900/90 border border-slate-800 p-3 shadow-2xl backdrop-blur-md max-w-xs w-full text-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-yellow-400">
            <RotateCw className="w-4 h-4" />
            <span>چرخش ۳۶۰ درجه گوشی</span>
          </div>
          <button
            onClick={() => setIs360AutoSpin(!is360AutoSpin)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
              is360AutoSpin
                ? 'bg-yellow-400 text-slate-950 border-yellow-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {is360AutoSpin ? 'توقف اسپین' : 'اسپین ۳۶۰°'}
          </button>
        </div>

        {/* Preset Angle Buttons */}
        <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
          <button
            onClick={() => {
              setIs360AutoSpin(false);
              setIndividualPhoneRotationY(0);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 rounded text-center border border-slate-700 transition"
          >
            روبرو
          </button>
          <button
            onClick={() => {
              setIs360AutoSpin(false);
              setIndividualPhoneRotationY(Math.PI);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 rounded text-center border border-slate-700 transition"
          >
            پشت
          </button>
          <button
            onClick={() => {
              setIs360AutoSpin(false);
              setIndividualPhoneRotationY(Math.PI / 2);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 rounded text-center border border-slate-700 transition"
          >
            راست
          </button>
          <button
            onClick={() => {
              setIs360AutoSpin(false);
              setIndividualPhoneRotationY(-Math.PI / 2);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 rounded text-center border border-slate-700 transition"
          >
            چپ
          </button>
        </div>

        {/* 360 Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>زاویه دید:</span>
            <span>{Math.round(((individualPhoneRotationY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) * (180 / Math.PI))}°</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.05"
            value={((individualPhoneRotationY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)}
            onChange={(e) => {
              setIs360AutoSpin(false);
              setIndividualPhoneRotationY(parseFloat(e.target.value));
            }}
            className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* ADDED TO CART TOAST */}
      {addedToCartToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-6 py-3 text-xs flex items-center gap-2 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>گوشی کارکرده با موفقیت به سبد خرید شما اضافه گردید!</span>
        </div>
      )}

      {/* COPIED NOTIFICATION TOAST */}
      {copiedNotification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-slate-950 font-black px-6 py-3 text-xs flex items-center gap-2 shadow-2xl">
          <Check className="w-5 h-5 text-slate-950" />
          <span>اطلاعات دستگاه جهت اشتراک‌گذاری کپی شد!</span>
        </div>
      )}

      {/* DETAILED NOTIFICATION / MODAL POPUP FOR SELECTED USED PHONE */}
      {selectedPhoneForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-yellow-400/60 shadow-2xl text-white my-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 text-slate-950 font-black flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    شناسنامه فنی و استعلام کارکرده
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    سریال: {selectedPhoneForModal.serialNumber} | کد کارشناسی ستاره
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPhoneForModal(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Product Hero Banner inside modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80 p-4 border border-slate-800">
                
                {/* Image */}
                <div className="relative w-full h-56 bg-slate-900 border border-slate-800 flex items-center justify-center p-4 overflow-hidden group">
                  <img
                    src={selectedPhoneForModal.image}
                    alt={selectedPhoneForModal.persianName}
                    className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5">
                    گرید کیفیت: {selectedPhoneForModal.conditionGrade}
                  </div>
                </div>

                {/* Main Summary */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-yellow-400 font-bold block mb-1">
                      برند: {selectedPhoneForModal.brand}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      {selectedPhoneForModal.persianName}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedPhoneForModal.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">سلامت باتری:</span>
                      <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                        <BatteryCharging className="w-4 h-4" />
                        <span>{selectedPhoneForModal.batteryHealth}٪</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">وضعیت بدنه:</span>
                      <span className="text-yellow-400 font-bold text-[11px]">
                        {selectedPhoneForModal.conditionText}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">قیمت آکبند در بازار:</span>
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {selectedPhoneForModal.originalPriceToman?.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-yellow-300 block">قیمت خرید کارکرده:</span>
                      <span className="text-lg font-black text-yellow-400 font-mono">
                        {selectedPhoneForModal.priceToman.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Hardware Specs Grid */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sliders className="w-4 h-4 text-yellow-400" />
                  <span>مشخصات فنی و سخت‌افزاری دستگاه</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">صفحه نمایش</span>
                    <span className="font-bold text-slate-200">{selectedPhoneForModal.specs.screen}</span>
                  </div>

                  <div className="bg-slate-950 p-3 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">پردازنده مرکزی</span>
                    <span className="font-bold text-slate-200">{selectedPhoneForModal.specs.processor}</span>
                  </div>

                  <div className="bg-slate-950 p-3 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">حافظه داخلی / رم</span>
                    <span className="font-bold text-slate-200">{selectedPhoneForModal.storage} | {selectedPhoneForModal.ram}</span>
                  </div>

                  <div className="bg-slate-950 p-3 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">دوربین</span>
                    <span className="font-bold text-slate-200">{selectedPhoneForModal.specs.camera}</span>
                  </div>

                  <div className="bg-slate-950 p-3 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">پارت نامبر / سیم کارت</span>
                    <span className="font-bold text-slate-200">{selectedPhoneForModal.partNumber || 'اصلی'}</span>
                  </div>

                  <div className="bg-slate-950 p-3 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">ضمانت و مهلت تست</span>
                    <span className="font-bold text-emerald-400">{selectedPhoneForModal.guarantee}</span>
                  </div>
                </div>
              </div>

              {/* Repairs & Accessories Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Repairs History */}
                <div className="bg-slate-950 p-3.5 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Wrench className="w-4 h-4 text-yellow-400" />
                    <span>سابقه تعمیرات و اصالت قطعات</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {selectedPhoneForModal.repairsHistory}
                  </p>
                </div>

                {/* Box Items */}
                <div className="bg-slate-950 p-3.5 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Box className="w-4 h-4 text-yellow-400" />
                    <span>اقلام موجود در جعبه</span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {selectedPhoneForModal.boxItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Buttons inside Popup */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCartClick(selectedPhoneForModal)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-5 py-3 text-xs flex items-center gap-2 transition shadow-lg shadow-yellow-400/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>افزودن به سبد و رزرو کارکرده</span>
                  </button>

                  <a
                    href="tel:03152415779"
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 text-xs flex items-center gap-2 transition border border-slate-700"
                  >
                    <PhoneCall className="w-4 h-4 text-yellow-400" />
                    <span>استعلام تلفنی در مبارکه</span>
                  </a>
                </div>

                <button
                  onClick={() => handleSharePhone(selectedPhoneForModal)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                  title="اشتراک گذاری لینک دستگاه"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
