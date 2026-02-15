<%@ page import="java.util.*" %>
<%
    // Create a Date object
    Date now = new Date();
    
    // Format date in classic 90s style
    String[] days = {"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};
    String[] months = {"January","February","March","April","May","June","July","August","September","October","November","December"};

    Calendar cal = Calendar.getInstance();
    cal.setTime(now);

    String dayName = days[cal.get(Calendar.DAY_OF_WEEK)-1];
    String monthName = months[cal.get(Calendar.MONTH)];
    int day = cal.get(Calendar.DAY_OF_MONTH);
    int year = cal.get(Calendar.YEAR);

    int hour = cal.get(Calendar.HOUR);
    if(hour==0) hour=12;
    int minute = cal.get(Calendar.MINUTE);
    String ampm = cal.get(Calendar.AM_PM)==0?"AM":"PM";

    String formattedDate = dayName + ", " + monthName + " " + day + ", " + year + " - " + hour + ":" + (minute<10?"0"+minute:minute) + " " + ampm;
%>


<font face="Times New Roman" color="#FFFF00" size="2">
    <blink>&copy; A.t.A. Tech Wiki, <%= formattedDate %></blink>
</font>
