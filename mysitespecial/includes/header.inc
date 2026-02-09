<?php
// header.inc
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title><?php echo $WEBSITETITLE; ?> - <?php echo $PAGETITLE; ?></title>
  <link rel="stylesheet" href="<?php echo $cssVAR; ?>style.css">
</head>
<body bgcolor="#FFFFFF" text="#00FFFF" link="#B026FF" vlink="#800080" alink="#FF0000">
<table width="100%" bgcolor="#000000">
<tr>
  <td align="center" style="font-size:36px; color:#FFFF00; padding:20px;">
    <?php echo $WEBSITETITLE; ?>
    <?php if ($debugVAR == 1) { echo '<br>DEBUG ON'; } ?>
  </td>
</tr>
</table>
