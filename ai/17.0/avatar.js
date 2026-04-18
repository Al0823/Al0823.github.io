// avatar.js — 2D Companion Avatar System
// Uses PixiJS v7 for rendering. Draws a layered character portrait
// from companion trait fields. Fully animated: idle breathing, blinking,
// eye tracking, expressions per emotion system.

(function(global) {
  "use strict";


  var SKIN_TONES = {
    light:  { base: 0xFFE0C8, shadow: 0xE8BFA0, blush: 0xF4A0A0 },
    medium: { base: 0xD4956A, shadow: 0xB87040, blush: 0xC47050 },
    dark:   { base: 0x8B5E3C, shadow: 0x6B3E20, blush: 0x7A4030 },
    pale:   { base: 0xFFF0E8, shadow: 0xF0D0C0, blush: 0xFFB0B0 },
    tan:    { base: 0xC8854A, shadow: 0xA86030, blush: 0xB86040 }
  };

  var HAIR_COLORS = {
    black:    0x1A1008,
    brown:    0x5C3317,
    blonde:   0xF4C430,
    red:      0xB22222,
    white:    0xF0F0F0,
    silver:   0xC0C0C0,
    blue:     0x1E90FF,
    pink:     0xFF69B4,
    purple:   0x9370DB,
    green:    0x228B22,
    orange:   0xFF8C00,
    gray:     0x808080,
    auburn:   0x922724,
    platinum: 0xE8E0D0
  };

  var EYE_COLORS = {
    brown:  0x6B3A2A,
    blue:   0x1E6BAD,
    green:  0x2D8A4E,
    hazel:  0x8B7355,
    gray:   0x6B7B8A,
    black:  0x1A1A2E,
    amber:  0xB8860B,
    violet: 0x7B4FA6,
    red:    0x8B0000
  };

  function parseSkinTone(appearance) {
    if (!appearance) return SKIN_TONES.medium;
    var s = appearance.toLowerCase();
    if (s.match(/pale|fair|light skin|porcelain|ivory/)) return SKIN_TONES.pale;
    if (s.match(/light|white|caucasian/)) return SKIN_TONES.light;
    if (s.match(/dark|black|ebony|deep/)) return SKIN_TONES.dark;
    if (s.match(/tan|tanned|olive|bronze|brown skin/)) return SKIN_TONES.tan;
    if (s.match(/medium|mixed|caramel|beige/)) return SKIN_TONES.medium;
    return SKIN_TONES.medium;
  }

  function parseHairColor(appearance) {
    if (!appearance) return HAIR_COLORS.brown;
    var s = appearance.toLowerCase();
    for (var k in HAIR_COLORS) {
      if (s.indexOf(k + " hair") !== -1 || s.indexOf(k + "-haired") !== -1) return HAIR_COLORS[k];
    }
    for (var k2 in HAIR_COLORS) {
      if (s.indexOf(k2) !== -1) return HAIR_COLORS[k2];
    }
    return HAIR_COLORS.brown;
  }

  function parseEyeColor(appearance) {
    if (!appearance) return EYE_COLORS.brown;
    var s = appearance.toLowerCase();
    for (var k in EYE_COLORS) {
      if (s.indexOf(k + " eye") !== -1 || s.indexOf(k + "-eyed") !== -1) return EYE_COLORS[k];
    }
    for (var k2 in EYE_COLORS) {
      if (s.indexOf(k2) !== -1) return EYE_COLORS[k2];
    }
    return EYE_COLORS.brown;
  }

  function parseHairStyle(appearance) {
    if (!appearance) return "medium";
    var s = appearance.toLowerCase();
    if (s.match(/short hair|short-haired|crew cut|buzz/)) return "short";
    if (s.match(/long hair|long-haired|flowing/)) return "long";
    if (s.match(/curly|wavy|afro/)) return "curly";
    if (s.match(/bun|ponytail|tied/)) return "bun";
    if (s.match(/bald|shaved head/)) return "bald";
    if (s.match(/bob|pixie/)) return "short";
    return "medium";
  }

  function parseGenderPresentation(gender, appearance) {
    if (gender === "she/her") return "feminine";
    if (gender === "he/him") return "masculine";
    if (appearance) {
      var s = appearance.toLowerCase();
      if (s.match(/feminine|female|woman|girl/)) return "feminine";
      if (s.match(/masculine|male|man|boy/)) return "masculine";
    }
    return "neutral";
  }

  function parseClothingColor(appearance) {
    if (!appearance) return 0x3A5F8A;
    var s = appearance.toLowerCase();
    var colorMap = {
      red: 0xC0392B, blue: 0x2E86AB, green: 0x27AE60,
      black: 0x2C2C2C, white: 0xECECEC, yellow: 0xF1C40F,
      purple: 0x8E44AD, orange: 0xE67E22, pink: 0xE91E8C,
      gray: 0x7F8C8D, grey: 0x7F8C8D, brown: 0x7B5B3A,
      navy: 0x1A2D5A, teal: 0x1ABC9C, gold: 0xF39C12
    };
    for (var k in colorMap) {
      if (s.indexOf(k + " shirt") !== -1 || s.indexOf(k + " jacket") !== -1 ||
          s.indexOf(k + " top") !== -1 || s.indexOf(k + " hoodie") !== -1 ||
          s.indexOf(k + " dress") !== -1 || s.indexOf("wearing " + k) !== -1) {
        return colorMap[k];
      }
    }
    return 0x3A5F8A;
  }


  function CompanionAvatar(canvasEl) {
    this.canvas = canvasEl;
    this.app = null;
    this.layers = {};
    this.view = "bust";   // bust | upper | full | hidden
    this.expression = "idle";
    this.traits = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.blinkTimer = 0;
    this.blinkState = 0; // 0=open 1=closing 2=closed 3=opening
    this.breathPhase = 0;
    this.idlePhase = 0;
    this.expressionTimer = 0;
    this.initialized = false;
    this._raf = null;
    this._mouseMoveHandler = null;
  }

  CompanionAvatar.prototype.init = function(comp, w, h) {
    var self = this;
    this._initW = w || 260;
    this._initH = h || 520;
    this.traits = this._parseTraits(comp);

    if (this.app) {
      this.app.destroy(true);
      this.app = null;
    }

    var w = this._initW || 260;
    var h = this._initH || 520;

    // Hard set canvas dimensions
    this.canvas.width  = w;
    this.canvas.height = h;
    this.canvas.style.width  = w + "px";
    this.canvas.style.height = h + "px";

    // Try WebGL first, fall back to Canvas renderer if it fails
    var appOptions = {
      view: this.canvas,
      width: w,
      height: h,
      backgroundColor: 0x0d1117,
      antialias: true,
      resolution: 1,
      autoDensity: false
    };

    try {
      // Force canvas renderer — more compatible across browsers and GitHub Pages
      this.app = new PIXI.Application(Object.assign({}, appOptions, {
        forceCanvas: true
      }));
    } catch(e1) {
      try {
        this.app = new PIXI.Application(appOptions);
      } catch(e2) {
        throw new Error("PixiJS failed to init: " + e2.message);
      }
    }

    // Draw a basic 2D placeholder immediately so the spinner can hide
    try {
      var ctx2d = this.canvas.getContext("2d");
      if (ctx2d) {
        ctx2d.fillStyle = "#0d1117";
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.fillStyle = "#bc8cff22";
        ctx2d.beginPath();
        ctx2d.ellipse(w/2, h*0.45, w*0.2, h*0.28, 0, 0, Math.PI*2);
        ctx2d.fill();
      }
    } catch(e) {}

    this._build();
    this._startLoop();
    this._bindMouse();
    this.initialized = true;
  };

  CompanionAvatar.prototype._parseTraits = function(comp) {
    var app = comp.appearance || "";
    return {
      skin:      parseSkinTone(app),
      hairColor: parseHairColor(app),
      eyeColor:  parseEyeColor(app),
      hairStyle: parseHairStyle(app),
      gender:    parseGenderPresentation(comp.gender, app),
      clothing:  parseClothingColor(app),
      name:      comp.name || "?"
    };
  };

  CompanionAvatar.prototype._build = function() {
    var app = this.app;
    var W = app.screen.width;
    var H = app.screen.height;
    var t = this.traits;
    var self = this;

    // Clear
    app.stage.removeChildren();
    this.layers = {};

    // ── Background gradient ──
    var bg = new PIXI.Graphics();
    bg.beginFill(0x0d1117); bg.drawRect(0, 0, W, H); bg.endFill();
    // Soft vignette
    var bgGrad = new PIXI.Graphics();
    var cx = W / 2, cy = H * 0.6;
    for (var r = Math.max(W, H) * 0.8; r > 0; r -= 4) {
      var alpha = 0.04 * (1 - r / (Math.max(W, H) * 0.8));
      bgGrad.beginFill(0xbc8cff, alpha);
      bgGrad.drawEllipse(cx, cy, r, r * 0.7);
      bgGrad.endFill();
    }
    app.stage.addChild(bg);
    app.stage.addChild(bgGrad);

    // ── Root container — we'll move this for view modes ──
    var root = new PIXI.Container();
    root.x = W / 2;
    root.y = H * 0.52;
    this.layers.root = root;
    app.stage.addChild(root);

    // Scale character to fit view
    this._applyViewScale();

    // ── Body ──
    var body = new PIXI.Container();
    this.layers.body = body;
    root.addChild(body);

    this._drawBody(body, t, W, H);

    // ── Head (separate for head bob) ──
    var head = new PIXI.Container();
    head.y = -this._charHeight() * 0.38;
    this.layers.head = head;
    root.addChild(head);

    this._drawHead(head, t, W, H);

    // ── Hair back (behind head) ──
    var hairBack = new PIXI.Container();
    hairBack.y = head.y;
    this.layers.hairBack = hairBack;
    body.addChild(hairBack);  // added to body so it's behind head
    this._drawHairBack(hairBack, t);

    // Reorder: hairBack behind head
    body.removeChild(hairBack);
    root.addChildAt(hairBack, 0);
    root.addChild(body);
    root.addChild(head);

    // ── Emotion glow ──
    var glow = new PIXI.Graphics();
    glow.alpha = 0;
    this.layers.glow = glow;
    root.addChildAt(glow, 0);
  };

  CompanionAvatar.prototype._charHeight = function() {
    var H = this.app.screen.height;
    return H * 0.85;
  };

  CompanionAvatar.prototype._applyViewScale = function() {
    var root = this.layers.root;
    if (!root) return;
    var W = this.app.screen.width;
    var H = this.app.screen.height;

    switch (this.view) {
      case "full":
        root.scale.set(0.72);
        root.y = H * 0.88;
        break;
      case "upper":
        root.scale.set(0.95);
        root.y = H * 0.72;
        break;
      case "bust":
      default:
        root.scale.set(1.15);
        root.y = H * 0.58;
        break;
    }
    root.x = W / 2;
  };


  CompanionAvatar.prototype._drawBody = function(container, t, W, H) {
    var ch = this._charHeight();
    var fem = t.gender === "feminine";

    // Neck
    var neck = new PIXI.Graphics();
    neck.beginFill(t.skin.base);
    neck.drawRoundedRect(-18, -ch * 0.25, 36, ch * 0.12, 8);
    neck.endFill();
    // Neck shadow
    neck.beginFill(t.skin.shadow, 0.4);
    neck.drawRoundedRect(-18, -ch * 0.25, 36, ch * 0.05, 6);
    neck.endFill();
    container.addChild(neck);

    // Shoulders / torso
    var body = new PIXI.Graphics();
    var sw = fem ? ch * 0.52 : ch * 0.60;
    var th = ch * 0.38;
    var sy = -ch * 0.18;

    // Main torso shape
    body.beginFill(t.clothing);
    body.moveTo(-sw / 2, sy);
    body.bezierCurveTo(-sw / 2 - 20, sy + th * 0.3, -sw / 2 - 10, sy + th, -sw / 2 + 20, sy + th);
    body.lineTo(sw / 2 - 20, sy + th);
    body.bezierCurveTo(sw / 2 + 10, sy + th, sw / 2 + 20, sy + th * 0.3, sw / 2, sy);
    body.bezierCurveTo(sw / 4, sy - 10, -sw / 4, sy - 10, -sw / 2, sy);
    body.endFill();

    // Clothing detail / collar
    var collarColor = this._lighten(t.clothing, 0.15);
    body.beginFill(collarColor, 0.6);
    body.moveTo(-30, sy + 5);
    body.lineTo(0, sy + 35);
    body.lineTo(30, sy + 5);
    body.lineTo(20, sy);
    body.lineTo(0, sy + 20);
    body.lineTo(-20, sy);
    body.closePath();
    body.endFill();

    // Clothing shadow
    body.beginFill(0x000000, 0.15);
    body.drawEllipse(0, sy + th * 0.9, sw * 0.35, 10);
    body.endFill();

    container.addChild(body);
    this.layers.torso = body;

    // Arms (for full/upper body)
    if (this.view === "full" || this.view === "upper") {
      this._drawArms(container, t, sw, sy, th, fem);
    }

    // Lower body for full view
    if (this.view === "full") {
      this._drawLowerBody(container, t, sw, sy, th, fem, ch);
    }
  };

  CompanionAvatar.prototype._drawArms = function(container, t, sw, sy, th, fem) {
    var aw = fem ? 22 : 26;

    // Left arm
    var leftArm = new PIXI.Graphics();
    leftArm.beginFill(t.clothing);
    leftArm.moveTo(-sw / 2 + 5, sy + 10);
    leftArm.bezierCurveTo(-sw / 2 - aw, sy + th * 0.4, -sw / 2 - aw - 5, sy + th * 0.9, -sw / 2 - aw + 10, sy + th * 1.1);
    leftArm.lineTo(-sw / 2 - aw + 30, sy + th * 1.1);
    leftArm.bezierCurveTo(-sw / 2 + 10, sy + th * 0.9, -sw / 2 + 5, sy + th * 0.4, -sw / 2 + 15, sy + 10);
    leftArm.closePath(); leftArm.endFill();

    // Hand
    leftArm.beginFill(t.skin.base);
    leftArm.drawEllipse(-sw / 2 - aw + 15, sy + th * 1.15, 18, 14);
    leftArm.endFill();
    container.addChild(leftArm);

    // Right arm
    var rightArm = new PIXI.Graphics();
    rightArm.beginFill(t.clothing);
    rightArm.moveTo(sw / 2 - 5, sy + 10);
    rightArm.bezierCurveTo(sw / 2 + aw, sy + th * 0.4, sw / 2 + aw + 5, sy + th * 0.9, sw / 2 + aw - 10, sy + th * 1.1);
    rightArm.lineTo(sw / 2 + aw - 30, sy + th * 1.1);
    rightArm.bezierCurveTo(sw / 2 - 10, sy + th * 0.9, sw / 2 - 5, sy + th * 0.4, sw / 2 - 15, sy + 10);
    rightArm.closePath(); rightArm.endFill();

    rightArm.beginFill(t.skin.base);
    rightArm.drawEllipse(sw / 2 + aw - 15, sy + th * 1.15, 18, 14);
    rightArm.endFill();
    container.addChild(rightArm);
  };

  CompanionAvatar.prototype._drawLowerBody = function(container, t, sw, sy, th, fem, ch) {
    var pantsColor = this._darken(t.clothing, 0.35);

    // Waist / pants
    var lower = new PIXI.Graphics();
    lower.beginFill(pantsColor);
    lower.drawRoundedRect(-sw / 2 + 5, sy + th - 5, sw - 10, ch * 0.42, 6);
    lower.endFill();

    // Belt
    lower.beginFill(0x1A1008, 0.7);
    lower.drawRect(-sw / 2 + 5, sy + th - 5, sw - 10, 12);
    lower.endFill();

    // Legs
    var legW = (sw - 10) / 2 - 4;
    lower.beginFill(pantsColor);
    lower.drawRoundedRect(-sw / 2 + 5, sy + th + ch * 0.35, legW, ch * 0.3, 4);
    lower.endFill();
    lower.beginFill(this._darken(pantsColor, 0.1), 0.5);
    lower.drawRect(-5, sy + th + ch * 0.35, 10, ch * 0.3);
    lower.endFill();
    lower.beginFill(pantsColor);
    lower.drawRoundedRect(9, sy + th + ch * 0.35, legW, ch * 0.3, 4);
    lower.endFill();

    // Shoes
    lower.beginFill(0x1A1008);
    lower.drawEllipse(-sw / 2 + 5 + legW / 2, sy + th + ch * 0.63, legW / 2 + 5, 14);
    lower.endFill();
    lower.beginFill(0x1A1008);
    lower.drawEllipse(9 + legW / 2, sy + th + ch * 0.63, legW / 2 + 5, 14);
    lower.endFill();

    container.addChild(lower);
  };


  CompanionAvatar.prototype._drawHead = function(container, t, W, H) {
    var fem = t.gender === "feminine";
    var ch = this._charHeight();

    // Face shape
    var face = new PIXI.Graphics();
    var fw = fem ? ch * 0.26 : ch * 0.28;
    var fh = fem ? ch * 0.33 : ch * 0.31;

    face.beginFill(t.skin.base);
    face.drawEllipse(0, 0, fw, fh);
    face.endFill();

    // Jaw taper
    face.beginFill(t.skin.base);
    face.moveTo(-fw * 0.7, fh * 0.3);
    face.bezierCurveTo(-fw * 0.5, fh * 0.9, fem ? -fw * 0.15 : -fw * 0.2, fh, 0, fh * 1.05);
    face.bezierCurveTo(fem ? fw * 0.15 : fw * 0.2, fh, fw * 0.5, fh * 0.9, fw * 0.7, fh * 0.3);
    face.closePath(); face.endFill();

    // Face shadow sides
    face.beginFill(t.skin.shadow, 0.25);
    face.drawEllipse(-fw * 0.7, 0, fw * 0.25, fh * 0.7);
    face.endFill();
    face.beginFill(t.skin.shadow, 0.25);
    face.drawEllipse(fw * 0.7, 0, fw * 0.25, fh * 0.7);
    face.endFill();

    // Ears
    face.beginFill(t.skin.base);
    face.drawEllipse(-fw - 6, 0, 10, 16);
    face.endFill();
    face.beginFill(t.skin.base);
    face.drawEllipse(fw + 6, 0, 10, 16);
    face.endFill();
    face.beginFill(t.skin.shadow, 0.4);
    face.drawEllipse(-fw - 6, 2, 6, 10);
    face.endFill();
    face.beginFill(t.skin.shadow, 0.4);
    face.drawEllipse(fw + 6, 2, 6, 10);
    face.endFill();

    container.addChild(face);
    this.layers.face = face;

    // Blush
    var blush = new PIXI.Graphics();
    blush.beginFill(t.skin.blush, 0.35);
    blush.drawEllipse(-fw * 0.55, fh * 0.35, fw * 0.28, fw * 0.12);
    blush.endFill();
    blush.beginFill(t.skin.blush, 0.35);
    blush.drawEllipse(fw * 0.55, fh * 0.35, fw * 0.28, fw * 0.12);
    blush.endFill();
    container.addChild(blush);
    this.layers.blush = blush;

    // Eyes (left/right containers for animation)
    var eyeSpacing = fw * 0.42;
    var eyeY = -fh * 0.08;

    var leftEyeCont = new PIXI.Container();
    leftEyeCont.x = -eyeSpacing;
    leftEyeCont.y = eyeY;
    this.layers.leftEye = leftEyeCont;
    container.addChild(leftEyeCont);

    var rightEyeCont = new PIXI.Container();
    rightEyeCont.x = eyeSpacing;
    rightEyeCont.y = eyeY;
    this.layers.rightEye = rightEyeCont;
    container.addChild(rightEyeCont);

    this._drawEye(leftEyeCont, t, false, fw);
    this._drawEye(rightEyeCont, t, true, fw);

    // Eyebrows
    var browL = new PIXI.Container();
    browL.x = -eyeSpacing;
    browL.y = eyeY - fw * 0.25;
    this.layers.browL = browL;
    container.addChild(browL);

    var browR = new PIXI.Container();
    browR.x = eyeSpacing;
    browR.y = eyeY - fw * 0.25;
    this.layers.browR = browR;
    container.addChild(browR);

    this._drawBrow(browL, t, fw, false);
    this._drawBrow(browR, t, fw, true);

    // Nose
    var nose = new PIXI.Graphics();
    nose.lineStyle(1.5, t.skin.shadow, 0.6);
    nose.moveTo(-4, fh * 0.18);
    nose.bezierCurveTo(-8, fh * 0.45, -6, fh * 0.5, 0, fh * 0.52);
    nose.bezierCurveTo(6, fh * 0.5, 8, fh * 0.45, 4, fh * 0.18);
    nose.lineStyle(0);
    nose.beginFill(t.skin.shadow, 0.2);
    nose.drawEllipse(-5, fh * 0.52, 5, 4);
    nose.endFill();
    nose.beginFill(t.skin.shadow, 0.2);
    nose.drawEllipse(5, fh * 0.52, 5, 4);
    nose.endFill();
    container.addChild(nose);

    // Mouth
    var mouth = new PIXI.Container();
    mouth.y = fh * 0.65;
    this.layers.mouth = mouth;
    container.addChild(mouth);
    this._drawMouth(mouth, t, fw, "idle");

    // Hair (front, drawn last = on top)
    var hairFront = new PIXI.Container();
    this.layers.hairFront = hairFront;
    container.addChild(hairFront);
    this._drawHairFront(hairFront, t, fw, fh);

    // Eyelids (drawn on top of eyes for blink)
    var lidL = new PIXI.Graphics();
    lidL.x = -eyeSpacing;
    lidL.y = eyeY;
    this.layers.lidL = lidL;
    container.addChild(lidL);

    var lidR = new PIXI.Graphics();
    lidR.x = eyeSpacing;
    lidR.y = eyeY;
    this.layers.lidR = lidR;
    container.addChild(lidR);
  };

  CompanionAvatar.prototype._drawEye = function(container, t, isRight, fw) {
    container.removeChildren();
    var ew = fw * 0.22;
    var eh = fw * 0.14;

    // White
    var white = new PIXI.Graphics();
    white.beginFill(0xFFFFFF);
    white.drawEllipse(0, 0, ew, eh);
    white.endFill();
    container.addChild(white);

    // Iris
    var iris = new PIXI.Graphics();
    iris.beginFill(t.eyeColor);
    iris.drawCircle(0, 0, ew * 0.62);
    iris.endFill();

    // Iris detail ring
    iris.lineStyle(1, this._lighten(t.eyeColor, 0.3), 0.5);
    iris.drawCircle(0, 0, ew * 0.55);
    iris.lineStyle(0);

    // Pupil
    iris.beginFill(0x080808);
    iris.drawCircle(0, 0, ew * 0.32);
    iris.endFill();

    // Highlight
    iris.beginFill(0xFFFFFF, 0.9);
    iris.drawCircle(-ew * 0.15, -eh * 0.35, ew * 0.1);
    iris.endFill();
    iris.beginFill(0xFFFFFF, 0.5);
    iris.drawCircle(ew * 0.1, eh * 0.1, ew * 0.06);
    iris.endFill();

    container.addChild(iris);
    container._iris = iris;

    // Lash line
    var lash = new PIXI.Graphics();
    lash.lineStyle(2.5, 0x1A1008, 0.9);
    lash.moveTo(-ew, 0);
    lash.bezierCurveTo(-ew, -eh * 1.1, ew, -eh * 1.1, ew, 0);
    lash.lineStyle(0);

    // Individual lashes
    lash.lineStyle(1.5, 0x1A1008, 0.8);
    for (var i = -1; i <= 1; i += 0.4) {
      var lx = i * ew * 0.8;
      var ly = -Math.sqrt(Math.max(0, 1 - (lx / ew) * (lx / ew))) * eh;
      lash.moveTo(lx, ly);
      lash.lineTo(lx + (isRight ? -1 : 1) * 1.5, ly - 5);
    }
    lash.lineStyle(0);
    container.addChild(lash);

    // Lower lash line
    var lashL = new PIXI.Graphics();
    lashL.lineStyle(1, 0x1A1008, 0.3);
    lashL.moveTo(-ew, 0);
    lashL.bezierCurveTo(-ew, eh * 0.6, ew, eh * 0.6, ew, 0);
    lashL.lineStyle(0);
    container.addChild(lashL);

    container._ew = ew;
    container._eh = eh;
  };

  CompanionAvatar.prototype._drawBrow = function(container, t, fw, isRight) {
    container.removeChildren();
    var bw = fw * 0.26;
    var g = new PIXI.Graphics();
    var hairC = t.hairColor;
    // Make brow slightly lighter than hair
    g.lineStyle(3.5, hairC, 0.85);
    g.moveTo(isRight ? -bw * 0.9 : -bw, 0);
    g.bezierCurveTo(-bw * 0.3, -6, bw * 0.3, -5, isRight ? bw : bw * 0.9, 2);
    g.lineStyle(0);
    container.addChild(g);
    container._g = g;
  };

  CompanionAvatar.prototype._drawMouth = function(container, t, fw, expression) {
    container.removeChildren();
    var mw = fw * 0.35;
    var m = new PIXI.Graphics();

    var configs = {
      idle:       { curve: 3,   w: mw,        lipH: 4 },
      joy:        { curve: 12,  w: mw * 1.1,  lipH: 5 },
      excitement: { curve: 15,  w: mw * 1.15, lipH: 6 },
      sadness:    { curve: -8,  w: mw * 0.85, lipH: 3 },
      anger:      { curve: -5,  w: mw * 0.9,  lipH: 3 },
      surprise:   { curve: 0,   w: mw * 0.5,  lipH: 8, open: true },
      curiosity:  { curve: 5,   w: mw * 0.9,  lipH: 4 }
    };
    var cfg = configs[expression] || configs.idle;

    // Upper lip
    m.lineStyle(2, this._darken(t.skin.base, 0.25), 0.9);
    m.moveTo(-cfg.w, 0);
    m.bezierCurveTo(-cfg.w * 0.5, -cfg.lipH * 0.5, 0, -cfg.lipH, cfg.w * 0.5, -cfg.lipH * 0.5);
    m.bezierCurveTo(cfg.w * 0.75, -cfg.lipH * 0.3, cfg.w, 0, cfg.w, 0);
    m.lineStyle(0);

    if (cfg.open) {
      // Open mouth
      m.beginFill(0x2A0A0A);
      m.moveTo(-cfg.w, 0);
      m.bezierCurveTo(-cfg.w, cfg.curve, cfg.w, cfg.curve, cfg.w, 0);
      m.bezierCurveTo(cfg.w, -cfg.lipH, -cfg.w, -cfg.lipH, -cfg.w, 0);
      m.endFill();
      // Teeth
      m.beginFill(0xF0EDE8);
      m.drawRoundedRect(-cfg.w * 0.7, -cfg.lipH * 0.2, cfg.w * 1.4, cfg.curve * 0.4, 3);
      m.endFill();
    } else {
      // Lower lip fill
      m.beginFill(this._lighten(t.skin.base, -0.08), 0.6);
      m.moveTo(-cfg.w, 0);
      m.bezierCurveTo(-cfg.w * 0.5, cfg.curve, cfg.w * 0.5, cfg.curve, cfg.w, 0);
      m.bezierCurveTo(cfg.w * 0.5, cfg.curve * 0.3, -cfg.w * 0.5, cfg.curve * 0.3, -cfg.w, 0);
      m.endFill();

      // Mouth line
      m.lineStyle(1.5, this._darken(t.skin.base, 0.3), 0.7);
      m.moveTo(-cfg.w, 0);
      m.bezierCurveTo(-cfg.w * 0.5, cfg.curve * 0.7, cfg.w * 0.5, cfg.curve * 0.7, cfg.w, 0);
      m.lineStyle(0);
    }

    // Lower lip shine
    m.beginFill(0xFFFFFF, 0.15);
    m.drawEllipse(0, cfg.curve * 0.5, cfg.w * 0.4, 3);
    m.endFill();

    container.addChild(m);
  };


  CompanionAvatar.prototype._drawHairBack = function(container, t) {
    container.removeChildren();
    var ch = this._charHeight();
    var fw = ch * 0.26;
    var fh = ch * 0.33;
    var headY = -ch * 0.38;
    var hc = t.hairColor;
    var style = t.hairStyle;

    var g = new PIXI.Graphics();

    if (style === "long") {
      g.beginFill(hc);
      g.moveTo(-fw * 1.1, headY - fh * 0.5);
      g.bezierCurveTo(-fw * 1.4, headY + fh, -fw * 1.2, headY + ch * 0.5, -fw * 0.8, headY + ch * 0.55);
      g.bezierCurveTo(-fw * 0.3, headY + ch * 0.58, fw * 0.3, headY + ch * 0.58, fw * 0.8, headY + ch * 0.55);
      g.bezierCurveTo(fw * 1.2, headY + ch * 0.5, fw * 1.4, headY + fh, fw * 1.1, headY - fh * 0.5);
      g.bezierCurveTo(fw * 0.9, headY - fh * 0.8, -fw * 0.9, headY - fh * 0.8, -fw * 1.1, headY - fh * 0.5);
      g.endFill();
      // Hair strands
      g.lineStyle(2, this._lighten(hc, 0.15), 0.4);
      for (var i = -1; i <= 1; i += 0.5) {
        g.moveTo(i * fw * 0.6, headY + fh * 0.8);
        g.bezierCurveTo(i * fw * 0.7, headY + ch * 0.3, i * fw * 0.65, headY + ch * 0.45, i * fw * 0.6, headY + ch * 0.55);
      }
      g.lineStyle(0);
    } else if (style === "curly") {
      g.beginFill(hc);
      g.drawEllipse(0, headY - fh * 0.1, fw * 1.3, fh * 1.1);
      g.endFill();
    } else if (style === "bun") {
      // Bun at back of head - just small blob
      g.beginFill(hc);
      g.drawCircle(0, headY - fh * 0.9, fh * 0.28);
      g.endFill();
    }

    container.addChild(g);
  };

  CompanionAvatar.prototype._drawHairFront = function(container, t, fw, fh) {
    container.removeChildren();
    var hc = t.hairColor;
    var hcLight = this._lighten(hc, 0.2);
    var style = t.hairStyle;

    if (style === "bald") return;

    var g = new PIXI.Graphics();

    if (style === "short") {
      // Short hair cap
      g.beginFill(hc);
      g.moveTo(-fw * 1.05, -fh * 0.1);
      g.bezierCurveTo(-fw * 1.1, -fh * 0.8, -fw * 0.5, -fh * 1.15, 0, -fh * 1.15);
      g.bezierCurveTo(fw * 0.5, -fh * 1.15, fw * 1.1, -fh * 0.8, fw * 1.05, -fh * 0.1);
      g.bezierCurveTo(fw * 0.7, -fh * 0.5, -fw * 0.7, -fh * 0.5, -fw * 1.05, -fh * 0.1);
      g.endFill();
      // Side pieces
      g.beginFill(hc);
      g.drawEllipse(-fw * 0.9, fh * 0.05, fw * 0.22, fh * 0.35);
      g.endFill();
      g.beginFill(hc);
      g.drawEllipse(fw * 0.9, fh * 0.05, fw * 0.22, fh * 0.35);
      g.endFill();
      // Highlight
      g.beginFill(hcLight, 0.4);
      g.drawEllipse(fw * 0.1, -fh * 0.85, fw * 0.3, fw * 0.12);
      g.endFill();

    } else if (style === "long") {
      // Top + front strands
      g.beginFill(hc);
      g.moveTo(-fw * 1.05, -fh * 0.05);
      g.bezierCurveTo(-fw * 1.1, -fh * 0.85, -fw * 0.4, -fh * 1.2, 0, -fh * 1.2);
      g.bezierCurveTo(fw * 0.4, -fh * 1.2, fw * 1.1, -fh * 0.85, fw * 1.05, -fh * 0.05);
      g.bezierCurveTo(fw * 0.6, -fh * 0.5, -fw * 0.6, -fh * 0.5, -fw * 1.05, -fh * 0.05);
      g.endFill();
      // Front face-framing strands
      g.beginFill(hc);
      g.moveTo(-fw * 0.9, -fh * 0.1);
      g.bezierCurveTo(-fw * 1.0, fh * 0.4, -fw * 0.95, fh * 0.7, -fw * 0.85, fh * 0.85);
      g.lineTo(-fw * 0.65, fh * 0.85);
      g.bezierCurveTo(-fw * 0.75, fh * 0.5, -fw * 0.75, fh * 0.1, -fw * 0.7, -fh * 0.1);
      g.closePath(); g.endFill();
      g.beginFill(hc);
      g.moveTo(fw * 0.9, -fh * 0.1);
      g.bezierCurveTo(fw * 1.0, fh * 0.4, fw * 0.95, fh * 0.7, fw * 0.85, fh * 0.85);
      g.lineTo(fw * 0.65, fh * 0.85);
      g.bezierCurveTo(fw * 0.75, fh * 0.5, fw * 0.75, fh * 0.1, fw * 0.7, -fh * 0.1);
      g.closePath(); g.endFill();
      // Highlight streak
      g.beginFill(hcLight, 0.35);
      g.drawEllipse(fw * 0.15, -fh * 0.9, fw * 0.25, fw * 0.1);
      g.endFill();

    } else if (style === "curly") {
      g.beginFill(hc);
      g.moveTo(-fw * 1.0, 0);
      g.bezierCurveTo(-fw * 1.3, -fh * 0.6, -fw * 0.6, -fh * 1.3, 0, -fh * 1.25);
      g.bezierCurveTo(fw * 0.6, -fh * 1.3, fw * 1.3, -fh * 0.6, fw * 1.0, 0);
      g.bezierCurveTo(fw * 0.7, -fh * 0.4, -fw * 0.7, -fh * 0.4, -fw * 1.0, 0);
      g.endFill();
      // Curl bumps
      for (var cx = -fw * 0.8; cx <= fw * 0.8; cx += fw * 0.35) {
        g.beginFill(this._lighten(hc, 0.1), 0.5);
        g.drawCircle(cx, -fh * 0.9, fw * 0.18);
        g.endFill();
      }

    } else if (style === "bun") {
      // Hair pulled back — just top cap and bun
      g.beginFill(hc);
      g.moveTo(-fw * 0.9, -fh * 0.1);
      g.bezierCurveTo(-fw * 1.0, -fh * 0.7, -fw * 0.3, -fh * 1.1, 0, -fh * 1.1);
      g.bezierCurveTo(fw * 0.3, -fh * 1.1, fw * 1.0, -fh * 0.7, fw * 0.9, -fh * 0.1);
      g.bezierCurveTo(fw * 0.5, -fh * 0.45, -fw * 0.5, -fh * 0.45, -fw * 0.9, -fh * 0.1);
      g.endFill();
      // Bun
      g.beginFill(hc);
      g.drawCircle(0, -fh * 1.2, fh * 0.3);
      g.endFill();
      g.beginFill(hcLight, 0.3);
      g.drawCircle(fh * 0.08, -fh * 1.28, fh * 0.1);
      g.endFill();

    } else {
      // Medium — default
      g.beginFill(hc);
      g.moveTo(-fw * 1.05, -fh * 0.05);
      g.bezierCurveTo(-fw * 1.15, -fh * 0.85, -fw * 0.45, -fh * 1.18, 0, -fh * 1.18);
      g.bezierCurveTo(fw * 0.45, -fh * 1.18, fw * 1.15, -fh * 0.85, fw * 1.05, -fh * 0.05);
      g.bezierCurveTo(fw * 0.65, -fh * 0.5, -fw * 0.65, -fh * 0.5, -fw * 1.05, -fh * 0.05);
      g.endFill();
      // Side pieces falling to shoulder
      g.beginFill(hc);
      g.moveTo(-fw * 0.9, 0);
      g.bezierCurveTo(-fw * 1.1, fh * 0.5, -fw * 1.0, fh * 0.85, -fw * 0.85, fh * 0.9);
      g.lineTo(-fw * 0.6, fh * 0.9);
      g.bezierCurveTo(-fw * 0.7, fh * 0.6, -fw * 0.7, fh * 0.2, -fw * 0.65, 0);
      g.closePath(); g.endFill();
      g.beginFill(hc);
      g.moveTo(fw * 0.9, 0);
      g.bezierCurveTo(fw * 1.1, fh * 0.5, fw * 1.0, fh * 0.85, fw * 0.85, fh * 0.9);
      g.lineTo(fw * 0.6, fh * 0.9);
      g.bezierCurveTo(fw * 0.7, fh * 0.6, fw * 0.7, fh * 0.2, fw * 0.65, 0);
      g.closePath(); g.endFill();
      // Highlight
      g.beginFill(hcLight, 0.35);
      g.drawEllipse(fw * 0.12, -fh * 0.88, fw * 0.28, fw * 0.1);
      g.endFill();
    }

    container.addChild(g);
  };


  CompanionAvatar.prototype._drawLid = function(lidGraphic, t, openAmount) {
    // openAmount: 0 = fully open, 1 = fully closed
    lidGraphic.clear();
    if (openAmount <= 0) return;
    var ew = this._charHeight() * 0.26 * 0.22;
    var eh = this._charHeight() * 0.26 * 0.14;
    var closedH = eh * 1.1;
    var h = closedH * openAmount;

    lidGraphic.beginFill(t.skin.base);
    lidGraphic.moveTo(-ew, 0);
    lidGraphic.bezierCurveTo(-ew, -eh * 1.05, ew, -eh * 1.05, ew, 0);
    // Bottom of lid
    var lidBot = -eh * 1.05 + h * 2.1;
    lidGraphic.bezierCurveTo(ew, lidBot, -ew, lidBot, -ew, 0);
    lidGraphic.endFill();

    // Lash line on lid
    lidGraphic.lineStyle(2.5, 0x1A1008, 0.9 * openAmount);
    lidGraphic.moveTo(-ew, 0);
    lidGraphic.bezierCurveTo(-ew, -eh * 1.05, ew, -eh * 1.05, ew, 0);
    lidGraphic.lineStyle(0);
  };


  var EXPRESSION_CONFIGS = {
    idle:       { browY: 0,   browAngle: 0,  blushA: 0.35, eyeScale: 1.0 },
    joy:        { browY: -4,  browAngle: -2, blushA: 0.55, eyeScale: 1.05 },
    excitement: { browY: -6,  browAngle: -3, blushA: 0.65, eyeScale: 1.1  },
    curiosity:  { browY: -5,  browAngle: -6, blushA: 0.3,  eyeScale: 1.05 },
    surprise:   { browY: -8,  browAngle: -4, blushA: 0.4,  eyeScale: 1.15 },
    sadness:    { browY: 4,   browAngle: 7,  blushA: 0.2,  eyeScale: 0.9  },
    anger:      { browY: 5,   browAngle: 10, blushA: 0.15, eyeScale: 0.88 }
  };

  var GLOW_COLORS = {
    idle:       null,
    joy:        { color: 0xFFD700, alpha: 0.06 },
    excitement: { color: 0xFF8C00, alpha: 0.08 },
    curiosity:  { color: 0x00BFFF, alpha: 0.06 },
    surprise:   { color: 0xDA70D6, alpha: 0.07 },
    sadness:    { color: 0x4169E1, alpha: 0.07 },
    anger:      { color: 0xFF3030, alpha: 0.08 }
  };

  CompanionAvatar.prototype.setExpression = function(name, duration) {
    if (!this.initialized) return;
    var cfg = EXPRESSION_CONFIGS[name] || EXPRESSION_CONFIGS.idle;
    var t = this.traits;
    this.expression = name;

    // Eyebrows
    if (this.layers.browL && this.layers.browR) {
      this.layers.browL.y = (this.layers.browL._baseY || 0) + cfg.browY;
      this.layers.browR.y = (this.layers.browR._baseY || 0) + cfg.browY;
      // Redraw with angle
      this._drawBrowAngled(this.layers.browL, t, cfg.browAngle, false);
      this._drawBrowAngled(this.layers.browR, t, cfg.browAngle, true);
    }

    // Mouth
    if (this.layers.mouth) {
      var ch = this._charHeight();
      var fw = ch * 0.26;
      this._drawMouth(this.layers.mouth, t, fw, name);
    }

    // Blush
    if (this.layers.blush) {
      this.layers.blush.alpha = cfg.blushA / 0.35;
    }

    // Eye scale
    if (this.layers.leftEye && this.layers.rightEye) {
      this.layers.leftEye.scale.set(cfg.eyeScale);
      this.layers.rightEye.scale.set(cfg.eyeScale);
    }

    // Glow
    this._updateGlow(name);

    // Label
    var lbl = document.getElementById("face-emotion-label");
    if (lbl) lbl.textContent = name;

    // Auto return to idle
    if (this._exprTimeout) clearTimeout(this._exprTimeout);
    var self = this;
    if (name !== "idle" && duration !== -1) {
      this._exprTimeout = setTimeout(function() {
        self.setExpression("idle");
      }, duration || 2800);
    }
  };

  CompanionAvatar.prototype._drawBrowAngled = function(container, t, angle, isRight) {
    container.removeChildren();
    var ch = this._charHeight();
    var fw = ch * 0.26;
    var bw = fw * 0.26;
    var g = new PIXI.Graphics();
    var ang = angle * 0.5;
    g.lineStyle(3.5, t.hairColor, 0.85);
    if (isRight) {
      g.moveTo(-bw * 0.9, ang * 0.5);
      g.bezierCurveTo(-bw * 0.3, -5 - ang, bw * 0.3, -4, bw, 2 + ang * 0.5);
    } else {
      g.moveTo(-bw, 2 + ang * 0.5);
      g.bezierCurveTo(-bw * 0.3, -4, bw * 0.3, -5 - ang, bw * 0.9, ang * 0.5);
    }
    g.lineStyle(0);
    container.addChild(g);
    container._g = g;
  };

  CompanionAvatar.prototype._updateGlow = function(name) {
    var glow = this.layers.glow;
    if (!glow) return;
    glow.clear();
    var gc = GLOW_COLORS[name];
    if (!gc) { glow.alpha = 0; return; }
    var ch = this._charHeight();
    glow.alpha = 1;
    glow.beginFill(gc.color, gc.alpha);
    glow.drawEllipse(0, -ch * 0.15, ch * 0.35, ch * 0.45);
    glow.endFill();
  };


  CompanionAvatar.prototype._startLoop = function() {
    var self = this;
    if (this._raf) cancelAnimationFrame(this._raf);

    var lastTime = 0;
    function loop(ts) {
      self._raf = requestAnimationFrame(loop);
      var dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      self._animate(dt);
    }
    this._raf = requestAnimationFrame(loop);
  };

  CompanionAvatar.prototype._animate = function(dt) {
    if (!this.app || !this.layers.root) return;
    var t = this.traits;

    // Breathing
    this.breathPhase += dt * 0.8;
    var breathY = Math.sin(this.breathPhase) * 3;
    var breathS = 1 + Math.sin(this.breathPhase) * 0.008;
    if (this.layers.root) {
      this.layers.root.scale.y = this.layers.root._baseScaleY * breathS;
    }

    // Head idle bob
    this.idlePhase += dt * 0.4;
    if (this.layers.head) {
      this.layers.head.y = this.layers.head._baseY + Math.sin(this.idlePhase) * 1.5 + breathY * 0.3;
    }
    if (this.layers.hairBack) {
      var ch = this._charHeight();
      this.layers.hairBack.y = (-ch * 0.38) + Math.sin(this.idlePhase) * 1.5 + breathY * 0.3;
    }

    // Eye tracking (follows mouse gently)
    var W = this.app.screen.width;
    var H = this.app.screen.height;
    var rootX = this.layers.root.x;
    var rootY = this.layers.root.y;
    var ch2 = this._charHeight();
    var headWorldX = rootX;
    var headWorldY = rootY - ch2 * 0.38;
    var dx = (this.mouseX - headWorldX) / W * 6;
    var dy = (this.mouseY - headWorldY) / H * 4;
    dx = Math.max(-3, Math.min(3, dx));
    dy = Math.max(-2, Math.min(2, dy));

    [this.layers.leftEye, this.layers.rightEye].forEach(function(ec) {
      if (ec && ec._iris) {
        ec._iris.x += (dx - ec._iris.x) * 0.08;
        ec._iris.y += (dy - ec._iris.y) * 0.08;
      }
    });

    // Blink
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      // Schedule next blink
      this.blinkTimer = 2.5 + Math.random() * 4;
      this.blinkState = 1;
      this.blinkProgress = 0;
    }

    if (this.blinkState > 0) {
      this.blinkProgress = (this.blinkProgress || 0) + dt * 12;
      var open;
      if (this.blinkState === 1) {
        open = 1 - Math.min(1, this.blinkProgress);
        if (this.blinkProgress >= 1) { this.blinkState = 2; this.blinkProgress = 0; }
      } else if (this.blinkState === 2) {
        open = Math.min(1, this.blinkProgress);
        if (this.blinkProgress >= 1) { this.blinkState = 0; open = 0; }
      }
      if (this.layers.lidL && this.layers.lidR) {
        this._drawLid(this.layers.lidL, t, 1 - open);
        this._drawLid(this.layers.lidR, t, 1 - open);
      }
    }
  };

  CompanionAvatar.prototype._bindMouse = function() {
    var self = this;
    if (this._mouseMoveHandler) {
      window.removeEventListener("mousemove", this._mouseMoveHandler);
    }
    this._mouseMoveHandler = function(e) {
      self.mouseX = e.clientX;
      self.mouseY = e.clientY;
    };
    window.addEventListener("mousemove", this._mouseMoveHandler);
  };


  CompanionAvatar.prototype.setView = function(view) {
    this.view = view;
    if (!this.initialized) return;
    var comp = window._activeComp;
    if (comp) {
      this.rebuild(comp);
    }
  };

  CompanionAvatar.prototype.rebuild = function(comp) {
    this.traits = this._parseTraits(comp);
    this._build();
    this._applyViewScale();
    // Store base Y for head
    if (this.layers.head) {
      var ch = this._charHeight();
      this.layers.head._baseY = -ch * 0.38;
      this.layers.head.y = this.layers.head._baseY;
    }
    if (this.layers.root) {
      this.layers.root._baseScaleY = this.layers.root.scale.y;
    }
  };

  CompanionAvatar.prototype.resize = function() {
    if (!this.app || !this.canvas) return;
    var w = this.canvas.offsetWidth;
    var h = this.canvas.offsetHeight;
    if (w > 0 && h > 0) {
      this.app.renderer.resize(w, h);
      if (this._activeComp) this.rebuild(this._activeComp);
    }
  };


  CompanionAvatar.prototype.destroy = function() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._mouseMoveHandler) window.removeEventListener("mousemove", this._mouseMoveHandler);
    if (this.app) this.app.destroy(true);
    this.initialized = false;
  };


  CompanionAvatar.prototype._lighten = function(hex, amt) {
    var r = ((hex >> 16) & 0xFF);
    var g = ((hex >> 8) & 0xFF);
    var b = (hex & 0xFF);
    r = Math.min(255, Math.round(r + 255 * amt));
    g = Math.min(255, Math.round(g + 255 * amt));
    b = Math.min(255, Math.round(b + 255 * amt));
    return (r << 16) | (g << 8) | b;
  };

  CompanionAvatar.prototype._darken = function(hex, amt) {
    return this._lighten(hex, -amt);
  };

  window.CompanionAvatar = CompanionAvatar;

})(window);