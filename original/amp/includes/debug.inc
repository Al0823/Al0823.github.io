
<style>
.flex_container {
display: flex;
flex-wrap: nowrap;
width: 99%;
border: solid black 5px
}
.flex {
width: 45%;
margin: 10px;
border: solid black 5px
}
</style>

<div><h1>Debug Variables</h1></div>
<div class="flex_container">
<div class="flex"> LISTVARIABLES
<br>
[listvariables]
[index], <B>[name]</b> = [value]
<br>
[/listvariables]
</div>
<div class="flex">FORMVARIABLES
<br>
[formvariables]
[index], <B>[name]</b> = [value]
<br>
[/formvariables]
</div>
</div>
<div class="flex_container">
<div class="flex"> LISTCOOKIES
<br>
[listcookies]
[index] <B>[name]</b> = [value]
<br>
[/listcookies]
</div>
<div class="flex"> LISTMIMEHEADERS
<br>
[listmimeheaders name=HTTP_HOST&exact=t]
[index] <B>[name]</b>= [value]<br>
[/listmimeheaders]
</div>
</div>
<pre>
</pre>
