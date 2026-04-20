(function () {
  var w = window;
  var d = document;

  var config = {
    delayMin: 20,
    delayMax: 100,
    shuffle: true
  };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function delay(fn, time) {
    setTimeout(fn, time);
  }

  function shuffleArray(arr) {
    var i = arr.length, j, temp;
    while (i--) {
      j = Math.floor(Math.random() * arr.length);
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function include(targetId, url, callback) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load: " + url);
        return res.text();
      })
      .then(function (html) {
        var target = d.getElementById(targetId);
        if (!target) {
          if (callback) callback();
          return;
        }


        var temp = d.createElement("div");
        temp.innerHTML = html;


        var nodes = temp.childNodes;
        var scripts = [];


        temp.querySelectorAll("script").forEach(function (s) {
          scripts.push(s);
        });


        scripts.forEach(function (s) {
          s.parentNode.removeChild(s);
        });


        target.innerHTML = "";
        while (temp.firstChild) {
          target.appendChild(temp.firstChild);
        }


        scripts.forEach(function (oldScript) {
          var newScript = d.createElement("script");


          for (var i = 0; i < oldScript.attributes.length; i++) {
            var attr = oldScript.attributes[i];
            newScript.setAttribute(attr.name, attr.value);
          }

if (oldScript.src) {
  newScript.src = oldScript.src;
} else {
  newScript.textContent = oldScript.textContent;
}
(d.body || d.documentElement).appendChild(newScript);

          (d.body || d.documentElement).appendChild(newScript);
        });

        if (callback) callback();
      })
      .catch(function (err) {
        console.error(err);
        if (callback) callback();
      });
  }

  function loadIncludes(list, done) {
    if (!list || !list.length) {
      if (done) done();
      return;
    }

    if (config.shuffle) list = shuffleArray(list);

    var i = 0;

    function next() {
      if (i >= list.length) {
        if (done) done();

        // Update title safely
        try {
          if (typeof w.PAGETITLE !== "undefined" && w.vars) {
            document.title = w.vars.WEBSITETITLE + " - " + w.PAGETITLE;
          }
        } catch (e) {}

        return;
      }

      var item = list[i++];

      delay(function () {
        include(item.id, w.vars.INCVAR + item.file, next);
      }, random(config.delayMin, config.delayMax));
    }

    next();
  }

  w.IncludeEngine = {
    load: function (list, callback) {
      loadIncludes(list, callback);
    },
    single: function (id, file, callback) {
      include(id, w.vars.INCVAR + file, callback);
    }
  };
})();