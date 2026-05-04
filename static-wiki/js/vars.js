/*
window.vars = {

INCVAR: "/static-wiki/includes/",
DBVAR: "/static-wiki/data/",
JSVAR: "/static-wiki/js/",
CSSVAR: "/css/",
IMGVAR: "/static-wiki/images/",
wikiadminVAR: "/static-wiki/26wiki26/",
CONTENTVAR: "/static-wiki/content/pages/",
DEBUGVAR: 1,
WEBSITETITLE: "A.t.A. Tech Wiki"
};
*/
window.vars = (function() {

  var PATHVAR = "/static-wiki/";

  return {
    PATHVAR: PATHVAR,

  CSSVAR: PATHVAR + "css/",

    INCVAR: PATHVAR + "includes/",


    DBVAR: PATHVAR + "data/",


    JSVAR: PATHVAR + "js/",
    
    UTILVAR: PATHVAR + "utils/",

    wikiadminVAR: PATHVAR + "26admin16/",

APIVAR: "https://wiki-worker.akonyswoodard.workers.dev"

    DEBUGVAR: true,
    WEBSITETITLE: "A.t.A. Tech Wiki",
  };

})();