/* ============================================================
   Handbook interactivity: nav scroll-spy, mobile jump,
   flashcard decks, and content-protection deterrents.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Scroll-spy nav highlighting ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = links
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function onScroll() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s;
    });
    links.forEach(function (a) {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === "#" + (current && current.id)
      );
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile jump menu ---------- */
  var sel = document.getElementById("mobileJump");
  if (sel) {
    links.forEach(function (a) {
      var o = document.createElement("option");
      o.value = a.getAttribute("href");
      o.textContent = a.textContent.replace(/^\s*\S+\s/, "");
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () {
      location.hash = sel.value;
    });
  }

  /* ============================================================
     FLASHCARD ENGINE
     ============================================================ */
  var decks = window.FLASHCARD_DECKS || [];
  var mount = document.getElementById("flashApp");
  if (mount && decks.length) {
    var state = { deck: decks[0], index: 0 };

    // total count KPI
    var totalEl = document.getElementById("totalCards");
    if (totalEl) {
      var t = decks.reduce(function (s, d) { return s + d.cards.length; }, 0);
      totalEl.textContent = t;
    }

    var controls = document.createElement("div");
    controls.className = "deck-controls";
    decks.forEach(function (d) {
      var b = document.createElement("button");
      b.className = "deck-btn";
      b.innerHTML = d.title + '<span class="c">' + d.cards.length + "</span>";
      b.addEventListener("click", function () { selectDeck(d); });
      d._btn = b;
      controls.appendChild(b);
    });
    mount.appendChild(controls);

    var stage = document.createElement("div");
    stage.className = "flash-stage";
    stage.innerHTML =
      '<div class="flash-meta"><span class="title"></span><span class="prog"></span></div>' +
      '<div class="flashcard"><div class="inner">' +
      '<div class="face front"><div class="lbl">Question</div><div class="txt q"></div><div class="hint">click to flip ↻</div></div>' +
      '<div class="face back"><div class="lbl">Answer</div><div class="txt a"></div><div class="hint">click to flip ↻</div></div>' +
      "</div></div>" +
      '<div class="flash-nav">' +
      '<button class="ghost" data-act="prev">← Prev</button>' +
      '<span class="count"></span>' +
      '<button data-act="next">Next →</button>' +
      "</div>";
    mount.appendChild(stage);

    var cardEl = stage.querySelector(".flashcard");
    var qEl = stage.querySelector(".txt.q");
    var aEl = stage.querySelector(".txt.a");
    var titleEl = stage.querySelector(".flash-meta .title");
    var progEl = stage.querySelector(".flash-meta .prog");
    var countEl = stage.querySelector(".count");

    cardEl.addEventListener("click", function () {
      cardEl.classList.toggle("flipped");
    });
    stage.querySelector('[data-act="next"]').addEventListener("click", function (e) {
      e.stopPropagation(); move(1);
    });
    stage.querySelector('[data-act="prev"]').addEventListener("click", function (e) {
      e.stopPropagation(); move(-1);
    });
    document.addEventListener("keydown", function (e) {
      if (!isInView(stage)) return;
      if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === " ") { e.preventDefault(); cardEl.classList.toggle("flipped"); }
    });

    function isInView(el) {
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    }
    function move(dir) {
      var n = state.deck.cards.length;
      state.index = (state.index + dir + n) % n;
      render();
    }
    function selectDeck(d) {
      state.deck = d; state.index = 0;
      decks.forEach(function (x) { x._btn.classList.toggle("active", x === d); });
      render();
    }
    function render() {
      cardEl.classList.remove("flipped");
      var c = state.deck.cards[state.index];
      qEl.textContent = c.q;
      aEl.textContent = c.a;
      titleEl.textContent = state.deck.title;
      var n = state.deck.cards.length;
      progEl.textContent = "Card " + (state.index + 1) + " of " + n;
      countEl.textContent = state.index + 1 + " / " + n;
    }
    selectDeck(decks[0]);
  }

  /* ============================================================
     CONTENT-PROTECTION DETERRENTS
     (Deters casual copying. NOT a hard guarantee on a public URL.)
     ============================================================ */
  // block right-click context menu
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  // block common save/copy/print/view-source shortcuts
  document.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    if (mod && ["s", "u", "p", "c"].indexOf(k) !== -1) {
      // allow copy inside form fields if any are added later
      if (k === "c" && /^(input|textarea)$/i.test((e.target || {}).tagName)) return;
      e.preventDefault();
    }
    if (e.key === "F12") e.preventDefault();
  });
  // block drag of images/text
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });
})();
