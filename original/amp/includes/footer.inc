<div class="footer"><div class="footernav">
[search db=[dbVAR]nav.db&EQSTATUSDATArq=1&SORTORDERSORT=1&SORTORDERtype=num]
 [founditems]
<a href="[pathVAR][PATHNAME]" [showif [thisurl]^[pathVAR][PATHNAME]][/showif]><br>[TITLE]<br></a>
[/founditems]
[/search]
<a href="https://www.facebook.com/aimeemohrphotographer/"><img src="[imgVAR]facebook.png"></a><a href="https://www.instagram.com/aimeemohrphotographer/"><img src="[imgVAR]instagram.jpeg"></a>
[search db=[dbVAR]category.db&eqSTATUSdataRQ=1&max=1]
   [founditems]
    [text]cattitleVAR=[title][/text]
    [search db=[dbVAR]gallery.db&eqSTATUSdataRQ=1&EQR_categorydataRQ=[SKU]&max=1&eqORIENTATIONdatarq=p&raSKUsort=1]
    [founditems]

    [showif [ORIENTATION]=p]<a href="[amppathVAR][cattitleVAR]/[IMAGEPATH]" target="mygal"><img src="[amppathVAR][cattitleVAR]/[IMAGEPATH]"alt="Photo" class="footergallery" style="height: 250px; float: right;"></a>[/showif]
     [/founditems]
      [/search]  
    [/founditems]
  [/search] </div>Copyright [date %a. %b. %d, %y] - [time %l:%M %p]</div>
[showif [debugVAR]=1]
[include file=[incVAR]debug.inc]
[/showif]
</body>
</html>
[include file=[incVAR]closedbs.inc]