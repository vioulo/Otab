// show pin link
browser.storage.sync.get('otab_pin', function (r) {
    const el_link = document.querySelector('.view');
    if (!r['otab_pin']) {
        el_link.innerHTML = '<div class="empty-link">⭕️ 您还未固定文件夹</div>';
    } else {
        $('.sp-t').addClass('active');
        $('.view').attr('tb_id', r['otab_pin']);
        browser.bookmarks.getChildren(r['otab_pin']).then((children) => {
            children.forEach((b) => {
                if (b.type == 'bookmark') {
                    insertLinkElement(b);
                }
            });
        });
    }
});