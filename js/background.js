let olc = 'otab_link_count';

browser.runtime.onMessage.addListener(function (message) {
    if (message.type === 'linkClick') {
        browser.storage.sync.get(olc).then((res) => {
            let rs = res[olc] || [];
            let update = false;
            if (rs.length) {
                let nrs = [];
                rs.map((obj) => {
                    if (obj.id == message.link_id) {
                        obj.count++;
                        update = true;
                    }
                    nrs.push(obj);
                });
                rs = nrs;
            }
            if (!update) {
                rs.push({
                    id: message.link_id,
                    count: 1
                });
            }
            browser.storage.sync.set({ [olc]: rs });
        });
    }
});