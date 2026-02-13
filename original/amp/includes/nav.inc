<div class="nav">
[search db=[dbVAR]nav.db&EQSTATUSDATArq=1&SORTORDERSORT=1&SORTORDERtype=num]
 [founditems]

[showif [admin]=2]
[if ("[userVAR]" = "")]
[then]
[showif [thisurl]=[pathVAR][pathname]]activenav[/showif] <a href="[pathVAR][pathname]">[TITLE]</a>
[/then]
[else]
[showif [thisurl]=[pathVAR][pathname]]activenav[/showif] <a href="[pathVAR][pathname]?action=logout">Logout</a>
[/else]
[/if]
[/showif]

[showif [admin]=0]
[showif [thisurl]=[pathVAR][pathname]]activenav[/showif] <a href="[pathVAR][pathname]">[TITLE]</a>
[/showif]
[/founditems]
[/search]
</div>
[showif [adminVAR]=1][include file=[incVAR]adminnav.inc][/showif]







[!]<div class="nav">
  <a class="[showif [thisurl]=[pathVAR]index.html]activenav[/showif]" href="[pathVAR]index.html">Homepage</a>
  <a class="[showif [thisurl]=[pathVAR]my_work/index.html]activenav[/showif]" href="[pathVAR]my_work/index.html">My Work</a>
  <a class="[showif [thisurl]=[pathVAR]testimonials/index.html]activenav[/showif]" href="[pathVAR]testimonials/index.html">Testimonials</a>
  <a class="[showif [thisurl]=[pathVAR]venues/index.html]activenav[/showif]" href="[pathVAR]venues/index.html">Venues</a>
  <a class="[showif [thisurl]=[pathVAR]about_us/index.html]activenav[/showif]" href="[pathVAR]about_us/index.html">About Us</a>
  <a class="[showif [thisurl]=[pathVAR]blog/index.html]activenav[/showif]" href="[pathVAR]blog/index.html">Blog</a>
  <a class="[showif [thisurl]=[pathVAR]contact/index.html]activenav[/showif]" href="[pathVAR]contact/index.html">Contact</a>[!]

  
  
  
<div class="dropdown">
<button class="dropbtn">Login 
<i class="fa fa-caret-down"></i>
</button>
<div class="dropdown-content">

</div>
</div>[/!]
</div>[/!]