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

  function initSiteDynamicBackground() {
    if (!document.body || document.querySelector(".site-dynamic-bg")) return;

    const layer = document.createElement("div");
    layer.className = "site-dynamic-bg";
    layer.setAttribute("aria-hidden", "true");

    const packets = [
      { x: 8, delay: -2, dur: 16, size: 2, height: 110, opacity: 0.38 },
      { x: 16, delay: -9, dur: 21, size: 3, height: 150, opacity: 0.24 },
      { x: 28, delay: -4, dur: 18, size: 2, height: 96, opacity: 0.32 },
      { x: 41, delay: -12, dur: 24, size: 2, height: 132, opacity: 0.2 },
      { x: 54, delay: -6, dur: 17, size: 3, height: 126, opacity: 0.34 },
      { x: 67, delay: -15, dur: 20, size: 2, height: 102, opacity: 0.26 },
      { x: 78, delay: -7, dur: 23, size: 3, height: 158, opacity: 0.22 },
      { x: 88, delay: -11, dur: 19, size: 2, height: 118, opacity: 0.3 }
    ];

    const runes = [
      { text: "GET /index.php?debug=1", top: 18, left: 10, delay: -2, dur: 18 },
      { text: "UNION SELECT flag FROM secrets", top: 34, left: 58, delay: -7, dur: 22 },
      { text: "Burp Proxy :: Repeater :: Intruder", top: 68, left: 18, delay: -11, dur: 20 },
      { text: "cat /flag && echo pwned", top: 78, left: 62, delay: -5, dur: 24 }
    ];

    layer.innerHTML =
      '<div class="bg-noise"></div>' +
      '<div class="bg-beam beam-a"></div>' +
      '<div class="bg-beam beam-b"></div>' +
      '<div class="bg-beam beam-c"></div>' +
      '<div class="bg-scanline"></div>' +
      '<div class="bg-packets"></div>' +
      '<div class="bg-runes"></div>';

    const packetWrap = layer.querySelector(".bg-packets");
    packets.forEach((packet) => {
      const item = document.createElement("span");
      item.className = "packet";
      item.style.setProperty("--x", String(packet.x));
      item.style.setProperty("--delay", packet.delay + "s");
      item.style.setProperty("--dur", packet.dur + "s");
      item.style.setProperty("--size", packet.size + "px");
      item.style.setProperty("--height", packet.height + "px");
      item.style.setProperty("--opacity", String(packet.opacity));
      packetWrap.appendChild(item);
    });

    const runeWrap = layer.querySelector(".bg-runes");
    runes.forEach((rune) => {
      const item = document.createElement("span");
      item.className = "rune";
      item.textContent = rune.text;
      item.style.setProperty("--top", rune.top + "%");
      item.style.setProperty("--left", rune.left + "%");
      item.style.setProperty("--delay", rune.delay + "s");
      item.style.setProperty("--dur", rune.dur + "s");
      runeWrap.appendChild(item);
    });

    document.body.insertBefore(layer, document.body.firstChild);
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
    footer.classList.add("single-item");

    const root = (window.KEEP && KEEP.theme_config && KEEP.theme_config.root) || "/";
    const themeConfig = (window.KEEP && KEEP.theme_config) || {};
    const currentYear = new Date().getFullYear();
    const since = themeConfig.footer && themeConfig.footer.since;
    const siteTitle =
      (themeConfig.base_info && themeConfig.base_info.title) || "HSJCHA LAB";

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
        " by</span>" +
        '<a class="footer-site-link" href="' +
        normalizePath(root) +
        '">' +
        siteTitle +
        "</a>" +
        "</span>";
    }

    const themeInfo = footer.querySelector(".theme-info");
    if (themeInfo) {
      themeInfo.remove();
    }

    const countInfo = footer.querySelector(".count-info");
    if (countInfo) {
      countInfo.remove();
    }
  }

  function init() {
    initSiteDynamicBackground();
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
