var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  elements: [],

  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        "background-color": "#666",
        label: "data(name)",
      },
    },

    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(name)",
      },
    },
  ],

  layout: {
    name: "grid",
    rows: 1,
  },
});

let authors = [];
async function loadOptions() {
  const authorsModule = await import("./data/index-zh.js");
  authors = authorsModule.default;
  const authorSelector = document.getElementById("auther-selector");
  const bookSelector = document.getElementById("book-selector");
  const versionSelector = document.getElementById("version-selector");

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
    cy.add(elements);
    cy.layout({ name: "grid", rows: 1 }).run();
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

cy.on("tap", "node", function (evt) {
  const node = evt.target;
  const nodeData = node.data();
  const nodeInfo = document.getElementById("node-info");
  nodeInfo.innerHTML = `
    <strong>Node Information:</strong><br>
    ID: ${nodeData.id}<br>
    Label: ${nodeData.label || "N/A"}
  `;
});

cy.on("tap", function (evt) {
  if (evt.target === cy) {
    document.getElementById("node-info").innerHTML = "bbb";
  }
});
