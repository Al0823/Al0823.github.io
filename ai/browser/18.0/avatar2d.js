class Avatar2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this._resize();
    window.addEventListener("resize", () => this._resize());

    this.mouseX = this.w / 2;
    this.mouseY = this.h / 2;

    this.traits = this._parseTraits(null); // default traits
    this.time = 0;

    this.blinkTimer = 0;
    this.blinkState = 1; // 1 = open, 0 = closed

    this.expression = "idle";
    this.expressionTimer = 0;
    this.view = "bust"; // bust, upper, full

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
    this._applyViewScale();
  }

  setView(view) {
    this.view = view;
    this._applyViewScale();
  }

  _applyViewScale() {
    // Adjust scale based on view
    switch (this.view) {
      case "bust":
        this.scale = 1;
        this.bodyOffset = 120;
        break;
      case "upper":
        this.scale = 0.8;
        this.bodyOffset = 100;
        break;
      case "full":
        this.scale = 0.6;
        this.bodyOffset = 80;
        break;
      default:
        this.scale = 1;
        this.bodyOffset = 120;
    }
  }

  _clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  _parseTraits(comp) {
    if (!comp) return { skin: '#f1d3c2', hairColor: '#2a1a12', hairStyle: 'short', eyes: '#3b2f2f', glowingEyes: false, age: 20, height: 68, weight: 150, faceWidth: 60, faceHeight: 75, jawSoftness: 1, eyeSize: 1, shoulderWidth: 105 };

    const a = String(comp.appearance || "").toLowerCase();

    const heightStr = comp.height || "5'8\"";
    let heightNum = 68; // default inches
    const feetMatch = heightStr.match(/(\d+)\s*'\s*(\d+)/);
    if (feetMatch) {
      heightNum = parseInt(feetMatch[1]) * 12 + parseInt(feetMatch[2]);
    } else {
      const num = parseFloat(heightStr);
      if (!isNaN(num)) heightNum = num;
    }

    const weightStr = comp.weight || "150 lbs";
    const weightNum = parseFloat(weightStr) || 150;
    const age = parseInt(comp.age) || 20;

    const genderRaw = String(comp.gender || "").toLowerCase();

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

      faceWidth: Math.max(50, Math.min(90, 60 + (weightNum - 150) * 0.15)),
      faceHeight: Math.max(65, Math.min(110, 75 + (heightNum - 66) * 0.2)),

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

    // expression timer
    if (this.expressionTimer > 0) {
      this.expressionTimer -= 0.016;
      if (this.expressionTimer <= 0) {
        this.expression = "idle";
      }
    }

    ctx.clearRect(0, 0, this.w, this.h);

    const cx = this.w / 2;
    const cy = this.h / 2;

    const dx = (this.mouseX - cx) * 0.02;
    const dy = (this.mouseY - cy) * 0.02;

    const breath = Math.sin(this.time * 2) * 2;

    const t = this.traits;

    // Ensure colors are valid strings
    if (typeof t.skin !== 'string' || !t.skin) t.skin = '#f1d3c2';
    if (typeof t.hairColor !== 'string' || !t.hairColor) t.hairColor = '#2a1a12';
    if (typeof t.eyes !== 'string' || !t.eyes) t.eyes = '#3b2f2f';

    const scale = this.scale || 1;

    // aura
    const aura = ctx.createRadialGradient(cx, cy, 50, cx, cy, 350);
    aura.addColorStop(0, "#7aa2ff22");
    aura.addColorStop(1, "#00000000");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, this.w, this.h);

    const lx = this.mouseX;
    const ly = this.mouseY;

    // body
    const bodyY = cy + this.bodyOffset + breath;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

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
    this._drawMouth(headX, headY + 30);

    ctx.restore();
  }

  _drawMouth(x, y) {
    const ctx = this.ctx;
    ctx.strokeStyle = "#3c1e1ecc";
    ctx.lineWidth = 2;
    ctx.beginPath();

    let curve = 0;
    switch (this.expression) {
      case "joy":
        curve = 8;
        break;
      case "sadness":
        curve = -6;
        break;
      case "anger":
        curve = -3;
        break;
      case "excitement":
        curve = 10;
        break;
      case "curiosity":
        curve = 2;
        break;
      case "surprise":
        curve = 0;
        ctx.beginPath();
        ctx.arc(x, y - 5, 3, 0, Math.PI * 2);
        ctx.stroke();
        return;
      default: // idle
        curve = 2;
    }

    ctx.quadraticCurveTo(x - 15, y + curve, x + 15, y + curve);
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
    if (!hex || typeof hex !== 'string') return '#000000';
    hex = hex.replace("#", "");
    if (hex.length !== 6) return '#000000';

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';

    r *= (1 - amt);
    g *= (1 - amt);
    b *= (1 - amt);

    return `rgb(${r|0},${g|0},${b|0})`;
  }
}

window.Avatar2D = Avatar2D;