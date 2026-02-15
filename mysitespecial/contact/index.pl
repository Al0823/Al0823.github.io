#!/usr/bin/perl
use strict;
use warnings;
use CGI qw(:standard);
use CGI::Carp qw(fatalsToBrowser);

# Path to includes and images
my $incVAR = "../includes/";
my $imgVAR = "../gallery/images/";

print header(-type => 'text/html', -charset => 'UTF-8');

# Include 90s-style header and navbar
sub include_file {
    my ($file) = @_;
    if (-e $file) {
        open my $fh, '<', $file or die "Cannot open $file: $!";
        while (<$fh>) { print; }
        close $fh;
    }
}
include_file($incVAR . "header.inc");
include_file($incVAR . "navbar.inc");

print start_html(-title => "Contact Page");

print <<'END_HTML';

<table width="100%" cellspacing="10" cellpadding="10">
<tr>
  <!-- LEFT INFO COLUMN -->
  <td width="20%" valign="top" bgcolor="#808080" style="border:3px solid #000000;">
    <font size="5">
    This is my Contact page, the purpose of this page is to allow users to contact me, the creator of the website.
    </font>
  </td>

  <!-- CENTER FORM COLUMN -->
  <td width="60%" valign="top" bgcolor="#C0C0C0" style="border:3px solid #000000;">
    <center><font size="6"><b>Contact Form</b></font></center><br>

    <form action="thankyou.pl" method="post">

      <fieldset style="border-color: black;">
        <legend>Name</legend>
        First name:<br>
        <input type="text" name="fname" style="width:400px; height:25px;" required><br><br>
        Last name:<br>
        <input type="text" name="lname" style="width:400px; height:25px;" required>
      </fieldset>
      <br>

      <fieldset style="border-color: black;">
        <legend>Contact Information</legend>
        Email:<br>
        <input type="text" name="Email" style="width:400px; height:25px;"><br><br>
        Address:<br>
        <input type="text" name="address" style="width:400px; height:25px;"><br><br>
        State:<br>
        <input type="text" name="state" style="width:400px; height:25px;"><br><br>
        Phone:<br>
        <input type="text" name="Phone" style="width:400px; height:25px;">
      </fieldset>
      <br>

      <fieldset style="border-color: black;">
        <legend>Comments</legend>
        Reason:<br>
        <select name="Reason" required>
          <option value="">Select One</option>
          <option>Report Bug</option>
          <option>Questions</option>
          <option>Suggestions</option>
          <option>Other</option>
        </select><br><br>
        Comment:<br>
        <textarea name="comment" rows="8" cols="50" placeholder="Write your comment here"></textarea>
      </fieldset>
      <br>

      <input type="hidden" name="UserIP" value="<%= $ENV{'REMOTE_ADDR'} %>">

      <input type="submit" value="Submit" style="width:100px; height:30px;">
    </form>
  </td>

  <!-- RIGHT IMAGE COLUMN -->
  <td width="20%" valign="top" bgcolor="#808080" style="border:3px solid #000000; text-align:center;">
    <img src="../images/contact.png" width="180" alt="Contact Image"><br>
    <font size="2">Contact Image</font>
  </td>
</tr>
</table>

END_HTML

# Include 90s-style footer
include_file($incVAR . "footer.inc");
include_file($incVAR . "debug.inc") if $ENV{'DEBUG'};
