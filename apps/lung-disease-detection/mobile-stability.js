/*
  Lung Disease Detection — Mobile stability v3

  This script does NOT create navigation links.
  It only:
  - compresses the existing header after scrolling;
  - adds a route-specific body class for the API page;
  - leaves all original React/HTML link behavior untouched.
*/
(function () {
  "use strict";

  var mobileQuery = window.matchMedia("(max-width: 700px)");
  var compactAfter = 96;
  var framePending = false;
  var lastPath = "";

  function normalizedPath() {
    return (window.location.pathname || "/")
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "") || "/";
  }

  function syncRouteClass() {
    var path = normalizedPath();
    if (path === lastPath) return;

    lastPath = path;
    document.body.classList.toggle(
      "lung-route-integration",
      path.indexOf("/apps/lung-disease-detection/docs/integration") !== -1
    );
  }

  function updateMobileHeader() {
    framePending = false;
    syncRouteClass();

    if (!mobileQuery.matches) {
      document.body.classList.remove("lung-mobile-nav-compact");
      return;
    }

    document.body.classList.toggle(
      "lung-mobile-nav-compact",
      window.scrollY > compactAfter
    );
  }

  function requestUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateMobileHeader);
  }

  function delayedRouteUpdate() {
    requestUpdate();
    window.setTimeout(requestUpdate, 0);
    window.setTimeout(requestUpdate, 100);
    window.setTimeout(requestUpdate, 260);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("pageshow", delayedRouteUpdate);
  window.addEventListener("popstate", delayedRouteUpdate);

  document.addEventListener(
    "click",
    function (event) {
      if (event.target.closest("a")) {
        /*
          Do not prevent the click. The existing HTML/React link performs the
          navigation. We only resync classes after the route changes.
        */
        delayedRouteUpdate();
      }
    },
    true
  );

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", delayedRouteUpdate);
  } else {
    mobileQuery.addListener(delayedRouteUpdate);
  }

  if (window.MutationObserver) {
    new MutationObserver(function () {
      syncRouteClass();
    }).observe(document.getElementById("root") || document.body, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener("DOMContentLoaded", delayedRouteUpdate);
  delayedRouteUpdate();
})();
