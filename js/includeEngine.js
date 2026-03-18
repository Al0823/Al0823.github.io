(function () {
var w = window;
var d = document;

var config = { delayMin: 20, delayMax: 100, shuffle: true };

function random(min, max) { return Math.random() * (max - min) + min; }
function delay(fn, time) { setTimeout(fn, time); }
function shuffleArray(arr) {
var i = arr.length, j, temp;
while (i--) { j = Math.floor(Math.random() * arr.length); temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; }
return arr;
}

function include(targetId, url, callback) {
try {
var iframe = d.createElement("iframe");
iframe.style.display = "none";
iframe.src = url;

iframe.onload = function () {
var target = d.getElementById(targetId);
if (!target) { if (callback) callback(); return; }

var doc = iframe.contentDocument || iframe.contentWindow.document;
target.innerHTML = doc.body.innerHTML;

var scripts = doc.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {
var s = d.createElement("script");
try { s.appendChild(d.createTextNode(scripts[i].innerHTML)); } catch (e) { s.text = scripts[i].innerHTML; }
(d.body || d.documentElement).appendChild(s);
}

if (callback) callback();
d.body.removeChild(iframe);
};

d.body.appendChild(iframe);
} catch (e) { if (callback) callback(); }
}

function loadIncludes(list, done) {
if (!list || !list.length) { if (done) done(); return; }
if (config.shuffle) list = shuffleArray(list);

var i = 0;
function next() {
if (i >= list.length) {
if (done) done();


try {
if (typeof w.PAGETITLE !== "undefined" && typeof w.vars !== "undefined") {
document.title = vars.WEBSITETITLE + " | " + PAGETITLE;
}
} catch (e) {}
return;
}

var item = list[i++];
delay(function () { include(item.id, w.vars.INCVAR + item.file, next); }, random(config.delayMin, config.delayMax));
}

next();
}

w.IncludeEngine = {
load: function (list, callback) { loadIncludes(list, callback); },
single: function (id, file, callback) { include(id, w.vars.INCVAR + file, callback); }
};
})();