
export interface ShaderUniforms_49 {
  uTime: number;
  uResolution: [number, number];
  uLightPosition: [number, number, number];
  uNeonGlowColor: [number, number, number, number];
  uDistortionStrength: number;
  uRoughnessMapOffset: [number, number];
  uFresnelPower: number;
}

export class ShaderPipelineModule_49 {
  public readonly shaderId = 'pipeline_shader_49';
  public vertexSource: string;
  public fragmentSource: string;
  public uniforms: ShaderUniforms_49;

  constructor() {
    this.uniforms = {
      uTime: 0.0,
      uResolution: [1920, 1080],
      uLightPosition: [10.0, 25.0, -15.0],
      uNeonGlowColor: [0.0, 1.0, 0.8, 1.0],
      uDistortionStrength: 2.450,
      uRoughnessMapOffset: [0.0, 0.0],
      uFresnelPower: 6.40
    };

    this.vertexSource = `
      precision highp float;
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;

      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform float uTime;

      varying vec3 vNormal;
      varying vec2 vTexCoord;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = mat3(uModelMatrix) * aNormal;
        vTexCoord = aTexCoord;
        vec3 displaced = aPosition + aNormal * (sin(uTime * 2.0 + aPosition.x * 0.5) * ${this.uniforms.uDistortionStrength});
        vec4 worldPos = uModelMatrix * vec4(displaced, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
      }
    `;

    this.fragmentSource = `
      precision highp float;
      varying vec3 vNormal;
      varying vec2 vTexCoord;
      varying vec3 vWorldPosition;

      uniform vec4 uNeonGlowColor;
      uniform vec3 uLightPosition;
      uniform float uFresnelPower;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPosition - vWorldPosition);
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 viewDir = normalize(-vWorldPosition);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower);

        vec4 finalColor = uNeonGlowColor * (diff * 0.6 + fresnel * 0.8 + 0.1);
        gl_FragColor = finalColor;
      }
    `;
  }

  public updateUniforms(time: number, lightPos?: [number, number, number]): void {
    this.uniforms.uTime = time;
    if (lightPos) this.uniforms.uLightPosition = lightPos;
    this.uniforms.uRoughnessMapOffset[0] = (time * 0.1) % 1.0;
    this.uniforms.uRoughnessMapOffset[1] = (time * 0.05) % 1.0;
  }

  public compileAndLink(gl: any): boolean {
    if (!gl) return false;
    return true;
  }
}
