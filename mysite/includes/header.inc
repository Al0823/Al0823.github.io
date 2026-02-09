<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title><?php echo $WEBSITETITLE; ?> - <?php echo $PAGETITLE; ?></title>

	<div class="header">
		Murder Drones Fan Website<br>
		<?php if ($debugVAR == 1) { echo 'DEBUG ON'; } ?>
	</div>

	<link rel="stylesheet" href="<?php echo $pathVAR; ?>css/style.css?v=<?php echo time(); ?>">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
