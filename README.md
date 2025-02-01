# Otab2
<a href="https://addons.mozilla.org/zh-CN/firefox/addon/otab-23/" style="font-size:20px;">A simple firefox ext</a>

### Icon from：<a href="https://www.svgrepo.com">svgrepo</a>

### BIG CHANGE
修改了图标、版本号、EXT-id



#### 0.1.5 25-02-01 20
1. 修改设置按钮图标、优化设置页面布局，样式，交互
2. 修改 manifest pages => options_ui
3. Otab2 => Otab
4. 修改图钉样式和提示
5. 优化多链接下的背景样式
6. 右键菜单添加复制链接
7. 添加主页设置
8. 优化缓存区逻辑：现在如果存在不在文件夹中的链接时，不会再创建一个名为`缓存区`的文件夹并将链接移入，
   取而代之的是当存在文件夹外的链接时，才在侧边栏显示`缓存区`文件夹，书签的内容不会移动，点击缓存区后展示位于文件夹外的链接。