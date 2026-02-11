
<style>
.flex-container {
display: flex;
flex-wrap: nowrap;
background-color: rgb(0, 0, 0);
color: rgb(255,255,0);
} 
.flex {
background-color: rgb(0, 0, 0);
width: 45%;
margin: 10px;
color: rgb(255,255,0);
}

.DEBUG {
background-color: rgb(0, 0, 0);
color: rgb(255,255,0);
}
</style>

<div class="DEBUG"><h1>Debug Variables</h1></div>
<div class="flex-container">
	<div class="flex"> LISTVARIABLES
	<br>
	[listvariables]
  [index], <B>[name]</b> = [value]<br>
[/listvariables]

	</div>
	<div class="flex"> FORMVARIABLES<br>
	[formvariables]
  [index], <B>[name]</b> = [value]<br>
[/formvariables]
	</div>
</div>


<div class="flex-container">
	<div class="flex"> LISTCOOKIES<br>
	[listcookies]
[index] <B>[name]</b>= [value]<br>
[/listcookies]
	</div>  
	<div class="flex"> listmimeheaders<br>
	[listmimeheaders name=HTTP_HOST&exact=t]
  [index] <B>[name]</b>= [value]<br>
[/listmimeheaders]
	</div>
</div>
<pre>
</pre>