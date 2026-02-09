<style>
.flex-container {
    display: flex;
    flex-wrap: nowrap;
    background-color: rgb(0, 0, 0);
    color: rgb(255,255,0);
} 
.flex {
    background-color: rgb(0, 0, 0);
    width: 45%;
    margin: 10px;
    color: rgb(255,255,0);
}
.DEBUG {
    background-color: rgb(0, 0, 0);
    color: rgb(255,255,0);
}
</style>

<div class="DEBUG"><h1>Debug Variables</h1></div>

<div class="flex-container">
    <div class="flex">
        LISTVARIABLES<br>
        <?php 
        $allVars = get_defined_vars();
        $i = 0;
        foreach ($allVars as $name => $value) {
            echo $i . ', <b>' . htmlspecialchars($name) . '</b> = ' . htmlspecialchars(print_r($value,true)) . '<br>';
            $i++;
        }
        ?>
    </div>
    
    <div class="flex">
        FORMVARIABLES<br>
        <?php 
        $i = 0;
        foreach ($_POST as $name => $value) {
            echo $i . ', <b>' . htmlspecialchars($name) . '</b> = ' . htmlspecialchars(print_r($value,true)) . '<br>';
            $i++;
        }
        ?>
    </div>
</div>

<div class="flex-container">
    <div class="flex">
        LISTCOOKIES<br>
        <?php 
        $i = 0;
        foreach ($_COOKIE as $name => $value) {
            echo $i . ' <b>' . htmlspecialchars($name) . '</b> = ' . htmlspecialchars($value) . '<br>';
            $i++;
        }
        ?>
    </div>
    
    <div class="flex">
        LISTMIMEHEADERS<br>
        <?php 
        $i = 0;
        $headers = getallheaders();
        foreach ($headers as $name => $value) {
            echo $i . ' <b>' . htmlspecialchars($name) . '</b> = ' . htmlspecialchars($value) . '<br>';
            $i++;
        }
        ?>
    </div>
</div>

<pre></pre>

