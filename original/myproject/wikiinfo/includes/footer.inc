<footer>
Copyright [date %A, %B %d, %Y] - [time %l:%M %p]
</footer>
[showif [debugVAR]=1]
[include file=[incVAR]debug.inc]
[/showif]
</body>

[closedatabase db=[DBVAR]blog.db]
[closedatabase db=[DBVAR]gallery.db]
[closedatabase db=[DBVAR]members.db]
</html>