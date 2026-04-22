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
      "<p>围绕漏洞原理、题目复盘和学习笔记持续更新。站点配置已经整理到根目录，样式与友链也都调整成了更方便后续维护的结构。</p>" +
      '<div class="showcase-actions">' +
      '<a class="primary" href="' +
      joinPath(root, "archives/") +
      '">浏览归档</a>' +
      '<a class="secondary" href="' +
      joinPath(root, "links/") +
      '">填写友链</a>' +
      "</div>" +
      "</div>" +
      '<div class="showcase-grid">' +
      '<a class="showcase-card" href="' +
      joinPath(root, "archives/") +
      '">' +
      '<i class="fa-solid fa-timeline"></i>' +
      "<h3>Writeup 时间线</h3>" +
      "<p>按时间集中浏览所有文章，适合快速回看比赛复盘、学习笔记和最近更新。</p>" +
      "</a>" +
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
      "</div>";

    const announcement = container.querySelector(".website-announcement");
    if (announcement && announcement.nextSibling) {
      container.insertBefore(section, announcement.nextSibling);
    } else {
      container.insertBefore(section, container.firstChild);
    }
  }

  function init() {
    initHomeShowcase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  document.addEventListener("pjax:complete", init);
})();
