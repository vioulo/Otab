let tamp_id = 0;
let tamp_new = false;
let tamp_title = '缓存区';

async function genTampNode() {
    try {
        const results = await new Promise((resolve, reject) => {
            browser.bookmarks.search({ title: tamp_title }, results => {
                resolve(results);
            });
        });
        if (results.length > 0) {
            tamp_id = results[0].id;
        } else {
            const node = await new Promise((resolve, reject) => {
                browser.bookmarks.create({
                    title: tamp_title,
                    parentId: 'toolbar_____',
                }, node => {
                    resolve(node);
                });
            });
            tamp_id = node.id;
            tamp_new = true;
        }
    } catch (error) {
        console.error(error);
    }
}

browser.bookmarks.getSubTree("toolbar_____").then((tree) => {
    let toolbar = tree[0].children;
    const el_box = document.querySelector('.box');
    if (!toolbar) {
        el_box.innerText = '书签工具栏没有书签';
        return;
    }
    let folder = [];
    toolbar.forEach(e => {
        if (e.type == 'folder') {
            folder.push(e);
        } else {
            genTampNode().then(() => {
                browser.bookmarks.move(e.id, { parentId: tamp_id });
                if (tamp_new) {
                    folder.push({
                        id: e.id,
                        title: tamp_title,
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    });
    folder.forEach(e => {
        let el_folder = document.createElement('div');
        el_folder.className = 'b-it';
        el_folder.innerText = e.title;
        el_folder.setAttribute('tb_id', e.id);
        el_folder.onclick = () => {
            fillBookmark(e.id);
        }
        el_box.appendChild(el_folder);
    })
}).catch((error) => {
    console.error(error);
})

function fillBookmark(folderId) {
    const el_folder = document.querySelector(`div[tb_id="${folderId}"]`);
    el_folder.classList.add('b-active');
    const el_divs = document.querySelectorAll(`div:not([tb_id="${folderId}"])`);
    el_divs.forEach((div) => {
        div.classList.remove('b-active');
    });
    emptyListElement();
    browser.bookmarks.getChildren(folderId).then((children) => {
        children.forEach((b) => {
            if (b.type == 'bookmark') {
                insertLinkElement(b);
            }
        });
    });
}

function emptyListElement() {
    const el_link = document.querySelector('.view');
    while (el_link.firstChild) {
        el_link.firstChild.remove();
    }
}

function insertLinkElement(link) {
    let a = document.createElement('a');
    a.href = link.url;
    a.innerText = link.title || link.url;
    a.setAttribute('tb_id', link.id);
    document.querySelector('.view').appendChild(a);

    adjustView();
}