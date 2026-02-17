#!/usr/bin/perl
use strict;
use warnings;
use CGI qw(:standard);

# -------------------------
# LOAD SITE VARIABLES
# -------------------------
do "../includes/vars.inc" or die "Cannot load vars.inc: $!";

# -------------------------
# PAGE TITLE
# -------------------------
my $PAGETITLE = "Contact Page";

# -------------------------
# OUTPUT HEADER + NAV
# -------------------------
do $incVAR . "header.inc" or die "Cannot load header.inc";
do $incVAR . "navbar.inc" or die "Cannot load navbar.inc";

print header();
print start_html(-title => $PAGETITLE);

# -------------------------
# PAGE BODY
# -------------------------
print qq(
<table width="100%" cellspacing="10" cellpadding="10">
<tr>

  <!-- LEFT COLUMN -->
  <td width="20%" valign="top" bgcolor="#808080" style="border:3px solid #000000;">
    <font size="5"><b>Contact Me</b></font><br><br>
    <font size="3">
    This is the Contact page. Use this form to reach the creator of the website.
    </font>
  </td>

  <!-- CENTER FORM -->
  <td width="60%" valign="top" bgcolor="#C0C0C0" style="border:3px solid #000000;">
    <center><font size="6"><b>Contact Form</b></font></center><br>

    <form method="post" action="thankyou.pl">

    <b>Name</b><br><br>

    First Name:<br>
    <input type="text" name="fname" size="40"><br><br>

    Last Name:<br>
    <input type="text" name="lname" size="40"><br><br>

    <b>Contact Info</b><br><br>

    Email:<br>
    <input type="text" name="Email" size="40"><br><br>

    Phone:<br>
    <input type="text" name="Phone" size="20"><br><br>

    Address:<br>
    <input type="text" name="address" size="50"><br><br>

    <b>Reason</b><br>
    <select name="Reason">
      <option>Report Bug</option>
      <option>Questions</option>
      <option>Suggestions</option>
      <option>Other</option>
    </select><br><br>

    <b>Comment</b><br>
    <textarea name="comment" rows="6" cols="50"></textarea><br><br>

    <input type="submit" value="Submit Form">

    </form>
  </td>

  <!-- RIGHT IMAGE -->
  <td width="20%" valign="top" bgcolor="#808080" style="border:3px solid #000000; text-align:center;">
    <img src="../gallery/images/contact.png" width="200" alt="Contact"><br>
    <font size="2">Contact Page</font>
  </td>

</tr>
</table>
);

# -------------------------
# FOOTER + DEBUG
# -------------------------
do $incVAR . "footer.inc" or die "Cannot load footer.inc";
do $incVAR . "debug.inc" if $debugVAR == 1;
