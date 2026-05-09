(function () {
  const WAIFU_MODEL_OPTIONS = [
    { value: "0", label: "Haru" },
    { value: "1", label: "Hijiki" },
    { value: "2", label: "Shizuku" },
  ];

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

  function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
      let tag = null;

      if (type === "css") {
        tag = document.createElement("link");
        tag.rel = "stylesheet";
        tag.href = url;
      } else if (type === "js") {
        tag = document.createElement("script");
        tag.type = "module";
        tag.src = url;
      }

      if (!tag) {
        reject(new Error("Unsupported resource type"));
        return;
      }

      tag.onload = () => resolve(url);
      tag.onerror = () => reject(new Error("Failed to load " + url));
      document.head.appendChild(tag);
    });
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
      "<h2>一个以内容为主的安全博客</h2>" +
      "<p>这里主要整理 CTF Web 题目复盘、漏洞原理、利用链理解和学习过程中的笔记，希望文章尽量写清楚思路，而不只留下结论。</p>" +
      '<div class="showcase-actions">' +
      '<a class="primary" href="' +
      joinPath(root, "archives/") +
      '">查看归档</a>' +
      '<a class="secondary" href="' +
      joinPath(root, "about/") +
      '">关于本站</a>' +
      "</div>" +
      "</div>" +
      '<div class="showcase-grid">' +
      '<a class="showcase-card" href="' +
      joinPath(root, "archives/") +
      '">' +
      '<i class="fa-solid fa-timeline"></i>' +
      "<h3>按时间浏览</h3>" +
      "<p>适合快速查看最近更新，也方便回顾不同阶段的 Writeup、笔记和练习记录。</p>" +
      "</a>" +
      '<a class="showcase-card" href="' +
      joinPath(root, "about/") +
      '">' +
      '<i class="fa-solid fa-user-secret"></i>' +
      "<h3>关于本站</h3>" +
      "<p>快速了解这个博客主要会写什么、现在在学什么，以及我想把内容整理成什么样子。</p>" +
      "</a>" +
      '<a class="showcase-card" href="' +
      joinPath(root, "links/") +
      '">' +
      '<i class="fa-solid fa-link"></i>' +
      "<h3>友链入口</h3>" +
      "<p>这里放平时会关注的一些安全同好与技术站点，后面内容多了也可以继续慢慢补充。</p>" +
      "</a>" +
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

  async function initLive2DWaifu() {
    if (
      document.getElementById("waifu") ||
      document.getElementById("waifu-toggle") ||
      document.documentElement.dataset.live2dReady === "true"
    ) {
      return true;
    }

    if (window.innerWidth < 860) {
      return false;
    }

    const root = (window.KEEP && KEEP.theme_config && KEEP.theme_config.root) || "/";
    const live2dBase = joinPath(root, "live2d/vendor/");
    const waifuPath = joinPath(root, "live2d/waifu-tips.json");
    const hostname = window.location.hostname;
    const isLocalPreview =
      hostname === "localhost" || hostname === "127.0.0.1";

    try {
      if (isLocalPreview) {
        window.localStorage.removeItem("waifu-display");
      }

      if (typeof window.initWidget !== "function") {
        await Promise.all([
          loadExternalResource(live2dBase + "waifu.css", "css"),
          loadExternalResource(live2dBase + "waifu-tips.js", "js"),
        ]);
      }

      if (typeof window.initWidget !== "function") {
        return false;
      }

      window.initWidget({
        waifuPath: waifuPath,
        cubism2Path: live2dBase + "live2d.min.js",
        tools: ["photo"],
        logLevel: "error",
        drag: true,
      });

      await new Promise((resolve) => window.setTimeout(resolve, 1200));

      if (
        !document.getElementById("waifu") &&
        !document.getElementById("waifu-toggle")
      ) {
        return false;
      }

      document.documentElement.dataset.live2dReady = "true";
      return true;
    } catch (error) {
      console.warn("Live2D widget init failed:", error);
      return false;
    }
  }

  function initWaifuModelPicker() {
    if (window.innerWidth < 860) return;

    let picker = document.getElementById("waifu-model-picker");
    if (!picker) {
      picker = document.createElement("div");
      picker.id = "waifu-model-picker";
      picker.innerHTML =
        '<span class="waifu-model-picker-label">看板娘</span>' +
        '<div class="waifu-model-picker-buttons" role="tablist" aria-label="Select waifu model"></div>';
      document.body.appendChild(picker);
    }

    const buttonGroup = picker.querySelector(".waifu-model-picker-buttons");
    if (!buttonGroup) return;

    const currentModelId = window.localStorage.getItem("modelId");
    const normalizedValue = WAIFU_MODEL_OPTIONS.some(
      (item) => item.value === currentModelId
    )
      ? currentModelId
      : "0";

    if (!buttonGroup.children.length) {
      WAIFU_MODEL_OPTIONS.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "waifu-model-button";
        button.dataset.value = item.value;
        button.textContent = item.label;
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", "false");
        button.addEventListener("click", () => {
          if (item.value === normalizedValue) return;
          window.localStorage.setItem("modelId", item.value);
          window.localStorage.setItem("modelTexturesId", "0");
          picker.classList.add("is-switching");
          window.setTimeout(() => {
            window.location.reload();
          }, 120);
        });
        buttonGroup.appendChild(button);
      });
    }

    buttonGroup.querySelectorAll(".waifu-model-button").forEach((button) => {
      const isActive = button.dataset.value === normalizedValue;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function initWaifuDragFreedom() {
    const waifu = document.getElementById("waifu");
    const live2d = document.getElementById("live2d");
    if (!waifu || !live2d || waifu.dataset.dragFreedomBound === "true") return;

    waifu.dataset.dragFreedomBound = "true";

    live2d.addEventListener("mousedown", () => {
      const rect = waifu.getBoundingClientRect();
      waifu.style.left = rect.left + "px";
      waifu.style.top = rect.top + "px";
      waifu.style.right = "auto";
      waifu.style.bottom = "auto";
      waifu.classList.add("is-free-drag");
    });
  }

  function initLabPet() {
    if (document.querySelector(".lab-pet")) return;

    const messages = [
      "欢迎来到 HSJCHA LAB",
      "今天也来刷一点 Web 安全。",
      "记得边做题边记思路。",
      "写下过程，比只记答案更有用。 ",
    ];

    const pet = document.createElement("div");
    pet.className = "lab-pet";
    pet.innerHTML =
      '<button class="lab-pet-button" type="button" aria-label="Open lab pet">' +
      '<span class="lab-pet-halo"></span>' +
      '<span class="lab-pet-body"></span>' +
      '<span class="lab-pet-arm left"></span>' +
      '<span class="lab-pet-arm right"></span>' +
      '<span class="lab-pet-face">' +
      '<span class="lab-pet-hair"></span>' +
      '<span class="lab-pet-bang bang-a"></span>' +
      '<span class="lab-pet-bang bang-b"></span>' +
      '<span class="lab-pet-bang bang-c"></span>' +
      '<span class="lab-pet-ribbon left"></span>' +
      '<span class="lab-pet-ribbon right"></span>' +
      '<span class="lab-pet-eye left"></span>' +
      '<span class="lab-pet-eye right"></span>' +
      '<span class="lab-pet-blush left"></span>' +
      '<span class="lab-pet-blush right"></span>' +
      '<span class="lab-pet-mouth"></span>' +
      "</span>" +
      "</button>" +
      '<div class="lab-pet-bubble">欢迎来到 HSJCHA LAB</div>';

    document.body.appendChild(pet);

    const button = pet.querySelector(".lab-pet-button");
    const bubble = pet.querySelector(".lab-pet-bubble");
    let currentIndex = 0;
    let hideTimer = null;

    function showBubble(text, sticky) {
      if (text) bubble.textContent = text;
      pet.classList.add("is-awake");
      if (hideTimer) window.clearTimeout(hideTimer);
      if (!sticky) {
        hideTimer = window.setTimeout(() => {
          pet.classList.remove("is-awake");
        }, 3600);
      }
    }

    button.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % messages.length;
      showBubble(messages[currentIndex], false);
    });

    pet.addEventListener("mouseenter", () => {
      showBubble(messages[currentIndex], true);
    });

    pet.addEventListener("mouseleave", () => {
      pet.classList.remove("is-awake");
    });

    window.setTimeout(() => {
      showBubble(messages[0], false);
    }, 900);
  }

  async function init() {
    initHomeShowcase();
    initFooterRefine();
    const live2dReady = await initLive2DWaifu();
    if (!live2dReady) {
      const picker = document.getElementById("waifu-model-picker");
      if (picker) picker.remove();
      initLabPet();
      return;
    }
    initWaifuModelPicker();
    initWaifuDragFreedom();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
    }, { once: true });
  } else {
    init();
  }

  document.addEventListener("pjax:complete", () => {
    init();
  });
})();
