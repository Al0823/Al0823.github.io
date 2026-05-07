// include.js
/*
async function loadInclude(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load header and nav first
  await loadInclude("header", window.vars.INCVAR + "header.html");
  await loadInclude("nav", window.vars.INCVAR + "nav.html");
  await loadInclude("footer", window.vars.INCVAR + "footer.html");

  // Populate footer date/time
  const footerEl = document.getElementById("footerText");
  if (footerEl) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    footerEl.textContent = "Copyright " + dateStr + " - " + timeStr;
  }

  // Load debug section if DEBUGVAR is true
  if (window.vars?.DEBUGVAR) {
    const debugArea = document.getElementById("debugArea");
    if (debugArea) {
      await loadInclude("debugArea", window.vars.INCVAR + "debug.html");
    }
  }
});
*/
/*
(function(){var p="5f3a4d3c2b1e6a7d8c9b0a1f2e3d4c5b6a79888796959493929190";var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";function d(x){var o="",i=0,c;for(i=0;i<x.length;i+=2){c=parseInt(x.substr(i,2),16);o+=String.fromCharCode(c);}return o;}function m(s){var o="",i,c;for(i=0;i<s.length;i++){c=s.charCodeAt(i)^((i*7+13)%255);o+=String.fromCharCode(c);}return o;}var payload="(function(){var e=(new Date()).getTime()&0xffff,w=window,d=document;function r(n){return Math.random()*(n||1);}function s(f,t){setTimeout(f,t);}try{var u=navigator.userAgent+'';if(u.match(/headless|bot|selenium/i)){w.location='about:blank';}}catch(x){}(function(){function c(){try{var o=w.outerWidth||0,i=w.innerWidth||d.body.clientWidth||0,h=w.outerHeight||0,j=w.innerHeight||d.body.clientHeight||0;if((o-i>160)||(h-j>160)){try{eval('void(0)');}catch(x){}}}catch(x){}s(c,1200);}c();})();w.__steal_me=function(){try{var i=new Image();i.src='/fake-endpoint?trap=1&x='+Math.random();}catch(x){}};(function(){function dbg(){var t=(new Date()).getTime();eval('debugger');var dt=(new Date()).getTime()-t;if(dt>200){try{eval('void(0)');}catch(x){}}s(dbg,1500);}dbg();})();function X(str,k){var o='',i,c;for(i=0;i<str.length;i++){c=str.charCodeAt(i)^((k+i*7)%255);o+=String.fromCharCode(c);}return o;}function L(c){try{var sc=d.createElement('script');sc.type='text/javascript';try{sc.appendChild(d.createTextNode(c));}catch(x){sc.text=c;}(d.body||d.documentElement).appendChild(sc);}catch(x){try{eval(c);}catch(x){}}}(function(){var j=[];for(var i=0;i<40;i++){j[i]=function(){return Math.random().toString(36);}}})();function LI(a,b,c){try{var f=d.createElement('iframe');f.style.display='none';f.src=b;f.onload=function(){var el=d.getElementById(a);if(!el){if(c)c();return;}el.innerHTML=f.contentDocument?f.contentDocument.body.innerHTML:f.contentWindow.document.body.innerHTML;var sc=f.contentDocument?f.contentDocument.getElementsByTagName('script'):f.contentWindow.document.getElementsByTagName('script');for(var i=sc.length-1;i>=0;i--){var ns=d.createElement('script');try{ns.appendChild(d.createTextNode(sc[i].innerHTML));}catch(x){ns.text=sc[i].innerHTML;}(d.body||d.documentElement).appendChild(ns);}if(c)c();d.body.removeChild(f);};d.body.appendChild(f);}catch(x){if(c)c();}}function SH(a){var i=a.length,j,t;while(i--){j=parseInt(Math.random()*a.length);t=a[i];a[i]=a[j];a[j]=t;}return a;}function B(){var v=w.vars;if(!v)return;var T=[['header','https://al0823.github.io/codefordummies/frontend/includes/header.html'],['nav','https://al0823.github.io/codefordummies/frontend/includes/nav.html'],['footer','https://al0823.github.io/codefordummies/frontend/includes/footer.html']];SH(T);var i=0;function N(){if(i>=T.length){A();return;}var x=T[i++];s(function(){LI(x[0],v.INCVAR+x[1],N);},r(80)+20);}function A(){if(v.DEBUGVAR){s(function(){LI('debugInclude',v.INCVAR+'debug.html');},r(100));}try{if(typeof updatePageTitle=='function')updatePageTitle();}catch(x){}}N();}s(B,r(120)+40);})();";try{eval(payload);}catch(e){}})();

async function include(id, url) {
  const response = await fetch(url);
  document.getElementById(id).innerHTML = await response.text();
}

include("header", "https://al0823.github.io/codefordummies/frontend/includes/header.html");
include("nav", "https://al0823.github.io/codefordummies/frontend/includes/nav.html");
include("footer", "https://al0823.github.io/codefordummies/frontend/includes/footer.html");*/

async function include(id, url) {
  const response = await fetch(url);
  const html = await response.text();

  const element = document.getElementById(id);

  element.innerHTML = html;

  const scripts = element.querySelectorAll("script");

  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");

    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });

    newScript.textContent = oldScript.textContent;

    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

include(
  "header",
  "https://al0823.github.io/codefordummies/frontend/includes/header.html"
);

include(
  "nav",
  "https://al0823.github.io/codefordummies/frontend/includes/nav.html"
);

include(
  "footer",
  "https://al0823.github.io/codefordummies/frontend/includes/footer.html"
);