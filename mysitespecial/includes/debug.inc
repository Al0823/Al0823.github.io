<?php
if ($debugVAR == 1) {
    echo '<center>';
    echo '<table width="800" border="4" cellpadding="10" cellspacing="0" bgcolor="#000000">';
    
    echo '<tr><td colspan="2" align="center">';
    echo '<font size="5" color="yellow"><b>DEBUG VARIABLES</b></font>';
    echo '</td></tr>';

    /* -------------------------
       LIST OF ALL PHP VARIABLES
       ------------------------- */
    echo '<tr><td width="50%" valign="top">';
    echo '<font size="3" color="#00FF00"><b>LISTVARIABLES</b><br>';
    
    $allVars = get_defined_vars();
    $i = 0;
    foreach ($allVars as $name => $value) {
        echo $i . ', <b>' . htmlspecialchars($name) . '</b> = <pre style="color:#00FF00;">' . htmlspecialchars(print_r($value,true)) . '</pre><br>';
        $i++;
    }

    echo '</font></td>';

    /* -------------------------
       FORM VARIABLES ($_POST)
       ------------------------- */
    echo '<td width="50%" valign="top">';
    echo '<font size="3" color="#00FF00"><b>FORMVARIABLES</b><br>';

    $i = 0;
    foreach ($_POST as $name => $value) {
        echo $i . ', <b>' . htmlspecialchars($name) . '</b> = <pre style="color:#00FF00;">' . htmlspecialchars(print_r($value,true)) . '</pre><br>';
        $i++;
    }

    echo '</font></td></tr>';

    /* -------------------------
       COOKIE VARIABLES
       ------------------------- */
    echo '<tr><td width="50%" valign="top">';
    echo '<font size="3" color="#00FFFF"><b>LISTCOOKIES</b><br>';
    $i = 0;
    foreach ($_COOKIE as $name => $value) {
        echo $i . ', <b>' . htmlspecialchars($name) . '</b> = ' . htmlspecialchars($value) . '<br>';
        $i++;
    }
    echo '</font></td>';

    /* -------------------------
       HTTP HEADERS
       ------------------------- */
    echo '<td width="50%" valign="top">';
    echo '<font size="3" color="#00FFFF"><b>LISTMIMEHEADERS</b><br>';
    $i = 0;
    $headers = getenv("ALL_HTTP") ? explode("\n", getenv("ALL_HTTP")) : array();
    foreach ($headers as $headerLine) {
        echo $i . ', ' . htmlspecialchars($headerLine) . '<br>';
        $i++;
    }
    echo '</font></td></tr>';

    echo '</table>';
    echo '</center>';
}
?>
