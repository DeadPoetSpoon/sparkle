var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  elements: [],

  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        "background-color": "#666",
        label: "data(label)",
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
        "label": "data(label)",
      },
    },
  ],

  layout: {
    name: "grid",
    rows: 1,
  },
});

async function loadOptions() {
  const authors = await import("./data/index-zh.js");
  const authorSelector = document.getElementById("auther-selector");
  const bookSelector = document.getElementById("book-selector");
  const versionSelector = document.getElementById("version-selector");
  
  for (const author of authors.default) {
    const option = document.createElement("option");
    option.value = author;
    option.textContent = author.name;
    authorSelector.appendChild(option);
  }
  
  authorSelector.addEventListener("change", async function(event) {
    const selectedAuthor = event.target.value;
    bookSelector.innerHTML = "";
    versionSelector.innerHTML = '<option selected value="default">default</option>';
    
    if (selectedAuthor && selectedAuthor.books) {
        for (const book of selectedAuthor.books) {
          const option = document.createElement("option");
          option.value = book;
          option.textContent = book.label;
          bookSelector.appendChild(option);
        }
    }
  });
  
  bookSelector.addEventListener("change", async function(event) {
    const selectedBook = event.target.value;
    versionSelector.innerHTML = '<option selected value="default">default</option>';
    
    if (selectedBook) {
      try {
        const versions = await import(`./data/${selectedBook}/index-zh.js`);
        for (const version of versions.default) {
          const option = document.createElement("option");
          option.value = version.version;
          option.textContent = version.label;
          versionSelector.appendChild(option);
        }
      } catch (error) {
        console.error(`Failed to load ${selectedBook}/index-zh.js:`, error);
      }
    }
  });
  
  versionSelector.addEventListener("change", async function(event) {
    const selectedAuthor = authorSelector.value;
    const selectedBook = bookSelector.value;
    const selectedVersion = versionSelector.value;
    
    if (selectedAuthor && selectedBook && selectedVersion) {
      await loadData(selectedAuthor, selectedBook, selectedVersion);
    }
  });
}

loadOptions();

async function loadData(author, book, version) {
  if (!book || !version) {
    return;
  }
  try {
    const module = await import(`./data/${book}/${book}-${version}.js`);
    const elements = module.default;
    cy.elements().remove();
    cy.add(elements);
    cy.layout({ name: "grid", rows: 1 }).run();
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

// document.getElementById("book-selector").addEventListener("change", function(event) {
//   const selectedBook = event.target.value;
//   if (selectedBook) {
//     loadData(selectedBook);
//   }
// });

cy.on("tap", "node", function(evt) {
  const node = evt.target;
  const nodeData = node.data();
  const nodeInfo = document.getElementById("node-info");
  nodeInfo.innerHTML = `
    <strong>Node Information:</strong><br>
    ID: ${nodeData.id}<br>
    Label: ${nodeData.label || "N/A"}
  `;
});

cy.on("tap", function(evt) {
  if (evt.target === cy) {
    document.getElementById("node-info").innerHTML = "bbb";
  }
});
