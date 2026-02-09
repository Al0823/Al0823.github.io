<?php

if (strpos($_SERVER['REQUEST_URI'], '25admin25') !== false):
    $currentURL = $_SERVER['REQUEST_URI'];

    
    function activeNav($target) {
        global $currentURL;
        return ($currentURL === $target) ? 'activenav' : '';
    }
?>
    <div class="navbar">
        <a class="<?= activeNav($adminVAR . 'index.html'); ?>" 
           href="<?= $adminVAR; ?>index.html">Admin Homepage</a>

        <a class="<?= activeNav($adminVAR . 'country/index.html'); ?>" 
           href="<?= $adminVAR; ?>country/index.html">Country</a>

<a class="<?= activeNav($adminVAR . 'state/index.html'); ?>" 
           href="<?= $adminVAR; ?>state/index.html">State</a>
    </div>
<?php endif; ?>
