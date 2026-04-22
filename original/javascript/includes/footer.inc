

<footer>
Copyright [date %A, %B %d, %Y] - [time %l:%M %p]
</footer>
[showif [debugVAR]=1]
[include file=[incVAR]debug.inc]
[/showif]
</body>

[closedatabase db=[DBVAR]pages.db]
[closedatabase db=[CSSVAR]colors.db]
</html>