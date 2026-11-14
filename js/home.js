'use strict';

// Home keeps the original "About Zebra Coffee" character while giving useful details.
// HTML and CSS files remain unchanged.
$(function () {
    const $main = $('main');
    if (!$main.length || $main.data('zcHomeReady')) return;
    $main.data('zcHomeReady', true);
    const $contact = $('#contact-info').detach();
    $main.empty();

    $('<style id="zc-home-v3">').text(`
      .zc-home-v3 {color:#30251e}
      .zc-home-v3 .zc-home-intro {padding:24px 0 12px}
      .zc-home-v3 .zc-home-intro h2 {font-size:clamp(2rem,4vw,3.1rem);font-weight:750;margin-bottom:16px}
      .zc-home-v3 .zc-home-intro p {max-width:760px;color:#65584c;line-height:1.8}
      .zc-home-v3 .zc-about-grid {display:grid;grid-template-columns:minmax(0,0.88fr) minmax(0,1.12fr);gap:20px;align-items:start;margin:18px 0 28px}
      .zc-home-v3 .zc-photo {width:100%;height:300px;min-height:0;object-fit:cover;border-radius:17px}
      .zc-home-v3 .zc-about-card,.zc-home-v3 .zc-info-card {background:#fffdf9;border:1px solid #e9ded0;border-radius:17px;padding:22px;box-shadow:0 8px 22px #3020120d}
      .zc-home-v3 h3 {font-weight:750;color:#34271f}
      .zc-home-v3 .zc-about-card p,.zc-home-v3 .zc-info-card p {line-height:1.55;color:#64584e}.zc-home-v3 .zc-about-card p{margin-bottom:10px}
      .zc-home-v3 .zc-quick-actions {display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
      .zc-home-v3 .zc-quick-actions a {border-radius:9px;padding:11px 18px;background:#30251e;color:white;text-decoration:none;font-weight:650}
      .zc-home-v3 .zc-quick-actions a:nth-child(2) {background:#f5e9d8;color:#38291d}
      .zc-home-v3 .zc-section-heading {font-size:1.65rem;font-weight:750;margin:25px 0 14px}
      .zc-home-v3 .zc-info-grid {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}
      .zc-home-v3 .zc-info-card {padding:18px 20px;transition:transform .2s}
      .zc-home-v3 .zc-info-card:hover {transform:translateY(-3px)}
      .zc-home-v3 .zc-info-card h3 {font-size:1.12rem;margin:8px 0}
      .zc-home-v3 .zc-info-card p {margin-bottom:10px;line-height:1.5}.zc-home-v3 .zc-info-card a {color:#704a2f;font-weight:700}
      .zc-home-v3 .zc-photo-strip {display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:22px 0}
      .zc-home-v3 .zc-photo-strip img {width:100%;height:200px;object-fit:cover;border-radius:15px}
      .zc-home-v3 .zc-home-benefits {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 22px}
      .zc-home-v3 .zc-home-benefits>div {padding:15px 17px;border-radius:13px;background:#f7ede1;border:1px solid #e4d2bf}
      .zc-home-v3 .zc-home-benefits strong,.zc-home-v3 .zc-home-benefits span {display:block}
      .zc-home-v3 .zc-home-benefits strong {color:#493324;margin-bottom:5px}
      .zc-home-v3 .zc-home-benefits span {color:#695748;font-size:.9rem}
      .zc-home-v3 #contact-info {display:block!important;margin:18px 0 28px!important;padding:26px!important;background:#f1e3d1!important;border:2px solid #b18a65!important;border-left:7px solid #805b3d!important;box-shadow:0 10px 28px #30201220;color:#30251e!important}.zc-home-v3 #contact-info h3 {font-size:1.5rem;font-weight:800;color:#30251e!important;margin-bottom:16px}.zc-home-v3 #contact-info p {color:#3d3026!important;line-height:1.65}.zc-home-v3 #contact-info a {color:#623c23!important;text-decoration:underline;font-weight:700}
      @media(max-width:767px){.zc-home-v3 .zc-about-grid,.zc-home-v3 .zc-info-grid,.zc-home-v3 .zc-photo-strip,.zc-home-v3 .zc-home-benefits{grid-template-columns:1fr}.zc-home-v3 .zc-photo{height:250px}}
      @media(prefers-reduced-motion:reduce){.zc-home-v3 .zc-info-card{transition:none}}
    `).appendTo('head');
    const $page = $('<div>', {'class':'container py-4 zc-home-v3'});
    const $intro = $('<section>', {'class':'zc-home-intro'});
    $intro.append(
      $('<h2>',{text:'About Zebra Coffee'}),
      $('<p>',{text:'Welcome to Zebra Coffee — a cosy place in Astana to enjoy your favourite drinks, catch up with friends, study or simply take a break. Explore our menu, customise your order or reserve a table for your next visit.'})
    );
    $page.append($intro);
    const $about = $('<section>',{'class':'zc-about-grid'});
    $about.append($('<img>',{src:'images/zc-new-interior.jpg',alt:'Warm café interior',class:'zc-photo',loading:'lazy'}));
    const $aboutCard = $('<div>',{'class':'zc-about-card'});
    $aboutCard.append(
      $('<h3>',{text:'A coffee break worth coming back for'}),
      $('<p>',{text:'From espresso and creamy latte to refreshing cold drinks, tea and colourful matcha, there is something for every mood. Choose a comfortable seat, discover new flavours and enjoy a relaxed atmosphere.'}),
      $('<p>',{text:'Our website makes planning your visit simple: browse all drinks, build an order with multiple items, or request a table for your preferred time.'})
    );
    const $actions=$('<div>',{'class':'zc-quick-actions'});
    $actions.append($('<a>',{href:'menu.html',text:'Explore Menu'}),$('<a>',{href:'booking.html',text:'Reserve a Table'}));
    $aboutCard.append($actions);$about.append($aboutCard);$page.append($about);
    const $benefits = $('<div>', {'class':'zc-home-benefits','aria-label':'Why choose Zebra Coffee'});
    [['Fresh choices','Coffee, tea, matcha and cold drinks'],['Easy ordering','Customise drinks and review your cart'],['Comfortable visits','Reserve a table for your coffee break']].forEach(([title,detail]) => {
      $benefits.append($('<div>').append($('<strong>',{text:title}),$('<span>',{text:detail})));
    });
    $page.append($benefits);
    $page.append($('<h2>',{'class':'zc-section-heading',text:'Everything you need to know'}));
    const $cards=$('<section>',{'class':'zc-info-grid'});
    [
      ['☕','Find your drink','Search our coffee, cold drinks, tea and matcha. Filter by category, compare prices and choose your size.','menu.html','View the menu'],
      ['🛒','How to order','Select a drink and size, choose extras, add multiple drinks to Your Cart and review quantities and total before submitting.','order.html','Build an order'],
      ['🪑','How to reserve','Choose a date, time, number of guests and preferred seating area. Add any special requests to your booking form.','booking.html','Book a table'],
      ['💬','Share feedback','Tell us about your experience or suggest an improvement through the Feedback page.','feedback.html','Leave feedback'],
      ['📍','Plan your visit','Find our contact details below and check the information provided on the website before visiting.','booking.html','Plan a visit'],
      ['✨','A little something extra','Take your time, explore different flavours and make your next coffee break your own.','menu.html','Discover drinks']
    ].forEach(([emoji,title,description,href,cta])=>{
      const $card=$('<article>',{'class':'zc-info-card'});
      $card.append($('<div>',{text:emoji,'aria-hidden':'true'}),$('<h3>',{text:title}),$('<p>',{text:description}),$('<a>',{href,text:cta}));
      $cards.append($card);
    });
    $page.append($cards);
    const $photos=$('<div>',{'class':'zc-photo-strip'});
    $photos.append($('<img>',{src:'images/zc-new-latte.jpg',alt:'Latte coffee',loading:'lazy'}),$('<img>',{src:'images/zc-new-barista.jpg',alt:'Barista preparing coffee',loading:'lazy'}));
    $page.append($photos);
    if($contact.length) $page.append($contact);
    $main.append($page);
    $('.navbar a[aria-current="page"]').not('[href="index.html"]').removeClass('active').removeAttr('aria-current');
    $('.navbar a[href="index.html"]').addClass('active').attr('aria-current','page');
});
