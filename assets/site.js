// One More Broadside site. No cookies, no storage, nothing sent anywhere.
(function () {
  'use strict';
  // Where the visitor came from, so each store can count it: a link such as .../onemorebroadside/?src=tiktok makes every
  // store button on the page carry utm_source=tiktok (Steam's UTM report, Google Play's acquisition report).
  var m = /[?&]src=([a-z0-9_-]{1,24})(?:&|$)/i.exec(location.search), src = m ? m[1].toLowerCase() : 'website';
  var medium = m ? 'social' : 'link', campaign = 'launch';
  var links = {
    steam: 'https://store.steampowered.com/app/5481030/?utm_source=' + src + '&utm_medium=' + medium + '&utm_campaign=' + campaign,
    play: 'https://play.google.com/store/apps/details?id=com.onemorecrew.broadside&referrer=' + encodeURIComponent('utm_source=' + src + '&utm_medium=' + medium + '&utm_campaign=' + campaign),
    demo: 'play/', // (the browser demo, hosted here; also on itch.io)
    itch: 'https://onemorecrew.itch.io/one-more-broadside',
    apple: 'https://apps.apple.com/us/app/one-more-broadside/id6824039758'
  };
  document.querySelectorAll('a[data-store]').forEach(function (a) { var to = links[a.getAttribute('data-store')]; if (to) a.href = to; });

  // The short loops load and play only when they are on screen, and not at all for someone who asked for less motion
  // (they get the still picture and can press play).
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loops = [].slice.call(document.querySelectorAll('video[data-src]'));
  function load(v) { if (!v.src) v.src = v.getAttribute('data-src'); }
  if (still || !('IntersectionObserver' in window)) { loops.forEach(function (v) { v.controls = true; v.addEventListener('play', function () { load(v); }, { once: true }); v.preload = 'none'; load(v); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { load(v); var p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; }); } else if (!v.paused) v.pause(); });
  }, { rootMargin: '200px 0px', threshold: 0.15 });
  loops.forEach(function (v) { io.observe(v); });
})();
