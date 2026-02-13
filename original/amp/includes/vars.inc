[text]pathVAR=/citi/coding/2025/ak/amp/[/text]
[text]imgVAR=[pathVAR]gallery/images/[/text]
[text]cssVAR=[pathVAR]css/[/text]
[text]incVAR=[pathVAR]includes/[/text]
[text]debugVAR=1[/text]
[text]dbVAR=[pathVAR]databases/[/text]
[text]adminVAR=[pathVAR]25admin25/[/text]
[text]amppathVAR=/citi/coding/ampassets/[/text]

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


