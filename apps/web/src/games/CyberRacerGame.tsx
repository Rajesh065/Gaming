import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Gauge, Zap, Trophy, Play, RotateCcw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { AudioSynthesizer } from '../components/AudioSynthesizer';

export const CyberRacerGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(0);
  const [nitro, setNitro] = useState(100);
  const [lap, setLap] = useState(1);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !isGameStarted) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d16);
    scene.fog = new THREE.FogExp2(0x0a0d16, 0.008);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 4, -8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x6366f1, 2.0);
    dirLight.position.set(20, 40, -20);
    scene.add(dirLight);

    // 3. Cyber Track Ground & Grid
    const trackWidth = 24;
    const trackLength = 800;
    const trackGeo = new THREE.PlaneGeometry(trackWidth, trackLength, 20, 200);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x121726,
      roughness: 0.2,
      metalness: 0.8
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = -Math.PI / 2;
    scene.add(trackMesh);

    // Neon Track Borders
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const leftBorderGeo = new THREE.BoxGeometry(0.5, 0.4, trackLength);
    const leftBorder = new THREE.Mesh(leftBorderGeo, borderMat);
    leftBorder.position.set(-trackWidth / 2, 0.2, 0);
    scene.add(leftBorder);

    const rightBorder = new THREE.Mesh(leftBorderGeo, borderMat);
    rightBorder.position.set(trackWidth / 2, 0.2, 0);
    scene.add(rightBorder);

    // 4. Player Vehicle (Cyber Speedster)
    const carGroup = new THREE.Group();

    // Chassis
    const bodyGeo = new THREE.BoxGeometry(2, 0.6, 4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.9,
      roughness: 0.1
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4;
    carGroup.add(body);

    // Cockpit Canopy
    const canopyGeo = new THREE.BoxGeometry(1.2, 0.4, 1.8);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.9,
      roughness: 0.0,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.3
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.8, -0.2);
    carGroup.add(canopy);

    // Thruster Neon Glow
    const thrusterGeo = new THREE.BoxGeometry(1.6, 0.2, 0.2);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.position.set(0, 0.4, -2.05);
    carGroup.add(thruster);

    scene.add(carGroup);

    // 5. Obstacles & Energy Boost Orbs
    const obstacles: THREE.Mesh[] = [];
    const obsGeo = new THREE.BoxGeometry(2.5, 1.5, 2.5);
    const obsMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.5
    });

    for (let i = 0; i < 20; i++) {
      const obs = new THREE.Mesh(obsGeo, obsMat);
      obs.position.set(
        (Math.random() - 0.5) * (trackWidth - 6),
        0.75,
        50 + i * 38
      );
      scene.add(obs);
      obstacles.push(obs);
    }

    // 6. Controls State
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 7. Game Loop
    let curSpeed = 0;
    let nitroFuel = 100;
    let totalDist = 0;
    let animId: number;
    let localScore = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Acceleration & Steering
      let accel = 0;
      if (keys['w'] || keys['arrowup']) accel += 1.2;
      if (keys['s'] || keys['arrowdown']) accel -= 1.5;

      const isNitro = (keys[' '] || keys['shift']) && nitroFuel > 5;
      if (isNitro) {
        accel += 2.5;
        nitroFuel = Math.max(0, nitroFuel - 0.8);
      } else {
        nitroFuel = Math.min(100, nitroFuel + 0.15);
      }

      curSpeed += accel;
      curSpeed *= 0.96; // drag
      curSpeed = Math.max(0, Math.min(isNitro ? 260 : 180, curSpeed));

      // Steering
      if (curSpeed > 2) {
        if (keys['a'] || keys['arrowleft']) {
          carGroup.position.x -= (curSpeed / 120) * 0.4;
          carGroup.rotation.z = Math.min(0.2, carGroup.rotation.z + 0.04);
        } else if (keys['d'] || keys['arrowright']) {
          carGroup.position.x += (curSpeed / 120) * 0.4;
          carGroup.rotation.z = Math.max(-0.2, carGroup.rotation.z - 0.04);
        } else {
          carGroup.rotation.z *= 0.8;
        }
      }

      // Clamp player within track
      carGroup.position.x = Math.max(-trackWidth / 2 + 1.5, Math.min(trackWidth / 2 - 1.5, carGroup.position.x));

      // Move world forward
      const deltaZ = (curSpeed / 60);
      carGroup.position.z += deltaZ;
      totalDist += deltaZ;

      // Update camera follow
      camera.position.x = carGroup.position.x * 0.7;
      camera.position.z = carGroup.position.z - 8;
      camera.lookAt(carGroup.position.x, carGroup.position.y + 1, carGroup.position.z + 12);

      // Loop track & obstacles
      obstacles.forEach((obs) => {
        if (obs.position.z < carGroup.position.z - 10) {
          obs.position.z += 800;
          obs.position.x = (Math.random() - 0.5) * (trackWidth - 6);
        }

        // Collision Check
        const dist = obs.position.distanceTo(carGroup.position);
        if (dist < 2.2) {
          curSpeed = 0;
          AudioSynthesizer.playExplosion();
        }
      });

      localScore += Math.round(curSpeed * 0.05);

      setSpeed(Math.round(curSpeed));
      setNitro(Math.round(nitroFuel));
      setScore(localScore);
      setLap(Math.floor(totalDist / 800) + 1);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isGameStarted]);

  return (
    <div className="relative w-full h-[650px] bg-[#0A0D16] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Start Screen Overlay */}
      {!isGameStarted && (
        <div className="absolute inset-0 bg-[#0A0D16]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20">
            <Trophy className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            APEX CYBER RACER 3D
          </h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            High-speed procedural raceway. Dodge hazard barriers, tap Nitro boost, and set the fastest lap record.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm mb-6 text-xs text-slate-300">
            <div className="bg-[#141926] p-2.5 rounded-xl border border-slate-800 font-mono">
              <span className="text-indigo-400 font-bold">W / ↑</span> : Accelerate
            </div>
            <div className="bg-[#141926] p-2.5 rounded-xl border border-slate-800 font-mono">
              <span className="text-indigo-400 font-bold">A / D</span> : Steer Left/Right
            </div>
            <div className="bg-[#141926] p-2.5 rounded-xl border border-slate-800 font-mono">
              <span className="text-indigo-400 font-bold">S / ↓</span> : Brake
            </div>
            <div className="bg-[#141926] p-2.5 rounded-xl border border-slate-800 font-mono">
              <span className="text-cyan-400 font-bold">SPACE</span> : Nitro Boost
            </div>
          </div>

          <button
            onClick={() => {
              AudioSynthesizer.playSuccess();
              setIsGameStarted(true);
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch 3D Raceway</span>
          </button>
        </div>
      )}

      {/* In-Game Cockpit HUD */}
      {isGameStarted && (
        <>
          {/* Top Telemetry Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="bg-[#0E121B]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400">SCORE</div>
                  <div className="text-sm font-black font-mono text-white">{score}</div>
                </div>
              </div>

              <div className="bg-[#0E121B]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">LAP {lap} / 3</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2.5 rounded-xl bg-[#0E121B]/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsGameStarted(false)}
                className="p-2.5 rounded-xl bg-[#0E121B]/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Speedometer & Nitro HUD */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 pointer-events-none">
            {/* Speed Gauge */}
            <div className="bg-[#0E121B]/95 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-2xl">
              <Gauge className="w-6 h-6 text-indigo-400" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider">SPEED</div>
                <div className="text-2xl font-black font-mono text-white leading-none">
                  {speed} <span className="text-xs font-normal text-slate-400">KM/H</span>
                </div>
              </div>
            </div>

            {/* Nitro Boost Gauge */}
            <div className="bg-[#0E121B]/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800 w-48 shadow-2xl">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>NITRO BOOST</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">{nitro}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
