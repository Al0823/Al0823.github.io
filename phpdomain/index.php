<?php
$PROPOSALVAR  = "/proposal/";
$MYSITEVAR    = "/mysite/";
$AMPVAR       = "/amp/";
$TBGVAR       = "/tbgp7/";
$JSWIKIVAR    = "/javascript/frontend/";
$WIKIVAR      = "/myproject/wiki/";
$WIKIDEVVAR   = "/myproject/wikiinfo/";
$SHSVAR       = "/shaysanimalshelter/";
$ALTDOMAINVAR = "https://al0823.github.io";
$ASSIGNMENTSVAR   = "/lessons/assignments/";
$DECODERVAR   = "/datawindecoder/v3/";
$AIVAR   = "/ai/20.0/";
$RUNNERVAR   = "/coderunner/";
$GAMEVAR   = "/game/game/";
$DEBUGVAR     = 0;
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>A.t.A. Projects - Landing Page</title>
</head>
<body bgcolor="#afafaf" text="#000000" link="#4b5c01" vlink="#4b5c01" alink="#000000">
<center>

<table width="760" border="0" cellpadding="0" cellspacing="0">
<tr>
<td bgcolor="#4b4b4b">
<marquee scrollamount="4">
<span style="color:#ffffff;font-family:Arial;">*** WELCOME TO A.t.A. PROJECTS ***</span>
</marquee>
</td>
</tr>
</table>

<table width="760" border="0" cellpadding="0" cellspacing="0" bgcolor="#4b4b4b">
<tr>
<td width="80" align="center">
<span style="color:#ffffff;font-size:xx-large;">★</span><br>
<span style="color:#c8c8c8;font-size:small;">Est. 2024</span>
</td>
<td align="center">
<span style="color:#ffffff;font-family:Comic Sans MS;font-size:300%;"><b>A.t.A. Projects</b></span><br>
<span style="color:#c8c8c8;font-family:Courier New;"><i>~ Your #1 Source For My Projects ~</i></span>
</td>
<td width="80" align="center">
<span style="color:#ffffff;font-size:xx-large;">★</span><br>
<span style="color:#c8c8c8;font-size:small;">Est. 2024</span>
</td>
</tr>
</table>

<br>

<table width="760" border="0" cellpadding="6" cellspacing="4">
<tr valign="top">

<td width="370" bgcolor="#c8c8c8">

<b>► 1st Year Projects</b><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$PROPOSALVAR."index.html' target='_blank'><b>Proposal Website (Mysite Project Idea)</b></a>"; ?><br><br>

• <?php echo "<a href='".$MYSITEVAR."index.html' target='_blank'><b>Murder Drones Fan Wiki (Mysite Project)</b></a>"; ?><br><br>

• <?php echo "<a href='".$AMPVAR."index.html' target='_blank'><b>AMP Project</b></a>"; ?><br><br>

• <a href="/tbgp7/index.html" target="_blank"><b>One Wrong Choice (Text Based Game)</b></a><br><br>

<b>► 2nd Year Projects</b><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$JSWIKIVAR."index.html' target='_blank'><b>Javascript Wiki</b></a>"; ?><br><br>

• <?php echo "<a href='".$WIKIVAR."index.html' target='_blank'><b>A.T.A. Tech Wiki</b></a>"; ?><br><br>

• <?php echo "<a href='".$WIKIDEVVAR."index.html' target='_blank'><b>A.T.A. Tech Wiki Dev Page</b></a>"; ?><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$ASSIGNMENTSVAR."week1.html' target='_blank'><b>CSS Driven Form</b></a>"; ?><br><br>

• <?php echo "<a href='".$ASSIGNMENTSVAR."week2.html' target='_blank'><b>Simple WebDNA Admin</b></a>"; ?>
<span style="color:#ff0000;font-size:xx-small;">[WebDNA replaced with PHP]</span><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$ASSIGNMENTSVAR."week3/index.html' target='_blank'><b>Hangman Splash Screen</b></a>"; ?><br><br>

• <?php echo "<a href='".$ASSIGNMENTSVAR."hangman/index.html' target='_blank'><b>Hangman Game</b></a>"; ?><br><br>

</td>

<td width="230" bgcolor="#c8c8c8">

<b>► Other Projects</b><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$DECODERVAR."index.html' target='_blank'><b>Data.win Decoder (W.I.P.)</b></a>"; ?><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$AIVAR."index.html' target='_blank'><b>FreeGPT (W.I.P.)</b></a>"; ?><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$RUNNERVAR."index.html' target='_blank'><b>Code Runner</b></a>"; ?><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR.$GAMEVAR."index.html' target='_blank'><b>Unnamed Text-Based Game</b></a>"; ?><br><br>

<b>► Other Domains/Servers</b><br><br>

• <?php echo "<a href='".$ALTDOMAINVAR."/index.html' target='_blank'><b>My Static Domain</b></a>"; ?><br>
<span style="color:#4b4b4b;font-size:xx-small;">Check out my Other Domain</span><br><br>

</td>

</tr>
</table>

<br>

<?php
$counterFile = "counter.txt";

if (!file_exists($counterFile)) {
    file_put_contents($counterFile, "000000");
}

$count = (int)file_get_contents($counterFile);
$count++;
file_put_contents($counterFile, str_pad($count, 6, "0", STR_PAD_LEFT));

echo "<center>".str_pad($count, 6, "0", STR_PAD_LEFT)."</center>";
?>

<br>

<table width="760" bgcolor="#4b4b4b">
<tr>
<td align="center">
<span style="color:#c8c8c8;font-size:12px;">
© 2024 - <script>document.write(new Date().getFullYear());</script>
</span>
</td>
</tr>
</table>

<?php
if ($DEBUGVAR == 1) {
    echo "<hr><b>DEBUG:</b><br>";
    foreach (get_defined_vars() as $k => $v) {
        if (!is_array($v) && !is_object($v)) {
            echo $k." = ".$v."<br>";
        }
    }
}
?>

</center>
</body>
</html>