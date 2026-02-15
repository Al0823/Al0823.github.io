
<nav>
[search db=[dbVAR]nav.db&EQSTATUSDATArq=1&SORTORDERSORT=1&SORTORDERtype=num]
 [founditems]

[showif [admin]=2]
[if ("[userVAR]" = "")]
[then]
<a class="[showif [thisurl]=[pathVAR][pathname]]activenav[/showif]" href="[pathVAR][pathname]">[TITLE]</a><br><br>
[/then]
[else]
<a class="[showif [thisurl]=[pathVAR][pathname]]activenav[/showif]" href="[pathVAR][pathname]?action=logout">Logout</a><br><br>
[/else]
[/if]
[/showif]


[showif [admin]=0]
<a class="[showif [thisurl]=[pathVAR][pathname]]activenav[/showif]" href="[pathVAR][pathname]">[TITLE]</a><br><br>
[/showif]
[/founditems]
[/search]
[showif [adminVAR]=1][include file=[incVAR]adminnav.inc][/showif]
[SHOWIF [getcookie name=Student]=2559]
<a href="[DEVPATHVAR]index.html">DEV PAGE</a><br><br>
[/SHOWIF]

[SHOWIF [getcookie name=Student]=1055]
<a href="[DEVPATHVAR]index.html">DEV PAGE</a><br><br>
[/SHOWIF]
</nav>




