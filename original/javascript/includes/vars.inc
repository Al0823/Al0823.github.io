[text]MACVAR=/citi/coding/javascript/databases/[/text]
[text]PATHVAR=/citi/coding/2026/2/ak/javascript/[/text]
[text]INCVAR=[PATHVAR]includes/[/text]
[text]DBVAR=[PATHVAR]dbs/[/text]
[text]CSSVAR=/citi/coding/2026/2/ak/css/[/text]
[text]IMGVAR=[PATHVAR]images/[/text]
[text]PAGEVAR=/citi/coding/2026/2/ak/javascript/pages/[/text]
[text]DEBUGVAR=1[/text]


[hideif [password]=EdKonys02]
[authenticate]
[/hideif]

[listMimeHeaders]
[showif [name]^HTTP_HOST]
[text]domainVAR=[value][/text]
[/showif]
[/listMimeHeaders]
