# Sparkle ✨

> 那些人啊，繁星闪闪

一个文学作品人物关系可视化工具，让你直观地探索小说中人物之间的联系。基于 GNU General Public License v3.0 开源。

[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/DeadPoetSpoon/sparkle/blob/main/LICENSE)  [![GitHub stars](https://img.shields.io/github/stars/DeadPoetSpoon/sparkle.svg)](https://github.com/DeadPoetSpoon/sparkle/stargazers)

## 简介

Sparkle 是一个基于 Web 的文学作品人物关系可视化工具。它使用交互式图谱展示小说中人物之间的关系网络，帮助读者更好地理解和探索文学作品中的人物关系。

### 主要功能

- 📚 多作者作品支持
- 🔍 人物关系可视化展示
- 🖱️ 交互式缩放、拖拽操作
- 🔄 多版本切换
- 🖥️ 全屏查看模式

## 技术栈

- **[Cytoscape.js](https://js.cytoscape.org/)** - 强大的图可视化库
- **[Pico CSS](https://picocss.com/)** - 轻量、优雅的 CSS 框架
- **原生 JavaScript (ES6+)** - 无需复杂的构建工具
- **模块化架构** - 使用 ES modules 组织代码

## 项目结构

```
sparkle/
├── index.html              # 主页面
├── about.html              # 关于页面
├── add-book.html           # 添加书籍页面
├── app.js                  # 主应用逻辑
├── cytoscape.min.js        # Cytoscape.js 库
├── pico.min.css            # Pico CSS 样式
├── favicon.ico             # 网站图标
├── LICENSE                 # 许可证文件
├── README.md               # 项目说明
├── data/                   # 数据目录
│   ├── index-zh.js         # 作者和作品索引
│   └── [book-id]/          # 具体书籍数据
│       ├── index-zh.js     # 版本索引
│       └── [version].js    # 人物关系数据
```

## 快速开始

### 直接访问

如果你不想在本地运行，可以直接访问以下在线部署：

- 🌐 **GitHub Pages**: https://deadpoetspoon.github.io/sparkle/
- 🌐 **Netlify**: https://sparkle-spoon.netlify.app/

### 前置要求

- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 本地 Web 服务器（推荐使用 Live Server 或 Python 内置服务器）

### 本地运行

1. 克隆项目到本地

```bash
git clone https://github.com/DeadPoetSpoon/sparkle.git
cd sparkle
```

2. 启动本地服务器

使用 Python 3：
```bash
python -m http.server 8000
```

或者使用 Node.js 的 http-server：
```bash
npx http-server -p 8000
```

3. 在浏览器中访问

```
http://localhost:8000
```

## 使用说明

### 浏览现有作品

1. 在页面顶部的下拉菜单中选择**作者**
2. 选择该作者的**作品**
3. 选择**版本**（如果有多个版本）
4. 人物关系图谱将自动加载并显示

### 交互操作

- **缩放**：使用鼠标滚轮或触摸板进行缩放
- **平移**：拖拽画布背景进行平移
- **查看信息**：点击节点查看人物详细信息
- **适应视图**：双击画布背景可以适应视图
- **全屏查看**：点击关系图右上角的 ⛶ 全屏 按钮或按 `F11` 键进入全屏模式，获得更好的浏览体验。按 `Esc` 键或再次点击按钮（显示为 ❎ 退出全屏）可退出全屏模式

### 添加新作品

1. 点击导航栏的"添加书籍"按钮
2. 按照数据格式准备你的人物关系数据
3. 将数据文件放入 `data` 目录的相应位置
4. 更新 `data/index-zh.js` 添加新作品信息

## 数据格式

### 作者和作品索引格式 (`data/index-zh.js`)

```javascript
export default [
  {
    id: "author-id",
    name: "作者姓名",
    biography: "作者生平",
    description: "作者介绍",
    books: [
      {
        id: "book-id",
        name: "作品名称",
      },
    ],
  },
];
```

### 人物关系数据格式

```javascript
export default [
  // 节点（人物）
  {
    group: "nodes",
    data: {
      id: "character-id",
      name: "人物姓名",
      gender: "性别",
      nickname: ["别名1", "别名2"],
    },
  },
  // 边（关系）
  {
    group: "edges",
    data: {
      id: "relationship-id",
      source: "character-id-1",
      target: "character-id-2",
      name: "关系描述",
    },
  },
];
```

## 贡献方式

我们欢迎任何形式的贡献！如果你想为 Sparkle 做出贡献，请遵循以下步骤：

### 报告问题

1. 前往 [Issues](https://github.com/DeadPoetSpoon/sparkle/issues) 页面
2. 搜索是否已有相关问题
3. 如果没有，创建新的 Issue，详细描述问题和复现步骤

### 提交代码

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 添加新作品数据

如果你想为 Sparkle 添加新的文学作品数据，请参考详细的 [ADD-BOOK.md](ADD-BOOK.md) 文档，其中包含了：

1. 完整的数据结构说明
2. 详细的添加流程
3. 数据格式示例
4. 常见问题解答
5. 数据准备工具建议

提交 Pull Request 时请详细描述作品信息。

## 许可证

本项目采用 GNU General Public License v3.0 (GPLv3) 许可证 - 查看 [LICENSE](LICENSE) 文件了解完整许可证条款。

### GPLv3 主要特点

- **自由使用**：任何人都可以自由使用、修改和分发本软件
- **开源要求**：任何基于本软件的衍生作品必须以相同的许可证开源
- **专利保护**：包含明确的专利授权条款
- **兼容性**：与许多其他开源许可证兼容

**重要提示**：如果你对本软件进行了修改并重新分发，必须：
1. 提供完整的源代码
2. 保留原有的版权声明
3. 使用相同的 GPLv3 许可证
4. 提供明确的修改说明

有关完整的许可证条款，请查看项目根目录下的 [LICENSE](LICENSE) 文件。

## 支持作者

如果你觉得这个项目对你有帮助，欢迎支持作者：

- ☕ [请作者喝一杯咖啡](https://ifdian.net/a/deadpoetspoon)
- ⭐ 在 GitHub 上给项目点个 Star
- 🔄 分享给你的朋友

## 致谢

- 感谢所有文学创作者为我们带来精彩的作品
- 感谢 [Cytoscape.js](https://js.cytoscape.org/) 提供强大的图可视化功能
- 感谢 [Pico CSS](https://picocss.com/) 提供优雅的样式框架

---

<p align="center">
  Made with ❤️ for literature lovers
</p>
