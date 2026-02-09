<?php
/* ===============================
   ADMIN NAVBAR - 90s TABLE STYLE
   =============================== */

$currentURL = $_SERVER['REQUEST_URI'];

function activeNav($target) {
    global $currentURL;
    return ($currentURL === $target) ? '<b><font color="yellow">' : '<font color="#B026FF">';
}

function endNav() {
    return '</font>';
}

if (strpos($currentURL, '25admin25') !== false) {

    echo '<center>';
    echo '<table width="800" border="4" cellpadding="5" cellspacing="0" bgcolor="#333333">';
    echo '<tr><td align="center">';

    /* -------------------------
       ADMIN LINKS
       ------------------------- */
    echo activeNav($adminVAR . 'index.html');
    echo '<a href="' . $adminVAR . 'index.html">Admin Homepage</a>' . endNav() . ' | ';

    echo activeNav($adminVAR . 'country/index.html');
    echo '<a href="' . $adminVAR . 'country/index.html">Country</a>' . endNav() . ' | ';

    echo activeNav($adminVAR . 'state/index.html');
    echo '<a href="' . $adminVAR . 'state/index.html">State</a>' . endNav();

    echo '</td></tr>';
    echo '</table>';
    echo '</center>';

}
?>
