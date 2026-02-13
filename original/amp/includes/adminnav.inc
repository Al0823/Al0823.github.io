[showif [adminvar]=0] [redirect [pathVAR]login/index.html]][/showif]
[showif [adminVAR]=1]
<div class="nav">
  [search db=[dbVAR]adminnav.db&EQSTATUSDATArq=1&SORTORDERSORT=1&SORTORDERtype=num]
 [founditems]
<a href="[pathVAR][PATHNAME]" [showif [thisurl]^[PATHNAME]]class="activenav"[/showif]>[TITLE]</a>
[/founditems]
[/search]
[!]

  
  
  
<div class="dropdown">
<button class="dropbtn">Login 
<i class="fa fa-caret-down"></i>
</button>
<div class="dropdown-content">
<a class= "[showif [thisurl]=[pathVAR]/index.html]activenav_dropdown[/showif]" href="[pathVAR]index.html">test</a>
</div>
</div>[/!]
</div>
[/showif]
[!]
[showif [thisurl]^25admin25]
<div class="nav">
  <a class="[showif [thisurl]=[adminVAR]index.html]activenav[/showif]" href="[adminVAR]index.html">Admin</a>
  <a class="[showif [thisurl]=[adminVAR]adminnav/index.html]activenav[/showif]" href="[adminVAR]adminnav/index.html">Adminnav</a>
  <a class="[showif [thisurl]=[adminVAR]contacts/index.html]activenav[/showif]" href="[adminVAR]contacts/index.html">Contacts</a>
  <a class="[showif [thisurl]=[adminVAR]country/index.html]activenav[/showif]" href="[adminVAR]country/index.html">Country</a>
  <a class="[showif [thisurl]=[adminVAR]nav/index.html]activenav[/showif]" href="[adminVAR]nav/index.html">nav</a>
  <a class="[showif [thisurl]=[adminVAR]state/index.html]activenav[/showif]" href="[adminVAR]state/index.html">State</a>[!]
  <a class="[showif [thisurl]=[pathVAR]contact/index.html]activenav[/showif]" href="[pathVAR]contact/index.html">Contact</a>[/!][!]

  
  
  
<div class="dropdown">
<button class="dropbtn">Login 
<i class="fa fa-caret-down"></i>
</button>
<div class="dropdown-content">
<a class= "[showif [thisurl]=[pathVAR]/index.html]activenav_dropdown[/showif]" href="[pathVAR]/index.html">test</a>
</div>
</div>[/!]
</div>
[/showif][/!]
