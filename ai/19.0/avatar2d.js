// avatar.js — 2.5D Companion Avatar System
// Pure HTML5 Canvas 2D — no WebGL, no PixiJS, works everywhere.
// Layered parallax depth gives a 2.5D feel without a 3D engine.

(function(global) {
  "use strict";

  /* ── Trait Parsers ────────────────────────────────────────────────────── */

  var SKIN = {
    pale:   { base:"#FFE8DC", mid:"#F0C8A8", shadow:"#D4956A", blush:"#F4AABB", lip:"#D4727A" },
    light:  { base:"#FDDCB8", mid:"#E8B888", shadow:"#C48050", blush:"#E89090", lip:"#C86070" },
    medium: { base:"#D4956A", mid:"#B87040", shadow:"#8B4820", blush:"#C46050", lip:"#A04040" },
    tan:    { base:"#C8854A", mid:"#A06030", shadow:"#784010", blush:"#B05040", lip:"#904035" },
    dark:   { base:"#8B5E3C", mid:"#6B3E20", shadow:"#3C1C08", blush:"#7A3830", lip:"#5A2828" }
  };

  var HAIR_COLS = {
    black:"#1A1008", brown:"#5C3317", blonde:"#F0C040", red:"#B02020",
    white:"#F0EEEA", silver:"#C0C4C8", blue:"#1060C0", pink:"#E860A0",
    purple:"#7040B0", green:"#206820", orange:"#D06010", gray:"#808890",
    auburn:"#802020", platinum:"#E8E0D0", teal:"#106870", lavender:"#9080C0"
  };

  var EYE_COLS = {
    brown:"#6B3A2A", blue:"#1E6BAD", green:"#2D8A4E", hazel:"#8B7355",
    gray:"#6B7B8A", black:"#1A1A2E", amber:"#B8860B", violet:"#7B4FA6",
    red:"#8B1010", gold:"#B89020", silver:"#8090A0", teal:"#208878"
  };

  function parseSkin(s) {
    s = (s||"").toLowerCase();
    if (s.match(/pale|porcelain|ivory|fair skin/)) return SKIN.pale;
    if (s.match(/light|white skin|caucasian/)) return SKIN.light;
    if (s.match(/dark|black skin|ebony|deep brown/)) return SKIN.dark;
    if (s.match(/tan|tanned|olive|bronze|caramel/)) return SKIN.tan;
    return SKIN.medium;
  }

  function parseHair(s) {
    s = (s||"").toLowerCase();
    for (var k in HAIR_COLS) { if (s.indexOf(k) !== -1) return HAIR_COLS[k]; }
    return HAIR_COLS.brown;
  }

  function parseEye(s) {
    s = (s||"").toLowerCase();
    for (var k in EYE_COLS) {
      if (s.indexOf(k+" eye") !== -1 || s.indexOf(k+"-eyed") !== -1) return EYE_COLS[k];
    }
    for (var k2 in EYE_COLS) { if (s.indexOf(k2) !== -1) return EYE_COLS[k2]; }
    return EYE_COLS.brown;
  }

  function parseHairStyle(s) {
    s = (s||"").toLowerCase();
    if (s.match(/short hair|short-haired|crew|buzz|pixie|bob/)) return "short";
    if (s.match(/long hair|long-haired|flowing/)) return "long";
    if (s.match(/curly|wavy|afro/)) return "curly";
    if (s.match(/bun|ponytail|updo|tied/)) return "bun";
    if (s.match(/bald/)) return "bald";
    return "medium";
  }

  function parseClothingColor(s) {
    s = (s||"").toLowerCase();
    var map = {
      red:"#A02020", blue:"#205090", green:"#1A6030", black:"#1A1A24",
      white:"#E8EAEC", yellow:"#C09010", purple:"#602890", orange:"#B04010",
      pink:"#B04070", gray:"#505868", grey:"#505868", brown:"#5C3820",
      navy:"#1A2848", teal:"#1A6868", gold:"#907010", crimson:"#801828",
      violet:"#502878", maroon:"#601820", indigo:"#282868", emerald:"#1A5830"
    };
    var keys = ["wearing ","shirt","jacket","hoodie","top","blouse","dress",
      "coat","sweater","cardigan","uniform","outfit"];
    for (var i = 0; i < keys.length; i++) {
      var idx = s.indexOf(keys[i]);
      if (idx !== -1) {
        var chunk = s.substring(Math.max(0, idx-15), idx+30);
        for (var k in map) { if (chunk.indexOf(k) !== -1) return map[k]; }
      }
    }
    for (var k2 in map) { if (s.indexOf(k2) !== -1) return map[k2]; }
    return "#2A4870";
  }

  function parseGender(gender, appearance) {
    if (gender === "she/her") return "f";
    if (gender === "he/him") return "m";
    var s = (appearance||"").toLowerCase();
    if (s.match(/feminine|woman|girl|female/)) return "f";
    if (s.match(/masculine|man|boy|male/)) return "m";
    return "n";
  }

  /* ── Avatar Class ─────────────────────────────────────────────────────── */

  function CompanionAvatar(canvas) {
    console.log("CompanionAvatar constructor - canvas element:", canvas);
    if (!canvas) {
      console.error("ERROR: Canvas element is undefined!");
      return;
    }
    this.canvas = canvas;
    try {
      this.ctx = canvas.getContext("2d");
      console.log("Canvas context obtained:", !!this.ctx);
      if (!this.ctx) {
        console.error("ERROR: Could not get 2D context from canvas!");
        return;
      }
    } catch(e) {
      console.error("ERROR getting canvas context:", e);
      return;
    }
    this.W      = canvas.width  || 260;
    this.H      = canvas.height || 520;
    console.log("Initial canvas dimensions - W:", this.W, "H:", this.H);
    this.view   = "bust";
    this.traits = {};
    this.anim   = {
      breath:0, bob:0, idle:0,
      blinkTimer:3, blinkOpen:1,
      exprTimer:0,
      mouseX:0, mouseY:0,
      eyeLX:0, eyeLY:0, eyeRX:0, eyeRY:0,
      parallaxX:0, parallaxY:0,
      lightX:0.5, lightY:0.35,
      mouthOpen:0,
      glowAlpha:0, glowColor:"255,200,80"
    };
    this.expression  = "idle";
    this.initialized = false;
    this._raf        = null;
    this._mouseHandler = null;
    this._destroyed  = false;
    this._exprTimeout = null;
    console.log("CompanionAvatar constructor complete");
  }

  CompanionAvatar.prototype.init = function(comp, w, h) {
    console.log("Avatar.init() called with comp:", comp, "w:", w, "h:", h);
    this._destroyed = false;
    this.W = w || this.canvas.width  || 260;
    this.H = h || this.canvas.height || 520;
    console.log("Setting canvas size - this.W:", this.W, "this.H:", this.H);
    this.canvas.width  = this.W;
    this.canvas.height = this.H;
    console.log("Canvas width/height updated - canvas.width:", this.canvas.width, "canvas.height:", this.canvas.height);
    this.traits = this._parseTraits(comp);
    console.log("Traits parsed:", this.traits);
    this._bindMouse();
    console.log("Mouse bound");
    this._startLoop();
    console.log("Animation loop started");
    this.initialized = true;
    console.log("Avatar initialization complete");
  };

  CompanionAvatar.prototype._parseTraits = function(comp) {
    var a = comp.appearance || "";
    return {
      skin:      parseSkin(a),
      hair:      parseHair(a),
      eye:       parseEye(a),
      hairStyle: parseHairStyle(a),
      clothing:  parseClothingColor(a),
      gender:    parseGender(comp.gender, a),
      name:      comp.name || ""
    };
  };

  /* ── Geometry ─────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._geo = function() {
    var W = this.W, H = this.H;
    var pivotY = {bust: H*0.6, upper: H*0.72, full: H*0.88}[this.view] || H*0.6;
    var scale  = {bust: 1.0, upper: 0.75, full: 0.55}[this.view] || 1.0;
    var faceH  = H * 0.26 * scale;
    var faceW  = faceH * 0.78;
    var cx     = W / 2;
    var faceTopY = pivotY - faceH * 0.42;
    return {
      W:W, H:H, scale:scale, cx:cx, pivotY:pivotY,
      faceH:faceH, faceW:faceW, faceTopY:faceTopY,
      eyeY:   faceTopY + faceH * 0.38,
      eyeSpX: faceW * 0.38,
      eyeRad: faceH * 0.095,
      browY:  faceTopY + faceH * 0.23,
      noseY:  faceTopY + faceH * 0.63,
      mouthY: faceTopY + faceH * 0.80,
      neckY:  faceTopY + faceH * 0.97
    };
  };

  /* ── Main draw ────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._draw = function() {
    if (this._destroyed) return;
    var ctx = this.ctx;
    var a   = this.anim;
    var g   = this._geo();

    console.log("_draw called - ctx:", ctx, "canvas.width:", this.canvas.width, "canvas.height:", this.canvas.height, "g.W:", g.W, "g.H:", g.H);

    ctx.clearRect(0, 0, g.W, g.H);

    // Global breathing transform
    var breathS = 1 + Math.sin(a.breath) * 0.007;
    var bobY    = Math.sin(a.bob) * 2.2;

    ctx.save();
    ctx.translate(g.cx, g.pivotY + bobY);
    ctx.scale(breathS, breathS);
    ctx.translate(-g.cx, -g.pivotY);

    this._drawBg(ctx, g, a);
    this._drawBody(ctx, g, a);
    this._drawHairBack(ctx, g, a);
    this._drawNeck(ctx, g);
    this._drawFace(ctx, g, a);
    this._drawHairFront(ctx, g, a);
    this._drawLighting(ctx, g, a);
    this._drawFX(ctx, g, a);

    ctx.restore();
  };

  /* ── Background ───────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawBg = function(ctx, g, a) {
    // Dark gradient bg
    var bg = ctx.createRadialGradient(g.cx, g.H*0.45, 0, g.cx, g.H*0.45, g.H*0.7);
    bg.addColorStop(0, "#1C1430");
    bg.addColorStop(0.5, "#100E1C");
    bg.addColorStop(1, "#07060E");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, g.W, g.H);

    // Ambient purple glow (parallax depth 0 — furthest back)
    var px = a.parallaxX * 0.15, py = a.parallaxY * 0.15;
    var ag = ctx.createRadialGradient(g.cx+px, g.H*0.42+py, 0, g.cx+px, g.H*0.42+py, g.H*0.42);
    ag.addColorStop(0, "rgba(90,50,180,0.18)");
    ag.addColorStop(0.6, "rgba(50,25,100,0.07)");
    ag.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ag;
    ctx.fillRect(0, 0, g.W, g.H);

    // Emotion glow
    if (a.glowAlpha > 0.01) {
      var ex = g.cx + a.parallaxX*0.12, ey = g.faceTopY + g.faceH*0.3 + a.parallaxY*0.12;
      var eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, g.faceH*1.2);
      eg.addColorStop(0, "rgba("+a.glowColor+","+a.glowAlpha*0.28+")");
      eg.addColorStop(1, "rgba("+a.glowColor+",0)");
      ctx.fillStyle = eg;
      ctx.fillRect(0, 0, g.W, g.H);
    }
  };

  /* ── Body ─────────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawBody = function(ctx, g, a) {
    var t   = this.traits;
    var fem = t.gender === "f";
    var px  = a.parallaxX * 0.25, py = a.parallaxY * 0.25;
    var bx  = g.cx + px;
    var by  = g.pivotY + py;
    var sw  = g.faceW * (fem ? 2.1 : 2.55);
    var sh  = g.faceH * 1.65;
    var cl  = t.clothing;

    ctx.save();
    // Main torso path
    ctx.beginPath();
    ctx.moveTo(bx - sw*0.06, by - sh*0.06);
    ctx.bezierCurveTo(bx - sw*0.58, by - sh*0.08, bx - sw*0.52, by + sh*0.62, bx - sw*0.38, by + sh);
    ctx.lineTo(bx + sw*0.38, by + sh);
    ctx.bezierCurveTo(bx + sw*0.52, by + sh*0.62, bx + sw*0.58, by - sh*0.08, bx + sw*0.06, by - sh*0.06);
    ctx.closePath();

    // Clothing gradient — dark sides, lighter center for depth
    var cg = ctx.createLinearGradient(bx - sw*0.55, by, bx + sw*0.55, by);
    cg.addColorStop(0,    this._shade(cl, 0.35));
    cg.addColorStop(0.22, this._shade(cl, 0.15));
    cg.addColorStop(0.5,  this._lighten(cl, 0.08));
    cg.addColorStop(0.78, this._shade(cl, 0.12));
    cg.addColorStop(1,    this._shade(cl, 0.32));
    ctx.fillStyle = cg;
    ctx.fill();

    // Collar V detail
    ctx.beginPath();
    ctx.moveTo(bx - g.faceW*0.32, by - sh*0.04);
    ctx.lineTo(bx, by + sh*0.13);
    ctx.lineTo(bx + g.faceW*0.32, by - sh*0.04);
    ctx.strokeStyle = this._shade(cl, 0.22);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Body shadow at chest
    var bsg = ctx.createRadialGradient(bx, by + sh*0.08, 0, bx, by + sh*0.08, sw*0.45);
    bsg.addColorStop(0, "rgba(0,0,0,0.18)");
    bsg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bsg;
    ctx.beginPath();
    ctx.ellipse(bx, by + sh*0.08, sw*0.42, sh*0.22, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();

    if (this.view === "full") this._drawLegs(ctx, g, t, bx, by + sh*0.88);
  };

  CompanionAvatar.prototype._drawLegs = function(ctx, g, t, bx, by) {
    var lw = g.faceW * 0.52, lh = g.faceH * 1.9;
    var pc = this._shade(t.clothing, 0.28);
    for (var s = -1; s <= 1; s += 2) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bx + s*lw*0.12, by);
      ctx.bezierCurveTo(bx+s*lw*0.48,by+lh*0.3, bx+s*lw*0.52,by+lh*0.72, bx+s*lw*0.48,by+lh);
      ctx.lineTo(bx+s*lw*0.1,by+lh);
      ctx.bezierCurveTo(bx+s*lw*0.08,by+lh*0.72, bx+s*lw*0.04,by+lh*0.3, bx+s*lw*0.04,by);
      ctx.closePath();
      var lg = ctx.createLinearGradient(bx+s*lw*0.52,by, bx-s*lw*0.1,by);
      lg.addColorStop(0, this._shade(pc,0.15)); lg.addColorStop(0.5,pc); lg.addColorStop(1,this._lighten(pc,0.08));
      ctx.fillStyle = lg; ctx.fill();
      ctx.beginPath();
      ctx.ellipse(bx+s*lw*0.3, by+lh+10, lw*0.32, 11, 0, 0, Math.PI*2);
      ctx.fillStyle = "#0E0E18"; ctx.fill();
      ctx.restore();
    }
  };

  /* ── Neck ─────────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawNeck = function(ctx, g) {
    var t  = this.traits;
    var nx = g.cx, ny = g.neckY;
    var nw = g.faceW*0.32, nh = g.faceH*0.24;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(nx-nw, ny);
    ctx.bezierCurveTo(nx-nw*1.05,ny+nh*0.5, nx-nw*0.88,ny+nh, nx-nw*0.65,ny+nh);
    ctx.lineTo(nx+nw*0.65, ny+nh);
    ctx.bezierCurveTo(nx+nw*0.88,ny+nh, nx+nw*1.05,ny+nh*0.5, nx+nw,ny);
    ctx.closePath();
    var ng = ctx.createLinearGradient(nx-nw,0, nx+nw,0);
    ng.addColorStop(0, this._shade(t.skin.base,0.12));
    ng.addColorStop(0.4, t.skin.mid);
    ng.addColorStop(1, this._shade(t.skin.base,0.08));
    ctx.fillStyle = ng; ctx.fill();
    ctx.beginPath();
    ctx.ellipse(nx, ny+2, nw*0.65, 5, 0, 0, Math.PI*2);
    ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.fill();
    ctx.restore();
  };

  /* ── Face ─────────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawFace = function(ctx, g, a) {
    var t   = this.traits;
    var skin = t.skin;
    var px  = a.parallaxX * 0.55, py = a.parallaxY * 0.55;
    var fx  = g.cx + px;
    var fcy = g.faceTopY + g.faceH*0.5 + py; // center of face ellipse
    var fw  = g.faceW, fh = g.faceH;
    var fem = t.gender === "f";

    // ── Face shape ──
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(fx, fcy, fw, fh*0.92, 0, 0, Math.PI*2);

    var fg = ctx.createRadialGradient(fx-fw*0.18, fcy-fh*0.25, 0, fx, fcy, fw*1.25);
    fg.addColorStop(0,   this._lighten(skin.base, 0.18));
    fg.addColorStop(0.3, skin.base);
    fg.addColorStop(0.65,skin.mid);
    fg.addColorStop(1,   skin.shadow);
    ctx.fillStyle = fg; ctx.fill();

    // Subsurface scatter cheeks
    ctx.beginPath(); ctx.ellipse(fx-fw*0.54,fcy+fh*0.08, fw*0.28,fh*0.2, -0.28,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,150,90,0.07)"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(fx+fw*0.54,fcy+fh*0.08, fw*0.28,fh*0.2, 0.28,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,150,90,0.07)"; ctx.fill();

    // Jaw shadow
    ctx.beginPath(); ctx.ellipse(fx, fcy+fh*0.7, fw*0.78,fh*0.28, 0, 0,Math.PI);
    ctx.fillStyle = "rgba(0,0,0,0.09)"; ctx.fill();

    // Chin highlight
    ctx.beginPath(); ctx.ellipse(fx+fw*0.07,fcy+fh*0.76, fw*0.11,fh*0.055, 0,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.11)"; ctx.fill();

    // Blush
    var ba = 0.16 + (this.expression==="joy"||this.expression==="excitement" ? 0.14 : 0) + a.glowAlpha*0.15;
    var br = this._hexToRgb(skin.blush);
    ctx.beginPath(); ctx.ellipse(fx-fw*0.52,fcy+fh*0.2, fw*0.25,fh*0.09, 0,0,Math.PI*2);
    ctx.fillStyle = "rgba("+br+","+ba+")"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(fx+fw*0.52,fcy+fh*0.2, fw*0.25,fh*0.09, 0,0,Math.PI*2);
    ctx.fillStyle = "rgba("+br+","+ba+")"; ctx.fill();

    ctx.restore();

    // Forehead specular highlight
    ctx.save();
    var fhg = ctx.createRadialGradient(fx+fw*0.07,fcy-fh*0.55, 0, fx,fcy-fh*0.38, fw*0.48);
    fhg.addColorStop(0,"rgba(255,255,255,0.15)"); fhg.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle = fhg;
    ctx.beginPath(); ctx.ellipse(fx,fcy-fh*0.42, fw*0.48,fh*0.25, 0,0,Math.PI*2);
    ctx.fill(); ctx.restore();

    // Ears
    this._drawEars(ctx, g, t, fx, fcy, fw, fh);

    // Eyebrows
    this._drawBrows(ctx, g, t, a, fx, fcy, fw, fh, fem, py);

    // Eyes
    var eBaseY = g.eyeY + py;
    this._drawEye(ctx, t, a, fx - g.eyeSpX + px*0.8, eBaseY, g.eyeRad, false);
    this._drawEye(ctx, t, a, fx + g.eyeSpX + px*0.8, eBaseY, g.eyeRad, true);

    // Nose
    this._drawNose(ctx, g, t, fx, fcy, fw, fh);

    // Mouth
    this._drawMouth(ctx, g, t, a, fx, g.mouthY + py*0.5, fw, fh, fem);
  };

  CompanionAvatar.prototype._drawEars = function(ctx, g, t, fx, fcy, fw, fh) {
    for (var s = -1; s <= 1; s += 2) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(fx+s*fw*1.0, fcy+fh*0.02, fw*0.095, fh*0.15, s*0.18, 0, Math.PI*2);
      var eg = ctx.createRadialGradient(fx+s*fw*0.96,fcy,0, fx+s*fw*1.0,fcy,fw*0.17);
      eg.addColorStop(0, t.skin.base); eg.addColorStop(1, t.skin.shadow);
      ctx.fillStyle = eg; ctx.fill();
      ctx.beginPath();
      ctx.ellipse(fx+s*fw*1.0, fcy+fh*0.03, fw*0.052, fh*0.085, s*0.12, 0, Math.PI*2);
      ctx.fillStyle = "rgba("+this._hexToRgb(t.skin.shadow)+",0.38)"; ctx.fill();
      ctx.restore();
    }
  };

  CompanionAvatar.prototype._drawBrows = function(ctx, g, t, a, fx, fcy, fw, fh, fem, py) {
    var EXPR = {
      idle:       {lY:0, rY:0, lA:0,  rA:0},
      joy:        {lY:-3,rY:-3,lA:-2, rA:2},
      excitement: {lY:-5,rY:-5,lA:-3, rA:3},
      sadness:    {lY:4, rY:4, lA:6,  rA:-6},
      anger:      {lY:4, rY:4, lA:9,  rA:-9},
      curiosity:  {lY:-4,rY:-1,lA:-3, rA:1},
      surprise:   {lY:-7,rY:-7,lA:-2, rA:2}
    };
    var e  = EXPR[this.expression] || EXPR.idle;
    var bw = fw * 0.28;
    var tk = fem ? 2.4 : 3.4;
    var hr = this._hexToRgb(t.hair);
    var by = g.browY + py;

    for (var side = -1; side <= 1; side += 2) {
      var isL = side === -1;
      var bsx = fx + side * g.eyeSpX;
      var bsy = by + (isL ? e.lY : e.rY);
      var ang = (isL ? e.lA : e.rA) * Math.PI / 180;
      ctx.save();
      ctx.translate(bsx, bsy);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(-bw*0.88, fem ? 2 : 3);
      ctx.bezierCurveTo(-bw*0.28,-tk*0.75, bw*0.2,-tk*0.55, bw*0.82, fem ? 2.2 : 3.5);
      ctx.strokeStyle = "rgba("+hr+",0.88)";
      ctx.lineWidth = tk; ctx.lineCap = "round"; ctx.stroke();
      // Highlight
      ctx.beginPath();
      ctx.moveTo(-bw*0.5,-tk*0.18); ctx.bezierCurveTo(0,-tk, bw*0.3,-tk*0.78, bw*0.55,-tk*0.18);
      ctx.strokeStyle = "rgba("+hr+",0.18)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }
  };

  /* ── Eye ──────────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawEye = function(ctx, t, a, cx, cy, rad, isRight) {
    var blink = a.blinkOpen;
    var ew = rad * 1.12, eh = rad * 0.7 * blink;
    if (eh < 0.4) eh = 0.4;

    var iDX = isRight ? a.eyeRX : a.eyeLX;
    var iDY = isRight ? a.eyeRY : a.eyeLY;

    // Clip to eye shape
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, ew, eh, 0, 0, Math.PI*2);
    ctx.clip();

    // Eye white with gradient depth
    var wg = ctx.createRadialGradient(cx-ew*0.14,cy-eh*0.2,0, cx,cy, ew*1.1);
    wg.addColorStop(0,"#FFFFFF"); wg.addColorStop(0.65,"#F0EEF5"); wg.addColorStop(1,"#D8D0DC");
    ctx.fillStyle = wg;
    ctx.fillRect(cx-ew*1.3, cy-eh*1.3, ew*2.6, eh*2.6);

    // Iris
    var irX = cx + iDX*ew*0.22, irY = cy + iDY*eh*0.22, irR = ew*0.62;
    var ig = ctx.createRadialGradient(irX-irR*0.22,irY-irR*0.28,0, irX,irY,irR);
    ig.addColorStop(0, this._lighten(t.eye,0.32));
    ig.addColorStop(0.38,t.eye);
    ig.addColorStop(0.78,this._shade(t.eye,0.18));
    ig.addColorStop(1, this._shade(t.eye,0.38));
    ctx.beginPath(); ctx.arc(irX,irY,irR,0,Math.PI*2);
    ctx.fillStyle = ig; ctx.fill();
    // Iris ring
    ctx.beginPath(); ctx.arc(irX,irY,irR*0.94,0,Math.PI*2);
    ctx.strokeStyle = "rgba(0,0,0,0.13)"; ctx.lineWidth = 1.1; ctx.stroke();

    // Pupil
    var pR = irR*0.40;
    var pg = ctx.createRadialGradient(irX-pR*0.2,irY-pR*0.2,0, irX,irY,pR);
    pg.addColorStop(0,"#1A1028"); pg.addColorStop(1,"#080408");
    ctx.beginPath(); ctx.arc(irX,irY,pR,0,Math.PI*2); ctx.fillStyle = pg; ctx.fill();

    // Highlights
    ctx.beginPath(); ctx.arc(irX-irR*0.2,irY-irR*0.26,irR*0.17,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.93)"; ctx.fill();
    ctx.beginPath(); ctx.arc(irX+irR*0.16,irY+irR*0.1,irR*0.07,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.52)"; ctx.fill();

    ctx.restore(); // end clip

    // Lash line (outside clip)
    ctx.save();
    if (blink > 0.25) {
      ctx.beginPath();
      ctx.ellipse(cx,cy, ew*1.04, eh*1.05, 0, Math.PI, Math.PI*2);
      ctx.strokeStyle = "#0C0810"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.stroke();
      // Individual lashes
      ctx.strokeStyle = "#0C0810"; ctx.lineWidth = 1.1;
      for (var i = -3; i <= 3; i++) {
        var lx = cx + i*ew*0.24;
        var la = Math.asin(Math.max(-1, Math.min(1,(lx-cx)/ew)));
        var ly = cy - Math.abs(Math.cos(la))*eh*1.06;
        var len = 4 + Math.abs(i)*0.4;
        var lang = i*0.16 + (isRight ? 0.1 : -0.1);
        ctx.beginPath(); ctx.moveTo(lx,ly);
        ctx.lineTo(lx + Math.sin(lang)*len*0.4, ly - len);
        ctx.stroke();
      }
    }
    // Lower lash
    ctx.beginPath(); ctx.ellipse(cx,cy, ew, eh*0.68, 0, 0, Math.PI);
    ctx.strokeStyle = "rgba(15,8,20,0.3)"; ctx.lineWidth = 1; ctx.stroke();
    // Eyelid crease
    ctx.beginPath(); ctx.ellipse(cx,cy-eh*0.12, ew*0.88,eh*1.28, 0, Math.PI+0.32, Math.PI*2-0.32);
    ctx.strokeStyle = "rgba("+this._hexToRgb(this.traits.skin.shadow)+",0.18)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  };

  /* ── Nose ─────────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawNose = function(ctx, g, t, fx, fcy, fw, fh) {
    var nx = fx, ny = g.noseY;
    var nw = fw*0.11, nh = fh*0.13;
    var sr = this._hexToRgb(t.skin.shadow);
    ctx.save();
    ctx.strokeStyle = "rgba("+sr+",0.32)"; ctx.lineWidth = 1; ctx.lineCap = "round";
    // Bridge lines
    for (var s = -1; s <= 1; s += 2) {
      ctx.beginPath();
      ctx.moveTo(nx+s*nw*0.38, ny-nh*0.88);
      ctx.bezierCurveTo(nx+s*nw*0.58,ny-nh*0.3, nx+s*nw*0.52,ny+nh*0.08, nx+s*nw*0.48,ny+nh*0.32);
      ctx.stroke();
    }
    // Nostrils
    ctx.beginPath(); ctx.ellipse(nx-nw*0.52,ny+nh*0.32, nw*0.34,nw*0.2, -0.28,0,Math.PI*2);
    ctx.fillStyle = "rgba("+sr+",0.28)"; ctx.fill();
    ctx.beginPath(); ctx.ellipse(nx+nw*0.52,ny+nh*0.32, nw*0.34,nw*0.2, 0.28,0,Math.PI*2);
    ctx.fill();
    // Tip highlight
    ctx.beginPath(); ctx.arc(nx+nw*0.09,ny+nh*0.12, nw*0.2,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fill();
    ctx.restore();
  };

  /* ── Mouth ────────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawMouth = function(ctx, g, t, a, fx, my, fw, fh, fem) {
    var mw  = fw * (fem ? 0.34 : 0.41);
    var lip = t.skin.lip, lr = this._hexToRgb(lip);
    var open = a.mouthOpen || 0;

    var MCFG = {
      idle:{c:3,w:mw}, joy:{c:10,w:mw*1.05}, excitement:{c:13,w:mw*1.08},
      sadness:{c:-7,w:mw*0.86}, anger:{c:-4,w:mw*0.9},
      curiosity:{c:4,w:mw*0.92}, surprise:{c:2,w:mw*0.52,open:true}
    };
    var mc = MCFG[this.expression] || MCFG.idle;
    var cv = mc.c, mww = mc.w;

    ctx.save();

    if (mc.open || open > 0.15) {
      var oh = fh*0.055 + open*fh*0.055;
      ctx.beginPath();
      ctx.moveTo(fx-mww,my);
      ctx.bezierCurveTo(fx-mww*0.5,my+cv*0.5, fx+mww*0.5,my+cv*0.5, fx+mww,my);
      ctx.bezierCurveTo(fx+mww*0.5,my+oh, fx-mww*0.5,my+oh, fx-mww,my);
      ctx.fillStyle = "#180808"; ctx.fill();
      // Teeth
      ctx.fillStyle = "#F8F5F0";
      ctx.fillRect(fx-mww*0.7, my+1, mww*1.4, oh*0.44);
    }

    // Upper lip
    ctx.beginPath();
    ctx.moveTo(fx-mww,my);
    ctx.bezierCurveTo(fx-mww*0.52,my-fh*0.022, fx-mww*0.07,my-fh*0.038, fx,my-fh*0.026);
    ctx.bezierCurveTo(fx+mww*0.07,my-fh*0.038, fx+mww*0.52,my-fh*0.022, fx+mww,my);
    ctx.strokeStyle = "rgba("+lr+",0.82)"; ctx.lineWidth = fem?1.4:1.7; ctx.lineCap="round"; ctx.stroke();

    // Lower lip fill
    ctx.beginPath();
    ctx.moveTo(fx-mww,my);
    ctx.bezierCurveTo(fx-mww*0.48,my+cv, fx+mww*0.48,my+cv, fx+mww,my);
    ctx.bezierCurveTo(fx+mww*0.38,my+cv*0.32, fx-mww*0.38,my+cv*0.32, fx-mww,my);
    ctx.closePath();
    var lgg = ctx.createLinearGradient(fx-mww,my, fx+mww,my+cv);
    lgg.addColorStop(0,"rgba("+lr+",0.58)"); lgg.addColorStop(0.5,"rgba("+lr+",0.72)"); lgg.addColorStop(1,"rgba("+lr+",0.48)");
    ctx.fillStyle = lgg; ctx.fill();

    // Mouth line
    ctx.beginPath(); ctx.moveTo(fx-mww,my);
    ctx.bezierCurveTo(fx-mww*0.38,my+cv*0.62, fx+mww*0.38,my+cv*0.62, fx+mww,my);
    ctx.strokeStyle = "rgba("+lr+",0.65)"; ctx.lineWidth = 1.1; ctx.stroke();

    // Lower lip highlight
    ctx.beginPath(); ctx.ellipse(fx+mww*0.05,my+cv*0.52, mww*0.26,fh*0.018, 0,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();

    ctx.restore();
  };

  /* ── Hair back ────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawHairBack = function(ctx, g, a) {
    var t = this.traits;
    if (t.hairStyle === "bald") return;
    var px = a.parallaxX*1.3, py = a.parallaxY*1.3;
    var fx = g.cx + px, fy = g.faceTopY + py;
    var fw = g.faceW, fh = g.faceH, hs = t.hairStyle;

    ctx.save();
    if (hs === "long" || hs === "medium") {
      ctx.beginPath();
      ctx.moveTo(fx-fw*1.04, fy-fh*0.35);
      ctx.bezierCurveTo(fx-fw*1.32,fy+fh*0.52, fx-fw*1.18,fy+fh*1.55, fx-fw*0.88,fy+fh*(hs==="long"?2.25:1.45));
      ctx.bezierCurveTo(fx-fw*0.28,fy+fh*(hs==="long"?2.55:1.65), fx+fw*0.28,fy+fh*(hs==="long"?2.55:1.65), fx+fw*0.88,fy+fh*(hs==="long"?2.25:1.45));
      ctx.bezierCurveTo(fx+fw*1.18,fy+fh*1.55, fx+fw*1.32,fy+fh*0.52, fx+fw*1.04,fy-fh*0.35);
      ctx.closePath();
      this._hairGrad(ctx, t.hair, 0, fy-fh*0.4, 0, fy+fh*2.2);
    } else if (hs === "curly") {
      ctx.beginPath(); ctx.ellipse(fx,fy-fh*0.1, fw*1.28,fh*1.12, 0,0,Math.PI*2);
      this._hairGrad(ctx, t.hair, fx-fw,fy-fh, fx+fw,fy+fh);
    }
    ctx.restore();
  };

  /* ── Hair front ───────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawHairFront = function(ctx, g, a) {
    var t = this.traits;
    if (t.hairStyle === "bald") return;
    var px = a.parallaxX*1.2, py = a.parallaxY*1.2;
    var fx = g.cx + px, fy = g.faceTopY + py;
    var fw = g.faceW, fh = g.faceH, hs = t.hairStyle;

    ctx.save();
    // Top cap
    ctx.beginPath();
    if (hs === "short") {
      ctx.moveTo(fx-fw*1.0,fy-fh*0.06);
      ctx.bezierCurveTo(fx-fw*1.06,fy-fh*0.7, fx-fw*0.38,fy-fh*1.1, fx,fy-fh*1.1);
      ctx.bezierCurveTo(fx+fw*0.38,fy-fh*1.1, fx+fw*1.06,fy-fh*0.7, fx+fw*1.0,fy-fh*0.06);
      ctx.bezierCurveTo(fx+fw*0.68,fy-fh*0.45, fx-fw*0.68,fy-fh*0.45, fx-fw*1.0,fy-fh*0.06);
    } else if (hs === "bun") {
      ctx.moveTo(fx-fw*0.88,fy-fh*0.06);
      ctx.bezierCurveTo(fx-fw*0.98,fy-fh*0.68, fx-fw*0.35,fy-fh*1.06, fx,fy-fh*1.06);
      ctx.bezierCurveTo(fx+fw*0.35,fy-fh*1.06, fx+fw*0.98,fy-fh*0.68, fx+fw*0.88,fy-fh*0.06);
      ctx.bezierCurveTo(fx+fw*0.58,fy-fh*0.42, fx-fw*0.58,fy-fh*0.42, fx-fw*0.88,fy-fh*0.06);
    } else {
      ctx.moveTo(fx-fw*1.04,fy-fh*0.04);
      ctx.bezierCurveTo(fx-fw*1.1,fy-fh*0.8, fx-fw*0.42,fy-fh*1.16, fx,fy-fh*1.16);
      ctx.bezierCurveTo(fx+fw*0.42,fy-fh*1.16, fx+fw*1.1,fy-fh*0.8, fx+fw*1.04,fy-fh*0.04);
      ctx.bezierCurveTo(fx+fw*0.66,fy-fh*0.46, fx-fw*0.66,fy-fh*0.46, fx-fw*1.04,fy-fh*0.04);
    }
    ctx.closePath();
    this._hairGrad(ctx, t.hair, 0, fy-fh*1.18, 0, fy+fh*0.18);

    // Bun
    if (hs === "bun") {
      ctx.beginPath(); ctx.ellipse(fx,fy-fh*1.22, fw*0.30,fw*0.26, 0,0,Math.PI*2);
      this._hairGrad(ctx, t.hair, 0, fy-fh*1.48, 0, fy-fh*1.0);
      ctx.beginPath(); ctx.arc(fx+fw*0.07,fy-fh*1.3, fw*0.09,0,Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fill();
    }

    // Side strands (medium/long)
    if (hs === "medium" || hs === "long") {
      for (var side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        ctx.moveTo(fx+side*fw*0.84,fy-fh*0.08);
        ctx.bezierCurveTo(fx+side*fw*1.04,fy+fh*0.42, fx+side*fw*1.0,fy+fh*0.84, fx+side*fw*0.86,fy+fh*0.96);
        ctx.lineTo(fx+side*fw*0.63,fy+fh*0.96);
        ctx.bezierCurveTo(fx+side*fw*0.7,fy+fh*0.66, fx+side*fw*0.66,fy+fh*0.22, fx+side*fw*0.58,fy-fh*0.06);
        ctx.closePath();
        this._hairGrad(ctx, t.hair, fx-fw,fy-fh*0.1, fx+fw,fy+fh*0.9);
      }
    }

    // Curly bumps
    if (hs === "curly") {
      for (var ci = -1.0; ci <= 1.0; ci += 0.55) {
        ctx.beginPath(); ctx.arc(fx+ci*fw*0.68,fy-fh*0.88, fw*0.2,0,Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.fill();
      }
    }

    // Specular highlight streak
    var hsg = ctx.createLinearGradient(fx+fw*0.04,fy-fh*1.08, fx+fw*0.32,fy-fh*0.48);
    hsg.addColorStop(0,"rgba(255,255,255,0)");
    hsg.addColorStop(0.42,"rgba(255,255,255,0.22)");
    hsg.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle = hsg;
    ctx.beginPath(); ctx.ellipse(fx+fw*0.17,fy-fh*0.78, fw*0.11,fh*0.26, -0.38,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
  };

  CompanionAvatar.prototype._hairGrad = function(ctx, hair, x1, y1, x2, y2) {
    var g2 = ctx.createLinearGradient(x1,y1,x2,y2);
    g2.addColorStop(0, this._lighten(hair,0.15));
    g2.addColorStop(0.32,hair);
    g2.addColorStop(0.72,this._shade(hair,0.14));
    g2.addColorStop(1, this._shade(hair,0.28));
    ctx.fillStyle = g2; ctx.fill();
  };

  /* ── Lighting ─────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawLighting = function(ctx, g, a) {
    var lx = g.cx + (a.lightX-0.5)*g.faceW*1.3;
    var ly = g.faceTopY + g.faceH*0.35 + (a.lightY-0.35)*g.faceH;
    // Key light
    var kl = ctx.createRadialGradient(lx,ly,0, lx,ly,g.faceH*0.92);
    kl.addColorStop(0,"rgba(255,248,225,0.09)");
    kl.addColorStop(0.5,"rgba(255,240,200,0.03)");
    kl.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = kl;
    ctx.beginPath(); ctx.ellipse(g.cx,g.faceTopY+g.faceH*0.4, g.faceW*1.1,g.faceH*1.1, 0,0,Math.PI*2);
    ctx.fill();
    // Cool rim light opposite side
    var rx = g.cx - (a.lightX-0.5)*g.faceW*0.85;
    var rl = ctx.createRadialGradient(rx,ly,0, rx,ly,g.faceH*0.58);
    rl.addColorStop(0,"rgba(150,175,255,0.055)");
    rl.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = rl;
    ctx.beginPath(); ctx.ellipse(g.cx,g.faceTopY+g.faceH*0.4, g.faceW*1.05,g.faceH*1.05, 0,0,Math.PI*2);
    ctx.fill();
  };

  /* ── Expression FX ────────────────────────────────────────────────────── */

  CompanionAvatar.prototype._drawFX = function(ctx, g, a) {
    // Sparkles for joy/excitement
    if ((this.expression==="joy"||this.expression==="excitement") && a.glowAlpha > 0.08) {
      var sp = [[0.72,-0.72],[-0.78,-0.58],[0.55,-0.45],[-0.52,-0.82]];
      for (var i = 0; i < sp.length; i++) {
        var sx = g.cx + sp[i][0]*g.faceW + Math.sin(a.idle*2+i)*3.5;
        var sy = g.faceTopY + g.faceH*0.5 + sp[i][1]*g.faceH + Math.cos(a.idle*1.5+i)*2.5;
        var sr = (2.2 + Math.sin(a.idle*3+i*1.5)) * a.glowAlpha;
        ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2);
        ctx.fillStyle = "rgba(255,230,100,"+a.glowAlpha*0.65+")"; ctx.fill();
      }
    }
    // Sadness tear
    if (this.expression==="sadness" && a.glowAlpha>0.12) {
      var tp = (a.exprTimer%120)/120;
      var tg = ctx.createLinearGradient(g.cx-g.eyeSpX,g.eyeY+g.eyeRad, g.cx-g.eyeSpX,g.eyeY+g.eyeRad+tp*g.faceH*0.5);
      tg.addColorStop(0,"rgba(150,195,255,0.58)"); tg.addColorStop(1,"rgba(110,155,220,0)");
      ctx.fillStyle = tg;
      ctx.beginPath(); ctx.ellipse(g.cx-g.eyeSpX, g.eyeY+g.eyeRad+tp*g.faceH*0.48, 2.8,5.5, 0,0,Math.PI*2);
      ctx.fill();
    }
  };

  /* ── Expression system ────────────────────────────────────────────────── */

  var EGLOW = {
    idle:null,
    joy:        {r:"255,220,80",  a:0.15},
    excitement: {r:"255,160,40",  a:0.18},
    curiosity:  {r:"100,200,255", a:0.12},
    surprise:   {r:"200,120,255", a:0.14},
    sadness:    {r:"80,130,220",  a:0.14},
    anger:      {r:"220,60,60",   a:0.16}
  };

  var EMOUTH = {idle:0,joy:0,excitement:0.14,curiosity:0,surprise:0.42,sadness:0,anger:0};

  CompanionAvatar.prototype.setExpression = function(name, duration) {
    if (!this.initialized) return;
    this.expression = name;
    var eg = EGLOW[name], a = this.anim;
    if (eg) { a.glowColor = eg.r; a.glowAlpha = eg.a; }
    else { a.glowAlpha = 0; }
    a.mouthOpen = EMOUTH[name] || 0;
    var lbl = document.getElementById("face-emotion-label");
    if (lbl) lbl.textContent = name;
    if (this._exprTimeout) clearTimeout(this._exprTimeout);
    var self = this;
    if (name !== "idle" && duration !== -1) {
      this._exprTimeout = setTimeout(function() {
        self.expression = "idle"; self.anim.glowAlpha = 0; self.anim.mouthOpen = 0;
        var l2 = document.getElementById("face-emotion-label");
        if (l2) l2.textContent = "idle";
      }, duration || 2800);
    }
  };

  /* ── Animation loop ───────────────────────────────────────────────────── */

  CompanionAvatar.prototype._startLoop = function() {
    console.log("_startLoop called, canvas:", this.canvas, "ctx:", this.ctx, "dimensions:", this.W, "x", this.H);
    var self = this;
    if (this._raf) cancelAnimationFrame(this._raf);
    var last = 0;
    var frameCount = 0;
    function loop(ts) {
      frameCount++;
      if (frameCount <= 3) console.log("Animation frame", frameCount, "ts:", ts);
      if (self._destroyed) return;
      var dt = Math.min((ts-last)/1000, 0.05); last = ts;
      self._tick(dt); self._draw();
      self._raf = requestAnimationFrame(loop);
    }
    this._raf = requestAnimationFrame(loop);
    console.log("_startLoop: requestAnimationFrame scheduled, _raf:", this._raf);
  };

  CompanionAvatar.prototype._tick = function(dt) {
    var a = this.anim;
    a.breath += dt*0.72; a.bob += dt*0.40; a.idle += dt*0.52; a.exprTimer += dt*60;

    // Light drift
    a.lightX += Math.sin(a.idle*0.28)*0.0007; a.lightY += Math.cos(a.idle*0.22)*0.0004;
    a.lightX = Math.max(0.26,Math.min(0.74,a.lightX)); a.lightY = Math.max(0.22,Math.min(0.52,a.lightY));

    // Glow fade
    if (this.expression==="idle" && a.glowAlpha>0) a.glowAlpha = Math.max(0,a.glowAlpha-dt*0.7);

    // Mouse parallax
    var mxN = (a.mouseX/this.W)*2-1, myN = (a.mouseY/this.H)*2-1;
    a.parallaxX += (mxN*6 - a.parallaxX)*dt*2.4;
    a.parallaxY += (myN*3 - a.parallaxY)*dt*2.4;

    // Eye tracking
    a.eyeLX += (mxN*0.52 - a.eyeLX)*dt*3.8; a.eyeLY += (myN*0.34 - a.eyeLY)*dt*3.8;
    a.eyeRX += (mxN*0.52 - a.eyeRX)*dt*3.8; a.eyeRY += (myN*0.34 - a.eyeRY)*dt*3.8;

    // Blink
    a.blinkTimer -= dt;
    if (a.blinkTimer <= 0) a.blinkTimer = 2.6 + Math.random()*4.0;
    if (a.blinkTimer < 0.2) a.blinkOpen = Math.max(0, 1-(0.2-a.blinkTimer)/0.1);
    else if (a.blinkTimer < 0.42) a.blinkOpen = Math.min(1,(a.blinkTimer-0.2)/0.22);
    else a.blinkOpen = 1;
  };

  CompanionAvatar.prototype._bindMouse = function() {
    var self = this;
    if (this._mouseHandler) window.removeEventListener("mousemove", this._mouseHandler);
    this._mouseHandler = function(e) { self.anim.mouseX=e.clientX; self.anim.mouseY=e.clientY; };
    window.addEventListener("mousemove", this._mouseHandler);
  };

  /* ── View / Rebuild / Resize ──────────────────────────────────────────── */

  CompanionAvatar.prototype._applyViewScale = function() {};

  CompanionAvatar.prototype.rebuild = function(comp) {
    this.traits = this._parseTraits(comp);
  };

  CompanionAvatar.prototype.resize = function() {
    var wrap = this.canvas.parentElement;
    if (wrap && wrap.offsetWidth>0 && wrap.offsetHeight>0) {
      this.W = wrap.offsetWidth; this.H = wrap.offsetHeight;
      this.canvas.width=this.W; this.canvas.height=this.H;
    }
  };

  /* ── Destroy ──────────────────────────────────────────────────────────── */

  CompanionAvatar.prototype.destroy = function() {
    this._destroyed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._mouseHandler) window.removeEventListener("mousemove",this._mouseHandler);
    if (this._exprTimeout) clearTimeout(this._exprTimeout);
    this.initialized = false;
  };

  /* ── Color utilities ──────────────────────────────────────────────────── */

  CompanionAvatar.prototype._hexToRgb = function(hex) {
    if (!hex || typeof hex !== 'string') return '0,0,0';
    hex = hex.replace("#","");
    if (hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length !== 6) return '0,0,0';
    var r=parseInt(hex.slice(0,2),16);
    var g=parseInt(hex.slice(2,4),16);
    var b=parseInt(hex.slice(4,6),16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '0,0,0';
    return r+","+g+","+b;
  };

  CompanionAvatar.prototype._lighten = function(hex, amt) {
    if (!hex || typeof hex !== 'string') return '#000000';
    hex = hex.replace("#","");
    if (hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length !== 6) return '#000000';
    var r=parseInt(hex.slice(0,2),16);
    var g=parseInt(hex.slice(2,4),16);
    var b=parseInt(hex.slice(4,6),16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
    r = Math.max(0, Math.min(255, r + Math.round(255*amt)));
    g = Math.max(0, Math.min(255, g + Math.round(255*amt)));
    b = Math.max(0, Math.min(255, b + Math.round(255*amt)));
    return "#"+("0"+r.toString(16)).slice(-2)+("0"+g.toString(16)).slice(-2)+("0"+b.toString(16)).slice(-2);
  };

  CompanionAvatar.prototype._shade = function(hex, amt) { return this._lighten(hex,-amt); };

  window.CompanionAvatar = CompanionAvatar;

})(window);class Avatar2D {
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