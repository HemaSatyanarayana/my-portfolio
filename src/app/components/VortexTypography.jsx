"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Atlas ────────────────────────────────────────────────────────────────────
// Renders every skill chip onto a single canvas so we need only one texture.
function buildAtlas(skills) {
  const CW = 320, CH = 68, COLS = 4;
  const ROWS = Math.ceil(skills.length / COLS);

  const canvas = document.createElement("canvas");
  canvas.width = COLS * CW;
  canvas.height = ROWS * CH;
  const ctx = canvas.getContext("2d");

  skills.forEach((skill, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);

    // Pill bounds (6 px margin inside each cell)
    const bx = col * CW + 8, by = row * CH + 8;
    const bw = CW - 16,     bh = CH - 16;
    const r  = bh / 2;

    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + r, r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.arcTo(bx + bw, by + bh, bx + bw - r, by + bh, r);
    ctx.lineTo(bx + r, by + bh);
    ctx.arcTo(bx, by + bh, bx, by + bh - r, r);
    ctx.lineTo(bx, by + r);
    ctx.arcTo(bx, by, bx + r, by, r);
    ctx.closePath();

    ctx.fillStyle = "rgba(10,28,20,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(18,130,95,0.82)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.93)";
    ctx.font = "600 22px Inter, ui-sans-serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(skill, col * CW + CW / 2, row * CH + CH / 2);
  });

  return { canvas, COLS, ROWS };
}

// ─── Vertex Shader ────────────────────────────────────────────────────────────
// Positions each instanced chip along a helical vortex using parametric math,
// then bills it to always face the camera in view space.
const VERT = /* glsl */ `
uniform float u_time;
uniform float u_scroll;
uniform float u_pitch;
uniform float u_count;
uniform float u_rows;
uniform float u_cols;
uniform float u_turns;
uniform float u_radius;
uniform float u_height;

attribute float a_idx;
attribute vec2  a_uv0;

varying vec2  v_uv;
varying float v_alpha;

#define PI 3.141592653589793

void main() {
  float norm = a_idx / u_count;

  // Each chip's angle on the helix — auto-rotates with time, shifts with scroll
  float t = norm * u_turns * 2.0 * PI - u_time * 0.38 + u_scroll;

  // Vertical position, shifted by pitch (spring-returns to 0)
  float yPos = (norm - 0.5) * u_height + u_pitch;

  // Helix center in world space
  vec3 center = vec3(
    u_radius * cos(t),
    yPos,
    u_radius * sin(t)
  );

  // ── Billboard ──────────────────────────────────────────────────────────────
  // Transform center to view space, then add the plane vertex offset in that
  // same space so the chip always faces the camera regardless of rotation.
  vec4 vc = modelViewMatrix * vec4(center, 1.0);

  float chipW = 0.72;                     // world-unit width  (tunable)
  float chipH = chipW * (68.0 / 320.0);  // keeps atlas cell aspect ratio

  vec4 vp = vc + vec4(position.x * chipW, position.y * chipH, 0.0, 0.0);
  gl_Position = projectionMatrix * vp;

  // ── Atlas UV ───────────────────────────────────────────────────────────────
  // Map the plane's 0-1 UVs into the correct atlas cell.
  // Canvas y=0 is top; texture y=0 is bottom — a_uv0.y is pre-flipped.
  v_uv = vec2(
    a_uv0.x + uv.x / u_cols,
    a_uv0.y + uv.y / u_rows
  );

  // ── Depth opacity ──────────────────────────────────────────────────────────
  // Skills at the back of the vortex fade out; front skills are fully bright.
  float worldZ = u_radius * sin(t);
  v_alpha = 0.06 + 0.94 * smoothstep(-u_radius * 0.45, u_radius, worldZ);
}
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────
// Samples the atlas texture and applies the depth-based alpha.
const FRAG = /* glsl */ `
uniform sampler2D u_atlas;

varying vec2  v_uv;
varying float v_alpha;

