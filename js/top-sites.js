browser.topSites.get().then((sites) => {
    const el_link = document.querySelector('.link');
    if (!sites.length) {
        el_link.innerText = '没有任何浏览记录';
        return;
    }
    for (let s of sites) {
        let li = document.createElement('div');
        li.className = 'l-item';
        let a = document.createElement('a');
        a.href = s.url;
        a.innerText = s.title || s.url;
        a.setAttribute('kk_id', s.id);
        li.appendChild(a);
        el_link.appendChild(li);
    }
});
