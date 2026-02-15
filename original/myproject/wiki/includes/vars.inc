
[text]PATHVAR=/citi/coding/2026/2/ak/myproject/wiki/[/text]
[text]INCVAR=[PATHVAR]includes/[/text]
[text]DEVPATHVAR=/citi/coding/2026/2/ak/myproject/wikiinfo/[/text]
[text]DBVAR=[PATHVAR]databases/[/text]
[text]CSSVAR=/citi/coding/2026/2/ak/css/[/text]
[text]IMGVAR=[PATHVAR]images/[/text]
[text]wikiadminVAR=[pathVAR]26wiki26/[/text]
[text]CONTENTVAR=[pathvar]content/pages/[/text]
[text]DEBUGVAR=1[/text]
[text]WEBSITETITLE=A.t.A. Tech Wiki[/text]


[!]BEGIN LOGIN CODE[/!]

[text]userSKUVAR=[getcookie name=userv][/text]
[text]userkeyVAR=[getcookie name=keyv][/text]

[showif [userSKUVAR]=][text]userSKUVAR=[cart][/text][/showif]
[showif [userkeyVAR]=][text]userkeyVAR=[cart][/text][/showif]

[text]fnameVAR=[/text]
[text]lnameVAR=[/text]
[text]userVAR=[/text]
[text]keyVAR=[/text]
[text]adminVAR=0[/text]

[search db=[dbVAR]members.db&eqSKUdatarq=[userSKUVAR]&eqkeydatarq=[userkeyVAR]&eqSTATUSdatarq=1]
[founditems]
[text]userVAR=[SKU][/text]
[text]keyVAR=[key][/text]
[text]adminVAR=[admin][/text]
[text]fnameVAR=[fname][/text]
[text]lnameVAR=[lname][/text]
[/founditems]
[/search]

[!]END LOGIN CODE[/!]

[listMimeHeaders]
[showif [name]^HTTP_HOST]
[text]domainVAR=[value][/text]
[/showif]
[/listMimeHeaders]


