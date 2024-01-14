browser.storage.local.get('otab_link_count').then((res) => {
    let rs = res['otab_link_count'] || [];

    browser.bookmarks.get(rs.map(data => data.id)).then((bookmarks) => {
        const result = rs.map((data) => {
            const bookmark = bookmarks.find((bookmark) => bookmark.id === data.id);
            if (bookmark) {
                return {
                    id: bookmark.id,
                    title: bookmark.title,
                    url: bookmark.url,
                    count: data.count
                };
            }
        });

        const el_link = document.querySelector('.view');
        if (!result.length) {
            el_link.innerText = '// 没有任何浏览记录';
            return;
        }
        // 使用数组的 sort() 方法按照 count 倒序排列
        result.sort((a, b) => b.count - a.count);
        for (let s of result.slice(0, 10)) {
            let a = document.createElement('a');
            a.innerText = s.title;
            a.setAttribute('tb_id', s.id || 0);
            a.onclick = () => {
                goLink(s.id, s.url);
            }
            el_link.appendChild(a);
        }
    });
});