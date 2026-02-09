<?php
$currentURL = $_SERVER['REQUEST_URI'];

function activeNav($target) {
	global $currentURL;
	return ($currentURL === $target) ? '<b><font color="yellow">' : '<font color="#B026FF">';
}

function endNav() {
	return '</font>';
}
?>

<center>
<table border="2" width="800" bgcolor="#333333" cellpadding="5" cellspacing="0">
<tr>
<td align="center">

<?php echo activeNav($pathVAR . 'index.html'); ?>
<a href="<?= $pathVAR; ?>index.html">Homepage</a><?php echo endNav(); ?> |

<?php echo activeNav($pathVAR . 'about_author/index.html'); ?>
<a href="<?= $pathVAR; ?>about_author/index.html">About Author</a><?php echo endNav(); ?> |

<?php echo activeNav($pathVAR . 'about_website/index.html'); ?>
<a href="<?= $pathVAR; ?>about_website/index.html">About Website</a><?php echo endNav(); ?> |

<?php echo activeNav($pathVAR . 'contact/index.html'); ?>
<a href="<?= $pathVAR; ?>contact/index.html">Contact</a><?php echo endNav(); ?> |

<?php echo activeNav($pathVAR . 'gallery/index.html'); ?>
<a href="<?= $pathVAR; ?>gallery/index.html">Gallery</a><?php echo endNav(); ?> |

<a href="<?= $pathVAR; ?>characters/index.html">Characters</a>

</td>
</tr>
</table>
</center>

<?php
if (!empty($adminVAR) && $adminVAR == 1) {
    include $incVAR . '/adminnavbar.inc';
}
?>
