/* ============================================================
   SEVER FITNESS — Enhancements (JS)
   Adaptive height for the reviews carousel so the container
   shrinks to the currently visible card (removes the big
   empty gap left under shorter reviews).
============================================================ */
(function () {
    function initReviewFit() {
        var outer = document.getElementById('reviewsOuter');
        var track = document.getElementById('reviewsTrack');
        if (!outer || !track) return;

        var cards = track.querySelectorAll('.review-card');
        if (!cards.length) return;

        // Each card sizes to its own content instead of stretching to the tallest.
        track.style.alignItems = 'flex-start';
        outer.style.transition = 'height .45s cubic-bezier(.22,1,.36,1)';

        function fit() {
            var active = track.querySelector('.review-card.active-card') || cards[0];
            if (active) outer.style.height = active.getBoundingClientRect().height + 'px';
        }

        // Update height whenever the active slide changes.
        var mo = new MutationObserver(fit);
        for (var i = 0; i < cards.length; i++) {
            mo.observe(cards[i], { attributes: true, attributeFilter: ['class'] });
        }

        window.addEventListener('resize', function () { setTimeout(fit, 60); }, { passive: true });

        // Run after layout + carousel JS + fonts settle.
        [150, 450, 900, 1600].forEach(function (t) { setTimeout(fit, t); });
    }

    if (document.readyState !== 'loading') initReviewFit();
    else document.addEventListener('DOMContentLoaded', initReviewFit);
})();
