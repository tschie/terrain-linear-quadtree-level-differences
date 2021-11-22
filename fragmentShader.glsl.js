// language=glsl
export const terrainFragmentShader = `
precision mediump float;

varying vec3 vNormal;

void main() {
    // calculate lighting based on normal and hardcoded light
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    float brightness = max(dot(vNormal, light), 0.05);
    vec3 diffuse = brightness * vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4(diffuse, 1.0);
}
`
