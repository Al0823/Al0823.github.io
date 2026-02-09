<?php
// navbar.inc
$currentURL = $_SERVER['REQUEST_URI'];

function activeNav($target) {
    global $currentURL;
    return ($currentURL === $target) ? ' style="background-color:#000000; color:#B026FF; font-weight:bold;"' : '';
}
?>
<table width="100%" bgcolor="#333333" cellspacing="0" cellpadding="6">
<tr>
  <td><a href="<?php echo $pathVAR; ?>index.html"<?php echo activeNav($pathVAR.'index.html'); ?>>Homepage</a></td>
  <td><a href="<?php echo $pathVAR; ?>about_author/index.html"<?php echo activeNav($pathVAR.'about_author/index.html'); ?>>About Author</a></td>
  <td><a href="<?php echo $pathVAR; ?>about_website/index.html"<?php echo activeNav($pathVAR.'about_website/index.html'); ?>>About Website</a></td>
  <td><a href="<?php echo $pathVAR; ?>contact/index.html"<?php echo activeNav($pathVAR.'contact/index.html'); ?>>Contact</a></td>
  <td><a href="<?php echo $pathVAR; ?>gallery/index.html"<?php echo activeNav($pathVAR.'gallery/index.html'); ?>>Gallery</a></td>
		  <td><a href="<?php echo $pathVAR; ?>characters/index.html"<?php echo activeNav($pathVAR.'characters/index.html'); ?>>Characters</a></td>
</tr>
</table>
