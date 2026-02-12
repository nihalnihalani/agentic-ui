"use client";

import React, { useRef, useEffect, useState } from "react";
import { Github, Star } from "lucide-react";
import { Liquid, type Colors } from "@/components/ui/button-1";

const LIQUID_COLORS: Colors = {
  color1: "#FFFFFF",
  color2: "#1E10C5",
  color3: "#9089E2",
  color4: "#FCFCFE",
  color5: "#F9F9FD",
  color6: "#B2B8E7",
  color7: "#0E2DCB",
  color8: "#0017E9",
  color9: "#4743EF",
  color10: "#7D7BF4",
  color11: "#0B06FC",
  color12: "#C5C1EA",
  color13: "#1403DE",
  color14: "#B6BAF6",
  color15: "#C1BEEB",
  color16: "#290ECB",
  color17: "#3F4CC0",
};

// Types for component props
interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

const defaultShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
    float d=1., t=.0;
    for (float i=.0; i<3.; i++) {
        float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
        t=mix(t,d,a);
        d=a;
        p*=2./(i+1.);
    }
    return t;
}
void main(void) {
    vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
    vec3 col=vec3(0);
    float bg=clouds(vec2(st.x+T*.5,-st.y));
    uv*=1.-.3*(sin(T*.2)*.5+.5);
    for (float i=1.; i<12.; i++) {
        uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
        vec2 p=uv;
        float d=length(p);
        col+=.00125/d*(cos(sin(i)*vec3(3,2,1))+1.);
        float b=noise(i+p+bg*1.731);
        col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
        col=mix(col,vec3(bg*.05,bg*.06,bg*.25),d);
    }
    O=vec4(col,1);
}`;

// WebGL Renderer class
class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private scale: number;
  private shaderSource: string;
  private mouseMove = [0, 0];
  private mouseCoords = [0, 0];
  private pointerCoords = [0, 0];
  private nbrOfPointers = 0;

  private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext("webgl2")!;
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.shaderSource = defaultShaderSource;
  }

  updateShader(source: string) {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }

  updateMove(deltas: number[]) {
    this.mouseMove = deltas;
  }

  updateMouse(coords: number[]) {
    this.mouseCoords = coords;
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(
      0,
      0,
      this.canvas.width * scale,
      this.canvas.height * scale
    );
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      console.error("Shader compilation error:", error);
    }
  }

  test(source: string) {
    let result = null;
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader);
    }
    gl.deleteShader(shader);
    return result;
  }

  reset() {
    const gl = this.gl;
    if (
      this.program &&
      !gl.getProgramParameter(this.program, gl.DELETE_STATUS)
    ) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }
      gl.deleteProgram(this.program);
    }
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER)!;
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }
  }

  init() {
    const gl = this.gl;
    const program = this.program!;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    (program as any).resolution = gl.getUniformLocation(
      program,
      "resolution"
    );
    (program as any).time = gl.getUniformLocation(program, "time");
    (program as any).move = gl.getUniformLocation(program, "move");
    (program as any).touch = gl.getUniformLocation(program, "touch");
    (program as any).pointerCount = gl.getUniformLocation(
      program,
      "pointerCount"
    );
    (program as any).pointers = gl.getUniformLocation(program, "pointers");
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;

    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.uniform2f(
      (program as any).resolution,
      this.canvas.width,
      this.canvas.height
    );
    gl.uniform1f((program as any).time, now * 1e-3);
    gl.uniform2f(
      (program as any).move,
      this.mouseMove[0],
      this.mouseMove[1]
    );
    gl.uniform2f(
      (program as any).touch,
      this.mouseCoords[0],
      this.mouseCoords[1]
    );
    gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
    gl.uniform2fv((program as any).pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Pointer Handler class
class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, number[]>();
  private lastCoords = [0, 0];
  private moves = [0, 0];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;

    const map = (
      el: HTMLCanvasElement,
      s: number,
      x: number,
      y: number
    ) => [x * s, el.height - y * s];

    element.addEventListener("pointerdown", (e) => {
      this.active = true;
      this.pointers.set(
        e.pointerId,
        map(element, this.getScale(), e.clientX, e.clientY)
      );
    });

    element.addEventListener("pointerup", (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener("pointerleave", (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener("pointermove", (e) => {
      if (!this.active) return;
      this.lastCoords = [e.clientX, e.clientY];
      this.pointers.set(
        e.pointerId,
        map(element, this.getScale(), e.clientX, e.clientY)
      );
      this.moves = [
        this.moves[0] + e.movementX,
        this.moves[1] + e.movementY,
      ];
    });
  }

  getScale() {
    return this.scale;
  }

  updateScale(scale: number) {
    this.scale = scale;
  }

  get count() {
    return this.pointers.size;
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0
      ? Array.from(this.pointers.values()).flat()
      : [0, 0];
  }

  get first() {
    return this.pointers.values().next().value || this.lastCoords;
  }
}

// Reusable Shader Background Hook
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);

    rendererRef.current.setup();
    rendererRef.current.init();

    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }

    const resize = () => {
      if (!canvasRef.current) return;
      const c = canvasRef.current;
      const d = Math.max(1, 0.5 * window.devicePixelRatio);
      c.width = window.innerWidth * d;
      c.height = window.innerHeight * d;
      if (rendererRef.current) rendererRef.current.updateScale(d);
      if (pointersRef.current) pointersRef.current.updateScale(d);
    };

    const loop = (now: number) => {
      if (!rendererRef.current || !pointersRef.current) return;
      rendererRef.current.updateMouse(pointersRef.current.first);
      rendererRef.current.updatePointerCount(pointersRef.current.count);
      rendererRef.current.updatePointerCoords(pointersRef.current.coords);
      rendererRef.current.updateMove(pointersRef.current.move);
      rendererRef.current.render(now);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop(0);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return canvasRef;
};

// Animation keyframes as a style element
const ShaderHeroStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        @keyframes shader-fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shader-fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shader-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .shader-animate-fade-in-down {
          animation: shader-fade-in-down 0.8s ease-out forwards;
        }
        .shader-animate-fade-in-up {
          animation: shader-fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .shader-delay-200 { animation-delay: 0.2s; }
        .shader-delay-400 { animation-delay: 0.4s; }
        .shader-delay-600 { animation-delay: 0.6s; }
        .shader-delay-800 { animation-delay: 0.8s; }
      `,
    }}
  />
);

