// Mobile nav toggle
document.querySelectorAll('.nav-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var nav = document.getElementById(btn.getAttribute('aria-controls'));
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

// Footer year
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Hero: single-molecule localization field (two-color, gently twinkling)
(function () {
  var canvas = document.querySelector('.hero canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dots = [];
  var colors = ['255,64,150', '60,220,150', '90,170,255'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  // Dots cluster along a few curved "filaments", like adhesions / actin bundles
  function seed() {
    dots = [];
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    var n = Math.min(900, Math.round(w * h / 900));
    var fils = [];
    for (var f = 0; f < 9; f++) {
      fils.push({
        x: w * (0.35 + Math.random() * 0.7), y: Math.random() * h,
        a: Math.random() * Math.PI, len: 80 + Math.random() * 260, c: f % 3
      });
    }
    for (var i = 0; i < n; i++) {
      var fl = fils[i % fils.length];
      var t = Math.random() - 0.5;
      var bend = Math.sin(t * 3) * 30;
      dots.push({
        x: fl.x + Math.cos(fl.a) * t * fl.len - Math.sin(fl.a) * bend + (Math.random() - .5) * 14,
        y: fl.y + Math.sin(fl.a) * t * fl.len + Math.cos(fl.a) * bend + (Math.random() - .5) * 14,
        r: 0.6 + Math.random() * 1.4,
        c: Math.random() < 0.8 ? fl.c : Math.floor(Math.random() * 3),
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.6
      });
    }
  }

  function draw(time) {
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    // fade dots on the left so text stays readable
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var fade = Math.min(1, Math.max(0, (d.x / w - 0.2) / 0.4));
      var blink = reduce ? 0.7 : 0.35 + 0.65 * Math.max(0, Math.sin(time / 1000 * d.s + d.p));
      var a = fade * blink;
      if (a < 0.02) continue;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + colors[d.c] + ',' + a + ')';
      ctx.shadowColor = 'rgba(' + colors[d.c] + ',' + a + ')';
      ctx.shadowBlur = 6;
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', size);
  size();
  requestAnimationFrame(draw);
})();

// Publications search filter
(function () {
  var input = document.getElementById('pub-search');
  if (!input) return;
  var pubs = Array.prototype.slice.call(document.querySelectorAll('.pub'));
  var years = Array.prototype.slice.call(document.querySelectorAll('.year'));
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    pubs.forEach(function (p) {
      p.classList.toggle('hidden', q && p.textContent.toLowerCase().indexOf(q) === -1);
    });
    years.forEach(function (y) {
      var el = y.nextElementSibling, any = false;
      while (el && !el.classList.contains('year')) {
        if (el.classList.contains('pub') && !el.classList.contains('hidden')) any = true;
        el = el.nextElementSibling;
      }
      y.classList.toggle('hidden', !any);
    });
  });
})();
