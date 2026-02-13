

<!DOCTYPE html>
<html>
[text]websitetitle=Aimee Mohr Photography[/text]
<meta charset="utf-8">
<head>
<title>[websitetitle] - [pagetitle]</title>
<div class="header"><img class="header_image" src="[imgVAR]amplogo.jpeg" alt="Uh oh broken"></div>
<br>
[showif [debugVAR]=1] DEBUG ON [/showif] 
</div>
 <style>
[include file=[cssVAR]style.css]

</style>
[text]dateone=12/25/[/text]
[text]currentyear=[date %Y][/text]
[text]checkyear=[date %Y][/text]
[text]datecheck=[dateone][checkyear][/text]
[text]dnumvar=[format days_to_date %w][math]{[datecheck]}[/math][/format][/text]
[text]dnowvar=[format days_to_date %A][math]{[datecheck]}[/math][/format][/text] [text]startdate=[format days_to_date][math]{[datecheck]}-[dnumvar][/math][/format][/text]
[text]enddate=[format days_to_date][math]6 - [dnumvar] + {[datecheck]}[/math][/format][/text]

[text]myholiday=Christmas[/text]
[include file=[incVAR]datecheck.inc&dateone=12/25/&checkyear=[date %Y]&holiday=[myholiday]]
[showif [holiday]=[myholiday]]
  [showif [dconfirm]=YES]
<style>
[include file=[cssVAR]christmas.css]

</style>
  [/showif]
[/showif][!]
[text]dateone=02/14/[/text]
[text]myholiday=Valentine's Day[/text]
[include file=[incVAR]datecheck.inc&dateone=2/14/&checkyear=[date %Y]&holiday=[myholiday]]
[showif [holiday]=[myholiday]]
  [showif [dconfirm]=YES]
  <style>
[include file=[cssVAR]valentines.css]

</style>
  [/showif]
[/showif][/!]
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>






