// 全屏功能
function adjustCytoscapeLayout() {
  // 调整Cytoscape布局，确保图形居中显示
  if (cy) {
    cy.resize();
    cy.center();
    cy.fit();

    // 添加一点边距，让图形不会贴边
    setTimeout(() => {
      if (cy) {
        const currentZoom = cy.zoom();
        if (currentZoom > 0.5) {
          cy.zoom(currentZoom * 0.9);
          cy.center();
        }
      }
    }, 50);
  }
}

function toggleFullscreen() {
  const cyContainer = document.getElementById("cy");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  if (!document.fullscreenElement) {
    // 进入全屏
    if (cyContainer.requestFullscreen) {
      cyContainer.requestFullscreen();
    } else if (cyContainer.webkitRequestFullscreen) {
      cyContainer.webkitRequestFullscreen();
    } else if (cyContainer.msRequestFullscreen) {
      cyContainer.msRequestFullscreen();
    }

    // 全屏时调整样式
    cyContainer.style.height = "calc(100vh - 2rem)";
    cyContainer.style.marginTop = "1rem";
    cyContainer.style.borderRadius = "0";
    cyContainer.style.backgroundColor = "var(--pico-background-color)";

    // 调整按钮位置
    fullscreenBtn.style.top = "2rem";
    fullscreenBtn.style.right = "2rem";

    // 更新按钮文本
    fullscreenBtn.innerHTML = "❎ 退出全屏";

    // 调整Cytoscape布局 - 使用setTimeout确保在全屏完全激活后执行
    setTimeout(adjustCytoscapeLayout, 100);
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    // 恢复原始样式
    cyContainer.style.height = "40em";
    cyContainer.style.marginTop = "0";
    cyContainer.style.borderRadius = "";
    cyContainer.style.backgroundColor = "";

    // 恢复按钮位置
    fullscreenBtn.style.top = "1rem";
    fullscreenBtn.style.right = "1rem";

    // 更新按钮文本
    fullscreenBtn.innerHTML = "⛶ 全屏";

    // 调整Cytoscape布局 - 使用setTimeout确保在退出全屏后执行
    setTimeout(adjustCytoscapeLayout, 100);
  }
}

// 监听全屏变化事件
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);

function handleFullscreenChange() {
  const cyContainer = document.getElementById("cy");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    // 用户退出了全屏
    cyContainer.style.height = "40em";
    cyContainer.style.marginTop = "0";
    cyContainer.style.borderRadius = "";
    cyContainer.style.backgroundColor = "";

    // 恢复按钮位置
    fullscreenBtn.style.top = "1rem";
    fullscreenBtn.style.right = "1rem";

    fullscreenBtn.innerHTML = "⛶ 全屏";

    // 确保图形居中显示
    setTimeout(adjustCytoscapeLayout, 100);
  } else {
    // 用户进入了全屏
    cyContainer.style.height = "calc(100vh - 2rem)";
    cyContainer.style.marginTop = "1rem";
    cyContainer.style.borderRadius = "0";
    cyContainer.style.backgroundColor = "var(--pico-background-color)";

    // 调整按钮位置
    fullscreenBtn.style.top = "2rem";
    fullscreenBtn.style.right = "2rem";

    fullscreenBtn.innerHTML = "❎ 退出全屏";

    // 调整Cytoscape布局
    setTimeout(adjustCytoscapeLayout, 100);
  }
}

// 初始化全屏按钮
document.addEventListener("DOMContentLoaded", function () {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      event.preventDefault();
      toggleFullscreen();
    });

    // 添加键盘快捷键支持 (F11 或 Esc)
    document.addEventListener("keydown", function (event) {
      if (event.key === "F11") {
        event.preventDefault();
        event.stopPropagation();
        toggleFullscreen();
      } else if (event.key === "Escape" && document.fullscreenElement) {
        // Esc 键退出全屏
        event.preventDefault();
        event.stopPropagation();
        toggleFullscreen();
      }
    });
  }
});

var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  elements: [],

  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        height: "8rem",
        width: "8rem",
        "background-color": "#666",
        "text-max-width": "80px",
        "text-wrap": "wrap",
        "text-overflow-wrap": "whitespace",
        label: "data(name)",
        "font-size": "data(fontSize)",
      },
    },

    {
      selector: "edge",
      style: {
        width: "2rem",
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "font-size": "data(edgeFontSize)",
        label: "data(name)",
      },
    },
  ],
});

// 缩放时自动调整文字大小 - 使用防抖优化性能
let zoomTimeout = null;
const baseNodeFontSize = 18;
const baseEdgeFontSize = 14;

cy.on("zoom", function () {
  // 使用防抖避免频繁更新
  if (zoomTimeout) {
    clearTimeout(zoomTimeout);
  }

  zoomTimeout = setTimeout(() => {
    const zoomLevel = cy.zoom();

    // 根据缩放级别计算新的字体大小
    const nodeFontSize = Math.max(1, baseNodeFontSize / zoomLevel);
    const edgeFontSize = Math.max(1, baseEdgeFontSize / zoomLevel);

    // 更新所有节点的字体大小数据
    cy.nodes().forEach((node) => {
      node.data("fontSize", nodeFontSize + "rem");
    });

    // 更新所有边的字体大小数据
    cy.edges().forEach((edge) => {
      edge.data("edgeFontSize", edgeFontSize + "rem");
    });
  }, 50); // 50ms防抖延迟
});

