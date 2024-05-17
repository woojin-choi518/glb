import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ modelPath }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const mixer = useRef();

  useEffect(() => {
    if (scene) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.play();
    }

    return () => {
      if (animations.length && mixer.current) {
        animations.forEach((clip) => mixer.current.uncacheClip(clip));
      }
    };
  }, [modelPath, scene, animations]);

  useFrame((state, delta) => mixer.current?.update(delta));

  return <primitive object={scene} ref={group} />;
};

function App() {
  const [modelPath, setModelPath] = useState('/squat.glb');
  const exercises = [
    'squat.glb',
    'sit_up.glb',
    'side_lateral_raise.glb',
    'pushup.glb',
    'leg_raise.glb',
    'dumbbell_tricep_extension.glb',
    'dumbbell_shoulder_press.glb',
    'dumbbell_fly.glb',
    'dumbbelcurl.glb',
    'dumbbell_tricep_extension_c.glb',
  ];

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Canvas>
        <Suspense fallback={null}>
          <Model modelPath={modelPath} />
          <Environment preset="sunset" />
          <OrbitControls />
        </Suspense>
      </Canvas>
      <div style={{ position: 'absolute', top: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {exercises.map(exercise => (
          <button key={exercise} style={{ margin: '10px' }} onClick={() => setModelPath(`/${exercise}`)}>
            {exercise.replace('.glb', '').replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
