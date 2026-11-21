/* ==========================================================================
   terminalbio — Interactive Scientific Visualizations & UI Controls
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Drawer
  const menuBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      const isOpen = drawer.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 2. Hero Biomolecular & Voxel Lattice Canvas
  const canvas = document.getElementById("bio-lattice-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const statusLabel = document.getElementById("canvas-telemetry-readout");
    let mode = "symmetry"; // 'symmetry' | 'voxel' | 'loop'
    let width = 0;
    let height = 0;
    let t = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const modeButtons = document.querySelectorAll(".canvas-mode-btn");
    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.mode;
        if (statusLabel) {
          if (mode === "symmetry") statusLabel.textContent = "MODE 01 // BIO ↔ INFO SYMMETRY";
          if (mode === "voxel") statusLabel.textContent = "MODE 02 // DISCRETE VOXEL TENSOR";
          if (mode === "loop") statusLabel.textContent = "MODE 03 // STATE → RESPONSE LOOP";
        }
      });
    });

    const nodes = Array.from({ length: 44 }, (_, i) => ({
      phase: (i / 44) * Math.PI * 2,
      radiusOffset: (i % 5) * 6,
      color: i % 3 === 0 ? "#2CE6D3" : i % 3 === 1 ? "#E85D9E" : "#C4E84A",
      size: i % 4 === 0 ? 5 : 3.5,
    }));

    const render = () => {
      t += 0.014;
      ctx.clearRect(0, 0, width, height);

      // Subtle coordinate grid
      ctx.strokeStyle = "rgba(44, 230, 211, 0.09)";
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width * 0.5;
      const cy = height * 0.5;

      if (mode === "symmetry") {
        // Left organic protein helix + Right pixelated voxel grid mirror
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx, 18);
        ctx.lineTo(cx, height - 18);
        ctx.stroke();
        ctx.setLineDash([]);

        nodes.forEach((n, idx) => {
          const prog = idx / nodes.length;
          const y = 36 + prog * (height - 72);
          const wave = Math.sin(prog * Math.PI * 3.5 + t) * (width * 0.16);
          const lx = cx - 48 - Math.abs(wave) * 0.75 + Math.cos(t + n.phase) * 10;

          // Organic node on left
          ctx.fillStyle = n.color;
          ctx.beginPath();
          ctx.arc(lx, y, n.size, 0, Math.PI * 2);
          ctx.fill();

          // Quantized voxel block on right (isomorphic symmetry)
          const rx = Math.round((cx + 36 + Math.abs(wave) * 0.75) / 16) * 16;
          const ry = Math.round(y / 16) * 16;
          ctx.fillStyle = n.color;
          ctx.fillRect(rx - 5, ry - 5, 10, 10);

          // Symmetry bridge line
          if (idx % 3 === 0) {
            ctx.strokeStyle = "rgba(44, 230, 211, 0.24)";
            ctx.beginPath();
            ctx.moveTo(lx, y);
            ctx.lineTo(rx, ry);
            ctx.stroke();
          }
        });
      } else if (mode === "voxel") {
        // 3D-projected modular voxel molecular pocket
        const cols = 11;
        const rows = 9;
        const cell = Math.min(width, height) / 15;
        const startX = cx - (cols * cell) / 2;
        const startY = cy - (rows * cell) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = c - cols / 2;
            const dy = r - rows / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const pulse = Math.sin(dist * 0.85 - t * 2.2);
            if (pulse > -0.15) {
              const px = startX + c * cell;
              const py = startY + r * cell;
              ctx.fillStyle =
                pulse > 0.55
                  ? "#2CE6D3"
                  : pulse > 0.15
                  ? "rgba(155, 200, 235, 0.55)"
                  : "rgba(232, 93, 158, 0.45)";
              ctx.fillRect(px + 2, py + 2, cell - 4, cell - 4);
            }
          }
        }
      } else {
        // Closed-loop Compute <-> Experiment orbit
        const rx = Math.min(width * 0.34, 150);
        const ry = Math.min(height * 0.28, 105);

        ctx.strokeStyle = "rgba(44, 230, 211, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        const stages = [
          { label: "STATE", angle: -Math.PI / 2, color: "#FFFFFF" },
          { label: "MODEL", angle: 0.2, color: "#2CE6D3" },
          { label: "ASSAY", angle: Math.PI - 0.2, color: "#C4E84A" },
        ];

        stages.forEach((s) => {
          const sx = cx + Math.cos(s.angle) * rx;
          const sy = cy + Math.sin(s.angle) * ry;
          ctx.fillStyle = "#0B132B";
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.5;
          ctx.fillRect(sx - 34, sy - 14, 68, 28);
          ctx.strokeRect(sx - 34, sy - 14, 68, 28);

          ctx.fillStyle = s.color;
          ctx.font = "10px 'DM Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(s.label, sx, sy);
        });

        // Orbiting evidence packet
        const packetAngle = t * 1.6;
        const px = cx + Math.cos(packetAngle) * rx;
        const py = cy + Math.sin(packetAngle) * ry;
        ctx.fillStyle = "#E85D9E";
        ctx.fillRect(px - 5, py - 5, 10, 10);
      }

      requestAnimationFrame(render);
    };
    render();
  }

  // 3. Interactive Closed-Loop Explorer Tabs (Home & Biocompute pages)
  const loopTabs = document.querySelectorAll(".loop-tab");
  const loopPanels = document.querySelectorAll(".loop-panel");
  if (loopTabs.length && loopPanels.length) {
    loopTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.target;
        loopTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        loopPanels.forEach((panel) => {
          panel.style.display = panel.id === target ? "grid" : "none";
        });
      });
    });
  }

  // 4. Interactive Application Track Filter (Applications page)
  const appFilters = document.querySelectorAll("[data-app-filter]");
  const appCards = document.querySelectorAll("[data-app-category]");
  if (appFilters.length && appCards.length) {
    appFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.appFilter;
        appFilters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        appCards.forEach((card) => {
          card.style.display =
            cat === "all" || card.dataset.appCategory === cat ? "flex" : "none";
        });
      });
    });
  }

  // 5. Static Contact / Research Inquiry Form Handler (GitHub Pages compatible)
  const contactForm = document.getElementById("terminalbio-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inquiry-name").value.trim();
      const org = document.getElementById("inquiry-org").value.trim();
      const track = document.getElementById("inquiry-track").value;
      const msg = document.getElementById("inquiry-message").value.trim();

      const statusBox = document.getElementById("form-status-box");
      if (statusBox) {
        statusBox.style.display = "block";
        statusBox.innerHTML = `<strong>Inquiry prepared for support@terminalbio.com</strong> — Opening your mail client with structured routing for <code>${track}</code>. You can also email <strong>support@terminalbio.com</strong> directly.`;
      }

      const subject = encodeURIComponent(`[terminalbio // ${track}] ${org || name}`);
      const body = encodeURIComponent(
        `Name: ${name}
Organization: ${org}
Program Track: ${track}

Biological Question / Collaboration Scope:
${msg}`
      );
      window.location.href = `mailto:support@terminalbio.com?subject=${subject}&body=${body}`;
    });
  }
});
