browser.bookmarks.getSubTree("toolbar_____").then((tree) => {
    let toolbar = tree[0].children;
    const el_toolbar = document.getElementById('folder');
    if (!toolbar) {
        el_toolbar.innerText = '书签工具栏没有书签';
        return;
    }
    let folder = [];
    toolbar.forEach(e => {
        if (e.type == 'folder') {
            folder.push(e);
        }
    });
    folder.push({
        id : 'tmp',
        title : '缓存区',
    });
    folder.forEach(e => {
        let el_folder = document.createElement('div');
        el_folder.className = 'f-item';
        el_folder.innerText = e.title;
        el_folder.setAttribute('kk_id', e.id);
        el_folder.onclick = () => {
            fillBookmark(e.id);
        }
        el_toolbar.appendChild(el_folder);
    })
}).catch((error) => {
    console.error(error);
})

function fillBookmark(folderId) {
    const el_folder = document.querySelector(`div[kk_id="${folderId}"]`);
    el_folder.classList.add('fi-active');
    const el_divs = document.querySelectorAll(`div:not([kk_id="${folderId}"])`);
    el_divs.forEach((div) => {
        div.classList.remove('fi-active');
    });
    // const el_title = document.querySelector('.sub-title');
    // el_title.innerText = el_folder.innerText;
    if (folderId == 'tmp') {
        return fillTmp();
    }
    emptyListElement();
    browser.bookmarks.getChildren(folderId).then((children) => {
        children.forEach((b) => {
            if (b.type == 'bookmark') {
                insertLinkElement(b);
            }
        });
    });
}

function fillTmp() {
    browser.bookmarks.getSubTree("toolbar_____").then((tree) => {
        let toolbar = tree[0].children;
        if (!toolbar) {
            return;
        }
        emptyListElement();
        toolbar.forEach(e => {
            if (e.type == 'folder') {
                return;
            }
            insertLinkElement(e);
        });
    }).catch((error) => {
        console.error(error);
    })
}

function emptyListElement() {
    const el_link = document.querySelector('.link');
    while (el_link.firstChild) {
        el_link.firstChild.remove();
    }
}

function insertLinkElement(link) {
    let li = document.createElement('div');
    li.className = 'l-item';
    let a = document.createElement('a');
    a.href = link.url;
    a.innerText = link.title || link.url;
    a.setAttribute('kk_id', link.id);
    li.appendChild(a);
    document.querySelector('.link').appendChild(li);
}