import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { useCartStore } from '@/stores/useCartStore';
import { Modal } from '@/components/ui/Modal';

interface ThreeSceneProps {
  selectedFurniture: string | null;
  onFurnitureCountChange: (count: number) => void;
  roomModelPath?: string;
}

export interface ThreeSceneHandle {
  loadCustomFurniture: (file: File) => void;
  loadFurnitureFromUrl: (url: string, name: string, productData?: any) => void;
  loadRoomModel: (path: string) => void;
  clearAllFurniture: () => void;
  resetCamera: () => void;
  toggleWireframe: () => void;
}

export const ThreeScene = forwardRef<ThreeSceneHandle, ThreeSceneProps>(({ onFurnitureCountChange, roomModelPath }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const furnitureObjectsRef = useRef<THREE.Group[]>([]);
  const selectedFurnitureRef = useRef<THREE.Group | null>(null);
  const roomModelRef = useRef<THREE.Group | null>(null);
  const roomFloorYRef = useRef<number>(0); // Nivel del suelo de la habitación
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const isDraggingRef = useRef(false);
  const wireframeModeRef = useRef(false);
  const isMovingFurnitureRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const placementIndicatorRef = useRef<THREE.Mesh | null>(null);
  
  // Estados para el panel de opciones del mueble
  const [showFurnitureOptions, setShowFurnitureOptions] = useState(false);
  const [selectedFurnitureData, setSelectedFurnitureData] = useState<any>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  
  // Store de carritos
  const { carts, addItem } = useCartStore();

  // Helper function: raycast para encontrar la superficie debajo de un punto
  const getRaycastSurfacePosition = (mouse: THREE.Vector2, camera: THREE.PerspectiveCamera): { position: THREE.Vector3, normal: THREE.Vector3 } | null => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Primero intentar intersectar con el modelo de la habitación
    if (roomModelRef.current) {
      const roomIntersects = raycaster.intersectObject(roomModelRef.current, true);
      if (roomIntersects.length > 0) {
        const hit = roomIntersects[0];
        return {
          position: hit.point.clone(),
          normal: hit.face?.normal.clone() || new THREE.Vector3(0, 1, 0)
        };
      }
    }

    // Si no hay habitación o no intersecta, usar un plano en el nivel del suelo
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -roomFloorYRef.current);
    const intersectPoint = new THREE.Vector3();
    const hasIntersection = raycaster.ray.intersectPlane(groundPlane, intersectPoint);
    
    if (hasIntersection) {
      return {
        position: intersectPoint,
        normal: new THREE.Vector3(0, 1, 0)
      };
    }

    return null;
  };

  // Helper function: calcular la altura correcta del objeto basado en su geometría
  const calculateObjectBaseHeight = (object: THREE.Group): number => {
    // Guardar la posición original
    const originalY = object.position.y;
    
    // Temporalmente colocar en Y=0 para calcular correctamente
    object.position.y = 0;
    object.updateMatrixWorld(true);
    
    const box = new THREE.Box3().setFromObject(object);
    
    // Restaurar posición original
    object.position.y = originalY;
    object.updateMatrixWorld(true);
    
    // La altura desde Y=0 hasta la base del objeto
    // Si bottomY es negativo, significa que la base está por debajo del origen
    // Si es positivo, está por encima
    const bottomY = box.min.y;
    
    // Retornar la distancia absoluta para elevar el objeto
    return Math.abs(bottomY);
  };

  // Helper function: posicionar objeto sobre una superficie con raycast
  const placeObjectOnSurface = (object: THREE.Group, position: THREE.Vector3) => {
    // Usar el nivel del suelo conocido como referencia
    let surfaceY = roomFloorYRef.current;
    
    // Si hay un modelo de habitación, hacer múltiples raycasts para mayor precisión
    if (roomModelRef.current) {
      const raycaster = new THREE.Raycaster();
      
      // Array para almacenar todas las alturas detectadas
      const surfaceHeights: number[] = [];
      
      // Hacer raycast en el centro y en un patrón circular alrededor
      const checkPoints = [
        { x: 0, z: 0 },      // Centro
        { x: 0.1, z: 0 },    // Derecha
        { x: -0.1, z: 0 },   // Izquierda
        { x: 0, z: 0.1 },    // Adelante
        { x: 0, z: -0.1 },   // Atrás
      ];
      
      for (const offset of checkPoints) {
        const testX = position.x + offset.x;
        const testZ = position.z + offset.z;
        // Raycast desde muy arriba (50m sobre el nivel del suelo)
        const rayOrigin = new THREE.Vector3(testX, roomFloorYRef.current + 50, testZ);
        const rayDirection = new THREE.Vector3(0, -1, 0);
        raycaster.set(rayOrigin, rayDirection);

        // Solo intersectar con el modelo de la habitación, no con muebles colocados
        const intersects = raycaster.intersectObject(roomModelRef.current, true);
        
        if (intersects.length > 0) {
          // Revisar todas las intersecciones para encontrar la superficie horizontal más alta
          for (const hit of intersects) {
            // Verificar que la normal de la superficie apunte hacia arriba
            if (hit.face) {
              const normal = hit.face.normal.clone();
              // Transformar la normal al espacio mundial
              const worldNormal = normal.transformDirection(hit.object.matrixWorld);
              
              // Si la normal apunta mayormente hacia arriba (Y > 0.7 significa ángulo < 45°)
              // Y está por encima del nivel actual del suelo
              if (worldNormal.y > 0.7 && hit.point.y >= surfaceY) {
                surfaceHeights.push(hit.point.y);
                break; // Tomar solo la primera superficie horizontal válida
              }
            }
          }
        }
      }
      
      // Si encontramos alturas válidas, usar el promedio para mayor estabilidad
      if (surfaceHeights.length > 0) {
        surfaceY = surfaceHeights.reduce((a, b) => a + b, 0) / surfaceHeights.length;
      }
    }

    // Calcular la altura base del objeto
    const baseHeight = calculateObjectBaseHeight(object);
    
    // Posicionar el objeto exactamente sobre la superficie
    object.position.set(position.x, surfaceY + baseHeight, position.z);
    object.userData.baseHeight = baseHeight;
    object.userData.surfaceY = surfaceY;
  };

  // Define functions before useEffect so they can be used in useImperativeHandle
  const loadCustomFurniture = (file: File) => {
    if (!sceneRef.current) return;

    const loader = new GLTFLoader();
    const url = URL.createObjectURL(file);

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centrar el modelo en su base
        model.position.sub(center);
        model.position.y += size.y / 2; // Elevar para que la base toque Y=0

        // Escalar a un tamaño razonable (0.5 a 1.5 metros)
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 1.0; // 1 metro
        const scale = targetSize / maxDim;
        model.scale.multiplyScalar(scale);

        // Usar el sistema de raycast para colocar en el centro
        const centerPosition = new THREE.Vector3(0, 0, 0);
        placeObjectOnSurface(model, centerPosition);

        model.userData.type = file.name;
        model.userData.isSelectable = true;
        model.userData.scale = 1.0;
        model.userData.isCustom = true;

        model.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.needsUpdate = true;
              if (child.material.map && rendererRef.current) {
                child.material.map.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
              }
            }
          }
        });

        sceneRef.current?.add(model);
        furnitureObjectsRef.current.push(model);
        onFurnitureCountChange(furnitureObjectsRef.current.length);
        
        // Seleccionar automáticamente el mueble recién cargado
        selectFurniture(model);
        
        URL.revokeObjectURL(url);
      },
      undefined,
      (error) => {
        console.error('Error loading custom furniture:', error);
        URL.revokeObjectURL(url);
      }
    );
  };

  const loadFurnitureFromUrl = (url: string, name: string, productData?: any) => {
    if (!sceneRef.current) return;

    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centrar el modelo
        model.position.sub(center);
        model.position.y += size.y / 2;

        // Escalar a tamaño razonable
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 1.0;
        const scale = targetSize / maxDim;
        model.scale.multiplyScalar(scale);

        // Usar el sistema de raycast para colocar en el centro
        const centerPosition = new THREE.Vector3(0, 0, 0);
        placeObjectOnSurface(model, centerPosition);

        model.userData.type = name;
        model.userData.isSelectable = true;
        model.userData.scale = 1.0;
        model.userData.isFromCatalog = true;
        
        // Guardar datos adicionales del producto si están disponibles
        if (productData) {
          model.userData.productData = productData;
        }

        model.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.needsUpdate = true;
              if (child.material.map && rendererRef.current) {
                child.material.map.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
              }
            }
          }
        });

        sceneRef.current?.add(model);
        furnitureObjectsRef.current.push(model);
        onFurnitureCountChange(furnitureObjectsRef.current.length);
        
        // Seleccionar automáticamente
        selectFurniture(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model from URL:', error);
      }
    );
  };

  const loadRoomModel = (path: string) => {
    if (!sceneRef.current) return;

    // Remover modelo de habitación anterior si existe
    if (roomModelRef.current) {
      sceneRef.current.remove(roomModelRef.current);
      roomModelRef.current = null;
    }

    setIsLoadingRoom(true);
    const loader = new GLTFLoader();

    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;

        // NO escalar ni centrar - mantener el modelo tal cual viene del escaneo
        model.userData.type = 'room';
        model.userData.isRoom = true;
        model.userData.isSelectable = false;

        // Configurar materiales para modelos escaneados con texturas
        model.traverse((child: any) => {
          if (child.isMesh) {
            if (child.material) {
              // Asegurar que es un material estándar
              if (!child.material.isMeshStandardMaterial && !child.material.isMeshPhysicalMaterial) {
                const oldMaterial = child.material;
                child.material = new THREE.MeshStandardMaterial({
                  map: oldMaterial.map,
                  color: oldMaterial.color || new THREE.Color(0xffffff),
                  roughness: 0.7,
                  metalness: 0.1
                });
              }

              // Mejorar calidad de texturas
              child.material.needsUpdate = true;
              
              // Configurar encoding correcto para texturas (Three.js r152+)
              if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
                if (rendererRef.current) {
                  child.material.map.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
                }
              }

              // Asegurar que recibe sombras (aunque no las proyecte)
              child.receiveShadow = true;
              child.castShadow = false;

              // Para modelos escaneados, ajustar propiedades de material
              child.material.roughness = 0.8;
              child.material.metalness = 0.0;
              
              // Habilitar double-side para evitar caras faltantes
              child.material.side = THREE.DoubleSide;
            }
          }
        });

        sceneRef.current?.add(model);
        roomModelRef.current = model;
        setIsLoadingRoom(false);

        // Calcular el nivel del suelo (Y mínimo del modelo)
        const box = new THREE.Box3().setFromObject(model);
        roomFloorYRef.current = box.min.y;
        console.log('Nivel del suelo detectado:', roomFloorYRef.current);

        // Ajustar cámara para ver toda la habitación
        if (cameraRef.current) {
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const distance = maxDim * 1.2;
          
          // Posicionar cámara desde un ángulo que muestre bien la habitación
          cameraRef.current.position.set(
            center.x + distance * 0.7,
            center.y + size.y * 0.4,
            center.z + distance * 0.7
          );
          cameraRef.current.lookAt(center);
          
          console.log('Habitación cargada:', {
            center: center.toArray(),
            size: size.toArray(),
            cameraPosition: cameraRef.current.position.toArray()
          });
        }
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Cargando habitación: ${percent.toFixed(0)}%`);
      },
      (error) => {
        console.error('Error loading room model:', error);
        setIsLoadingRoom(false);
        alert('Error al cargar la habitación. Verifica que el archivo GLB sea válido.');
      }
    );
  };

  const clearAllFurniture = () => {
    if (!sceneRef.current) return;

    furnitureObjectsRef.current.forEach(obj => sceneRef.current?.remove(obj));
    furnitureObjectsRef.current = [];
    selectedFurnitureRef.current = null;
    onFurnitureCountChange(0);
  };

  const resetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 1.5, 3);
    cameraRef.current.lookAt(0, 0, 0);
  };

  const toggleWireframe = () => {
    wireframeModeRef.current = !wireframeModeRef.current;
    
    if (sceneRef.current) {
      sceneRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = wireframeModeRef.current;
        }
      });
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    loadCustomFurniture,
    loadFurnitureFromUrl,
    loadRoomModel,
    clearAllFurniture,
    resetCamera,
    toggleWireframe
  }));

  // Cargar modelo de habitación al montar si se proporciona
  useEffect(() => {
    if (roomModelPath && sceneRef.current) {
      loadRoomModel(roomModelPath);
    }
  }, [roomModelPath]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0E27);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: false
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    
    // Configuración de tono para mejor visualización
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights - Configuración optimizada para modelos escaneados
    // Luz ambiental más intensa para iluminar bien las texturas
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Luz principal desde arriba
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    scene.add(mainLight);

    // Luz de relleno suave
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Luz hemisférica para simular luz natural
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Crear indicador de colocación
    const placementGeometry = new THREE.CircleGeometry(0.3, 32);
    const placementMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00D4AA, 
      transparent: true, 
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const placementIndicator = new THREE.Mesh(placementGeometry, placementMaterial);
    placementIndicator.rotation.x = -Math.PI / 2; // Horizontal
    placementIndicator.visible = false;
    scene.add(placementIndicator);
    placementIndicatorRef.current = placementIndicator;

    // No agregar geometrías de suelo y paredes - el modelo escaneado las incluye

    setIsLoading(false);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Mouse controls
    const canvas = renderer.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, cameraRef.current!);

        const intersects = raycaster.intersectObjects(furnitureObjectsRef.current, true);

        if (intersects.length > 0) {
          let furniture = intersects[0].object as any;
          while (furniture.parent && !furniture.userData.isSelectable) {
            furniture = furniture.parent;
          }
          if (furniture.userData.isSelectable) {
            selectFurniture(furniture);
            isMovingFurnitureRef.current = true;
            return;
          }
        } else {
          deselectFurniture();
        }

        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMovingFurnitureRef.current && selectedFurnitureRef.current) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (!cameraRef.current) return;

        // Usar el sistema de raycast mejorado
        const surfaceData = getRaycastSurfacePosition(mouse, cameraRef.current);
        
        if (surfaceData) {
          // Mostrar indicador en la posición
          if (placementIndicatorRef.current) {
            placementIndicatorRef.current.visible = true;
            placementIndicatorRef.current.position.copy(surfaceData.position);
            placementIndicatorRef.current.position.y += 0.01; // Ligeramente encima de la superficie
          }
          
          // Colocar el objeto sobre la superficie detectada
          placeObjectOnSurface(selectedFurnitureRef.current, surfaceData.position);
        }
      } else if (isDraggingRef.current && cameraRef.current) {
        // Ocultar indicador cuando no se mueve mueble
        if (placementIndicatorRef.current) {
          placementIndicatorRef.current.visible = false;
        }
        
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        const radius = Math.sqrt(
          cameraRef.current.position.x ** 2 + 
          cameraRef.current.position.z ** 2
        );

        const currentAngle = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);
        const newAngle = currentAngle - deltaX * 0.01;

        cameraRef.current.position.x = radius * Math.cos(newAngle);
        cameraRef.current.position.z = radius * Math.sin(newAngle);
        cameraRef.current.position.y = Math.max(0.5, Math.min(5, cameraRef.current.position.y + deltaY * 0.01));

        cameraRef.current.lookAt(0, 0, 0);

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      isMovingFurnitureRef.current = false;
      
      // Ocultar indicador de colocación
      if (placementIndicatorRef.current) {
        placementIndicatorRef.current.visible = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;

      const radius = Math.sqrt(
        cameraRef.current.position.x ** 2 + 
        cameraRef.current.position.z ** 2
      );
      const newRadius = Math.max(1, Math.min(10, radius + e.deltaY * 0.01));
      const angle = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);

      cameraRef.current.position.x = newRadius * Math.cos(angle);
      cameraRef.current.position.z = newRadius * Math.sin(angle);
      cameraRef.current.lookAt(0, 0, 0);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Drop event for furniture
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const furnitureType = e.dataTransfer?.getData('furnitureType');
      if (!furnitureType || !cameraRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Usar el sistema de raycast mejorado
      const surfaceData = getRaycastSurfacePosition(mouse, cameraRef.current);
      
      if (surfaceData) {
        createFurniture(furnitureType, surfaceData.position);
      }
      
      // Ocultar indicador después de soltar
      if (placementIndicatorRef.current) {
        placementIndicatorRef.current.visible = false;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      
      // Mostrar indicador durante drag
      if (e.dataTransfer?.types.includes('furnituretype') && cameraRef.current) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const surfaceData = getRaycastSurfacePosition(mouse, cameraRef.current);
        
        if (surfaceData && placementIndicatorRef.current) {
          placementIndicatorRef.current.visible = true;
          placementIndicatorRef.current.position.copy(surfaceData.position);
          placementIndicatorRef.current.position.y += 0.01;
        }
      }
    };

    const handleDragLeave = () => {
      // Ocultar indicador cuando el drag sale del canvas
      if (placementIndicatorRef.current) {
        placementIndicatorRef.current.visible = false;
      }
    };

    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('dragleave', handleDragLeave);

    // Controles de teclado para manipular muebles
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFurnitureRef.current) return;

      const furniture = selectedFurnitureRef.current;
      const moveStep = 0.1; // 10cm por paso
      const rotateStep = Math.PI / 16; // 11.25 grados
      const scaleStep = 0.05; // 5% por paso

      switch(e.key.toLowerCase()) {
        // Mover con flechas
        case 'arrowup':
        case 'w':
          furniture.position.z -= moveStep;
          placeObjectOnSurface(furniture, furniture.position);
          break;
        case 'arrowdown':
        case 's':
          furniture.position.z += moveStep;
          placeObjectOnSurface(furniture, furniture.position);
          break;
        case 'arrowleft':
        case 'a':
          furniture.position.x -= moveStep;
          placeObjectOnSurface(furniture, furniture.position);
          break;
        case 'arrowright':
        case 'd':
          furniture.position.x += moveStep;
          placeObjectOnSurface(furniture, furniture.position);
          break;

        // Rotar con Q/E
        case 'q':
          furniture.rotation.y += rotateStep;
          break;
        case 'e':
          furniture.rotation.y -= rotateStep;
          break;

        // Escalar con +/-
        case '+':
        case '=':
          furniture.userData.scale = (furniture.userData.scale || 1.0) + scaleStep;
          furniture.scale.setScalar(furniture.userData.scale);
          // Reposicionar sobre la superficie después de escalar
          placeObjectOnSurface(furniture, furniture.position);
          break;
        case '-':
        case '_':
          const newScale = Math.max(0.2, (furniture.userData.scale || 1.0) - scaleStep);
          furniture.userData.scale = newScale;
          furniture.scale.setScalar(newScale);
          // Reposicionar sobre la superficie después de escalar
          placeObjectOnSurface(furniture, furniture.position);
          break;

        // Eliminar con Delete o Backspace
        case 'delete':
        case 'backspace':
          e.preventDefault();
          if (sceneRef.current) {
            sceneRef.current.remove(furniture);
            const index = furnitureObjectsRef.current.indexOf(furniture);
            if (index > -1) {
              furnitureObjectsRef.current.splice(index, 1);
              onFurnitureCountChange(furnitureObjectsRef.current.length);
            }
            deselectFurniture();
          }
          break;

        // Deseleccionar con Escape
        case 'escape':
          deselectFurniture();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('dragleave', handleDragLeave);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const createFurniture = (type: string, position: THREE.Vector3) => {
    if (!sceneRef.current) return;

    const furniture = createFurnitureGeometry(type);
    if (!furniture) return;

    // Usar el sistema de raycast para colocar sobre la superficie
    placeObjectOnSurface(furniture, position);

    furniture.userData.type = type;
    furniture.userData.isSelectable = true;
    furniture.userData.scale = 1.0;

    sceneRef.current.add(furniture);
    furnitureObjectsRef.current.push(furniture);
    onFurnitureCountChange(furnitureObjectsRef.current.length);
    
    // Seleccionar automáticamente
    selectFurniture(furniture);
  };

  const createFurnitureGeometry = (type: string): THREE.Group | null => {
    const colors = {
      primary: 0x4C6FFF,
      secondary: 0x00D4AA,
      accent: 0xFF4C6F,
      neutral: 0x2D3561
    };

    const furniture = new THREE.Group();

    switch(type) {
      case 'sofa':
        const sofaBase = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.3, 0.6),
          new THREE.MeshStandardMaterial({ color: colors.primary })
        );
        sofaBase.position.y = 0.15;
        furniture.add(sofaBase);
        
        const sofaBack = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.5, 0.1),
          new THREE.MeshStandardMaterial({ color: colors.primary })
        );
        sofaBack.position.set(0, 0.4, -0.25);
        furniture.add(sofaBack);
        break;

      case 'table':
        const tableTop = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.05, 1),
          new THREE.MeshStandardMaterial({ color: colors.neutral })
        );
        tableTop.position.y = 0.5;
        furniture.add(tableTop);
        
        const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5);
        const legMaterial = new THREE.MeshStandardMaterial({ color: colors.neutral });
        const positions = [[-0.4, 0.25, -0.4], [0.4, 0.25, -0.4], [-0.4, 0.25, 0.4], [0.4, 0.25, 0.4]];
        positions.forEach(pos => {
          const leg = new THREE.Mesh(legGeometry, legMaterial);
          leg.position.set(pos[0], pos[1], pos[2]);
          furniture.add(leg);
        });
        break;

      case 'chair':
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.05, 0.4),
          new THREE.MeshStandardMaterial({ color: colors.secondary })
        );
        seat.position.y = 0.3;
        furniture.add(seat);
        
        const chairBack = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.4, 0.05),
          new THREE.MeshStandardMaterial({ color: colors.secondary })
        );
        chairBack.position.set(0, 0.5, -0.175);
        furniture.add(chairBack);
        break;

      case 'bed':
        const mattress = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.2, 1.8),
          new THREE.MeshStandardMaterial({ color: colors.accent })
        );
        mattress.position.y = 0.25;
        furniture.add(mattress);
        
        const headboard = new THREE.Mesh(
          new THREE.BoxGeometry(1.3, 0.6, 0.1),
          new THREE.MeshStandardMaterial({ color: colors.accent })
        );
        headboard.position.set(0, 0.5, -0.85);
        furniture.add(headboard);
        break;

      case 'lamp':
        const lampBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.03),
          new THREE.MeshStandardMaterial({ color: colors.neutral })
        );
        lampBase.position.y = 0.015;
        furniture.add(lampBase);
        
        const lampPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 1),
          new THREE.MeshStandardMaterial({ color: colors.neutral })
        );
        lampPole.position.y = 0.5;
        furniture.add(lampPole);
        
        const lampShade = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.25, 8),
          new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            emissive: 0xFFD700,
            emissiveIntensity: 0.3
          })
        );
        lampShade.position.y = 1.1;
        furniture.add(lampShade);
        break;

      case 'plant':
        const pot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.1, 0.2),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        pot.position.y = 0.1;
        furniture.add(pot);
        
        const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        for(let i = 0; i < 5; i++) {
          const leaf = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            plantMaterial
          );
          const angle = (i / 5) * Math.PI * 2;
          leaf.position.set(
            Math.cos(angle) * 0.1,
            0.3 + Math.random() * 0.15,
            Math.sin(angle) * 0.1
          );
          furniture.add(leaf);
        }
        break;

      case 'bookshelf':
        const shelfBase = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1.5, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        shelfBase.position.y = 0.75;
        furniture.add(shelfBase);
        
        for(let i = 0; i < 4; i++) {
          const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 0.02, 0.28),
            new THREE.MeshStandardMaterial({ color: 0xA0522D })
          );
          shelf.position.set(0, 0.2 + i * 0.35, 0);
          furniture.add(shelf);
        }
        break;

      case 'tv':
        const tvScreen = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.7, 0.05),
          new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            emissive: 0x1a1a2e,
            emissiveIntensity: 0.5
          })
        );
        tvScreen.position.y = 0.5;
        furniture.add(tvScreen);
        
        const tvStand = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.3, 0.2),
          new THREE.MeshStandardMaterial({ color: colors.neutral })
        );
        tvStand.position.y = 0.15;
        furniture.add(tvStand);
        break;

      case 'desk':
        const deskTop = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.05, 0.6),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        deskTop.position.y = 0.75;
        furniture.add(deskTop);
        
        const deskLeg1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.75, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        deskLeg1.position.set(-0.55, 0.375, -0.25);
        furniture.add(deskLeg1);
        
        const deskLeg2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.75, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        deskLeg2.position.set(0.55, 0.375, -0.25);
        furniture.add(deskLeg2);
        break;

      case 'dresser':
        const dresserBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 1, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        dresserBody.position.y = 0.5;
        furniture.add(dresserBody);
        
        for(let i = 0; i < 3; i++) {
          const drawer = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.25, 0.02),
            new THREE.MeshStandardMaterial({ color: 0xA0522D })
          );
          drawer.position.set(0, 0.2 + i * 0.3, 0.2);
          furniture.add(drawer);
          
          const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.02, 0.03),
            new THREE.MeshStandardMaterial({ color: 0x444444 })
          );
          handle.position.set(0, 0.2 + i * 0.3, 0.22);
          furniture.add(handle);
        }
        break;

      case 'nightstand':
        const nightstandBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.5, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        nightstandBody.position.y = 0.25;
        furniture.add(nightstandBody);
        
        const nightDrawer = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.15, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xA0522D })
        );
        nightDrawer.position.set(0, 0.25, 0.2);
        furniture.add(nightDrawer);
        break;

      case 'armchair':
        const armchairSeat = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.3, 0.6),
          new THREE.MeshStandardMaterial({ color: colors.accent })
        );
        armchairSeat.position.y = 0.3;
        furniture.add(armchairSeat);
        
        const armchairBack = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.5, 0.1),
          new THREE.MeshStandardMaterial({ color: colors.accent })
        );
        armchairBack.position.set(0, 0.5, -0.25);
        furniture.add(armchairBack);
        
        const armrest1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.3, 0.5),
          new THREE.MeshStandardMaterial({ color: colors.accent })
        );
        armrest1.position.set(-0.3, 0.4, 0);
        furniture.add(armrest1);
        
        const armrest2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.3, 0.5),
          new THREE.MeshStandardMaterial({ color: colors.accent })
        );
        armrest2.position.set(0.3, 0.4, 0);
        furniture.add(armrest2);
        break;

      case 'coffeetable':
        const coffeeTop = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.05, 0.6),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        coffeeTop.position.y = 0.3;
        furniture.add(coffeeTop);
        
        const coffeeLegs = [[0.4, 0.15, 0.25], [-0.4, 0.15, 0.25], [0.4, 0.15, -0.25], [-0.4, 0.15, -0.25]];
        coffeeLegs.forEach(pos => {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x654321 })
          );
          leg.position.set(pos[0], pos[1], pos[2]);
          furniture.add(leg);
        });
        break;

      case 'rug':
        const rug = new THREE.Mesh(
          new THREE.BoxGeometry(2, 0.02, 1.5),
          new THREE.MeshStandardMaterial({ 
            color: colors.accent,
            roughness: 0.9
          })
        );
        rug.position.y = 0.01;
        furniture.add(rug);
        break;

      case 'mirror':
        const mirrorFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 1.2, 0.05),
          new THREE.MeshStandardMaterial({ color: 0xFFD700 })
        );
        mirrorFrame.position.y = 0.6;
        furniture.add(mirrorFrame);
        
        const mirrorGlass = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 1.1, 0.02),
          new THREE.MeshStandardMaterial({ 
            color: 0xCCCCCC,
            metalness: 1,
            roughness: 0.1
          })
        );
        mirrorGlass.position.set(0, 0.6, 0.02);
        furniture.add(mirrorGlass);
        break;

      case 'cabinet':
        const cabinetBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 1.2, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        cabinetBody.position.y = 0.6;
        furniture.add(cabinetBody);
        
        const door1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 1.1, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xA0522D })
        );
        door1.position.set(-0.15, 0.6, 0.2);
        furniture.add(door1);
        
        const door2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 1.1, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xA0522D })
        );
        door2.position.set(0.15, 0.6, 0.2);
        furniture.add(door2);
        break;

      case 'bench':
        const benchSeat = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.1, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        benchSeat.position.y = 0.4;
        furniture.add(benchSeat);
        
        const benchLegGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.08);
        const benchLegMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const benchLegs = [[0.5, 0.2, 0.15], [-0.5, 0.2, 0.15], [0.5, 0.2, -0.15], [-0.5, 0.2, -0.15]];
        benchLegs.forEach(pos => {
          const leg = new THREE.Mesh(benchLegGeometry, benchLegMaterial);
          leg.position.set(pos[0], pos[1], pos[2]);
          furniture.add(leg);
        });
        break;

      case 'stool':
        const stoolTop = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.2, 0.05),
          new THREE.MeshStandardMaterial({ color: colors.secondary })
        );
        stoolTop.position.y = 0.5;
        furniture.add(stoolTop);
        
        const stoolLeg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.08, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        stoolLeg.position.y = 0.25;
        furniture.add(stoolLeg);
        
        const footRest = new THREE.Mesh(
          new THREE.TorusGeometry(0.15, 0.02, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0x444444 })
        );
        footRest.position.y = 0.2;
        footRest.rotation.x = Math.PI / 2;
        furniture.add(footRest);
        break;

      default:
        return null;
    }

    return furniture;
  };

  const selectFurniture = (furniture: THREE.Group) => {
    if (selectedFurnitureRef.current) {
      selectedFurnitureRef.current.traverse(child => {
        if ((child as any).isMesh && (child as any).material.emissive) {
          (child as any).material.emissive.setHex(0x000000);
        }
      });
    }

    selectedFurnitureRef.current = furniture;

    if (selectedFurnitureRef.current) {
      selectedFurnitureRef.current.traverse(child => {
        if ((child as any).isMesh && (child as any).material.emissive) {
          (child as any).material.emissive.setHex(0x00D4AA);
          (child as any).material.emissiveIntensity = 0.3;
        }
      });
      
      // Mostrar panel de opciones con información del mueble
      setSelectedFurnitureData({
        name: furniture.userData.type || 'Mueble',
        isCustom: furniture.userData.isCustom || false,
        isFromCatalog: furniture.userData.isFromCatalog || false,
        scale: furniture.userData.scale || 1.0,
        position: {
          x: furniture.position.x.toFixed(2),
          y: furniture.position.y.toFixed(2),
          z: furniture.position.z.toFixed(2)
        }
      });
      setShowFurnitureOptions(true);
    }
  };

  const deselectFurniture = () => {
    if (selectedFurnitureRef.current) {
      selectedFurnitureRef.current.traverse(child => {
        if ((child as any).isMesh && (child as any).material.emissive) {
          (child as any).material.emissive.setHex(0x000000);
        }
      });
      selectedFurnitureRef.current = null;
    }
    setShowFurnitureOptions(false);
    setSelectedFurnitureData(null);
  };
  
  const handleDeleteFurniture = () => {
    if (selectedFurnitureRef.current && sceneRef.current) {
      sceneRef.current.remove(selectedFurnitureRef.current);
      const index = furnitureObjectsRef.current.indexOf(selectedFurnitureRef.current);
      if (index > -1) {
        furnitureObjectsRef.current.splice(index, 1);
      }
      onFurnitureCountChange(furnitureObjectsRef.current.length);
      deselectFurniture();
    }
  };
  
  const handleAddToCart = () => {
    setShowCartModal(true);
  };
  
  const handleCartSelection = (cartId: string) => {
    if (selectedFurnitureData && selectedFurnitureRef.current) {
      // Si el mueble tiene datos de producto guardados, usarlos
      const productData = selectedFurnitureRef.current.userData.productData;
      
      const product = productData ? {
        // Usar los datos reales del producto del catálogo
        id: productData.id || `furniture-${Date.now()}`,
        sku: productData.sku,
        name: productData.name,
        price: productData.price,
        currency: productData.currency || 'CLP',
        image: productData.image || productData.images?.[0],
        images: productData.images,
        catalog: productData.catalog || 'Catálogo',
        catalogId: productData.catalogId
      } : {
        // Crear producto genérico para muebles personalizados
        id: `furniture-${Date.now()}`,
        sku: 'CUSTOM-' + Date.now(),
        name: selectedFurnitureData.name,
        price: 0,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        catalog: 'Personalizado',
        catalogId: 'custom'
      };
      
      addItem(cartId, product);
      setShowCartModal(false);
      setShowFurnitureOptions(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0E27]/80 backdrop-blur-sm z-10">
          <div className="w-12 h-12 border-3 border-[#2D3561] border-t-[#4C6FFF] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-sm">Inicializando escena 3D...</p>
        </div>
      )}
      {isLoadingRoom && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0E27]/80 backdrop-blur-sm z-10">
          <div className="w-12 h-12 border-3 border-[#2D3561] border-t-[#00D4AA] rounded-full animate-spin mb-4"></div>
          <p className="text-[#00D4AA] text-sm font-semibold">Cargando habitación escaneada...</p>
        </div>
      )}
      
      {/* Panel de opciones del mueble */}
      {showFurnitureOptions && selectedFurnitureData && (
        <div className="absolute top-4 right-4 bg-[#1A1F3A]/95 backdrop-blur-sm border border-[#2D3561] rounded-lg shadow-xl p-3 w-48 z-20">
          <div className="mb-2">
            <p className="text-white text-sm font-medium mb-1">{selectedFurnitureData.name}</p>
            <p className="text-gray-400 text-[10px] font-mono">
              {selectedFurnitureData.position.x}, {selectedFurnitureData.position.y}, {selectedFurnitureData.position.z}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#4C6FFF] hover:bg-[#3D5CFF] text-white p-2 rounded transition-colors flex items-center justify-center"
              title="Agregar al carrito"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            
            <button
              onClick={handleDeleteFurniture}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded transition-colors flex items-center justify-center"
              title="Eliminar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button
              onClick={() => setShowFurnitureOptions(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de selección de carrito */}
      <Modal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        title="Seleccionar carrito"
      >
        <div className="space-y-4 px-6 py-4">
          <p className="text-sm text-gray-600">
            ¿A qué carrito deseas agregar este mueble?
          </p>
          
          {selectedFurnitureData && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    {selectedFurnitureData.isFromCatalog ? 'De catálogo' : 'Personalizado'}
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedFurnitureData.name}</p>
                  <p className="text-sm font-bold text-primary-600 mt-1">
                    {selectedFurnitureData.isFromCatalog ? '$150.000' : 'Personalizado'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Selecciona el cliente</p>
            <div className="space-y-3">
              {carts.map((cart) => (
                <button
                  key={cart.id}
                  onClick={() => handleCartSelection(cart.id)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{cart.clientName}</h3>
                      <p className="text-sm text-gray-500">
                        {cart.items.length === 0 ? 'Carrito vacío' : `${cart.items.length} ${cart.items.length === 1 ? 'producto' : 'productos'}`}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});