void main() {
  vec4 c = texture2D(u_atlas, v_uv);
  float a = c.a * v_alpha;
  if (a < 0.012) discard;
  gl_FragColor = vec4(c.rgb, a);
}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function VortexTypography({ skills = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || skills.length === 0) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // Scene + camera
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 5.0;

    // Renderer (transparent background)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Texture atlas ──────────────────────────────────────────────────────
    const { canvas, COLS, ROWS } = buildAtlas(skills);
    const atlas = new THREE.CanvasTexture(canvas);

    // ── Per-instance buffer attributes ────────────────────────────────────
    const N      = skills.length;
    const idxArr = new Float32Array(N);
    const uvArr  = new Float32Array(N * 2);

    for (let i = 0; i < N; i++) {
      idxArr[i] = i;
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      uvArr[i * 2]     = col / COLS;
      uvArr[i * 2 + 1] = 1.0 - (row + 1) / ROWS; // flip Y for texture coords
    }

    // One shared plane; positions computed entirely in the vertex shader
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.setAttribute("a_idx", new THREE.InstancedBufferAttribute(idxArr, 1));
    geo.setAttribute("a_uv0", new THREE.InstancedBufferAttribute(uvArr,  2));

    // ── Shader uniforms ───────────────────────────────────────────────────
    const TURNS  = 2.5;
    const RADIUS = 1.55;
    const HEIGHT = 4.6;

    const uniforms = {
      u_time:   { value: 0 },
      u_scroll: { value: 0 },
      u_pitch:  { value: 0 },
      u_count:  { value: N },
      u_rows:   { value: ROWS },
      u_cols:   { value: COLS },
      u_turns:  { value: TURNS },
      u_radius: { value: RADIUS },
      u_height: { value: HEIGHT },
      u_atlas:  { value: atlas },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,
      depthWrite:     false,
      side:           THREE.DoubleSide,
    });

    // InstancedMesh — all instance matrices stay at identity;
    // the vertex shader owns all world-space placement.
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.frustumCulled = false;
    const identity = new THREE.Matrix4();
    for (let i = 0; i < N; i++) mesh.setMatrixAt(i, identity);
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);

    // ── Helix guide lines (two faint strands) ─────────────────────────────
    const strandPts = (offset) => {
      const pts = [];
      for (let i = 0; i <= 180; i++) {
        const tt = (i / 180) * TURNS * Math.PI * 2 + offset;
        pts.push(new THREE.Vector3(
          RADIUS * Math.cos(tt),
          (i / 180 - 0.5) * HEIGHT,
          RADIUS * Math.sin(tt),
        ));
      }
      return pts;
    };

    const lineMat = new THREE.LineBasicMaterial({
      color:       0x12825f,
      transparent: true,
      opacity:     0.18,
    });
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(strandPts(0)), lineMat,
    ));
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(strandPts(Math.PI)), lineMat,
    ));

    // ── Scroll interaction ─────────────────────────────────────────────────
    // scrollV: spins the vortex; pitchV: shifts vertical position
    let scrollV = 0;
    let pitchV  = 0;

    const onWheel = (e) => {
      e.preventDefault();
      scrollV += e.deltaY * 0.0032;
      pitchV  += e.deltaY * 0.00045;
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    // ── Animation loop ────────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      uniforms.u_time.value += clock.getDelta();

      // Apply velocity with exponential decay
      uniforms.u_scroll.value += scrollV;
      scrollV *= 0.87;

      uniforms.u_pitch.value += pitchV;
      pitchV *= 0.87;
      uniforms.u_pitch.value *= 0.96; // spring back to centre

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("wheel", onWheel);
      renderer.dispose();
      atlas.dispose();
      geo.dispose();
      mat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [skills]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <span style={{
        position: "absolute",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 11,
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.2)",
        userSelect: "none",
        pointerEvents: "none",
        textTransform: "uppercase",
      }}>
        scroll to explore
      </span>
    </div>
  );
}
