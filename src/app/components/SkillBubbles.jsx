"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// ─── Skill brand colours ──────────────────────────────────────────────────────
const PALETTE = {
  "JavaScript":    "#F7DF1E",
  "TypeScript":    "#3178C6",
  "HTML":          "#E34F26",
  "CSS":           "#1572B6",
  "Python":        "#3776AB",
  "Go":            "#00ADD8",
  "React":         "#61DAFB",
  "Node.js":       "#339933",
  "Express.js":    "#7B7B7B",
  "MongoDB":       "#47A248",
  "PostgreSQL":    "#336791",
  "ClickHouse":    "#FFCC00",
  "Kafka":         "#A86BE0",
  "TailwindCSS":   "#06B6D4",
  "ShadCN":        "#8B8B8B",
  "Zustand":       "#FF6B35",
  "Tanstack Query":"#FF4154",
  "LLM":           "#7C3AED",
  "GenAI":         "#8B5CF6",
  "RAG":           "#A855F7",
  "Agentic AI":    "#C084FC",
  "Docker":        "#2496ED",
  "Git":           "#F05032",
  "Qdrant":        "#DC143C",
};

function getColor(skill) {
  return new THREE.Color(PALETTE[skill] ?? "#12825F");
}

// ─── Popup overlay ────────────────────────────────────────────────────────────
function SkillPopup({ skill, experiences, onClose }) {
  const accent = PALETTE[skill] ?? "#12825F";
  const matches = experiences.filter((exp) =>
    (exp.title + " " + exp.description).toLowerCase().includes(skill.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
        cursor: "pointer",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(8,18,13,0.97)",
          border: `1px solid ${accent}55`,
          borderRadius: 20, padding: "28px 30px",
          maxWidth: 420, width: "90%", cursor: "default",
          boxShadow: `0 0 80px ${accent}22, 0 4px 40px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{
            background: `${accent}1a`,
            border: `1px solid ${accent}88`,
            color: accent,
            borderRadius: 100, padding: "5px 18px",
            fontSize: 14, fontWeight: 700, letterSpacing: "0.05em",
            fontFamily: "Inter, ui-sans-serif, sans-serif",
          }}>
            {skill}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)", borderRadius: 8,
              width: 32, height: 32, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Experience cards */}
        {matches.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {matches.map((exp, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: `3px solid ${accent}88`,
                borderRadius: "0 10px 10px 0", padding: "11px 14px",
              }}>
                <div style={{
                  color: accent, fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  marginBottom: 6, fontFamily: "Inter, ui-sans-serif, sans-serif",
                }}>
                  {exp.title}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.52)", fontSize: 12.5,
                  lineHeight: 1.7, fontFamily: "Inter, ui-sans-serif, sans-serif",
                }}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{
            color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center",
            marginTop: 4, fontFamily: "Inter, ui-sans-serif, sans-serif",
          }}>
            Core technology powering the full stack.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Physics constants ────────────────────────────────────────────────────────
const SPHERE_R   = 0.36;
const BOUNDARY_R = 1.9;
const GRAVITY    = 20;

// ─── Main component ───────────────────────────────────────────────────────────
export default function SkillBubbles({ skills = [], experiences = [] }) {
  const containerRef = useRef(null);
  const [activeSkill, setActiveSkill] = useState(null);

  // Stable ref so the Three.js closure always calls the latest setter
  const setActiveSkillRef = useRef(setActiveSkill);
  setActiveSkillRef.current = setActiveSkill;

  useEffect(() => {
    if (!skills.length) return;

    let cancelled = false;
    let disposeAll = () => {};

    import("cannon-es").then((CANNON) => {
      if (cancelled || !containerRef.current) return;

      const el  = containerRef.current;
      const W   = el.clientWidth;
      const H   = el.clientHeight;

      // ── Renderer ────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping        = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      el.appendChild(renderer.domElement);

      // CSS2D for skill name labels
      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(W, H);
      Object.assign(labelRenderer.domElement.style, {
        position: "absolute", top: "0", left: "0",
        pointerEvents: "none", overflow: "visible",
      });
      el.appendChild(labelRenderer.domElement);

      // ── Scene + camera ───────────────────────────────────────────────────
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.z = 7;

      // Dark inner sphere so glass transmission has something to refract against
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(18, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x04100a, side: THREE.BackSide }),
      ));

      // ── Lighting ─────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      const keyLight = new THREE.PointLight(0xffffff, 3.5, 40);
      keyLight.position.set(5, 6, 7);
      scene.add(keyLight);

      const tealFill = new THREE.PointLight(0x4dffc0, 2.0, 25);
      tealFill.position.set(-5, -3, 4);
      scene.add(tealFill);

      const blueRim = new THREE.PointLight(0x3b82f6, 1.2, 20);
      blueRim.position.set(0, -6, -4);
      scene.add(blueRim);

      // ── Physics world ────────────────────────────────────────────────────
      const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
      world.broadphase = new CANNON.SAPBroadphase(world);
      world.defaultContactMaterial.restitution = 0.52;
      world.defaultContactMaterial.friction    = 0.04;

      // ── Shared geometry ──────────────────────────────────────────────────
      const outerGeo = new THREE.SphereGeometry(SPHERE_R, 52, 52);
      const innerGeo = new THREE.SphereGeometry(SPHERE_R * 0.60, 28, 28);

      const bodies  = [];
      const meshes  = [];

      skills.forEach((skill, i) => {
        // Physics body — start in a shell around the origin
        const angle = (i / skills.length) * Math.PI * 2;
        const tier  = Math.floor(i / 8);
        const initR = 0.5 + tier * 0.55;

        const body = new CANNON.Body({
          mass:           1,
          linearDamping:  0.25,
          angularDamping: 0.6,
          position: new CANNON.Vec3(
            initR * Math.cos(angle),
            initR * Math.sin(angle) * 0.7 + (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * initR * 0.8,
          ),
        });
        body.addShape(new CANNON.Sphere(SPHERE_R));
        // Random kick to seed jiggling
        body.velocity.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        );
        world.addBody(body);
        bodies.push(body);

        // Glass outer sphere
        const color = getColor(skill);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color,
          metalness:          0.0,
          roughness:          0.03,
          transmission:       0.80,
          thickness:          SPHERE_R * 2.1,
          ior:                1.45,
          transparent:        true,
          clearcoat:          1.0,
          clearcoatRoughness: 0.04,
          envMapIntensity:    0.5,
        });
        const outerMesh = new THREE.Mesh(outerGeo, glassMat);
        scene.add(outerMesh);

        // Glowing inner core
        const innerMat = new THREE.MeshStandardMaterial({
          color,
          emissive:          color,
          emissiveIntensity: 0.22,
          transparent:       true,
          opacity:           0.60,
          roughness:         0.55,
          metalness:         0.1,
        });
        outerMesh.add(new THREE.Mesh(innerGeo, innerMat));

        // CSS2D skill label
        const div = document.createElement("div");
        div.textContent = skill;
        Object.assign(div.style, {
          color:       "#ffffff",
          fontSize:    "9.5px",
          fontWeight:  "700",
          fontFamily:  "Inter, ui-sans-serif, sans-serif",
          textTransform:  "uppercase",
          letterSpacing:  "0.07em",
          textShadow: `0 0 12px ${PALETTE[skill] ?? "#12825F"}dd, 0 1px 4px rgba(0,0,0,0.95)`,
          pointerEvents:  "none",
          userSelect:     "none",
          whiteSpace:     "nowrap",
        });
        const labelObj = new CSS2DObject(div);
        labelObj.position.set(0, 0, 0);
        outerMesh.add(labelObj);

        meshes.push(outerMesh);
      });

      // ── Mouse interaction ─────────────────────────────────────────────────
      const raycaster   = new THREE.Raycaster();
      const ndcMouse    = new THREE.Vector2();
      const dragPlane   = new THREE.Plane();
      const planeHit    = new THREE.Vector3();

      let dragIdx       = null;
      let mouseDownPos  = null;
      let mouseDownTime = 0;
      const dragHistory = [];

      function toNDC(e) {
        const r = el.getBoundingClientRect();
        ndcMouse.set(
          ((e.clientX - r.left) / r.width)  * 2 - 1,
          -((e.clientY - r.top)  / r.height) * 2 + 1,
        );
      }

      const onMouseDown = (e) => {
        toNDC(e);
        raycaster.setFromCamera(ndcMouse, camera);
        const hits = raycaster.intersectObjects(meshes, false);
        if (!hits.length) return;

        dragIdx      = meshes.indexOf(hits[0].object);
        mouseDownPos = { x: e.clientX, y: e.clientY };
        mouseDownTime = Date.now();
        dragHistory.length = 0;

        // Freeze dragged body
        bodies[dragIdx].mass = 0;
        bodies[dragIdx].velocity.set(0, 0, 0);
        bodies[dragIdx].angularVelocity.set(0, 0, 0);
        bodies[dragIdx].updateMassProperties();

        dragPlane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(new THREE.Vector3()),
          hits[0].point,
        );
        raycaster.ray.intersectPlane(dragPlane, planeHit);

        el.style.cursor = "grabbing";
      };

      const onMouseMove = (e) => {
        if (dragIdx === null) return;
        toNDC(e);
        raycaster.setFromCamera(ndcMouse, camera);
        if (!raycaster.ray.intersectPlane(dragPlane, planeHit)) return;

        bodies[dragIdx].position.set(planeHit.x, planeHit.y, planeHit.z);
        dragHistory.push({ x: planeHit.x, y: planeHit.y, z: planeHit.z, t: Date.now() });
        if (dragHistory.length > 7) dragHistory.shift();
      };

      const onMouseUp = (e) => {
        if (dragIdx === null) return;

        const dx = e.clientX - (mouseDownPos?.x ?? e.clientX);
        const dy = e.clientY - (mouseDownPos?.y ?? e.clientY);
        const wasDrag  = Math.sqrt(dx * dx + dy * dy) > 5;
        const elapsed  = Date.now() - mouseDownTime;

        if (!wasDrag && elapsed < 280) {
          // Click — show popup
          setActiveSkillRef.current(skills[dragIdx]);
        } else if (dragHistory.length >= 2) {
          // Fling — apply velocity from drag history
          const dt = Math.max(
            (dragHistory.at(-1).t - dragHistory[0].t) / 1000, 0.016,
          );
          const scale = 0.6;
          bodies[dragIdx].velocity.set(
            (dragHistory.at(-1).x - dragHistory[0].x) / dt * scale,
            (dragHistory.at(-1).y - dragHistory[0].y) / dt * scale,
            (dragHistory.at(-1).z - dragHistory[0].z) / dt * scale,
          );
        }

        bodies[dragIdx].mass = 1;
        bodies[dragIdx].updateMassProperties();
        dragIdx = null;
        dragHistory.length = 0;
        el.style.cursor = "grab";
      };

      el.style.cursor = "grab";
      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseup",   onMouseUp);

      // ── Animation loop ────────────────────────────────────────────────────
      let rafId;
      const clock     = new THREE.Clock();
      let   accumulator = 0;
      const FIXED_DT  = 1 / 60;

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), 0.05);
        accumulator += delta;

        while (accumulator >= FIXED_DT) {
          bodies.forEach((body, i) => {
            if (i === dragIdx) return;

            const p    = body.position;
            const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);

            // Central gravity well — pulls all spheres to origin
            if (dist > 0.01) {
              const g = GRAVITY / dist;
              body.applyForce(new CANNON.Vec3(-p.x * g, -p.y * g, -p.z * g));
            }

            // Soft boundary wall — prevents escape
            const maxR = BOUNDARY_R - SPHERE_R;
            if (dist > maxR) {
              const excess = dist - maxR;
              const k = 90 * excess;
              body.applyForce(new CANNON.Vec3(
                -(p.x / dist) * k,
                -(p.y / dist) * k,
                -(p.z / dist) * k,
              ));
            }

            // Tiny jitter to prevent frozen clusters
            body.applyForce(new CANNON.Vec3(
              (Math.random() - 0.5) * 0.25,
              (Math.random() - 0.5) * 0.25,
              (Math.random() - 0.5) * 0.25,
            ));
          });

          world.step(FIXED_DT);
          accumulator -= FIXED_DT;
        }

        // Sync Three.js meshes → physics bodies
        bodies.forEach((body, i) => {
          meshes[i].position.set(body.position.x, body.position.y, body.position.z);
          meshes[i].quaternion.set(
            body.quaternion.x, body.quaternion.y,
            body.quaternion.z, body.quaternion.w,
          );
        });

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
      };
      animate();

      // ── Resize ───────────────────────────────────────────────────────────
      const onResize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        labelRenderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // ── Dispose ───────────────────────────────────────────────────────────
      disposeAll = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseup",   onMouseUp);
        renderer.dispose();
        outerGeo.dispose();
        innerGeo.dispose();
        meshes.forEach((m) => { m.material?.dispose?.(); });
        if (el.contains(renderer.domElement))    el.removeChild(renderer.domElement);
        if (el.contains(labelRenderer.domElement)) el.removeChild(labelRenderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      disposeAll();
    };
  }, [skills]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {activeSkill && (
        <SkillPopup
          skill={activeSkill}
          experiences={experiences}
          onClose={() => setActiveSkill(null)}
        />
      )}
      <span style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.18)",
        userSelect: "none", pointerEvents: "none", textTransform: "uppercase",
        fontFamily: "Inter, ui-sans-serif, sans-serif",
      }}>
        click · drag · fling
      </span>
    </div>
  );
}
