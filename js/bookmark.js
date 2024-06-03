let tmp_id = 0;
let tmp_new = false;
let tmp_title = '缓存区';

async function genTmpNode() {
    try {
        const results = await browser.bookmarks.search({ title: tmp_title });
        if (results.length) {
            return [results[0].id, false];
        } else {
            if (!tmp_id) {
                const node = await new Promise((resolve, reject) => {
                    browser.bookmarks.create({
                        title: tmp_title,
                        parentId: 'toolbar_____',
                    }, node => {
                        resolve(node);
                    });
                });
                return [node.id, true];
            }
        }
    } catch (error) {
        console.error(error);
    }
}

browser.bookmarks.getSubTree("toolbar_____").then(async (tree) => {
    let toolbar = tree[0].children;
    const el_box = document.querySelector('.box');
    if (!toolbar) {
        el_box.innerText = '书签工具栏没有书签';
        return;
    }
    [tmp_id, tmp_new] = await genTmpNode();
    console.log(tmp_id);
    let folder = [];
    toolbar.forEach(e => {
        if (e.type == 'folder') {
            folder.push(e);
        } else {
            browser.bookmarks.move(e.id, { parentId: tmp_id });
            if (tmp_new) {
                folder.push({
                    id: e.id,
                    title: tmp_title,
                });
            }
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
    a.onclick = (e) => {
        goLink(link.id);
    }
    document.querySelector('.view').appendChild(a);

    adjustView();
}

// 记录链接的点击次数
function goLink(link_id) {
    browser.runtime.sendMessage({
        type: 'linkClick',
        link_id: link_id,
      });
}

/// --- ContextMenu Start ---
const ContextMenu = function (options) {
    let instance;

    function createMenu() {
        const ul = document.createElement("ul");
        ul.classList.add("custom-context-menu");
        const { menus } = options;
        if (menus && menus.length > 0) {
            for (let menu of menus) {
                const li = document.createElement("li");
                li.textContent = menu.name;
                li.onclick = menu.onClick;
                ul.appendChild(li);
            }
        }
        const body = document.querySelector("body");
        body.appendChild(ul);
        return ul;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createMenu();
            }
            return instance;
        },
    };
};

const contextMenu = ContextMenu({
    menus: [
        {
            name: "新标签打开",
            onClick: function (e) {
                window.open(window.cur_link.url, '_blank');
            },
        },
        {
            name: "新窗口打开",
            onClick: function (e) {
                browser.windows.create({ url: window.cur_link.url });
            },
        },
        {
            name: "删除",
            onClick: function (e) {
                let id = window.cur_link.id;
                if (confirm("确定要删除吗?")) {
                    try {
                        document.querySelector(`a[tb_id="${id}"]`).remove();
                        browser.bookmarks.remove(id);
                    } catch (error) {
                        alert('删除失败');
                        console.error(error);
                    }
                }
            },
        },
    ],
});

function showMenu(e) {
    e.preventDefault();
    window.cur_link = {
        id: e.target.getAttribute("tb_id"),
        url: e.target.href
    };
    let h_top = e.clientY;
    let h_left = e.clientX;
    if (window.innerHeight - h_top < 100) {
        h_top = e.clientY - 100;
    }
    if (window.innerWidth - e.clientX < 120) {
        h_left = window.innerWidth - 120;
    }
    const menus = contextMenu.getInstance();
    menus.style.top = `${h_top}px`;
    menus.style.left = `${h_left}px`;
    menus.classList.remove("hidden");
}

function hideMenu(event) {
    window.cur_link = {};
    const menus = contextMenu.getInstance();
    menus.classList.add("hidden");
}

document.addEventListener("click", hideMenu);
document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName == "A") {
        showMenu(e);
    } else {
        hideMenu();
    }
});
/// --- ContextMenu End ---