<?php
$currentURL = $_SERVER['REQUEST_URI'];

// Function to add inline style for the current page
function activeNav($target) {
    global $currentURL;
    if ($currentURL === $target) {
        return ' style="background-color:#000000; color:#FFFF00; font-weight:bold;"';
    } else {
        return ' style="color:#B026FF; text-decoration:none;"';
    }
}
?>

<!-- Table-Based Navbar with 90s Hover -->
<table width="100%" bgcolor="#333333" cellspacing="0" cellpadding="6" border="0">
<tr>
  <td align="center">
    <a href="<?php echo $pathVAR; ?>index.html"<?php echo activeNav($pathVAR.'index.html'); ?>
       onMouseOver="this.style.color='#FFFF00'; this.style.backgroundColor='#000000';"
       onMouseOut="this.style.color='<?php echo ($currentURL===$pathVAR.'index.html')?'#FFFF00':'#B026FF'; ?>'; this.style.backgroundColor='<?php echo ($currentURL===$pathVAR.'index.html')?'#000000':'#333333'; ?>';">
       Homepage
    </a>
  </td>

  <td align="center">
    <a href="<?php echo $pathVAR; ?>about_author/index.html"<?php echo activeNav($pathVAR.'about_author/index.html'); ?>
       onMouseOver="this.style.color='#FFFF00'; this.style.backgroundColor='#000000';"
       onMouseOut="this.style.color='<?php echo ($currentURL===$pathVAR.'about_author/index.html')?'#FFFF00':'#B026FF'; ?>'; this.style.backgroundColor='<?php echo ($currentURL===$pathVAR.'about_author/index.html')?'#000000':'#333333'; ?>';">
       About Author
    </a>
  </td>

  <td align="center">
    <a href="<?php echo $pathVAR; ?>about_website/index.html"<?php echo activeNav($pathVAR.'about_website/index.html'); ?>
       onMouseOver="this.style.color='#FFFF00'; this.style.backgroundColor='#000000';"
       onMouseOut="this.style.color='<?php echo ($currentURL===$pathVAR.'about_website/index.html')?'#FFFF00':'#B026FF'; ?>'; this.style.backgroundColor='<?php echo ($currentURL===$pathVAR.'about_website/index.html')?'#000000':'#333333'; ?>';">
       About Website
    </a>
  </td>

  <td align="center">
    <a href="<?php echo $pathVAR; ?>contact/index.html"<?php echo activeNav($pathVAR.'contact/index.html'); ?>
       onMouseOver="this.style.color='#FFFF00'; this.style.backgroundColor='#000000';"
       onMouseOut="this.style.color='<?php echo ($currentURL===$pathVAR.'contact/index.html')?'#FFFF00':'#B026FF'; ?>'; this.style.backgroundColor='<?php echo ($currentURL===$pathVAR.'contact/index.html')?'#000000':'#333333'; ?>';">
       Contact
    </a>
  </td>

  <td align="center">
    <a href="<?php echo $pathVAR; ?>gallery/index.html"<?php echo activeNav($pathVAR.'gallery/index.html'); ?>
       onMouseOver="this.style.color='#FFFF00'; this.style.backgroundColor='#000000';"
       onMouseOut="this.style.color='<?php echo ($currentURL===$pathVAR.'gallery/index.html')?'#FFFF00':'#B026FF'; ?>'; this.style.backgroundColor='<?php echo ($currentURL===$pathVAR.'gallery/index.html')?'#000000':'#333333'; ?>';">
       Gallery
    </a>
  </td>

  <td align="center">
    <a href="<?php echo $pathVAR; ?>characters/index.html"<?php echo activeNav($pathVAR.'characters/index.html'); ?>
       onMouseOver="this.style.color='#FFFF00'; this.style.backgroundColor='#000000';"
       onMouseOut="this.style.color='<?php echo ($currentURL===$pathVAR.'characters/index.html')?'#FFFF00':'#B026FF'; ?>'; this.style.backgroundColor='<?php echo ($currentURL===$pathVAR.'characters/index.html')?'#000000':'#333333'; ?>';">
       Characters
    </a>
  </td>
</tr>
</table>
