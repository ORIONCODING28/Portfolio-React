import * as THREE from 'three';

/** Screen-space studio lighting: stays fixed while the device camera orbits. */
export function createStudioBackdrop(dark: boolean) {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    uniforms: { dark: { value: dark ? 1 : 0 }, floorY: { value: .13 } },
    vertexShader: `varying vec2 uvPosition;
      void main() { uvPosition = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `varying vec2 uvPosition; uniform float dark; uniform float floorY;
      float wash(vec2 center, vec2 spread) {
        vec2 p = (uvPosition - center) / spread;
        return exp(-dot(p, p) * 2.);
      }
      void main() {
        // Ground-only ellipse: no atmospheric halo behind the object.
        float floor = wash(vec2(.5,floorY), vec2(.67,.085));
        float contact = wash(vec2(.51,floorY), vec2(.28,.025));
        vec3 color = mix(vec3(.028,.23,.65), vec3(.0,.32,.39), dark);
        float alpha = floor * mix(.38,.28,dark) + contact * .10;
        float edge = smoothstep(0.,.17,uvPosition.x) * smoothstep(0.,.17,1.-uvPosition.x)
                   * smoothstep(0.,.08,uvPosition.y) * smoothstep(0.,.12,1.-uvPosition.y);
        gl_FragColor = vec4(color, clamp(alpha,0.,.6) * edge);
      }`,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}
