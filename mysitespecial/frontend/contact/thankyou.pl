#!/usr/bin/perl
use strict;
use warnings;
use CGI qw(:standard);

# -------------------------
# INCLUDE SITE VARIABLES
# -------------------------
do "../includes/vars.inc" or die "Cannot load vars.inc: $!";

# -------------------------
# PAGE TITLE
# -------------------------
my $PAGETITLE = "Contact Page - Thank You";

# -------------------------
# OUTPUT HEADER
# -------------------------
do $incVAR . "header.inc" or die "Cannot load header.inc: $!"; 
do $incVAR . "navbar.inc" or die "Cannot load navbar.inc: $!"; 

# -------------------------
# PROCESS FORM DATA
# -------------------------
my $to      = 'akonysmerrill@citiboces.net';
my $from    = 'amccombie@citiboces.org';
my $subject = 'Murder Drones Feedback Contact';

my $date = localtime();
my $ip   = $ENV{'REMOTE_ADDR'} || 'Unknown';

# Collect POST parameters
my %form = map { $_ => param($_) } param();

# -------------------------
# EMAIL MESSAGE
# -------------------------
my $message = "Form submitted on $date\n\n";
$message .= "Name: $form{fname} $form{lname}\n";
$message .= "Phone: $form{Phone}\n";
$message .= "Email: $form{Email}\n";
$message .= "Address: $form{address}\n";
$message .= "Reason: $form{Reason}\n";
$message .= "Comment: $form{comment}\n";
$message .= "IP: $ip\n";

# Send email
open(MAIL, "| /usr/sbin/sendmail -t") or die "Cannot send email: $!";
print MAIL "To: $to\n";
print MAIL "From: $from\n";
print MAIL "Subject: $subject\n\n";
print MAIL $message;
close(MAIL);

# -------------------------
# OUTPUT PAGE BODY
# -------------------------
print start_html(-title=>$PAGETITLE);

print qq(
<table width="100%" cellspacing="10" cellpadding="10">
<tr>

  <!-- LEFT COLUMN -->
  <td width="20%" valign="top" bgcolor="#808080" style="border:3px solid #000000;">
    <font size="5"><b>YIPPEE!</b></font><br><br>
    <font size="3">Thank you for submitting the form. We will get back to you soon!</font>
  </td>

  <!-- CENTER COLUMN -->
  <td width="60%" valign="top" bgcolor="#C0C0C0" style="border:3px solid #000000; text-align:center;">
    <font size="6"><b>Form Submitted Successfully</b></font><br><br>
    <a href="../index.pl" style="color:#B026FF; font-weight:bold;">&lt;&lt; Back to Homepage</a>
  </td>

  <!-- RIGHT COLUMN -->
  <td width="20%" valign="top" bgcolor="#808080" style="border:3px solid #000000; text-align:center;">
    <img src="$imgVAR" . "thank_you.png" width="200" alt="Thank You"><br>
    <font size="2">Thank You!</font>
  </td>

</tr>
</table>
);

# -------------------------
# FOOTER & DEBUG
# -------------------------
do $incVAR . "footer.inc" or die "Cannot load footer.inc: $!"; 
do $incVAR . "debug.inc" if $debugVAR == 1;
