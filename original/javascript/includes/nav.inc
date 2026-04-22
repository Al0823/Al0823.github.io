<nav>
<ul>
<a href="[PATHVAR]index.html">Homepage</a><br>

<a href="[PATHVAR]/jsadmin/pages/index.html">Admin</a>

[search db=[MACVAR]nav.db&neSKUdatarq=FA&SORTORDERsort=1&SORTORDERtype=num&WEEKSUMM=T]
[founditems] 
<h2 style="color: rgb(0, 0, 0)">[WEEK]</h2>
<hr>
[search db=[MACVAR]nav.db&eqWEEKdatarq=[week]&SORTORDERsort=1&SORTORDERtype=num]
[founditems]


[search db=[DBVAR]pages.db&eqR_NAVdatarq=[SKU]&eqSTATUSdatarq=1]
[founditems]

<a href="[PAGEVAR]lesson[r_nav].html">[TITLE]</a><br>
[/founditems]
[showif [numfound]=0][TITLE] <br>[/showif]
[/search]
[/founditems]
[/search]

[/founditems]
[/search]

<h2 style="color: rgb(0, 0, 0)">EXTRA</h2>
<hr>

<a href="[PAGEVAR]lesson74.html">Ternary</a><br>

<a href="[PAGEVAR]lesson75.html">Logical</a><br>

<a href="[PAGEVAR]lesson76.html">Continue</a><br>

<a href="[PAGEVAR]lesson71.html">ECMAScript 1999</a><br>

<a href="[PAGEVAR]lesson72.html">ECMAScript 2009</a><br>

<a href="[PAGEVAR]lesson73.html">ECMAScript 2015</a><br>

</ul>
</nav>