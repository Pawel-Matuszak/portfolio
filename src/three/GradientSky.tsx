import * as THREE from 'three'
import { BackSide } from 'three'

export function GradientSky() {
  return (
    <mesh>
      <sphereGeometry args={[500, 32, 32]} />
      <shaderMaterial
        side={BackSide}
        uniforms={{
          uColorA: { value: new THREE.Color('#E0F7FA') }, // Horizon: Very Pale Cyan/White (matches foam/highlights)
          uColorB: { value: new THREE.Color('#51B2FC') }, // Zenith: Vibrant Light Blue (complements turquoise water)
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;
          void main() {
            // Mix based on Y coordinate (vUv.y goes from 0 to 1)
            // 0.5 is the equator/horizon in a sphere mapping, but for simple vertical gradient:
            // Use pow to push the horizon color up higher (make the gradient softer)
            // Higher power = more horizon color (white) visible higher up
            float mixStrength = pow(smoothstep(0.0, 1.0, vUv.y), 4.0);
            gl_FragColor = vec4(mix(uColorA, uColorB, mixStrength), 1.0);
          }
        `}
      />
    </mesh>
  )
}

