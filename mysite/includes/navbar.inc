<?php
$currentURL = $_SERVER['REQUEST_URI'];

function activeNav($target) {
	global $currentURL;
	return ($currentURL === $target) ? 'activenav' : '';
}

function activeDropdown($target) {
	global $currentURL;
	return ($currentURL === $target) ? 'activenav_dropdown' : '';
}
?>

<div class="navbar">
	<a class="<?= activeNav($pathVAR . 'index.html'); ?>"
	   href="<?= $pathVAR; ?>index.html">Homepage</a>

	<a class="<?= activeNav($pathVAR . 'about_author/index.html'); ?>"
	   href="<?= $pathVAR; ?>about_author/index.html">About Author</a>

	<a class="<?= activeNav($pathVAR . 'about_website/index.html'); ?>"
	   href="<?= $pathVAR; ?>about_website/index.html">About Website</a>

	<a class="<?= activeNav($pathVAR . 'contact/index.html'); ?>"
	   href="<?= $pathVAR; ?>contact/index.html">Contact</a>

	<a class="<?= activeNav($pathVAR . 'gallery/index.html'); ?>"
	   href="<?= $pathVAR; ?>gallery/index.html">Gallery</a>

	<div class="dropdown">
		<button class="dropbtn">
			Characters <i class="fa fa-caret-down"></i>
		</button>

		<div class="dropdown-content">
<a class="<?= activeDropdown($pathVAR . 'characters/character_absolutesolver_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_absolutesolver_md/index.html">Absolute Solver</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_alice_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_alice_md/index.html">Alice</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_amda_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_amda_md/index.html">Amda</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_cyn_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_cyn_md/index.html">Cyn</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_j_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_j_md/index.html">J</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_khan_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_khan_md/index.html">Khan</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_n_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_n_md/index.html">N</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_uzi_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_uzi_md/index.html">Uzi</a>

			<a class="<?= activeDropdown($pathVAR . 'characters/character_v_md/index.html'); ?>"
			   href="<?= $pathVAR; ?>characters/character_v_md/index.html">V</a>
		</div>
	</div>
</div>
<?php
if (!empty($adminVAR) && $adminVAR == 1) {
    include $incVAR . '/adminnavbar.inc';
}
?>

