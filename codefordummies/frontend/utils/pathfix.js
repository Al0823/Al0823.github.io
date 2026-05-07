(function () {

  const NEW_BASE =
    "https://al0823.github.io/codefordummies/frontend/utils/";

  function getFileName(path) {

    try {

      // Remove query strings and hashes
      path = path.split("?")[0].split("#")[0];

      return path.substring(path.lastIndexOf("/") + 1);

    } catch (e) {

      return null;

    }
  }

  function shouldFix(src) {

    if (!src) return false;

    // Ignore already-correct paths
    if (src.startsWith(NEW_BASE)) {
      return false;
    }

    // Only rewrite JS files
    return src.endsWith(".js");
  }

  function fixScripts() {

    const scripts =
      document.querySelectorAll("script[src]");

    scripts.forEach(oldScript => {

      const oldSrc =
        oldScript.getAttribute("src");

      if (!shouldFix(oldSrc)) {
        return;
      }

      const fileName =
        getFileName(oldSrc);

      if (!fileName) {
        return;
      }

      const newSrc =
        NEW_BASE + fileName;

      console.log(
        "[PathFix]",
        oldSrc,
        "->",
        newSrc
      );

      const newScript =
        document.createElement("script");

      // Copy all attributes
      Array.from(oldScript.attributes)
        .forEach(attr => {

          if (attr.name !== "src") {

            newScript.setAttribute(
              attr.name,
              attr.value
            );

          }

        });

      newScript.src = newSrc;

      oldScript.parentNode.replaceChild(
        newScript,
        oldScript
      );

    });

  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      fixScripts
    );

  } else {

    fixScripts();

  }

})();