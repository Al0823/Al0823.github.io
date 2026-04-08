class Avatar2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this._resize();
    window.addEventListener("resize", () => this._resize());

    this.mouseX = this.w / 2;
    this.mouseY = this.h / 2;

    this.traits = {};
    this.time = 0;

    this.blinkTimer = 0;
    this.blinkState = 1; // 1 = open, 0 = closed

    this._bindMouse();
    this._loop();
  }

  _resize() {
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;

    this.canvas.width = this.w;
    this.canvas.height = this.h;
  }

  init(comp) {
    this.traits = this._parseTraits(comp);
  }

  _clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  _parseTraits(comp) {
    const a = (comp.appearance || "").toLowerCase();

    const heightNum = parseFloat(comp.height) || 68;
    const weightNum = parseFloat(comp.weight) || 150;
    const age = parseInt(comp.age) || 20;

    const genderRaw = (comp.gender || "").toLowerCase();

    let genderType = "neutral";
    if (genderRaw.includes("she")) genderType = "feminine";
    else if (genderRaw.includes("he")) genderType = "masculine";

    return {
      skin:
        a.includes("dark") ? "#5a3b2e" :
        a.includes("tan") ? "#c58c5a" :
        "#f1d3c2",

      hairColor:
        a.includes("blonde") ? "#e6c27a" :
        a.includes("white") ? "#d9d9d9" :
        a.includes("red") ? "#8a3b2e" :
        "#2a1a12",

      hairStyle:
        a.includes("long") ? "long" :
        a.includes("curly") ? "curly" :
        "short",

      eyes:
        a.includes("green") ? "#4caf50" :
        a.includes("blue") ? "#4a90e2" :
        a.includes("red") ? "#b33939" :
        "#3b2f2f",

      glowingEyes: a.includes("glow") || a.includes("magic"),

      age,
      height: heightNum,
      weight: weightNum,

      faceWidth: this._clamp(60 + (weightNum - 150) * 0.15, 50, 90),
      faceHeight: this._clamp(75 + (heightNum - 66) * 0.2, 65, 110),

      jawSoftness: age < 18 ? 1.2 : age > 40 ? 0.85 : 1,
      eyeSize: age < 18 ? 1.2 : 1,

      shoulderWidth:
        genderType === "feminine" ? 90 :
        genderType === "masculine" ? 120 :
        105
    };
  }

  _bindMouse() {
    window.addEventListener("mousemove", e => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  _loop() {
    requestAnimationFrame(() => this._loop());
    this._draw();
  }

  _draw() {
    const ctx = this.ctx;
    this.time += 0.016;

    // blinking logic
    this.blinkTimer += 0.016;
    if (this.blinkTimer > 3) {
      this.blinkState = 0;
      if (this.blinkTimer > 3.1) {
        this.blinkState = 1;
        this.blinkTimer = 0;
      }
    }

    ctx.clearRect(0, 0, this.w, this.h);

    const cx = this.w / 2;
    const cy = this.h / 2;

    const dx = (this.mouseX - cx) * 0.02;
    const dy = (this.mouseY - cy) * 0.02;

    const breath = Math.sin(this.time * 2) * 2;

    const t = this.traits;

    // aura
    const aura = ctx.createRadialGradient(cx, cy, 50, cx, cy, 350);
    aura.addColorStop(0, "#7aa2ff22");
    aura.addColorStop(1, "#00000000");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, this.w, this.h);

    const lx = this.mouseX;
    const ly = this.mouseY;

    // body
    const bodyY = cy + 120 + breath;
    ctx.fillStyle = "#2a2a2a";
    ctx.beginPath();
    this._roundRect(ctx, cx - t.shoulderWidth / 2, bodyY, t.shoulderWidth, 140, 30);
    ctx.fill();

    const headX = cx + dx;
    const headY = cy - 40 + breath;

    const skinGrad = ctx.createRadialGradient(lx, ly, 50, headX, headY, 140);
    skinGrad.addColorStop(0, t.skin);
    skinGrad.addColorStop(1, this._darken(t.skin, 0.5));

    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.ellipse(headX, headY, t.faceWidth, t.faceHeight * t.jawSoftness, 0, 0, Math.PI * 2);
    ctx.fill();

    // shadow
    ctx.fillStyle = "#00000033";
    ctx.beginPath();
    ctx.ellipse(headX + 20, headY + 30, t.faceWidth * 0.8, t.faceHeight * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // hair
    ctx.fillStyle = t.hairColor;
    ctx.beginPath();
    ctx.ellipse(headX, headY - 40, t.faceWidth * 1.3, t.faceHeight * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // eyes
    const eyeOffset = 25 * t.eyeSize;
    this._drawEye(headX - eyeOffset + dx * 2, headY - 25 + dy * 2, t.eyeSize);
    this._drawEye(headX + eyeOffset + dx * 2, headY - 25 + dy * 2, t.eyeSize);

    // mouth
    ctx.strokeStyle = "#3c1e1ecc";
    ctx.beginPath();
    ctx.quadraticCurveTo(headX - 15, headY + 30, headX + 15, headY + 30);
    ctx.stroke();
  }

  _drawEye(x, y, scale = 1) {
    const ctx = this.ctx;

    // blinking
    const open = this.blinkState;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x, y, 12 * scale, 8 * scale * open, 0, 0, Math.PI * 2);
    ctx.fill();

    if (open > 0.2) {
      ctx.fillStyle = this.traits.eyes;
      ctx.beginPath();
      ctx.arc(x, y, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  _darken(hex, amt) {
    hex = hex.replace("#", "");

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r *= (1 - amt);
    g *= (1 - amt);
    b *= (1 - amt);

    return `rgb(${r|0},${g|0},${b|0})`;
  }
}

window.Avatar2D = Avatar2D;