<?php


$currentURL = $_SERVER['REQUEST_URI'];

function activeNav($target) {
    global $currentURL;
    // Return yellow bold font if active, otherwise purple
    return ($currentURL === $target) ? '<b><font color="#FFFF00">' : '<font color="#B026FF">';
}

function endNav() {
    return '</font></b>';
}

// Only display if URL contains '25admin25'
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
