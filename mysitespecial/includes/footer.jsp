<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>

<%
    // Create a date object
    Date now = new Date();
    // Format date like: "Friday, February 14, 2026 - 10:45 PM"
    SimpleDateFormat sdf = new SimpleDateFormat("EEEE, MMMM dd, yyyy - h:mm a");
    String currentDate = sdf.format(now);
%>

<table width="100%" bgcolor="#000000">
<tr>
  <td align="center">
    <font color="#FFFF00" size="3">
      &copy; A.t.A. Tech Wiki, <%= currentDate %>
    </font>
  </td>
</tr>
</table>
