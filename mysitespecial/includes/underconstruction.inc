<?php


echo '<center>';
echo '<table width="800" border="4" cellpadding="10" cellspacing="0" bgcolor="#FFFFCC">';
echo '<tr><td align="center">';

echo '<font size="5" color="#C70039"><b>Sorry! This page is still under construction!</b></font><br><br>';

echo '<font size="3" color="#FF5700">';
echo 'Check back soon for updates.';
echo '</font><br><br>';

/* Add classic animated GIF for extra flair */
echo '<img src="' . $imgVAR . 'under_construction.gif" alt="Under Construction" width="200" height="200"><br>';

/* Optional scrolling text */
echo '<marquee behavior="alternate" scrollamount="5">';
echo '<font size="3" color="#FF0000"><b>🚧 UNDER CONSTRUCTION 🚧</b></font>';
echo '</marquee>';

echo '</td></tr>';
echo '</table>';
echo '</center>';
?>
