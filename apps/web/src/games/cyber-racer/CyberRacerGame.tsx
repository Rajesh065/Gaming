import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFx } from '../../components/AudioSynthesizer';
import { Play, RotateCcw, Zap, Trophy, ShieldAlert, Award } from 'lucide-react';

export const CyberRacerGame: React.FC<{ onGameOver?: (score: number) => void }> = ({ onGameOver }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [boostFuel, setBoostFuel] = useState(100);
  const [health, setHealth] = useState(100);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [highScore, setHighScore] = useState(14850);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameState = useRef({
    playerX: 0,
    playerSpeed: 0,
    boostActive: false,
    score: 0,
    health: 100,
    boostFuel: 100,
    distance: 0,
    keys: { left: false, right: false, forward: false, backward: false, boost: false }
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Three.js Scene Setup ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.008);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 4, -8);
    camera.lookAt(0, 1.5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x223355, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ffcc, 2.0);
    dirLight.position.set(10, 20, -10);
    scene.add(dirLight);

    // --- Procedural Neon Track & Grid ---
    const trackWidth = 24;
    const trackLength = 400;

    const gridHelper = new THREE.GridHelper(trackLength, 40, 0x00ffcc, 0x1f2438);
    gridHelper.position.set(0, 0, trackLength / 2);
    gridHelper.scale.set(trackWidth / 40, 1, 1);
    scene.add(gridHelper);

    // Track Borders (Glowing Cyber Neon Rails)
    const railMatLeft = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const railMatRight = new THREE.MeshBasicMaterial({ color: 0xff007f });
    const railGeo = new THREE.BoxGeometry(0.5, 0.8, trackLength);

    const leftRail = new THREE.Mesh(railGeo, railMatLeft);
    leftRail.position.set(-trackWidth / 2, 0.4, trackLength / 2);
    scene.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMatRight);
    rightRail.position.set(trackWidth / 2, 0.4, trackLength / 2);
    scene.add(rightRail);

    // --- Player Cyber Vehicle ---
    const vehicleGroup = new THREE.Group();

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(2.2, 0.6, 4.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.5;
    vehicleGroup.add(chassis);

    // Cockpit Visor (Cyan Glow)
    const visorGeo = new THREE.BoxGeometry(1.4, 0.45, 1.8);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      emissive: 0x00ffcc,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.85, 0.2);
    vehicleGroup.add(visor);

    // Neon Thruster Glow (Pink)
    const thrusterGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 16);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
    const leftThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    leftThruster.rotation.x = Math.PI / 2;
    leftThruster.position.set(-0.7, 0.5, -2.1);
    vehicleGroup.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightThruster.rotation.x = Math.PI / 2;
    rightThruster.position.set(0.7, 0.5, -2.1);
    vehicleGroup.add(rightThruster);

    scene.add(vehicleGroup);

    // --- Obstacles & Speed Boost Pads ---
    const obstaclePool: THREE.Mesh[] = [];
    const obsGeo = new THREE.BoxGeometry(2.5, 2.0, 2.5);
    const obsMat = new THREE.MeshStandardMaterial({
      color: 0xff0055,
      emissive: 0xff0055,
      emissiveIntensity: 0.6
    });

    const boostPads: THREE.Mesh[] = [];
    const boostGeo = new THREE.PlaneGeometry(3.5, 6.0);
    const boostMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, side: THREE.DoubleSide });

    for (let i = 0; i < 15; i++) {
      const obs = new THREE.Mesh(obsGeo, obsMat);
      obs.position.set((Math.random() - 0.5) * (trackWidth - 4), 1.0, 50 + i * 45);
      scene.add(obs);
      obstaclePool.push(obs);

      const pad = new THREE.Mesh(boostGeo, boostMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set((Math.random() - 0.5) * (trackWidth - 4), 0.05, 75 + i * 45);
      scene.add(pad);
      boostPads.push(pad);
    }

    // --- Keyboard Event Listeners ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) gameState.current.keys.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) gameState.current.keys.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) gameState.current.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) gameState.current.keys.right = true;
      if (['Space', 'ShiftLeft'].includes(e.code)) {
        gameState.current.keys.boost = true;
        soundFx.playPowerUp();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) gameState.current.keys.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) gameState.current.keys.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) gameState.current.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) gameState.current.keys.right = false;
      if (['Space', 'ShiftLeft'].includes(e.code)) gameState.current.keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- Animation & Physics Game Loop ---
    let animationId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const state = gameState.current;

      if (state.health > 0) {
        // Acceleration & Speed
        let maxSpeed = 120;
        let accel = 50;

        if (state.keys.boost && state.boostFuel > 0) {
          maxSpeed = 220;
          accel = 120;
          state.boostFuel = Math.max(0, state.boostFuel - 30 * dt);
        } else {
          state.boostFuel = Math.min(100, state.boostFuel + 8 * dt);
        }

        if (state.keys.forward) {
          state.playerSpeed = Math.min(maxSpeed, state.playerSpeed + accel * dt);
        } else if (state.keys.backward) {
          state.playerSpeed = Math.max(0, state.playerSpeed - 70 * dt);
        } else {
          state.playerSpeed = Math.max(0, state.playerSpeed - 20 * dt);
        }

        // Lateral Steering
        if (state.keys.left) {
          state.playerX = Math.max(-trackWidth / 2 + 1.8, state.playerX - 22 * dt);
          vehicleGroup.rotation.z = Math.min(0.25, vehicleGroup.rotation.z + 3 * dt);
        } else if (state.keys.right) {
          state.playerX = Math.min(trackWidth / 2 - 1.8, state.playerX + 22 * dt);
          vehicleGroup.rotation.z = Math.max(-0.25, vehicleGroup.rotation.z - 3 * dt);
        } else {
          vehicleGroup.rotation.z *= 0.85;
        }

        vehicleGroup.position.x = state.playerX;
        state.distance += state.playerSpeed * dt;
        state.score += Math.round(state.playerSpeed * dt * 3.5);

        // Move road & obstacles toward player to simulate forward motion
        const moveDist = state.playerSpeed * dt;

        gridHelper.position.z -= moveDist;
        if (gridHelper.position.z < 0) gridHelper.position.z += 40;

        for (const obs of obstaclePool) {
          obs.position.z -= moveDist;
          if (obs.position.z < -10) {
            obs.position.z += 300 + Math.random() * 80;
            obs.position.x = (Math.random() - 0.5) * (trackWidth - 4);
          }

          // Collision Check
          const dx = Math.abs(vehicleGroup.position.x - obs.position.x);
          const dz = Math.abs(vehicleGroup.position.z - obs.position.z);
          if (dx < 2.2 && dz < 2.5) {
            soundFx.playExplosion();
            state.health = Math.max(0, state.health - 35);
            state.playerSpeed = 20;
            obs.position.z += 100;
            if (state.health <= 0) {
              setIsGameOver(true);
              if (onGameOver) onGameOver(state.score);
            }
          }
        }

        for (const pad of boostPads) {
          pad.position.z -= moveDist;
          if (pad.position.z < -10) {
            pad.position.z += 300 + Math.random() * 80;
            pad.position.x = (Math.random() - 0.5) * (trackWidth - 4);
          }

          // Boost Pad Check
          const dx = Math.abs(vehicleGroup.position.x - pad.position.x);
          const dz = Math.abs(vehicleGroup.position.z - pad.position.z);
          if (dx < 2.5 && dz < 3.0) {
            soundFx.playLaser();
            state.playerSpeed = Math.min(240, state.playerSpeed + 60);
            state.score += 250;
            pad.position.z += 80;
          }
        }

        // Camera follow & dynamic shake
        camera.position.x = vehicleGroup.position.x * 0.4;
        camera.position.y = 3.5 + (state.playerSpeed / maxSpeed) * 0.8;
      }

      setScore(state.score);
      setSpeed(Math.round(state.playerSpeed));
      setBoostFuel(Math.round(state.boostFuel));
      setHealth(Math.max(0, Math.round(state.health)));
      setDistanceTraveled(Math.round(state.distance));

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [isGameOver]);

  const restartGame = () => {
    gameState.current = {
      playerX: 0,
      playerSpeed: 30,
      boostActive: false,
      score: 0,
      health: 100,
      boostFuel: 100,
      distance: 0,
      keys: { left: false, right: false, forward: false, backward: false, boost: false }
    };
    setIsGameOver(false);
    setIsPlaying(true);
    soundFx.playPowerUp();
  };

  return (
    <div className="relative w-full h-[620px] bg-cyber-darker rounded-2xl overflow-hidden border border-cyber-border/70 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyber HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        {/* Left Stats Widget */}
        <div className="bg-cyber-dark/85 backdrop-blur-md border border-cyber-neon/40 p-4 rounded-xl shadow-lg min-w-[200px]">
          <div className="text-xs text-cyber-neon tracking-widest uppercase font-semibold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-cyber-yellow" /> Score
          </div>
          <div className="text-3xl font-black orbitron text-white text-glow-cyan tracking-wider">
            {score.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Distance: {distanceTraveled}m</div>
        </div>

        {/* Center Speedometer & Boost */}
        <div className="bg-cyber-dark/85 backdrop-blur-md border border-cyber-border p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[220px]">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Speedometer</div>
          <div className="text-4xl font-black orbitron text-cyber-neon">
            {speed} <span className="text-base text-slate-400 font-sans">KM/H</span>
          </div>

          {/* Boost Energy Bar */}
          <div className="w-full mt-2">
            <div className="flex justify-between text-[11px] text-cyber-pink font-semibold mb-0.5">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> NITRO</span>
              <span>{boostFuel}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-pink to-cyber-yellow transition-all duration-75"
                style={{ width: `${boostFuel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Hull Integrity */}
        <div className="bg-cyber-dark/85 backdrop-blur-md border border-cyber-border p-4 rounded-xl shadow-lg min-w-[180px]">
          <div className="flex justify-between text-xs text-slate-400 uppercase font-semibold mb-1">
            <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-cyber-pink" /> Shield</span>
            <span className={health > 30 ? 'text-cyber-neon' : 'text-red-500'}>{health}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                health > 50 ? 'bg-cyber-neon' : health > 25 ? 'bg-cyber-yellow' : 'bg-red-500'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">High Score: {highScore.toLocaleString()}</div>
        </div>
      </div>

      {/* Controls Legend */}
      <div className="absolute bottom-4 left-4 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-border px-3 py-2 rounded-lg text-xs text-slate-400 flex items-center gap-3">
        <span><strong className="text-white font-mono">W / ↑</strong> Accelerate</span>
        <span><strong className="text-white font-mono">A / D / ← →</strong> Steer</span>
        <span><strong className="text-white font-mono">SPACE / SHIFT</strong> Nitro Boost</span>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20">
          <div className="bg-cyber-card border border-red-500/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl glow-pink">
            <h2 className="text-4xl font-black orbitron text-red-500 text-glow-pink mb-2">VEHICLE DESTROYED</h2>
            <p className="text-slate-400 text-sm mb-6">Your chassis suffered catastrophic collision failure.</p>

            <div className="bg-cyber-dark p-4 rounded-xl border border-cyber-border mb-6">
              <div className="text-xs text-slate-400 uppercase">Final Score</div>
              <div className="text-3xl font-black orbitron text-cyber-neon">{score.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Distance Reached: {distanceTraveled} meters</div>
            </div>

            <button
              onClick={restartGame}
              className="w-full py-3 bg-gradient-to-r from-cyber-neon to-cyber-blue text-black font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg glow-cyan"
            >
              <RotateCcw className="w-5 h-5" /> Race Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
