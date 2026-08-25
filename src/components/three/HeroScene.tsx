"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/* ----------------- Shift glyph geometry ----------------- */
/**
 * Build a 3D shape for the Coshift glyph: a small rectangular "dot" stacked
 * on top of an S-curve body. We assemble it from two Shapes (rect + curve)
 * and extrude them — the result is a single mesh that reads as the same
 * symbol used as the 2D motif elsewhere.
 */
function useGlyphGeometries() {
  return useMemo(() => {
    // Body — the S-curve, traced with same control points as the SVG path.
    const body = new THREE.Shape();
    body.moveTo(-1.6, 1.8);
    body.lineTo(1.6, 1.8);
    body.bezierCurveTo(1.6, 1.4, 1.6, 0.6, 0.6, 0.2);
    body.bezierCurveTo(-0.2, -0.2, -1.2, -0.4, -1.6, -0.9);
    body.bezierCurveTo(-2.2, -1.8, -1.6, -2.5, -0.6, -2.4);
    body.bezierCurveTo(0.5, -2.3, 1.6, -2.0, 1.6, -2.6);
    body.lineTo(1.6, -3.0);
    body.lineTo(-1.6, -3.0);
    body.bezierCurveTo(-1.6, -2.4, -1.6, -1.6, -0.6, -1.2);
    body.bezierCurveTo(0.4, -0.8, 1.2, -0.6, 1.6, -0.1);
    body.bezierCurveTo(2.2, 0.7, 1.6, 1.4, 0.6, 1.3);
    body.bezierCurveTo(-0.5, 1.2, -1.6, 0.9, -1.6, 1.5);
    body.closePath();

    const dot = new THREE.Shape();
    dot.moveTo(-1.4, 0);
    dot.lineTo(1.4, 0);
    dot.lineTo(1.4, 0.8);
    dot.lineTo(-1.4, 0.8);
    dot.closePath();

    const bodyGeo = new THREE.ExtrudeGeometry(body, {
      depth: 0.7,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      curveSegments: 24,
    });
    bodyGeo.center();

    const dotGeo = new THREE.ExtrudeGeometry(dot, {
      depth: 0.7,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      curveSegments: 4,
    });

    return { bodyGeo, dotGeo };
  }, []);
}

