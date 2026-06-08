/* ============================================================
   โรงเรียนบัวใหญ่วิทยา — Interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme switching ---------- */
  var html = document.documentElement;
  var THEME_KEY = "bwy-theme";
  function setTheme(t) {
    if (t === "fresh") html.removeAttribute("data-theme");
    else html.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    document.querySelectorAll(".theme-switch button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.t === t);
    });
  }
  var saved = "fresh";
  try { saved = localStorage.getItem(THEME_KEY) || "fresh"; } catch (e) {}
  setTheme(saved);
  document.querySelectorAll(".theme-switch button").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.dataset.t); });
  });

  /* ---------- Navbar scroll state ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("scrolled", y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    // parallax
    parallaxTick(y);
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".nav-links");
  var overlay = document.querySelector(".nav-overlay");
  function closeMenu() {
    burger.classList.remove("open");
    links.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  function toggleMenu() {
    var open = burger.classList.toggle("open");
    links.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("show", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- Smooth anchor scroll with offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 58;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-l, .reveal-r, .reveal-sc");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
          if (en.target.hasAttribute("data-count")) animateCount(en.target);
          var counters = en.target.querySelectorAll("[data-count]");
          counters.forEach(animateCount);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Counter animation ---------- */
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    var target = parseFloat(el.getAttribute("data-count"));
    var dur = 1500, start = null;
    var dec = (el.getAttribute("data-dec") === "1");
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = dec ? val.toFixed(2) : Math.round(val).toLocaleString("th-TH");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(2) : target.toLocaleString("th-TH");
    }
    requestAnimationFrame(step);
  }
  // observe standalone counters too
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll("[data-count]").forEach(function (el) { io2.observe(el); });
  }
  // Kick hero counters immediately (they may sit below the fold at load)
  setTimeout(function () {
    document.querySelectorAll("#hero [data-count]").forEach(animateCount);
  }, 450);

  /* ---------- Parallax ---------- */
  var pEls = [];
  document.querySelectorAll("[data-parallax]").forEach(function (el) {
    pEls.push({ el: el, speed: parseFloat(el.getAttribute("data-parallax")) || 0.2 });
  });
  function parallaxTick(y) {
    for (var i = 0; i < pEls.length; i++) {
      pEls[i].el.style.transform = "translate3d(0," + (y * pEls[i].speed) + "px,0)";
    }
  }

  /* ---------- Floating decorations ---------- */
  function spawnFloaties() {
    document.querySelectorAll(".floaties").forEach(function (box) {
      var n = parseInt(box.getAttribute("data-n") || "10", 10);
      for (var i = 0; i < n; i++) {
        var f = document.createElement("span");
        var kind = Math.random() > 0.5 ? "leaf" : "dot";
        f.className = "floaty " + kind;
        var sz = kind === "dot" ? (6 + Math.random() * 14) : (16 + Math.random() * 26);
        f.style.width = sz + "px";
        f.style.height = sz + "px";
        f.style.left = (Math.random() * 100) + "%";
        f.style.top = (Math.random() * 100) + "%";
        var dur = 8 + Math.random() * 10;
        var dx = (Math.random() * 40 - 20);
        var dy = (Math.random() * 50 - 25);
        f.animate(
          [
            { transform: "translate(0,0) rotate(0deg)" },
            { transform: "translate(" + dx + "px," + dy + "px) rotate(" + (Math.random() * 180 - 90) + "deg)" },
            { transform: "translate(0,0) rotate(0deg)" }
          ],
          { duration: dur * 1000, iterations: Infinity, easing: "ease-in-out", delay: Math.random() * -dur * 1000 }
        );
        box.appendChild(f);
      }
    });
  }
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    spawnFloaties();
  }

  /* ---------- 3D tilt / parallax on staff cards ---------- */
  (function () {
    var fine = !window.matchMedia || window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    var MAX_X = 11;  // max vertical tilt (deg)
    var MAX_Y = 14;  // max horizontal tilt (deg)
    var LIFT = 18;   // px lift toward viewer

    function initCard(card) {
      var raf = null, tx = 0, ty = 0;

      function apply() {
        raf = null;
        card.style.transform =
          "perspective(1100px) rotateX(" + ty + "deg) rotateY(" + tx +
          "deg) translateZ(" + LIFT + "px) scale(1.04)";
      }

      function move(e) {
        if (!card.classList.contains("tilting")) card.classList.add("tilting");
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;   // 0..1
        tx = (px - 0.5) * 2 * MAX_Y;
        ty = -(py - 0.5) * 2 * MAX_X;
        if (!raf) raf = window.requestAnimationFrame(apply);
      }
      function reset() {
        card.classList.remove("tilting");
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
        card.style.transform = "";
      }

      // pointer events cover mouse + pen; mouse* as a belt-and-braces fallback
      card.addEventListener("pointerenter", move);
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", reset);
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", reset);
    }

    document.querySelectorAll(".staff-card").forEach(initCard);
  })();

  /* ---------- Scroll listener ---------- */
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Active nav highlight ---------- */
  var sections = [].slice.call(document.querySelectorAll("section[id]"));
  var navAnchors = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    navAnchors[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var ioNav = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(navAnchors).forEach(function (k) {
            navAnchors[k].classList.toggle("active", k === en.target.id);
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { ioNav.observe(s); });
  }
})();
