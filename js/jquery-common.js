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

// A consistent contact panel on every non-Home page.
// Home already has the original #contact-info block; do not duplicate it.
$(function () {
    if ($('#contact-info').length || $('#zc-contact-panel').length) return;
    // Booking uses its existing Find Us block, with the same palette as Contact Info.
    if (window.location.pathname.toLowerCase().endsWith('/booking.html')) {
        const $heading = $('main h3').filter(function () {
            return $(this).text().trim() === 'Find Us';
        }).first();
        if ($heading.length) {
            const $panel = $heading.parent();
            $panel.removeClass('bg-dark text-white');
            $panel.css({
                background:'#f1e3d1', color:'#30251e',
                border:'2px solid #b18a65', borderLeft:'7px solid #805b3d',
                borderRadius:'15px', padding:'26px 28px',
                boxShadow:'0 10px 28px rgba(48,32,18,.13)'
            });
            $heading.removeClass('text-white').css({
                color:'#30251e',fontSize:'1.45rem',fontWeight:'800',marginBottom:'14px'
            });
            $panel.find('p').removeClass('text-white').css({color:'#3d3026',lineHeight:'1.65'});
            $panel.find('a').removeClass('link-light').css({
                color:'#623c23',fontWeight:'700',textDecoration:'underline'
            });
            if (!$panel.find('.zc-booking-details').length) {
                const $details = $('<div>',{'class':'zc-booking-details'}).css({
                    display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',
                    gap:'8px 20px',marginTop:'16px',paddingTop:'14px',
                    borderTop:'1px solid #d2b89b'
                });
                $details.append(
                    $('<p>').append($('<strong>',{text:'Address: '}),document.createTextNode('Dr. Park Avenue – 1, block 39, Astana, Kazakhstan')),
                    $('<p>').append($('<strong>',{text:'Opening hours: '}),document.createTextNode('08:00–21:00, daily')),
                    $('<p>').append($('<strong>',{text:'Phone: '}),$('<a>',{href:'tel:+77470290093',text:'+7 747 029 0093'}))
                );
                $panel.append($details);
                $details.find('p').css({margin:0,color:'#3d3026'});
                $details.find('a').css({color:'#623c23',fontWeight:'700'});
            }
        }
        return;
    }
    const $footer = $('body > footer').first();
    if (!$footer.length) return;

    $('<style id="zc-contact-shared-style">').text(`
      #zc-contact-panel {max-width:1110px;margin:30px auto 20px;padding:24px 28px;background:#f1e3d1;
        border:2px solid #b18a65;border-left:7px solid #805b3d;border-radius:15px;
        box-shadow:0 10px 28px #30201220;color:#30251e}
      #zc-contact-panel h3 {font-size:1.45rem;font-weight:800;margin:0 0 14px;color:#30251e}
      #zc-contact-panel .zc-contact-grid {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 22px}
      #zc-contact-panel p {margin:0;line-height:1.65;color:#3d3026}
      #zc-contact-panel a {color:#623c23;text-decoration:underline;font-weight:700}
      @media(max-width:640px){#zc-contact-panel{margin:20px 14px;padding:20px}#zc-contact-panel .zc-contact-grid{grid-template-columns:1fr}}
    `).appendTo('head');

    const $panel = $('<aside>', {id:'zc-contact-panel','aria-label':'Zebra Coffee contact information'});
    $panel.append($('<h3>', {text:'Contact Info'}));
    const $grid = $('<div>', {'class':'zc-contact-grid'});
    $grid.append(
      $('<p>').append($('<strong>',{text:'Address: '}), document.createTextNode('Dr. Park Avenue – 1, block 39, Astana, Kazakhstan')),
      $('<p>').append($('<strong>',{text:'Opening hours: '}), document.createTextNode('08:00–21:00, daily')),
      $('<p>').append($('<strong>',{text:'Phone: '}), $('<a>',{href:'tel:+77470290093',text:'+7 747 029 0093'})),
      $('<p>').append($('<strong>',{text:'TikTok: '}), $('<a>',{href:'https://www.tiktok.com/@zebracoffee.kz?_r=1&_t=ZS-99cQzxEdeGC',text:'@zebra.coffee.kz',target:'_blank',rel:'noopener noreferrer'}))
    );
    $panel.append($grid);
    $footer.before($panel);
});
