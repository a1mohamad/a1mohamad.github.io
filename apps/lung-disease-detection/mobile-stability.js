/*
  Lung Disease Detection — compact mobile tab dock
  Load after app.js, near the end of <body>.
*/
(function () {
  "use strict";

  var mobileQuery = window.matchMedia("(max-width: 700px)");
  var dock = null;
  var sourceTabs = null;
  var lastPath = "";
  var scheduled = false;

  var tabDefinitions = [
    { suffix: "/app", label: "App" },
    { suffix: "/docs/architecture", label: "Arch" },
    { suffix: "/docs/dataset", label: "Dataset" },
    { suffix: "/docs/training", label: "Training" },
    { suffix: "/docs/integration", label: "API" }
  ];

  function normalizePath(path) {
    return (path || "/")
      .replace(/\/index\.html$/, "")
      .replace(/\/+$/, "") || "/";
  }

  function projectBase() {
    return "/apps/lung-disease-detection";
  }

  function currentRoute() {
    var path = normalizePath(window.location.pathname);
    var base = projectBase();
    var index = path.indexOf(base);
    return index >= 0 ? path.slice(index + base.length) || "/" : path;
  }

  function findSourceTabs() {
    if (document.body.classList.contains("lung-route-landing")) {
      return document.querySelector(".lung-landing-tabs");
    }

    return document.querySelector(
      ".top-ribbon .header-actions > .hidden-mobile"
    );
  }

  function makeHref(suffix) {
    return projectBase() + suffix;
  }

  function activeSuffix() {
    var route = currentRoute();
    if (route === "/" || route === "") return "";
    return route;
  }

  function buildDock() {
    if (!dock) {
      dock = document.createElement("nav");
      dock.className = "lung-mobile-tab-dock";
      dock.setAttribute("aria-label", "Sticky project navigation");

      tabDefinitions.forEach(function (tab) {
        var link = document.createElement("a");
        link.href = makeHref(tab.suffix);
        link.textContent = tab.label;
        link.dataset.routeSuffix = tab.suffix;
        dock.appendChild(link);
      });

      document.body.appendChild(dock);
    }

    var active = activeSuffix();
    dock.querySelectorAll("a").forEach(function (link) {
      var suffix = link.dataset.routeSuffix;
      var selected =
        active === suffix ||
        (suffix !== "/app" && active.indexOf(suffix) === 0);

      link.classList.toggle("is-active", selected);
      if (selected) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateDock() {
    scheduled = false;

    if (!mobileQuery.matches) {
      if (dock) dock.classList.remove("is-visible");
      return;
    }

    buildDock();

    var candidate = findSourceTabs();
    if (candidate) sourceTabs = candidate;

    if (!sourceTabs || !sourceTabs.isConnected) {
      dock.classList.remove("is-visible");
      return;
    }

    var rect = sourceTabs.getBoundingClientRect();

    /*
      Show the compact dock only after the original tabs have completely moved
      above the viewport. This keeps the full header visible at the page top.
    */
    dock.classList.toggle("is-visible", rect.bottom <= 0);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateDock);
  }

  function routeMayHaveChanged() {
    var path = window.location.pathname;
    if (path !== lastPath) {
      lastPath = path;
      sourceTabs = null;
      buildDock();
    }
    scheduleUpdate();
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("pageshow", routeMayHaveChanged);
  window.addEventListener("popstate", routeMayHaveChanged);

  document.addEventListener(
    "click",
    function (event) {
      if (event.target.closest("a")) {
        window.setTimeout(routeMayHaveChanged, 0);
        window.setTimeout(routeMayHaveChanged, 120);
      }
    },
    true
  );

  mobileQuery.addEventListener
    ? mobileQuery.addEventListener("change", routeMayHaveChanged)
    : mobileQuery.addListener(routeMayHaveChanged);

  if (window.MutationObserver) {
    new MutationObserver(routeMayHaveChanged).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener("DOMContentLoaded", routeMayHaveChanged);
  routeMayHaveChanged();
})();
