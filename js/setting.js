browser.storage.local.get('bar_pox', function (r) {
    let bar_pox = r.bar_pox || 'left';
    $(`.bar-${bar_pox}`).addClass('st-bar-act');
});

$('.bar-it').on('click', function () {
    $('.bar-it').removeClass('st-bar-act');
    $(this).addClass('st-bar-act');
    browser.storage.local.set({ 'bar_pox': $(this).attr('pox') });
});