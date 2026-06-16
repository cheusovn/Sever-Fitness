/* ============================================================
   SEVER FITNESS — Enhancements (JS)
   1) Reveal safety-net: guarantees scroll-reveal content becomes
      visible even if the IntersectionObserver doesn't fire on the
      device (iOS Safari + smooth-scroll edge cases). Without this,
      reveal elements stay at opacity:0 and leave huge empty gaps
      (e.g. the reviews + FAQ block before the final CTA).
   2) Adaptive height for the reviews carousel so the container
      shrinks to the currently visible card.
============================================================ */
(function () {
    var REVEAL_SEL = '.reveal,.reveal-left,.reveal-right,.reveal-zoom';

    function revealFallback() {
        var els = document.querySelectorAll(REVEAL_SEL);
        if (!els.length) return;

        function activateInView() {
            var vh = window.innerHeight || document.documentElement.clientHeight;
            els.forEach(function (el) {
                if (el.classList.contains('active')) return;
                var r = el.getBoundingClientRect();
                // Reveal anything that has entered (or is above) the viewport.
                if (r.top < vh * 0.95) el.classList.add('active');
            });
        }

        window.addEventListener('scroll', activateInView, { passive: true });
        window.addEventListener('resize', activateInView, { passive: true });
        activateInView();

        // Absolute safety: never leave content invisible.
        setTimeout(function () {
            els.forEach(function (el) { el.classList.add('active'); });
            fitReviews();
        }, 2200);
    }

    function fitReviews() {
        var outer = document.getElementById('reviewsOuter');
        var track = document.getElementById('reviewsTrack');
        if (!outer || !track) return;
        var active = track.querySelector('.review-card.active-card') ||
                     track.querySelector('.review-card');
        if (active) outer.style.height = active.getBoundingClientRect().height + 'px';
    }

    function initReviewFit() {
        var outer = document.getElementById('reviewsOuter');
        var track = document.getElementById('reviewsTrack');
        if (!outer || !track) return;

        var cards = track.querySelectorAll('.review-card');
        if (!cards.length) return;

        track.style.alignItems = 'flex-start';
        outer.style.transition = 'height .45s cubic-bezier(.22,1,.36,1)';

        var mo = new MutationObserver(fitReviews);
        for (var i = 0; i < cards.length; i++) {
            mo.observe(cards[i], { attributes: true, attributeFilter: ['class'] });
        }

        window.addEventListener('resize', function () { setTimeout(fitReviews, 60); }, { passive: true });
        [150, 450, 900, 1600, 2400].forEach(function (t) { setTimeout(fitReviews, t); });
    }

    function init() {
        revealFallback();
        initReviewFit();
    }

    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);
})();
