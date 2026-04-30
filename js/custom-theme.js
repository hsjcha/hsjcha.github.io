(function () {
  function normalizePath(value) {
    if (!value) return "/";
    let result = value.replace(/index\.html$/, "");
    if (!result.startsWith("/")) result = "/" + result;
    if (!result.endsWith("/")) result += "/";
    return result;
  }

  function joinPath(root, path) {
    const safeRoot = normalizePath(root).replace(/\/$/, "");
    const safePath = String(path || "").replace(/^\//, "");
    return (safeRoot ? safeRoot : "") + "/" + safePath;
  }

  function initHomeShowcase() {
    const container = document.querySelector(".home-content-container");
    if (!container || container.querySelector(".home-showcase")) return;

    const root = (window.KEEP && KEEP.theme_config && KEEP.theme_config.root) || "/";
    const currentPath = normalizePath(window.location.pathname);
    if (currentPath !== normalizePath(root)) return;

    const section = document.createElement("section");
    section.className = "home-showcase border-box";
    section.innerHTML =
      '<div class="showcase-intro">' +
      '<span class="eyebrow">HSJCHA LAB</span>' +
      "<h2>CTF Web 与安全研究的实验场</h2>" +
      "<p>围绕漏洞原理、题目复盘和学习笔记持续更新。</p>" +

      /*
      '<div class="showcase-actions">' +
      '<a class="primary" href="' +
      joinPath(root, "archives/") +
      '">浏览归档</a>' +
      '<a class="secondary" href="' +
      joinPath(root, "links/") +
      '">填写友链</a>' +
      "</div>" +

      */
      "</div>" +
      '<div class="showcase-grid">' +
      '<a class="showcase-card" href="' +
      joinPath(root, "archives/") +
      '">' +
      '<i class="fa-solid fa-timeline"></i>' +
      "<h3>Writeup 时间线</h3>" +
      "<p>按时间集中浏览所有文章，适合快速回看比赛复盘、学习笔记和最近更新。</p>" +
      "</a>" +

      /*
      '<a class="showcase-card" href="' +
      joinPath(root, "about/") +
      '">' +
      '<i class="fa-solid fa-shield-halved"></i>' +
      "<h3>研究方向</h3>" +
      "<p>补了一页更完整的站点说明，后续你可以继续扩展成个人介绍或学习路线页。</p>" +
      "</a>" +
      '<a class="showcase-card" href="' +
      joinPath(root, "links/") +
      '">' +
      '<i class="fa-solid fa-link"></i>' +
      "<h3>友链入口</h3>" +
      "<p>友链数据已经独立成文件，后续只改 source/_data/links.yml 就可以直接生效。</p>" +
      "</a>" +

      */

      "</div>";

    const announcement = container.querySelector(".website-announcement");
    if (announcement && announcement.nextSibling) {
      container.insertBefore(section, announcement.nextSibling);
    } else {
      container.insertBefore(section, container.firstChild);
    }
  }

  function initFooterRefine() {
    const footer = document.querySelector(".footer");
    if (!footer || footer.dataset.refined === "true") return;

    footer.dataset.refined = "true";
    footer.classList.add("is-refined");

    const root = (window.KEEP && KEEP.theme_config && KEEP.theme_config.root) || "/";
    const themeConfig = (window.KEEP && KEEP.theme_config) || {};
    const currentYear = new Date().getFullYear();
    const since = themeConfig.footer && themeConfig.footer.since;
    const siteTitle =
      (themeConfig.base_info && themeConfig.base_info.title) || "HSJCHA LAB";
    const themeVersion = themeConfig.version
      ? "Keep v" + themeConfig.version
      : "Keep";

    const copyrightInfo = footer.querySelector(".copyright-info");
    if (copyrightInfo) {
      const yearText =
        since && String(since) !== String(currentYear)
          ? String(since) + " - " + String(currentYear)
          : String(currentYear);

      copyrightInfo.innerHTML =
        '<span class="footer-label">Site</span>' +
        '<span class="footer-value">' +
        '<span class="footer-strong">© ' +
        yearText +
        "</span>" +
        '<a href="' +
        normalizePath(root) +
        '">' +
        siteTitle +
        "</a>" +
        "</span>";
    }

    const themeInfo = footer.querySelector(".theme-info");
    if (themeInfo) {
      themeInfo.innerHTML =
        '<span class="footer-label">Stack</span>' +
        '<span class="footer-value">' +
        '<a target="_blank" rel="noopener noreferrer" href="https://hexo.io">Hexo</a>' +
        '<span class="footer-separator"></span>' +
        '<a target="_blank" rel="noopener noreferrer" href="https://github.com/XPoet/hexo-theme-keep">' +
        themeVersion +
        "</a>" +
        "</span>";
    }

    const countInfo = footer.querySelector(".count-info");
    if (countInfo) {
      const items = Array.from(countInfo.querySelectorAll(".count-item"))
        .map((item) => item.outerHTML)
        .join("");

      countInfo.innerHTML =
        '<span class="footer-label">Stats</span>' +
        '<div class="footer-value footer-metrics">' +
        items +
        "</div>";
    }
  }

  function init() {
    initHomeShowcase();
    initFooterRefine();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  document.addEventListener("pjax:complete", init);
})();
