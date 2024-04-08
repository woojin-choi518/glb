import React, { useRef, useEffect, Suspense } from 'react';  // Suspense를 여기에 추가
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';  // THREE 네임스페이스를 임포트

const Model = ({ modelPath }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const mixer = useRef(new THREE.AnimationMixer(scene));  // mixer를 여기서 초기화

  useEffect(() => {
    const action = mixer.current.clipAction(animations[0]);
    action.play();

    return () => animations.forEach((clip) => mixer.current.uncacheClip(clip));
  }, [animations]);

  useFrame((state, delta) => mixer.current.update(delta));

  return <primitive object={scene} ref={group} />;
};

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas>
        <Suspense fallback={null}>
          <Model modelPath="/squat.glb" />
          <Environment preset="sunset" />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
