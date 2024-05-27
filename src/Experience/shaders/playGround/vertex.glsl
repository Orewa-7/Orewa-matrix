varying vec2 vUv;
uniform float uTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main (){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y = random(modelPosition.xz) * 0.1;
    modelPosition.y += sin(random(modelPosition.xz) * 10.+uTime) * 0.05 - 0.2;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vUv = uv;
}