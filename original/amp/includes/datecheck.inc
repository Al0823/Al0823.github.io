[text]holiday=[holiday][/text]
[text]currentyear=[date %Y][/text]
[text]datecheck=[dateone][checkyear][/text]
[text]dnumvar=[format days_to_date %w][math]{[datecheck]}[/math][/format][/text]
[text]dnowvar=[format days_to_date %A][math]{[datecheck]}[/math][/format][/text]
[text]startdate=[format days_to_date][math]{[datecheck]}-[dnumvar][/math][/format][/text]
[text]enddate=[format days_to_date][math]6 - [dnumvar] + {[datecheck]}[/math][/format][/text]


[if (([math]{[date]}[/math] > [math]{[startdate]} - 1[/math]) & ([math]{[date]}[/math] < [math]{[enddate]} + 1[/math]))]
[then][text]dconfirm=YES[/text][/then]
[else][text]dconfirm=NO[/text][/else][/if]