/* /drug-model page interactions — no dependencies */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── sub-nav scroll spy ── */
  (function subnav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.subnav li a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (current) current.classList.remove('is-active');
          current = map[e.target.id];
          if (current) current.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  })();

  /* ── blueprint hover: light the connectors of the hovered group ── */
  (function blueprint() {
    var groups = document.querySelectorAll('.blueprint .bp-group[data-hl]');
    Array.prototype.forEach.call(groups, function (g) {
      var ids = g.getAttribute('data-hl').split(/\s+/);
      var paths = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      g.addEventListener('mouseenter', function () { paths.forEach(function (p) { p.classList.add('hot'); }); });
      g.addEventListener('mouseleave', function () { paths.forEach(function (p) { p.classList.remove('hot'); }); });
    });
  })();

  /* ── deliverables picker ── */
  (function picker() {
    var root = document.querySelector('[data-component="picker"]');
    if (!root) return;
    var data = {
      quick: {
        kicker: 'Quick forecast',
        title: 'A one-screen answer you can act on.',
        bullets: [
          'Risk-adjusted peak sales and the year it lands',
          'The derivation chain, factor by factor',
          'The single driver that matters most, and how sure the evidence is'
        ]
      },
      full: {
        kicker: 'Full forecast package',
        title: 'The whole case, with its own independent review.',
        bullets: [
          'Narrative report with every number tagged',
          'Structured data for your own model or dashboard',
          'An independent review report, written by a second reader of the sources'
        ]
      },
      excel: {
        kicker: 'Excel model',
        title: 'Patient flow to revenue, every cell a formula.',
        bullets: [
          'Assumptions, calculations and outputs on separate sheets',
          'One sales line per indication and market, summed',
          'Single-product DCF or rNPV on request'
        ]
      },
      landscape: {
        kicker: 'Landscape report',
        title: 'Where the asset sits, and what that implies for share.',
        bullets: [
          'Standard of care and unmet need, scored',
          'The competitive pipeline with verified stages and catalysts',
          'Head-to-head clinical profile, positioning and share implications'
        ]
      },
      sotp: {
        kicker: 'Sum-of-parts valuation',
        title: 'From each asset to the share price.',
        bullets: [
          'Risk-adjusted value per asset and per market',
          'Pipeline, platform and cash brought to equity value',
          'A target price with the bridge laid out'
        ]
      },
      deal: {
        kicker: 'Deal returns',
        title: 'From the sales line to IRR, MOIC and coverage.',
        bullets: [
          'The revenue line that backs the instrument',
          'Returns under the base case and the stress cases',
          'Royalty or equity-round structures, with the comparables'
        ]
      },
      company: {
        kicker: 'Company read',
        title: 'Is the market paying for the right cycle?',
        bullets: [
          'Margin cycle and product cycle, read together',
          'What the current price already assumes',
          'The one thing that would change the call'
        ]
      }
    };
    var tabs = root.querySelectorAll('[role="tab"]');
    var kicker = root.querySelector('.picker-kicker');
    var title = root.querySelector('.picker-title');
    var bullets = root.querySelector('.picker-bullets');
    var previews = root.querySelectorAll('.pv');
    function show(key) {
      var d = data[key]; if (!d) return;
      Array.prototype.forEach.call(tabs, function (t) { t.setAttribute('aria-selected', t.getAttribute('data-key') === key ? 'true' : 'false'); });
      Array.prototype.forEach.call(previews, function (p) { p.classList.toggle('is-on', p.classList.contains('pv-' + key)); });
      kicker.textContent = d.kicker;
      title.textContent = d.title;
      bullets.innerHTML = '';
      d.bullets.forEach(function (b) { var li = document.createElement('li'); li.textContent = b; bullets.appendChild(li); });
    }
    Array.prototype.forEach.call(tabs, function (t) {
      t.addEventListener('click', function () { show(t.getAttribute('data-key')); });
      t.addEventListener('mouseenter', function () { show(t.getAttribute('data-key')); });
    });
    show('quick');
  })();

  /* ── stepper ── */
  (function stepper() {
    var root = document.querySelector('[data-component="stepper"]');
    if (!root) return;
    var steps = [
      {
        kicker: 'Step 0 · Identify',
        q: 'What exactly are we modelling, and for which markets?',
        a: 'The asset’s identity is locked before anything is fetched: its names at every regulator and registry, target, sponsor, listing, and the regions and indications in scope. Nothing is inferred. Every open question goes out once, in one batch, with a default.',
        see: 'the locked identity table, the scope, and any prior work on the asset found on disk — with its date.'
      },
      {
        kicker: 'Step 1 · Evidence',
        q: 'What do the primary documents actually say?',
        a: 'Five evidence agents set out in parallel — clinical evidence, competitive pipeline, price and sales, development stage, epidemiology — and return facts with their sources. They never return a judgment.',
        see: 'an evidence packet per family, every fact with a locator, every gap with the place it was searched.'
      },
      {
        kicker: 'Step 2 · Patients',
        q: 'How many patients can this drug actually reach?',
        a: 'A patient funnel built from the treatment guideline and the real care pathway, from the population down to the treated, eligible pool — each filter sourced from at least two independent families of evidence.',
        see: 'the funnel, the pool definition, and the standard of care and unmet need the asset is entering.'
      },
      {
        kicker: 'Step 3 · Share and ramp',
        q: 'Where does it land against standard of care and the field — and how fast?',
        a: 'A clinical profile against the standard of care and the in-class field, a positioning read, a share range, and a launch curve calibrated on historical launches. Exclusivity and competitor timing are checked against dated events.',
        see: 'the positioning read, the share range with its ends, and the launch curve with the events that shape it.'
      },
      {
        kicker: 'Step 4 · Price and duration',
        q: 'What does a treated patient pay, and for how long?',
        a: 'Net price by market from the most reliable benchmark available, and months on therapy from the documents that record it. Price unit and duration unit always match.',
        see: 'the price used per market, the benchmark it came from, and the duration with its source.'
      },
      {
        kicker: 'Step 5 · Probability of success',
        q: 'Pre-launch only: what are the odds it gets there?',
        a: 'A probability of approval built from the verified development stage onward, disclosed link by link, and applied on the revenue line — never in the discount rate.',
        see: 'the PoS, the stage it starts from, and the one adjustment made, if any, with its reason.'
      },
      {
        kicker: 'Exit · Validate, review, deliver',
        q: 'Does it hold up — and what is weakest?',
        a: 'The output form is chosen, then three controls run in order: a machine check that refuses silence and broken arithmetic, an independent review that re-opens every cited document, and a delivery that puts the weakest assumptions first.',
        see: 'the validation report, the independent review, and a deliverable whose first page is the list of what rests on weaker ground.'
      }
    ];
    var tabs = root.querySelectorAll('[role="tab"]');
    var kicker = root.querySelector('.step-kicker');
    var q = root.querySelector('.step-q');
    var a = root.querySelector('.step-a');
    var see = root.querySelector('.step-see-text');
    var current = 0;
    function show(i) {
      var d = steps[i]; if (!d) return;
      current = i;
      Array.prototype.forEach.call(tabs, function (t) { t.setAttribute('aria-selected', String(+t.getAttribute('data-step') === i)); });
      kicker.textContent = d.kicker; q.textContent = d.q; a.textContent = d.a; see.textContent = d.see;
    }
    Array.prototype.forEach.call(tabs, function (t) {
      t.addEventListener('click', function () { show(+t.getAttribute('data-step')); });
      t.addEventListener('keydown', function (e) {
        var i = +t.getAttribute('data-step');
        if (e.key === 'ArrowRight') { e.preventDefault(); show(Math.min(steps.length - 1, i + 1)); tabs[current].focus(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(Math.max(0, i - 1)); tabs[current].focus(); }
      });
    });
    show(0);
  })();

  /* ── equation explorer ── */
  (function equation() {
    var root = document.querySelector('[data-component="equation"]');
    if (!root) return;
    var data = {
      sales: {
        kicker: 'Sales',
        title: 'One line per indication and market, over time.',
        body: 'The product of the five factors, ramped over the years from launch. Multi-indication assets are modelled as separate lines and summed; a single blended share is never used.',
        src: 'all five families below, reconciled on one page.'
      },
      patients: {
        kicker: 'Patients',
        title: 'The pool the drug can actually reach.',
        body: 'From the population to the treated, eligible pool, filter by filter, with the pool definition fixed before anything downstream is computed.',
        src: 'registries, peer-reviewed epidemiology, treatment guidelines, and an observed anchor the funnel must close on.'
      },
      share: {
        kicker: 'Share',
        title: 'Where it lands against the field, and how fast.',
        body: 'Launch order and the clinical profile against standard of care and in-class rivals set a range; competition inside the class tightens it. The ramp to that share is calibrated on historical launches.',
        src: 'trial registries, sponsor filings, the competitive pipeline, and the proprietary launch library.'
      },
      duration: {
        kicker: 'Duration',
        title: 'How long a treated patient stays on therapy.',
        body: 'Months on therapy taken from the documents that record real exposure, matched to the population and line being modelled. Price unit and duration unit always agree.',
        src: 'regulator labels and pivotal-trial exposure data.'
      },
      price: {
        kicker: 'Net price',
        title: 'What is actually paid, per market.',
        body: 'The most reliable benchmark available in each market, ranked by reliability, with the choice disclosed. A weaker benchmark is named as such and leads the first page.',
        src: 'regulator and payer price records, reported sales, and named comparables where no record exists yet.'
      },
      pos: {
        kicker: 'Probability of success',
        title: 'The odds from the verified stage to approval.',
        body: 'Built from the development stage as verified in registries and filings, not as described in a press release, and applied on the revenue line only.',
        src: 'registries, sponsor filings, and class precedents — approved, positive and failed.'
      }
    };
    var terms = root.querySelectorAll('.eq-term');
    var figs = root.querySelectorAll('.eqf');
    var kicker = root.querySelector('.eq-kicker');
    var title = root.querySelector('.eq-title');
    var body = root.querySelector('.eq-body');
    var src = root.querySelector('.eq-src-text');
    function show(key) {
      var d = data[key]; if (!d) return;
      Array.prototype.forEach.call(terms, function (t) { t.classList.toggle('is-on', t.getAttribute('data-term') === key); });
      Array.prototype.forEach.call(figs, function (f) { f.classList.toggle('is-on', f.classList.contains('eqf-' + key)); });
      kicker.textContent = d.kicker; title.textContent = d.title; body.textContent = d.body; src.textContent = d.src;
    }
    Array.prototype.forEach.call(terms, function (t) {
      t.addEventListener('mouseenter', function () { show(t.getAttribute('data-term')); });
      t.addEventListener('focus', function () { show(t.getAttribute('data-term')); });
      t.addEventListener('click', function () { show(t.getAttribute('data-term')); });
    });
    show('sales');
  })();

  /* ── illustrative launch curve ── */
  (function curve() {
    var root = document.querySelector('[data-component="curve"]');
    if (!root) return;
    var svg = root.querySelector('.curve-svg');
    var tip = root.querySelector('.curve-tip');
    var NS = 'http://www.w3.org/2000/svg';
    var W = 680, H = 300, L = 44, R = 20, T = 28, B = 40;
    var unrisked = [0, 4, 11, 22, 36, 52, 68, 82, 93, 100, 100, 98, 76, 52, 36];
    var pos = 0.45;
    var risked = unrisked.map(function (v) { return Math.round(v * pos); });
    var n = unrisked.length;
    var loeIdx = 11;
    function x(i) { return L + (i / (n - 1)) * (W - L - R); }
    function y(v) { return T + (1 - v / 100) * (H - T - B); }
    function el(name, attrs, text) {
      var e = document.createElementNS(NS, name);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      svg.appendChild(e);
      return e;
    }
    function smooth(vals) {
      // Catmull-Rom to cubic Bezier, clamped so the line never overshoots the data
      var pts = vals.map(function (v, i) { return [x(i), y(v)]; });
      var d = 'M' + pts[0][0] + ',' + pts[0][1];
      for (var i = 0; i < n - 1; i++) {
        var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
        var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ' C' + c1x + ',' + c1y + ' ' + c2x + ',' + c2y + ' ' + p2[0] + ',' + p2[1];
      }
      return d;
    }
    // grid
    [25, 50, 75, 100].forEach(function (v) {
      el('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), 'class': 'ax' });
      el('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', 'class': 'tick' }, String(v));
    });
    el('line', { x1: L, x2: W - R, y1: y(0), y2: y(0), 'class': 'ax ax-base' });
    for (var i = 0; i < n; i += 2) {
      el('text', { x: x(i), y: H - B + 18, 'text-anchor': 'middle', 'class': 'tick' }, i === 0 ? 'launch' : 'Y' + (i + 1));
    }
    // LoE
    el('line', { x1: x(loeIdx), x2: x(loeIdx), y1: T, y2: y(0), 'class': 'loe' });
    el('text', { x: x(loeIdx) + 6, y: y(0) - 8, 'class': 'tick' }, 'LoE');
    // area under risked
    el('path', { d: smooth(risked) + ' L' + x(n - 1) + ',' + y(0) + ' L' + x(0) + ',' + y(0) + ' Z', 'class': 'a-risked' });
    // series
    el('path', { d: smooth(unrisked), 'class': 's-unrisked' });
    el('path', { d: smooth(risked), 'class': 's-risked' });
    // direct labels
    el('text', { x: x(9) - 8, y: y(100) - 10, 'text-anchor': 'end', 'class': 'dlabel' }, 'unrisked peak');
    el('text', { x: x(9) - 8, y: y(risked[9]) - 10, 'text-anchor': 'end', 'class': 'dlabel' }, 'risk-adjusted');
    // hover layer
    var xh = el('line', { x1: 0, x2: 0, y1: T, y2: y(0), 'class': 'xh' });
    var p1 = el('circle', { r: 4, fill: '#1f9d5a', stroke: '#fff', 'stroke-width': 2, 'class': 'pt' });
    var p2 = el('circle', { r: 4, fill: '#4e6fae', stroke: '#fff', 'stroke-width': 2, 'class': 'pt' });
    var hit = el('rect', { x: L, y: T, width: W - L - R, height: H - T - B, fill: 'transparent' });
    function move(evt) {
      var rect = svg.getBoundingClientRect();
      var sx = (evt.clientX - rect.left) * (W / rect.width);
      var i = Math.round(((sx - L) / (W - L - R)) * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      var px = x(i);
      xh.setAttribute('x1', px); xh.setAttribute('x2', px); xh.classList.add('is-on');
      p1.setAttribute('cx', px); p1.setAttribute('cy', y(unrisked[i])); p1.classList.add('is-on');
      p2.setAttribute('cx', px); p2.setAttribute('cy', y(risked[i])); p2.classList.add('is-on');
      tip.innerHTML = '<b>' + (i === 0 ? 'Launch' : 'Year ' + (i + 1)) + '</b><br>unrisked ' + unrisked[i] + '<br>risk-adjusted ' + risked[i];
      tip.style.left = (px / W * 100) + '%';
      tip.style.top = (y(unrisked[i]) / H * 100) + '%';
      tip.hidden = false;
    }
    function leave() {
      xh.classList.remove('is-on'); p1.classList.remove('is-on'); p2.classList.remove('is-on'); tip.hidden = true;
    }
    hit.addEventListener('mousemove', move);
    hit.addEventListener('mouseleave', leave);
    hit.addEventListener('touchstart', function (e) { if (e.touches[0]) move(e.touches[0]); }, { passive: true });
    hit.addEventListener('touchmove', function (e) { if (e.touches[0]) move(e.touches[0]); }, { passive: true });
  })();

  /* ── count-up numbers ── */
  (function countup() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length || !('IntersectionObserver' in window) || reduceMotion) return;
    function fmt(v) { return v.toLocaleString('en-US'); }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var node = e.target; io.unobserve(node);
        var target = +node.getAttribute('data-count');
        var prefix = node.getAttribute('data-prefix') || '';
        var suffix = node.getAttribute('data-suffix') || '';
        if (target < 10) return; // small numbers do not animate
        var start = null, dur = 900;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          node.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(nodes, function (nd) { io.observe(nd); });
  })();

  /* ── gates light up in order ── */
  (function gates() {
    var root = document.querySelector('[data-component="gates"]');
    if (!root) return;
    var gates = root.querySelectorAll('.gate');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(gates, function (g) { g.classList.add('lit'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        Array.prototype.forEach.call(gates, function (g, i) {
          setTimeout(function () { g.classList.add('lit'); }, 200 + i * 350);
        });
      });
    }, { threshold: 0.35 });
    io.observe(root);
  })();
})();
