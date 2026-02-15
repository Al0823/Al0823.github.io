



<html>
<header>
<script>
(function () {
  const saved = localStorage.getItem("site-theme");
  if (!saved) return; // Original theme = no override
  document.documentElement.classList.add("theme-" + saved);
})();
</script>

<audio autoplay loop>
    <source src="/citi/coding/2026/2/ak/audio/bgmusic.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
<title>[WEBSITETITLE] - [PAGETITLE]</title>
<style>
[include file=[CSSVAR]style.css]
</style>
<div class="header">
A.t.A. Tech Wiki<br>
</div>
[showif [debugVAR]=1]Dev stuff is showing[/showif] 

</header>
<body>




