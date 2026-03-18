// ../includes/vars.js
window.vars = (function() {
  var PATHVAR = "/myproject/";

  return {
    PATHVAR: PATHVAR,                  // base path
    INCVAR: PATHVAR + "includes/",     // includes folder
    DBVAR: PATHVAR + "data/",          // data folder
    CSSVAR: "/css/",                    // CSS folder (optional, outside project folder)
    IMGVAR: PATHVAR + "images/",       // images folder
    PAGEVAR: PATHVAR + "pages/",       // pages folder
    JSVAR: PATHVAR + "js/",            // JS folder

    DEBUGVAR: false,                   // debug mode

    WEBSITETITLE: "A.t.A. Tech Wiki"  // site-wide title
  };
})();