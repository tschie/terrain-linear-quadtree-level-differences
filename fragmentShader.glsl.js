// language=glsl
export const terrainFragmentShader = `
precision mediump float;

#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
    vec3 direction;
    vec3 color;
};
uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

varying vec3 vNormal;

void main() {
    // calculate lighting based on normal and directional light
    vec3 light = normalize(directionalLights[0].direction);
    float brightness = max(dot(vNormal, light), 0.05);
    vec3 diffuse = brightness * vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4(diffuse, 1.0);
}
`
