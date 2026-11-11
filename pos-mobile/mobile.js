/* Mobile helper: drawer menu, bottom-sheet panels, table labels. Safe on desktop (CSS is phone-only). */
(function () {
  var d = document, body = d.body;
  function el(html) { var t = d.createElement('div'); t.innerHTML = html; return t.firstChild; }
  var bar = el('<header id="m-bar"><button id="m-menu" aria-label="Menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><span id="m-title"></span></header>');
  var back = el('<div id="m-backdrop"></div>');
  body.appendChild(back); body.appendChild(bar);
  var title = bar.querySelector('#m-title');
  function nav(open) { body.classList.toggle('m-nav-open', open); }
  bar.querySelector('#m-menu').addEventListener('click', function () { nav(!body.classList.contains('m-nav-open')); });
  back.addEventListener('click', function () { nav(false); });
  window.addEventListener('hashchange', function () { nav(false); });

  function text(n) { return (n && n.textContent || '').replace(/\s+/g, ' ').trim(); }

  function updatePanel(p) {
    var label = text(p.querySelector('.font-bold')) || 'Details';
    var total = '', count = 0, spans = p.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      if (text(spans[i]) === 'Total' && spans[i].nextElementSibling) { total = text(spans[i].nextElementSibling); break; }
    }
    var isCart = label === 'Cart';
    if (isCart) count = p.querySelectorAll('.rounded-md.border.p-2').length;
    var s = label + (isCart ? ' \u00b7 ' + count + (count === 1 ? ' item' : ' items') : '') + (total ? ' \u00b7 ' + total : '');
    s += p.classList.contains('m-open') ? '    \u25bc' : '    \u25b2';
    if (p.getAttribute('data-m-title') !== s) p.setAttribute('data-m-title', s);
    if (isCart) {
      var prev = +(p.getAttribute('data-m-count') || 0);
      if (prev > 0 && count === 0) p.classList.remove('m-open');
      p.setAttribute('data-m-count', count);
    }
    p.setAttribute('data-m-cart', isCart ? '1' : '');
  }

  function run() {
    var aside = d.querySelector('aside');
    body.classList.toggle('m-has-shell', !!aside);
    if (aside) {
      var act = aside.querySelector('nav a[aria-current="page"]');
      var t = text(act) || text(aside.querySelector('span.truncate'));
      if (title.textContent !== t) title.textContent = t;
    } else nav(false);

    var panels = d.querySelectorAll('main div.flex.h-full > div.shrink-0.border-l');
    body.classList.toggle('m-has-panel', panels.length > 0);
    for (var i = 0; i < panels.length; i++) { panels[i].classList.add('m-panel'); updatePanel(panels[i]); }

    var tables = d.querySelectorAll('main table');
    for (var j = 0; j < tables.length; j++) {
      var ths = tables[j].querySelectorAll('thead th'), labels = [];
      for (var k = 0; k < ths.length; k++) labels.push(text(ths[k]));
      var rows = tables[j].querySelectorAll('tbody tr');
      for (var r = 0; r < rows.length; r++) {
        var tds = rows[r].children;
        for (var c = 0; c < tds.length; c++) {
          var lb = labels[c] || '';
          if (tds[c].getAttribute('data-label') !== lb) tds[c].setAttribute('data-label', lb);
        }
      }
    }
  }

  var raf = 0;
  function schedule() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; run(); }); }
  new MutationObserver(schedule).observe(d.documentElement, { childList: true, subtree: true, characterData: true });
  run();

  d.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('aside a')) { nav(false); return; }
    var p = t.closest('.m-panel');
    if (p) {
      if (t === p && e.clientY - p.getBoundingClientRect().top < 56) {
        p.classList.toggle('m-open'); updatePanel(p); e.stopPropagation();
      }
      return;
    }
    if (t.closest('main tbody tr')) {
      var pp = d.querySelector('.m-panel');
      if (pp && !pp.getAttribute('data-m-cart')) setTimeout(function () { pp.classList.add('m-open'); updatePanel(pp); }, 0);
    }
  }, true);
})();
