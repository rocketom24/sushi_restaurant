"use client";

import React, { useEffect, useRef } from "react";

// --- FRAGMENT SHADER ---
// We add a `u_color` uniform to accept a color from our component.
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color; // <-- The new color uniform

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);

  // KEY CHANGE: Instead of mixing with white (vec3(1)), we mix with our custom.
  // This tints the brightest parts of the noise with the color provided by the user.
  // A plain lerp from this near-white base toward u_color looks pink/pastel
  // across most of the visible range — white mixed toward red at any partial
  // ratio IS pink, no matter how saturated the target red is. Reshaping the
  // mix factor with pow() reaches full u_color much sooner, shrinking that
  // pale band so the smoke reads as red almost everywhere, not just at the
  // very brightest peaks.
  float tint=pow(clamp(dot(col,vec3(.21,.71,.07)),0.,1.),0.3);
  col=mix(col, u_color, tint);

  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1);
}`;

const vertexShaderSource = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

type ProgramWithUniforms = WebGLProgram & {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  u_color: WebGLUniformLocation | null;
};

// --- RENDERER CLASS ---
// Updated to handle the new color uniform
class Renderer {
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  private gl: WebGL2RenderingContext | null;
  private canvas: HTMLCanvasElement;
  private program: ProgramWithUniforms | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.5, 0.5, 0.5]; // Default to gray

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2");
    if (!this.gl) return;
    this.setup(fragmentSource);
    this.init();
  }

  get ready() {
    return this.gl !== null && this.program !== null;
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor;
  }

  updateScale() {
    if (!this.gl) return;
    const dpr = Math.max(1, window.devicePixelRatio);
    const { innerWidth: width, innerHeight: height } = window;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Shader compilation error: ${gl.getShaderInfoLog(shader)}`);
    }
  }

  reset() {
    const { gl, program, vs, fs, buffer } = this;
    if (!gl || !program) return;
    if (vs) {
      gl.detachShader(program, vs);
      gl.deleteShader(vs);
    }
    if (fs) {
      gl.detachShader(program, fs);
      gl.deleteShader(fs);
    }
    if (buffer) gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    this.program = null;
  }

  private setup(fragmentSource: string) {
    const gl = this.gl;
    if (!gl) return;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!this.vs || !this.fs || !program) return;
    this.compile(this.vs, vertexShaderSource);
    this.compile(this.fs, fragmentSource);
    gl.attachShader(program, this.vs);
    gl.attachShader(program, this.fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(program)}`);
    }
    this.program = program as ProgramWithUniforms;
  }

  private init() {
    const { gl, program } = this;
    if (!gl || !program) return;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
    program.u_color = gl.getUniformLocation(program, "u_color");
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!gl || !program || !gl.isProgram(program)) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(program.resolution, canvas.width, canvas.height);
    gl.uniform1f(program.time, now * 1e-3);
    gl.uniform3fv(program.u_color, this.color); // Send the color to the shader
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// --- UTILITY FUNCTION ---
// Converts a hex color string like "#FF5733" to an array of floats [r, g, b]
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : null;
};

// --- REACT COMPONENT ---
interface SmokeBackgroundProps {
  smokeColor?: string; // e.g., "#8A2BE2"
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  smokeColor = "#808080", // Default to gray
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  // Effect for initialization and cleanup
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const renderer = new Renderer(canvas, fragmentShaderSource);
    if (!renderer.ready) return; // WebGL2 unsupported — leave the canvas blank rather than throw.
    rendererRef.current = renderer;

    const initialColor = hexToRgb(smokeColor);
    if (initialColor) renderer.updateColor(initialColor);

    const handleResize = () => renderer.updateScale();
    handleResize(); // Initial size
    window.addEventListener("resize", handleResize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let running = false;

    const loop = (now: number) => {
      renderer.render(now);
      if (running) animationFrameId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      animationFrameId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };

    if (reducedMotion) {
      renderer.render(0);
    } else {
      // Only spend GPU/main-thread time on this ambient background while
      // its canvas is actually on screen — otherwise it keeps rendering
      // every frame forever, competing with whatever the user scrolls to
      // next (e.g. the scroll-scrubbed video section) for no visual gain.
      start();
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (reducedMotion) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      visibilityObserver.disconnect();
      stop();
      renderer.reset();
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to update color when the prop changes
  useEffect(() => {
    const renderer = rendererRef.current;
    if (renderer) {
      const rgbColor = hexToRgb(smokeColor);
      if (rgbColor) {
        renderer.updateColor(rgbColor);
      }
    }
  }, [smokeColor]);

  return <canvas ref={canvasRef} aria-hidden className="w-full h-full block" />;
};
