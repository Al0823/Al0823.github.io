<div class="right">
 [search db=[dbVAR]category.db&eqSTATUSdataRQ=1&max=1]
   [founditems]
	[text]cattitleVAR=[title][/text]
	[search db=[dbVAR]gallery.db&eqSTATUSdataRQ=1&EQR_categorydataRQ=[SKU]&max=1&eqORIENTATIONdatarq=p&raSKUsort=1]
	[founditems]

	[showif [ORIENTATION]=p]<a href="[amppathVAR][cattitleVAR]/[IMAGEPATH]" target="mygal"><img src="[amppathVAR][cattitleVAR]/[IMAGEPATH]"alt="Photo" class="rightgallery" style="height: 400px; float: left;"></a>[/showif]
	 [/founditems]
	  [/search]  
    [/founditems]
  [/search]
</div>