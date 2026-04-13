// ============================================
// PREMIUM 3D CHROME — Photorealistic Silver
// + FLOWING LIGHT STREAKS behind the text
// ============================================

import * as THREE from 'three';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const loader = new FontLoader();
loader.load(
    './helvetiker_bold.typeface.json',
    function (font) {
        document.fonts.ready.then(() => {
            setTimeout(() => init3DChrome(font), 200);
        });
    },
    undefined,
    function (err) {
        console.error('Font load error:', err);
    }
);

function init3DChrome(font) {
    const canvas = document.getElementById('chrome-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // Renderer — maximum quality
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ═══════════════════════════════════════════
    // PROCEDURAL STUDIO HDRI
    // ═══════════════════════════════════════════
    function createStudioHDRI() {
        // Çözünürlüğü 256'ya indirdik (2048x2048'de 16.7 Milyon döngü yapıp siteyi ilk saniyede felç ediyordu!)
        // 256 fazlasıyla yeterli çünkü PMREM ortam haritasını zaten blur'layıp fırınlıyor.
        const size = 256;
        const data = new Float32Array(size * size * 4);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const idx = (y * size + x) * 4;
                const u = x / size;
                const v = y / size;
                const phi = u * Math.PI * 2;
                const theta = v * Math.PI;
                const cosTheta = Math.cos(theta);
                const sinTheta = Math.sin(theta);

                // --- STUDIO INFINITY COVE ---
                // Smooth gradient: bright ceiling fading to dark floor
                // This creates the classic chrome "horizon line" reflection
                const coveGradient = Math.max(0, Math.pow(Math.max(0, cosTheta), 0.4)) * 2.5;

                // Dark floor reflection (very subtle)
                const floorDark = Math.max(0, -cosTheta) * 0.02;

                let brightness = coveGradient + floorDark;

                // --- KEY SOFTBOX --- (large, slightly left-of-center overhead)
                const keyTheta = Math.exp(-Math.pow((theta - 0.45) * 1.8, 2));
                const keyPhi = Math.exp(-Math.pow((phi - 2.8) * 0.2, 2));
                brightness += keyTheta * keyPhi * 6.0;

                // --- FILL SOFTBOX --- (right side, dimmer, wider)
                const fillTheta = Math.exp(-Math.pow((theta - 0.7) * 2.2, 2));
                const fillPhi = Math.exp(-Math.pow((phi - 5.2) * 0.18, 2));
                brightness += fillTheta * fillPhi * 2.0;

                // --- HORIZON STRIP --- crisp bright line at equator
                // This is what gives chrome that signature bright horizontal band
                const horizonStrip = Math.exp(-Math.pow((theta - 1.57) * 12.0, 2));
                brightness += horizonStrip * 3.5;

                // --- NEGATIVE FILL --- dark panels to create contrast
                // Without dark areas, chrome looks flat. Black panels are crucial.
                const negFill1 = Math.exp(-Math.pow((theta - 1.2) * 3.5, 2)) *
                                 Math.exp(-Math.pow((phi - 0.5) * 0.4, 2));
                brightness *= (1.0 - negFill1 * 0.85);

                const negFill2 = Math.exp(-Math.pow((theta - 1.4) * 4.0, 2)) *
                                 Math.exp(-Math.pow((phi - 4.0) * 0.35, 2));
                brightness *= (1.0 - negFill2 * 0.7);

                // --- RIM / KICKER --- (from behind-below, for edge definition)
                const rimTheta = Math.exp(-Math.pow((theta - 2.3) * 2.5, 2));
                const rimPhi = Math.exp(-Math.pow((phi - 3.5) * 0.25, 2));
                brightness += rimTheta * rimPhi * 1.5;

                // Clamp negatives
                brightness = Math.max(brightness, 0.001);

                // Neutral silver tone — very slight cool shift
                data[idx]     = brightness * 0.96;
                data[idx + 1] = brightness * 0.97;
                data[idx + 2] = brightness * 1.03;
                data[idx + 3] = 1.0;
            }
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.needsUpdate = true;
        return texture;
    }

    const envMap = createStudioHDRI();

    // ═══════════════════════════════════════════
    // ANAMORPHIC LIGHT STREAKS — Cinematic shader
    // Fullscreen GLSL plane behind text
    // ═══════════════════════════════════════════
    const streakPlaneGeo = new THREE.PlaneGeometry(50, 30);
    const streakMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform float uGlobalOpacity;
            uniform vec2 uResolution;

            // Hash for pseudo-random
            float hash(float n) { return fract(sin(n) * 43758.5453123); }

            void main() {
                vec2 uv = vUv;
                float totalGlow = 0.0;

                // 18 horizontal streaks at different Y positions
                for (int i = 0; i < 18; i++) {
                    float fi = float(i);
                    
                    // Random but stable Y position for this streak
                    float yPos = hash(fi * 7.31) * 0.85 + 0.075; // 0.075 to 0.925
                    
                    // Speed & direction (all right-to-left conceptually via offset)
                    float speed = 1.525 + hash(fi * 3.17) * 0.045;
                    float offset = fract(uTime * speed + hash(fi * 11.3));
                    
                    // Streak X center moves across screen
                    float xCenter = offset * 1.8 - 0.4; // overscan range
                    
                    // Streak length (how far it stretches horizontally)
                    float streakLen = 0.15 + hash(fi * 5.53) * 0.35;
                    
                    // Horizontal falloff: bright center, fading to edges
                    float dx = uv.x - xCenter;
                    // Asymmetric: sharp leading edge, long trailing fade
                    float xFade;
                    if (dx > 0.0) {
                        // Trail side (behind the motion) - longer fade
                        xFade = exp(-dx * dx / (streakLen * streakLen * 0.8));
                    } else {
                        // Leading edge - sharper
                        xFade = exp(-dx * dx / (streakLen * streakLen * 0.15));
                    }
                    
                    // Vertical thickness: thin gaussian band
                    float thickness = 0.003 + hash(fi * 9.71) * 0.008;
                    float dy = uv.y - yPos;
                    float yFade = exp(-dy * dy / (thickness * thickness));
                    
                    // Outer soft glow (wider, dimmer)
                    float glowThickness = thickness * 6.0;
                    float yGlow = exp(-dy * dy / (glowThickness * glowThickness)) * 0.15;
                    
                    // Brightness varies per streak
                    float brightness = 0.3 + hash(fi * 2.91) * 0.7;
                    
                    // Pulsing: subtle brightness variation over time
                    float pulse = 0.7 + 0.3 * sin(uTime * (0.5 + hash(fi * 4.23) * 1.5) + fi);
                    
                    totalGlow += (yFade + yGlow) * xFade * brightness * pulse;
                }
                
                // Clamp and tone
                totalGlow = min(totalGlow, 2.0);
                
                // Edge fade: hide streaks in top & bottom regions (nav/footer) + sides
                float edgeFadeY = smoothstep(0.15, 0.28, uv.y) * smoothstep(0.15, 0.28, 1.0 - uv.y);
                float edgeFadeX = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x);
                totalGlow *= edgeFadeY * edgeFadeX;
                
                // Slight warm-cool color: mostly white with very subtle blue tint
                vec3 color = vec3(0.95, 0.97, 1.0) * totalGlow;
                
                gl_FragColor = vec4(color, totalGlow * uGlobalOpacity * 0.5);
            }
        `,
        uniforms: {
            uTime: { value: 0 },
            uGlobalOpacity: { value: 0 },
            uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const streakPlane = new THREE.Mesh(streakPlaneGeo, streakMaterial);
    streakPlane.position.z = -4; // Behind text
    scene.add(streakPlane);

    // ═══════════════════════════════════════════
    // 3D TEXT GEOMETRY — Ultra smooth
    // ═══════════════════════════════════════════
    const textGeo = new TextGeometry('DSE', {
        font: font,
        size: 4.2,
        height: 1.2,
        // Site yüklenirken CPU'yu kilitlememesi için poligon sayısını yarıya indirdik (görsel kayıp yaşanmaz)
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.22,
        bevelSize: 0.14,
        bevelOffset: 0,
        bevelSegments: 4
    });

    textGeo.computeBoundingBox();
    const center = new THREE.Vector3();
    textGeo.boundingBox.getCenter(center);
    textGeo.translate(-center.x, -center.y, -center.z);
    textGeo.computeVertexNormals();

    // ═══════════════════════════════════════════
    // MATERIAL — Anthracite Gunmetal
    // ═══════════════════════════════════════════
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x2a2a30,
        metalness: 1.0,
        roughness: 0.22,
        envMap: envMap,
        envMapIntensity: 1.6,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
        reflectivity: 0.95,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0,
    });

    const textMesh = new THREE.Mesh(textGeo, material);
    textMesh.scale.set(1.25, 1, 1); // Wider letters
    scene.add(textMesh);

    // ═══════════════════════════════════════════
    // LIGHTS — Edge definition for dark metal
    // ═══════════════════════════════════════════
    const sweepLight = new THREE.DirectionalLight(0xffffff, 0);
    sweepLight.position.set(-10, 2, 8);
    scene.add(sweepLight);

    const keyLight = new THREE.DirectionalLight(0xeef0ff, 1.8);
    keyLight.position.set(-4, 5, 9);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde0f0, 0.5);
    fillLight.position.set(6, 0, 7);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc0c5dd, 1.2);
    rimLight.position.set(2, 2, -7);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xf5f5ff, 0.7);
    topLight.position.set(0, 8, 2);
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x0a0a14, 0.2);
    scene.add(ambientLight);

    // ═══════════════════════════════════════════
    // MOUSE INTERACTION
    // ═══════════════════════════════════════════
    let mouseSmX = 0.5, mouseSmY = 0.5;
    let targetMX = 0.5, targetMY = 0.5;
    let currentOpacity = 0;
    let targetOpacity = 0;
    let isPaused = document.body.classList.contains('opening-active');
    let hiddenByVisibility = document.hidden;

    document.addEventListener('mousemove', (e) => {
        targetMX = e.clientX / window.innerWidth;
        targetMY = e.clientY / window.innerHeight;
    });
    document.addEventListener('visibilitychange', () => {
        hiddenByVisibility = document.hidden;
    });

    // ═══════════════════════════════════════════
    // RESIZE
    // ═══════════════════════════════════════════
    function onResize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;

        // Mobile scaling: pull the camera back so DSE doesn't clip
        if (w < 768) {
            camera.position.z = 32; 
        } else {
            camera.position.z = 22;
        }

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        streakMaterial.uniforms.uResolution.value.set(w, h);
    }
    onResize();
    window.addEventListener('resize', onResize);

    // ═══════════════════════════════════════════
    // RENDER LOOP
    // ═══════════════════════════════════════════
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (isPaused || hiddenByVisibility) return;

        const elapsed = clock.getElapsedTime();

        // Smooth mouse
        mouseSmX += (targetMX - mouseSmX) * 0.05;
        mouseSmY += (targetMY - mouseSmY) * 0.05;

        // Smooth opacity
        currentOpacity += (targetOpacity - currentOpacity) * 0.04;
        material.opacity = currentOpacity;
        material.transparent = currentOpacity < 0.99;

        // Text rotation
        textMesh.rotation.y = (mouseSmX - 0.5) * 0.25;
        textMesh.rotation.x = -(mouseSmY - 0.5) * 0.15;

        // Key light follows mouse
        keyLight.position.x = -5 + (mouseSmX - 0.5) * 10;
        keyLight.position.y = 5 - (mouseSmY - 0.5) * 6;

        // Sweep light
        const sweepX = Math.sin(elapsed * 0.3) * 15;
        const sweepY = Math.cos(elapsed * 0.2) * 3 + 2;
        sweepLight.position.set(sweepX, sweepY, 8);
        sweepLight.intensity = (0.4 + Math.sin(elapsed * 0.5) * 0.2) * currentOpacity;

        // Breathing
        const breathe = 1.0 + Math.sin(elapsed * 0.8) * 0.05;
        keyLight.intensity = 1.5 * breathe;

        // Update streak shader
        streakMaterial.uniforms.uTime.value = elapsed;
        streakMaterial.uniforms.uGlobalOpacity.value = currentOpacity * 0.8;

        renderer.render(scene, camera);
    }
    animate();

    // ═══════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════
    window.chrome3D = {
        reveal: function (opts) {
            opts = opts || {};
            targetOpacity = opts.opacity !== undefined ? opts.opacity : 1.0;
            isPaused = false;
        },
        setOpacity: function (v) {
            targetOpacity = v;
            if (v > 0.001) isPaused = false;
        },
        setPaused: function (v) { isPaused = !!v; },
        destroy: function () { isPaused = true; }
    };
}
