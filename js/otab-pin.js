// show pin link
browser.storage.sync.get('otab_pin', function (r) {
    const el_link = document.querySelector('.view');
    if (!r['otab_pin']) {
        el_link.innerText = '// 暂时空白咯';
    } else {
        $('.cls-1').addClass('cls-1-active');
        $('.cls-2').addClass('cls-2-active');
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