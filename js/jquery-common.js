'use strict';

// Shared jQuery effects used by the menu and booking pages.
// Load after jQuery and main.js, before jquery-menu.js / jquery-booking.js.
// ---------- show / hide helper (jQuery effects) ----------

// The project hides blocks with the ready-made "hidden" class
// (display: none !important), so an effect cannot animate it directly.
// showBlock/hideBlock add and remove that class around the animation.
// $block.data('open') remembers the state, so a fast double call is safe.
function isBlockOpen($block) {
    const stored = $block.data('open');

    return stored === undefined ? !$block.hasClass('hidden') : stored;
}

// Fades a hidden block in. duration is in milliseconds.
function showBlock($block, duration = 300, callback) {
    if (isBlockOpen($block)) {
        return;
    }

    $block.data('open', true);
    $block.stop(true, true).hide().removeClass('hidden').fadeIn(duration, callback);
}

// Fades a visible block out, then puts the "hidden" class back (callback).
function hideBlock($block, duration = 300, callback) {
    if (!isBlockOpen($block)) {
        return;
    }

    $block.data('open', false);
    $block.stop(true, true).fadeOut(duration, function () {
        if ($block.data('open') === false) {
            $(this).addClass('hidden');
        }

        if (typeof callback === 'function') {
            callback.call(this);
        }
    });
}


// Explain unavailable controls without changing the existing HTML or CSS.
$(function () {
    $('button:disabled').attr('title', 'Not available right now');
});
