<a href="[PATHVAR]/26wiki26/index.html">Admin Homepage</a><br><br>
[!]
<a href="[PATHVAR]/26wiki26/blog/index.html">Blog Admin</a><br><br>[/!]
[showif [adminvar]=0] [redirect [pathVAR]login/index.html]][/showif]
[showif [adminVAR]=1]

  [search db=[dbVAR]adminnav.db&EQSTATUSDATArq=1&SORTORDERSORT=1&SORTORDERtype=num]
 [founditems]
<a href="[pathVAR][PATHNAME]" [showif [thisurl]^[PATHNAME]]class="activenav"[/showif]>[TITLE]</a><br><br>
[/founditems]
[/search]