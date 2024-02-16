browser.storage.sync.get('bar_pox', function (r) {
    let bar_pox = r.bar_pox || 'left';
    $(`.bar-${bar_pox}`).addClass('st-bar-act');
});

browser.storage.sync.get('otab-cus-css', function (r) {
    $('#cus-css').val(r['otab-cus-css'] || '');
});

$('.bar-it').on('click', function () {
    $('.bar-it').removeClass('st-bar-act');
    $(this).addClass('st-bar-act');
    browser.storage.sync.set({ 'bar_pox': $(this).attr('pox') });
});

$('.cc-cfm').on('click', function () {
    browser.storage.sync.set({ 'otab-cus-css': $('#cus-css').val() });
});