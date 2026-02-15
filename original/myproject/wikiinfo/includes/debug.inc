<style>
.flex_container {
display: flex;
flex-wrap: nowrap;
 border: 2px rgb(75, 75, 75) solid;
 background-color: rgb(125, 125, 125);
}
.flex {
width: 45%;
margin: 10px;
 border: 2px rgb(75, 75, 75) solid;
 background-color: rgb(175, 175, 175);
}
.DEBUGTITLE {
background-color: rgb(75, 75, 75);
  color: rgb(255, 255, 255);
border: 2px solid rgb(200, 200, 200);
}
</style>
<div class="DEBUGTITLE"><h1>Debug Variables</h1></div>
<div class="flex_container">
<div class="flex"> LISTVARIABLES<br>
[listvariables]
[index], <B>[name]</b> = [value]<br>
[/listvariables]
</div>
<div class="flex">FORMVARIABLES<br>
[formvariables]
[index], <B>[name]</b> = [value]<br>
[/formvariables]
</div>
</div>
<div class="flex_container">
<div class="flex"> LISTCOOKIES<br>
[listcookies]
[index] <B>[name]</b> = [value]<br>
[/listcookies]
</div>
<div class="flex"> LISTMIMEHEADERS<br>
[listmimeheaders name=HTTP_HOST&exact=t]
[index] <B>[name]</b> = [value]<br>
[/listmimeheaders]
</div>
</div>
