<center>
<table width="800" border="4" cellpadding="10" cellspacing="0" bgcolor="#000000">
<tr>
<td align="center">

<font size="3" color="yellow">
&copy; A.t.A. Tech Wiki<br>
Last Updated:
<?php echo date("l, F d, Y"); ?> -
<?php echo date("g:i A"); ?>
</font>

<br><br>

<font size="2" color="#00FF00">
Best viewed at 800x600 resolution<br>
Optimized for Netscape Navigator & Internet Explorer
</font>

<br><br>

<img src="<?php echo $pathVAR; ?>images/under_construction.gif" alt="Under Construction">
<img src="<?php echo $pathVAR; ?>images/emailme.gif" alt="Email Me">

</td>
</tr>
</table>
</center>

<?php if ($debugVAR == 1): ?>
    <pre style="color:red;">
*** DEBUG MODE ACTIVE ***
    </pre>
    <?php include $incVAR . 'debug.inc'; ?>
<?php endif; ?>