/* ----------------- Single floating glyph ----------------- */
function GlyphInstance({
  position,
  rotation,
  scale,
  drift,
  morph,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  drift: { rx: number; ry: number; rz: number };
  morph: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = position[1];
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const { bodyGeo, dotGeo } = useGlyphGeometries();

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.x += drift.rx * delta;
    g.rotation.y += drift.ry * delta;
    g.rotation.z += drift.rz * delta;

    const m = morph.current ?? 0;
    const contract = THREE.MathUtils.lerp(1, 0.32, easeInOut(m));
    g.position.x = basePos.x * contract;
    g.position.y =
      basePos.y * contract +
      Math.sin(performance.now() * 0.0005 + baseY) * 0.12 * (1 - m);
    g.position.z = basePos.z * contract;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh geometry={bodyGeo}>
        <meshPhysicalMaterial
          color="#e6f6ff"
          metalness={1}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transmission={0.06}
          ior={1.4}
          envMapIntensity={1.3}
        />
      </mesh>
      <mesh geometry={dotGeo} position={[0, 2.4, 0]}>
        <meshPhysicalMaterial
          color="#33C5F3"
          metalness={1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={1.6}
          emissive="#33C5F3"
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/* ----------------- Camera/parallax/scroll wiring ----------------- */
function SceneRig({
  morph,
}: {
  morph: React.RefObject<number>;
}) {
  const { camera, gl } = useThree();
  const targetPos = useRef(new THREE.Vector2());
  const pos = useRef(new THREE.Vector2());

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetPos.current.x = (e.clientX - r.left) / r.width - 0.5;
      targetPos.current.y = (e.clientY - r.top) / r.height - 0.5;
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame(() => {
    pos.current.x += (targetPos.current.x - pos.current.x) * 0.06;
    pos.current.y += (targetPos.current.y - pos.current.y) * 0.06;
    const m = morph.current ?? 0;
    // small parallax (~3°) on mouse, pull camera in as morph progresses
    camera.position.x = pos.current.x * 1.8;
    camera.position.y = -pos.current.y * 1.2;
    camera.position.z = 14 - m * 2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ----------------- Composition ----------------- */
function HeroComposition({ morph }: { morph: React.RefObject<number> }) {
  // Pre-computed constellation: 7 instances at varied positions / rotations / drift speeds.
  // Scale tuned so glyphs sit behind the headline rather than swallowing it.
  const instances = useMemo(() => {
    const seeds = [
      { p: [-6.0, 2.4, -2] as [number, number, number], s: 0.6 },
      { p: [5.4, 1.6, -1.5] as [number, number, number], s: 0.52 },
      { p: [-3.0, -2.6, 0.4] as [number, number, number], s: 0.42 },
      { p: [4.0, -2.4, -0.5] as [number, number, number], s: 0.4 },
      { p: [0.6, 3.4, -3.0] as [number, number, number], s: 0.68 },
      { p: [-5.0, -0.8, 1.6] as [number, number, number], s: 0.36 },
      { p: [2.4, -0.4, -3.6] as [number, number, number], s: 0.48 },
    ];
    return seeds.map((seed, i) => ({
      key: i,
      position: seed.p,
      rotation: [i * 0.6, i * 0.41, i * 0.23] as [number, number, number],
      scale: seed.s,
      drift: {
        rx: 0.05 + (i % 3) * 0.03,
        ry: 0.07 + ((i + 1) % 3) * 0.02,
        rz: 0.03 + ((i + 2) % 3) * 0.02,
      },
    }));
  }, []);

  return (
    <>
      {/*
        Inline lightformers — no external HDR fetch. This gives us a
        studio-like envMap that ships with the bundle and works offline.
        The cyan + indigo rims drive the chrome look on the glyphs.
      */}
      <Environment frames={1} resolution={256} background={false}>
        <color attach="background" args={["#070b1f"]} />
        <Lightformer
          intensity={2.5}
          color="#ffffff"
          position={[6, 5, 6]}
          scale={[6, 8, 1]}
        />
        <Lightformer
          intensity={1.4}
          color="#33C5F3"
          position={[-7, 2, -2]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#211852"
          position={[0, -6, 2]}
          scale={[10, 6, 1]}
        />
        <Lightformer
          intensity={1.6}
          color="#4DD0FF"
          position={[3, -3, -6]}
          scale={[5, 2, 1]}
        />
      </Environment>
      {/* Direct lights add definition the envMap alone can't give */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[6, 8, 6]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[-6, -4, 4]} intensity={0.4} color="#211852" />
      <directionalLight position={[0, -2, -8]} intensity={1.4} color="#33C5F3" />

      <group>
        {instances.map((inst) => (
          <GlyphInstance
            key={inst.key}
            position={inst.position}
            rotation={inst.rotation}
            scale={inst.scale}
            drift={inst.drift}
            morph={morph}
          />
        ))}
      </group>
    </>
  );
}

/* ----------------- Outer wrapper ----------------- */
export default function HeroScene() {
  const reduced = useReducedMotionPref();
  const [degraded, setDegraded] = useState(false);
  const morphRef = useRef(0);

  // Capability detection — on low-power devices we skip WebGL entirely.
  useEffect(() => {
    const navAny = navigator as Navigator & { deviceMemory?: number };
    if (
      (navAny.deviceMemory && navAny.deviceMemory < 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    ) {
      setDegraded(true);
    }
  }, []);

  // Drive `morphRef` from window.scrollY across the first 100vh.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      morphRef.current = Math.max(0, Math.min(1, y / vh));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reduced || degraded) {
    return <StaticFallback />;
  }

  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.6]}
      camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0, 14] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#050614"]} />
      <Suspense fallback={null}>
        <HeroComposition morph={morphRef} />
      </Suspense>
      <SceneRig morph={morphRef} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0014)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise opacity={0.04} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

function StaticFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_40%,rgba(31,182,240,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_70%,rgba(26,27,92,0.6),transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-[42vmin] w-[42vmin] rounded-full opacity-60"
          style={{
            background:
              "conic-gradient(from 220deg at 50% 50%, var(--coshift-cyan), transparent 35%, var(--coshift-indigo) 60%, transparent 90%)",
            filter: "blur(40px)",
          }}
        />
      </div>
    </div>
  );
}
