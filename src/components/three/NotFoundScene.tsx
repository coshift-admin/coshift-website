"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * 404 scene: a single floating Coshift cube. The user can drag it around;
 * physics-lite — a spring on a damped target. Releasing settles it back
 * toward origin with a soft overshoot.
 */
export default function NotFoundScene() {
  const reduced = useReducedMotionPref();
  if (reduced) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(31,182,240,0.18),transparent_60%)]" />
    );
  }
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      camera={{ fov: 32, position: [0, 0, 7] }}
      gl={{ alpha: true, antialias: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <DragCube />
        <Environment frames={1} resolution={128} background={false}>
          <Lightformer intensity={2} color="#ffffff" position={[5, 5, 5]} scale={[5, 5, 1]} />
          <Lightformer intensity={1.2} color="#33C5F3" position={[-5, 0, 0]} scale={[5, 5, 1]} />
          <Lightformer intensity={1.2} color="#211852" position={[0, -5, -2]} scale={[5, 5, 1]} />
        </Environment>
      </Suspense>
      <ambientLight intensity={0.3} />
    </Canvas>
  );
}

function DragCube() {
  const mesh = useRef<THREE.Mesh>(null);
  const target = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3());
  const [dragging, setDragging] = useState(false);
  const { camera, size } = useThree();

  // Convert pointer screen coords to a world-space target at z=0.
  const toWorld = (clientX: number, clientY: number) => {
    const ndc = new THREE.Vector3(
      (clientX / size.width) * 2 - 1,
      -(clientY / size.height) * 2 + 1,
      0.5,
    );
    ndc.unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(t));
  };

  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (!dragging) {
      // Pull back toward origin
      target.current.lerp(new THREE.Vector3(0, 0, 0), Math.min(1, delta * 1.2));
    }
    pos.current.lerp(target.current, Math.min(1, delta * 6));
    mesh.current.position.copy(pos.current);
    mesh.current.rotation.x += delta * 0.4;
    mesh.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh
      ref={mesh}
      onPointerDown={(e) => {
        e.stopPropagation();
        setDragging(true);
        target.current.copy(toWorld(e.clientX, e.clientY));
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        target.current.copy(toWorld(e.clientX, e.clientY));
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshPhysicalMaterial
        color="#e6f6ff"
        metalness={1}
        roughness={0.18}
        clearcoat={1}
        envMapIntensity={1.4}
      />
    </mesh>
  );
}
