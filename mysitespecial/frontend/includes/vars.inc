<?php

$pathVAR  = '/mysitespecial/';
$imgVAR   = $pathVAR . 'gallery/images/';
$cssVAR   = $pathVAR . 'css/';
$incVAR   = $pathVAR . 'includes/';
$debugVAR = 0;
$dbVAR    = $pathVAR . 'databases/';
$adminVAR = 0;
$WEBSITETITLE = "A.t.A. Murder Drones Fan Wiki";


$userVAR  = '';
$keyVAR   = '';
$fnameVAR = '';
$lnameVAR = '';
$adminVAR = 0;


$membersFile = $dbVAR . "members.txt";  // simple CSV file: SKU,key,admin,fname,lname,status

$userSKUVAR = isset($_COOKIE['userv']) ? $_COOKIE['userv'] : '';
$userkeyVAR = isset($_COOKIE['keyv'])  ? $_COOKIE['keyv']  : '';

if ($userSKUVAR && $userkeyVAR && file_exists($membersFile)) {
    $lines = file($membersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        list($sku, $key, $admin, $fname, $lname, $status) = explode(',', $line);
        if ($sku == $userSKUVAR && $key == $userkeyVAR && $status == 1) {
            $userVAR  = $sku;
            $keyVAR   = $key;
            $adminVAR = $admin;
            $fnameVAR = $fname;
            $lnameVAR = $lname;
            break;
        }
    }
}


$domainVAR = getenv("HTTP_HOST");
?>