// 初始缩放级别设置
cy.on("ready", function () {
  // 设置初始缩放级别
  cy.fit();

  // 初始化字体大小数据
  const initialZoom = cy.zoom();
  const initialNodeFontSize = Math.max(1, baseNodeFontSize / initialZoom);
  const initialEdgeFontSize = Math.max(1, baseEdgeFontSize / initialZoom);

  cy.nodes().forEach((node) => {
    node.data("fontSize", initialNodeFontSize + "rem");
  });

  cy.edges().forEach((edge) => {
    edge.data("edgeFontSize", initialEdgeFontSize + "rem");
  });
});

let authors = [];
const authorSelector = document.getElementById("auther-selector");
const bookSelector = document.getElementById("book-selector");
const versionSelector = document.getElementById("version-selector");
const nodeInfo = document.getElementById("node-info");
const autherInfo = document.getElementById("auther-info");
async function loadOptions() {
  const authorsModule = await import("./data/index-zh.js");
  authors = authorsModule.default;
  for (const author of authors) {
    const option = document.createElement("option");
    option.value = author.id;
    option.textContent = author.name;
    authorSelector.appendChild(option);
  }

  authorSelector.addEventListener("change", async function (event) {
    const selectedAuthor = event.target.value;
    bookSelector.innerHTML =
      '<option selected disabled value="">著作...</option>';
    versionSelector.innerHTML =
      '<option selected disabled value="">版本...</option>';

    for (const auther of authors) {
      if (auther.id === selectedAuthor) {
        for (const book of auther.books) {
          const option = document.createElement("option");
          option.value = book.id;
          option.textContent = book.name;
          bookSelector.appendChild(option);
        }
        autherInfo.innerHTML = `
          <strong>${auther.name}</strong><br>
          ${auther.biography || "N/A"}<br>
          ${auther.description || "N/A"}
        `;
      }
    }
  });

  bookSelector.addEventListener("change", async function (event) {
    const selectedBook = event.target.value;
    versionSelector.innerHTML =
      '<option selected disabled value="">版本...</option>';
    if (selectedBook && selectedBook != "") {
      try {
        const versions = await import(`./data/${selectedBook}/index-zh.js`);
        for (const version of versions.default) {
          const option = document.createElement("option");
          option.value = version.version;
          option.textContent = version.name;
          versionSelector.appendChild(option);
        }
      } catch (error) {
        console.error(`Failed to load ${selectedBook}/index-zh.js:`, error);
      }
    }
  });

  versionSelector.addEventListener("change", async function (event) {
    const selectedBook = bookSelector.value;
    const selectedVersion = versionSelector.value;

    if (selectedBook && selectedVersion) {
      await loadData(selectedBook, selectedVersion);
    }
  });
}

loadOptions();

async function loadData(book, version) {
  if (!book || !version) {
    return;
  }
  try {
    const module = await import(`./data/${book}/${version}.js`);
    const elements = module.default;
    cy.elements().remove();

    // 初始化字体大小数据
    const initialZoom = cy.zoom();
    const initialNodeFontSize = Math.max(1, baseNodeFontSize / initialZoom);
    const initialEdgeFontSize = Math.max(1, baseEdgeFontSize / initialZoom);

    // 为元素添加字体大小数据
    const elementsWithFontSize = elements.map((element) => {
      if (element.data) {
        if (element.group === "nodes") {
          element.data.fontSize = initialNodeFontSize + "rem";
        } else if (element.group === "edges") {
          element.data.edgeFontSize = initialEdgeFontSize + "rem";
        }
      }
      return element;
    });

    cy.add(elementsWithFontSize);
    cy.layout({
      name: "cose",
      nodeOverlap: 60,
      avoidOverlap: true,
    }).run();
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

cy.on("tap", "node", function (evt) {
  // 检查是否点击了全屏按钮
  if (
    evt.originalEvent &&
    evt.originalEvent.target &&
    evt.originalEvent.target.id === "fullscreen-btn"
  ) {
    return;
  }

  const node = evt.target;
  const nodeData = node.data();

  nodeInfo.innerHTML = `
    <strong>[${nodeData.id}]${nodeData.name}(${nodeData.gender})</strong><br>
    ${nodeData.nickname ? nodeData.nickname.join(", ") : "N/A"}<br>
  `;
});

cy.on("tap", function (evt) {
  // 检查是否点击了全屏按钮
  if (
    evt.originalEvent &&
    evt.originalEvent.target &&
    evt.originalEvent.target.id === "fullscreen-btn"
  ) {
    return;
  }

  if (evt.target === cy) {
    nodeInfo = "";
  }
});
