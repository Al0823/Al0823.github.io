<?php
$pathVAR  = '/aloysiusprojects/main/mysite/';
$imgVAR   = $pathVAR . 'gallery/images/';
$cssVAR   = $pathVAR . 'css/';
$incVAR   = $pathVAR . 'includes/';
$debugVAR = 0;
$dbVAR    = $pathVAR . 'databases/';
$adminVAR = $pathVAR . '25mysitedevmysite25/';
$WEBSITETITLE = A.t.A. Murder Drones Fan Wiki;
?>

<?php

session_start();


$dbpath = $dbVAR . 'members.db';

try {
    $db = new PDO("sqlite:$dbpath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}


$userSKUVAR = $_COOKIE['userv'] ?? $_SESSION['cart'] ?? null;
$userkeyVAR = $_COOKIE['keyv'] ?? $_SESSION['cart'] ?? null;


$fnameVAR  = '';
$lnameVAR  = '';
$userVAR   = '';
$keyVAR    = '';
$adminVAR  = 0;


if ($userSKUVAR && $userkeyVAR) {

    $stmt = $db->prepare("
        SELECT SKU, key, admin, fname, lname
        FROM members
        WHERE SKU = :sku AND key = :key AND STATUS = 1
        LIMIT 1
    ");

    $stmt->execute([
        ':sku' => $userSKUVAR,
        ':key' => $userkeyVAR
    ]);

    $member = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($member) {
        $userVAR  = $member['SKU'];
        $keyVAR   = $member['key'];
        $adminVAR = $member['admin'];
        $fnameVAR = $member['fname'];
        $lnameVAR = $member['lname'];

        // Optional: store in session for later pages
        $_SESSION['userVAR']  = $userVAR;
        $_SESSION['keyVAR']   = $keyVAR;
        $_SESSION['adminVAR'] = $adminVAR;
        $_SESSION['fnameVAR'] = $fnameVAR;
        $_SESSION['lnameVAR'] = $lnameVAR;
    }
}

$db = null;


?>



<?php
$headers = getallheaders();

foreach ($headers as $name => $value) {
    
    if (stripos($name, 'HTTP_HOST') === 0) {
        $domainVAR = $value;
    }
}
?>