// Liquid Gradient Button
const LiquidButton: React.FC<{ text: string; onClick?: () => void }> = ({
  text,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block w-52 h-[3em] group dark:bg-black bg-white dark:border-white border-black border-2 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
        <span className="absolute inset-0 rounded-lg bg-[#d9d9d9] filter blur-[6.5px]" />
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Liquid isHovered={isHovered} colors={LIQUID_COLORS} />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-lg bg-[#010128] filter blur-[7.3px]" />
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-[#d9d9d9]" />
        <span className="absolute inset-0 rounded-lg bg-black" />
        <Liquid isHovered={isHovered} colors={LIQUID_COLORS} />
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`absolute inset-0 rounded-lg border-solid border-[3px] border-gradient-to-b from-transparent to-white mix-blend-overlay filter ${
              i <= 2 ? "blur-[3px]" : i === 3 ? "blur-[5px]" : "blur-[4px]"
            }`}
          />
        ))}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-lg filter blur-[15px] bg-[#006]" />
      </div>
      <button
        className="absolute inset-0 rounded-lg bg-transparent cursor-pointer"
        aria-label={text}
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center justify-center px-4 gap-2 rounded-lg group-hover:text-yellow-400 text-white text-sm font-semibold tracking-wide whitespace-nowrap">
          <Star className="group-hover:fill-yellow-400 fill-white w-4 h-4 flex-shrink-0" />
          <span>{text}</span>
        </span>
      </button>
    </div>
  );
};

// Reusable Hero Component
const AnimatedShaderHero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
}) => {
  const canvasRef = useShaderBackground();

  return (
    <div
      className={`relative w-full min-h-[90vh] overflow-hidden bg-black ${className}`}
    >
      <ShaderHeroStyles />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover touch-none"
        style={{ background: "black" }}
      />

      {/* Bottom gradient fade — blends shader into page background */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white pt-16 pb-24">
        {/* Trust Badge */}
        {trustBadge && (
          <div className="mb-8 shader-animate-fade-in-down">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-violet-500/10 backdrop-blur-md border border-violet-400/20 rounded-full text-sm">
              {trustBadge.icons && (
                <div className="flex">
                  {trustBadge.icons.map((icon, index) => (
                    <span
                      key={index}
                      className="text-violet-300"
                    >
                      {icon}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-violet-200/90">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-6 max-w-4xl mx-auto px-6">
          {/* Main Heading with Animation */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent shader-animate-fade-in-up shader-delay-200">
              {headline.line1}
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent shader-animate-fade-in-up shader-delay-400">
              {headline.line2}
            </h1>
          </div>

          {/* Subtitle with Animation */}
          {subtitle && (
            <div className="max-w-2xl mx-auto shader-animate-fade-in-up shader-delay-600">
              <p className="text-base sm:text-lg md:text-xl text-white/60 font-light leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* CTA Buttons with Animation */}
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 shader-animate-fade-in-up shader-delay-800">
              {buttons.primary && (
                <button
                  onClick={buttons.primary.onClick}
                  className="px-7 py-3 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <LiquidButton
                  text={buttons.secondary.text}
                  onClick={buttons.secondary.onClick}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedShaderHero;
export type { HeroProps };
