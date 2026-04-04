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
      '<option selected disabled value="">Select book...</option>';
    versionSelector.innerHTML =
      '<option selected disabled value="">Select version...</option>';

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
      '<option selected disabled value="">Select version...</option>';
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
  const node = evt.target;
  const nodeData = node.data();

  nodeInfo.innerHTML = `
    <strong>[${nodeData.id}]${nodeData.name}(${nodeData.gender})</strong><br>
    ${nodeData.nickname ? nodeData.nickname.join(", ") : "N/A"}<br>
  `;
});

cy.on("tap", function (evt) {
  if (evt.target === cy) {
    nodeInfo = "";
  }
});
