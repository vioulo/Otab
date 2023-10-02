browser.topSites.get().then((sites) => {
    const el_link = document.querySelector('.view');
    if (!sites.length) {
        el_link.innerText = '没有任何浏览记录';
        return;
    }
    for (let s of sites) {
        let a = document.createElement('a');
        a.href = s.url;
        a.innerText = s.title || s.url;
        a.setAttribute('tb_id', s.id || 0);
        el_link.appendChild(a);
    }
});
