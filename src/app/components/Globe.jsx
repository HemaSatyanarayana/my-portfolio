"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

function fibonacciSphere(n) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  const yMax = 0.75;
  for (let i = 0; i < n; i++) {
    const y = (1 - ((i + 0.5) / n) * 2) * yMax;
    const r = Math.sqrt(1 - y * y);
    pts.push(new THREE.Vector3(Math.cos(phi * i) * r, y, Math.sin(phi * i) * r));
  }
  return pts;
}

export default function Globe({ skills = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // Scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 3.4;

    // WebGL renderer (transparent bg)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.filter = "drop-shadow(0 0 24px rgba(18,130,95,0.25))";
    el.appendChild(renderer.domElement);

    // CSS2D renderer for skill labels
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(W, H);
    Object.assign(labelRenderer.domElement.style, {
      position: "absolute",
      top: "0",
      left: "0",
      pointerEvents: "none",
      overflow: "visible",
    });
    el.appendChild(labelRenderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const mainLight = new THREE.PointLight(0x4dffc0, 4, 10);
    mainLight.position.set(2, 2, 3);
    scene.add(mainLight);
    const fillLight = new THREE.PointLight(0x12825f, 1.5, 8);
    fillLight.position.set(-2, -1, 1);
    scene.add(fillLight);

    // Globe sphere
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x071510,
        emissive: 0x030a07,
        specular: 0x1aaa6e,
        shininess: 60,
        transparent: true,
        opacity: 0.92,
      })
    );
    scene.add(globe);

    // Latitude / longitude grid lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x12825f,
      transparent: true,
      opacity: 0.45,
    });
    // Latitude rings (9 rings)
    for (let i = 1; i <= 8; i++) {
      const lat = (i / 9) * Math.PI - Math.PI / 2;
      const pts = [];
      for (let j = 0; j <= 64; j++) {
        const lon = (j / 64) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(
            Math.cos(lat) * Math.cos(lon),
            Math.sin(lat),
            Math.cos(lat) * Math.sin(lon)
          )
        );
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }
    // Longitude meridians (12 meridians)
    for (let i = 0; i < 12; i++) {
      const lon = (i / 12) * Math.PI * 2;
      const pts = [];
      for (let j = 0; j <= 64; j++) {
        const lat = (j / 64) * Math.PI - Math.PI / 2;
        pts.push(
          new THREE.Vector3(
            Math.cos(lat) * Math.cos(lon),
            Math.sin(lat),
            Math.cos(lat) * Math.sin(lon)
          )
        );
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }

    // Skill labels distributed evenly on the sphere surface
    const positions = fibonacciSphere(skills.length);
    const labelDivs = [];

    skills.forEach((skill, i) => {
      const div = document.createElement("div");
      div.textContent = skill;
      Object.assign(div.style, {
        color: "rgba(255,255,255,0.92)",
        fontSize: "14px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        fontWeight: "500",
        letterSpacing: "0.02em",
        background: "rgba(10,28,20,0.7)",
        border: "1px solid rgba(18,130,95,0.55)",
        padding: "3px 9px",
        borderRadius: "100px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        transition: "opacity 0.12s",
        backdropFilter: "blur(6px)",
      });
      labelDivs.push(div);

      const obj = new CSS2DObject(div);
      obj.position.copy(positions[i].clone().multiplyScalar(1.05));
      globe.add(obj);
    });

    // Animation loop
    const cameraDir = new THREE.Vector3();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      globe.rotation.y += 0.0045;

      // Fade labels on back hemisphere so they don't crowd the front
      camera.getWorldDirection(cameraDir);
      positions.forEach((localPos, i) => {
        const worldNormal = localPos
          .clone()
          .applyMatrix4(globe.matrixWorld)
          .normalize();
        const dot = -worldNormal.dot(cameraDir);
        // dot > 0 means facing camera; remap to [0,1] with soft edge
        const opacity = Math.max(0, Math.min(1, (dot + 0.1) / 0.5));
        labelDivs[i].style.opacity = opacity.toFixed(3);
      });

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      if (el.contains(labelRenderer.domElement)) el.removeChild(labelRenderer.domElement);
    };
  }, [skills]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}
