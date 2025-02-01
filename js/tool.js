// tips
function showTooltip(x, y, msg) {
    const tooltip = document.createElement('div'); // 动态创建气泡元素
    tooltip.className = 'tooltip';
    tooltip.textContent = msg;
    document.body.appendChild(tooltip); // 将气泡添加到文档中

    // 设置气泡位置
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.opacity = 1;

    setTimeout(() => {
        tooltip.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(tooltip); // 移除气泡
        }, 300);
    }, 2000);
}