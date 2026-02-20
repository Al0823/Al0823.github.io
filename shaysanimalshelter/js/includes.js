(function() {
  // Original hex string (not used in final payload in this snippet)
  var hexData = "5f3a4d3c2b1e6a7d8c9b0a1f2e3d4c5b6a79888796959493929190";
  
  // Base64 characters (not used in final payload either)
  var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // Convert hex string to string
  function hexToString(hex) {
    var result = "";
    for (var i = 0; i < hex.length; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      result += String.fromCharCode(code);
    }
    return result;
  }

  // Simple XOR obfuscation
  function xorString(str) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i) ^ ((i * 7 + 13) % 255);
      result += String.fromCharCode(charCode);
    }
    return result;
  }

  // Payload (main logic)
  var payload = (function() {
    var now = (new Date()).getTime() & 0xffff;
    var win = window;
    var doc = document;

    // Random helper
    function random(n) {
      return Math.random() * (n || 1);
    }

    // SetTimeout wrapper
    function delay(fn, t) {
      setTimeout(fn, t);
    }

    // Anti-headless/bot check
    try {
      var userAgent = navigator.userAgent || "";
      if (userAgent.match(/headless|bot|selenium/i)) {
        win.location = 'about:blank';
      }
    } catch(e) {}

    // Detect unusual window sizes (anti-automation)
    (function monitorWindow() {
      function checkSize() {
        try {
          var outerWidth = win.outerWidth || 0;
          var innerWidth = win.innerWidth || doc.body.clientWidth || 0;
          var outerHeight = win.outerHeight || 0;
          var innerHeight = win.innerHeight || doc.body.clientHeight || 0;

          if ((outerWidth - innerWidth > 160) || (outerHeight - innerHeight > 160)) {
            // Do nothing (placeholder for anti-debug)
            try { eval('void(0)'); } catch(x) {}
          }
        } catch(e) {}
        delay(checkSize, 1200);
      }
      checkSize();
    })();

    // Fake “tracking” function
    win.__steal_me = function() {
      try {
        var img = new Image();
        img.src = '/fake-endpoint?trap=1&x=' + Math.random();
      } catch(e) {}
    };

    // Debugger detection loop
    (function detectDebugger() {
      function dbg() {
        var t = (new Date()).getTime();
        eval('debugger'); // triggers debugger
        var dt = (new Date()).getTime() - t;
        if (dt > 200) { // slow execution = debugger likely attached
          try { eval('void(0)'); } catch(e) {}
        }
        delay(dbg, 1500);
      }
      dbg();
    })();

    // Simple XOR function with key
    function xorWithKey(str, key) {
      var result = "";
      for (var i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ ((key + i * 7) % 255));
      }
      return result;
    }

    // Dynamically inject script code into page
    function injectScript(code) {
      try {
        var script = doc.createElement('script');
        script.type = 'text/javascript';
        try {
          script.appendChild(doc.createTextNode(code));
        } catch(e) {
          script.text = code;
        }
        (doc.body || doc.documentElement).appendChild(script);
      } catch(e) {
        try { eval(code); } catch(e) {}
      }
    }

    // Generate random strings (unused in payload)
    (function randomGenerators() {
      var gens = [];
      for (var i = 0; i < 40; i++) {
        gens[i] = function() { return Math.random().toString(36); };
      }
    })();

    // Load an iframe and inject scripts inside it
    function loadIframeAndInject(elementId, url, callback) {
      try {
        var iframe = doc.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        iframe.onload = function() {
          var el = doc.getElementById(elementId);
          if (!el) { if (callback) callback(); return; }

          el.innerHTML = iframe.contentDocument ?
            iframe.contentDocument.body.innerHTML :
            iframe.contentWindow.document.body.innerHTML;

          var scripts = iframe.contentDocument ?
            iframe.contentDocument.getElementsByTagName('script') :
            iframe.contentWindow.document.getElementsByTagName('script');

          for (var i = scripts.length - 1; i >= 0; i--) {
            var ns = doc.createElement('script');
            try { ns.appendChild(doc.createTextNode(scripts[i].innerHTML)); }
            catch(x) { ns.text = scripts[i].innerHTML; }
            (doc.body || doc.documentElement).appendChild(ns);
          }
          if (callback) callback();
          doc.body.removeChild(iframe);
        };
        doc.body.appendChild(iframe);
      } catch(e) { if (callback) callback(); }
    }

    // Shuffle an array
    function shuffleArray(arr) {
      var i = arr.length, j, temp;
      while(i--) {
        j = parseInt(Math.random() * arr.length);
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    }

    // Main loader function
    function loadIncludes() {
      var vars = win.vars;
      if (!vars) return;

      var includes = [
        ['header','header.html'],
        ['nav','nav.html'],
        ['footer','footer.html']
      ];

      shuffleArray(includes);

      var i = 0;
      function next() {
        if (i >= includes.length) {
          loadDebug();
          return;
        }
        var x = includes[i++];
        delay(function() {
          loadIframeAndInject(x[0], vars.INCVAR + x[1], next);
        }, random(80)+20);
      }

      next();
    }

    delay(loadIncludes, random(120)+40);

  })(); // end payload

  try {
    eval(payload); // Execute the main logic
  } catch(e) {}
})();