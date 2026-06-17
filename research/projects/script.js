const projects = window.PROJECTS_DATA || window.PROJECTS || [];
const state = {
  q: "",
  category: "All",
  tool: "All",
  algorithm: "All",
  categoryQuery: "",
  toolQuery: "",
  algorithmQuery: "",
  sort: "upload",
  page: 1,
  perPage: 10
};

const grid = document.getElementById("project-grid");
const count = document.getElementById("project-count");
const empty = document.getElementById("empty-state");
const search = document.getElementById("project-search");
const clearBtn = document.getElementById("clear-search");
const catWrap = document.getElementById("category-filters");
const toolWrap = document.getElementById("tool-filters");
const algorithmWrap = document.getElementById("algorithm-filters");
const categoryFilterSearch = document.getElementById("category-filter-search");
const toolFilterSearch = document.getElementById("tool-filter-search");
const algorithmFilterSearch = document.getElementById("algorithm-filter-search");
const filterBlocks = document.querySelectorAll("[data-filter-block]");
const filterMoreButtons = document.querySelectorAll("[data-filter-more]");
const pagination = document.getElementById("pagination");
const sortWrap = document.getElementById("sort-wrap");
const sortToggle = document.getElementById("project-sort-toggle");
const sortMenu = document.getElementById("project-sort-menu");
const sortLabel = document.getElementById("project-sort-label");
const quickFilterButtons = document.querySelectorAll("[data-quick-category]");

const categories = ["All", ...new Set(projects.flatMap(p => [p.category, ...p.meta.filter(item => !/^\d{4}$/.test(String(item)))]))];
const tools = ["All", ...new Set(projects.flatMap(p => p.tools))];
const algorithms = ["All", ...new Set(projects.flatMap(p => p.tags))];
const sortLabels = {
  upload: "Upload order",
  alphabet: "Alphabet A-Z",
  "year-desc": "Newest year",
  "year-asc": "Oldest year"
};

function makeChip(value, type) {
  const btn = document.createElement("button");
  btn.className = "filter-chip";
  btn.textContent = value;
  btn.dataset.value = value;
  btn.onclick = () => {
    state[type] = value;
    state.page = 1;
    render();
  };
  return btn;
}

function updateFilterControls() {
  const configs = [
    {name:"category", list:catWrap, total:document.getElementById("category-total"), values:categories},
    {name:"tool", list:toolWrap, total:document.getElementById("tool-total"), values:tools},
    {name:"algorithm", list:algorithmWrap, total:document.getElementById("algorithm-total"), values:algorithms}
  ];

  requestAnimationFrame(() => {
    configs.forEach(({name, list, total, values}) => {
      const block = document.querySelector(`[data-filter-block="${name}"]`);
      const button = document.querySelector(`[data-filter-more="${name}"]`);
      if (!block || !button) return;
      total.textContent = `${Math.max(values.length - 1, 0)} items`;
      const hasMore = list.scrollHeight > list.clientHeight + 4;
      block.classList.toggle("has-more", hasMore);
      if (!hasMore) block.classList.remove("expanded");
      button.firstChild.nodeValue = block.classList.contains("expanded") ? "Show less " : "Show more ";
    });
  });
}

function filterValues(values, query) {
  const q = query.toLowerCase().trim();
  if (!q) return values;
  return values.filter(value => value === "All" || value.toLowerCase().includes(q));
}

function renderFilterGroup(wrap, values, type, query) {
  const visibleValues = filterValues(values, query);
  wrap.innerHTML = "";
  if (visibleValues.length === 1 && query.trim()) {
    wrap.appendChild(makeChip("All", type));
    const empty = document.createElement("span");
    empty.className = "filter-empty-mini";
    empty.textContent = "No match";
    wrap.appendChild(empty);
    return;
  }
  visibleValues.forEach(value => wrap.appendChild(makeChip(value, type)));
}

function renderChips() {
  renderFilterGroup(catWrap, categories, "category", state.categoryQuery);
  renderFilterGroup(toolWrap, tools, "tool", state.toolQuery);
  renderFilterGroup(algorithmWrap, algorithms, "algorithm", state.algorithmQuery);
  updateFilterControls();
}

function matches(p) {
  const q = state.q.toLowerCase().trim();
  const haystack = [
    p.title, p.category, p.desc,
    ...p.meta, ...p.tools, ...p.tags
  ].join(" ").toLowerCase();

  return (!q || haystack.includes(q)) &&
         (state.category === "All" || p.category === state.category || p.meta.includes(state.category)) &&
         (state.tool === "All" || p.tools.includes(state.tool)) &&
         (state.algorithm === "All" || p.tags.includes(state.algorithm));
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPreviewChips(items, chipClass, limit) {
  const safeItems = Array.isArray(items) ? [...new Set(items.filter(Boolean))] : [];
  const visible = safeItems.slice(0, limit);
  const hidden = safeItems.slice(limit);
  const chips = visible
    .map(item => `<span class="${chipClass}" title="${escapeHTML(item)}">${escapeHTML(item)}</span>`)
    .join("");

  if (!hidden.length) return chips;

  return chips + `<span class="chip-more" title="Full list appears inside the hover panel">+${hidden.length}</span>`;
}

function renderAllChips(items, chipClass) {
  const safeItems = Array.isArray(items) ? [...new Set(items.filter(Boolean))] : [];
  return safeItems
    .map(item => `<span class="${chipClass}" title="${escapeHTML(item)}">${escapeHTML(item)}</span>`)
    .join("");
}

function renderFullChips(items, chipClass) {
  const safeItems = Array.isArray(items) ? [...new Set(items.filter(Boolean))] : [];
  return safeItems
    .map(item => `<span class="${chipClass}" title="${escapeHTML(item)}">${escapeHTML(item)}</span>`)
    .join("");
}

function card(p) {
  const toolCount = Array.isArray(p.tools) ? new Set(p.tools.filter(Boolean)).size : 0;
  const tagCount = Array.isArray(p.tags) ? new Set(p.tags.filter(Boolean)).size : 0;
  const richCard = toolCount + tagCount > 28;
  const previewToolLimit = 4;
  const previewTagLimit = 4;

  return `<a class="project-card${richCard ? " rich-card" : ""}" href="${p.href}" target="_blank" rel="noopener" aria-label="Open ${escapeHTML(p.title)} project page">
    <div class="thumb" style="--image:${p.image}"></div>
    <div class="card-content">
      <div class="tool-row compact-row meta-row">${renderAllChips([p.category, ...p.meta], "status")}</div>
      <h3 class="project-title">${escapeHTML(p.title)}</h3>
      <p class="project-desc">${escapeHTML(p.desc)}</p>
      <div class="card-taxonomy">
        <div class="taxonomy-line">
          <span class="taxonomy-label">Tools</span>
          <div class="tool-row compact-row">${renderPreviewChips(p.tools, "tool", previewToolLimit)}</div>
        </div>
        <div class="taxonomy-line">
          <span class="taxonomy-label">Algorithms</span>
          <div class="tag-row compact-row">${renderPreviewChips(p.tags, "tag", previewTagLimit)}</div>
        </div>
      </div>
    </div>
    <div class="card-detail-panel" aria-hidden="true">
      <div class="detail-head">
        <span>Complete project labels</span>
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </div>
      <p>${escapeHTML(p.desc)}</p>
      <div class="detail-group">
        <strong>Project</strong>
        <div class="detail-chips">${renderFullChips([p.category, ...p.meta], "status")}</div>
      </div>
      <div class="detail-group">
        <strong>Tools</strong>
        <div class="detail-chips">${renderFullChips(p.tools, "tool")}</div>
      </div>
      <div class="detail-group">
        <strong>Algorithms</strong>
        <div class="detail-chips">${renderFullChips(p.tags, "tag")}</div>
      </div>
    </div>
  </a>`;
}

function filteredProjects() {
  const list = projects.filter(matches).map((project, index) => ({ project, index }));

  if (state.sort === "alphabet") {
    list.sort((a, b) => a.project.title.localeCompare(b.project.title));
  } else if (state.sort === "year-desc") {
    list.sort((a, b) => Number(b.project.meta[0]) - Number(a.project.meta[0]) || a.index - b.index);
  } else if (state.sort === "year-asc") {
    list.sort((a, b) => Number(a.project.meta[0]) - Number(b.project.meta[0]) || a.index - b.index);
  }

  return list.map(item => item.project);
}

function renderPagination(totalPages) {
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.innerHTML = "←";
  prev.disabled = state.page === 1;
  prev.onclick = () => {
    if (state.page > 1) {
      state.page--;
      render();
      document.getElementById("catalog").scrollIntoView({behavior:"smooth", block:"start"});
    }
  };
  pagination.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === state.page ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => {
      state.page = i;
      render();
      document.getElementById("catalog").scrollIntoView({behavior:"smooth", block:"start"});
    };
    pagination.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "page-btn";
  next.innerHTML = "→";
  next.disabled = state.page === totalPages;
  next.onclick = () => {
    if (state.page < totalPages) {
      state.page++;
      render();
      document.getElementById("catalog").scrollIntoView({behavior:"smooth", block:"start"});
    }
  };
  pagination.appendChild(next);
}

function render() {
  const list = filteredProjects();
  const totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * state.perPage;
  const visible = list.slice(start, start + state.perPage);

  grid.innerHTML = visible.map(card).join("");
  empty.hidden = list.length !== 0;
  count.textContent = list.length
    ? `Showing ${start + 1}–${Math.min(start + state.perPage, list.length)} of ${list.length}`
    : "0 projects";

  document.querySelectorAll("#category-filters .filter-chip").forEach(b => b.classList.toggle("active", b.dataset.value === state.category));
  document.querySelectorAll("#tool-filters .filter-chip").forEach(b => b.classList.toggle("active", b.dataset.value === state.tool));
  document.querySelectorAll("#algorithm-filters .filter-chip").forEach(b => b.classList.toggle("active", b.dataset.value === state.algorithm));
  document.querySelectorAll(".sort-option").forEach(b => b.classList.toggle("active", b.dataset.sort === state.sort));
  quickFilterButtons.forEach(b => b.classList.toggle("active", b.dataset.quickCategory === state.category));
  sortLabel.textContent = sortLabels[state.sort];

  renderPagination(totalPages);
}

quickFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.quickCategory;
    state.q = "";
    state.category = value;
    state.tool = "All";
    state.algorithm = "All";
    state.categoryQuery = "";
    state.toolQuery = "";
    state.algorithmQuery = "";
    state.page = 1;
    search.value = "";
    categoryFilterSearch.value = "";
    toolFilterSearch.value = "";
    algorithmFilterSearch.value = "";
    renderChips();
    render();
    document.getElementById("catalog").scrollIntoView({behavior:"smooth", block:"start"});
  });
});

search.addEventListener("input", e => {
  state.q = e.target.value;
  state.page = 1;
  render();
});

categoryFilterSearch.addEventListener("input", e => {
  state.categoryQuery = e.target.value;
  renderChips();
  render();
});

toolFilterSearch.addEventListener("input", e => {
  state.toolQuery = e.target.value;
  renderChips();
  render();
});

algorithmFilterSearch.addEventListener("input", e => {
  state.algorithmQuery = e.target.value;
  renderChips();
  render();
});

sortToggle.addEventListener("click", () => {
  const isOpen = sortMenu.classList.toggle("open");
  sortToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".sort-option").forEach(btn => {
  btn.addEventListener("click", () => {
    state.sort = btn.dataset.sort;
    state.page = 1;
    sortMenu.classList.remove("open");
    sortToggle.setAttribute("aria-expanded", "false");
    render();
  });
});

document.addEventListener("click", e => {
  if (!sortWrap.contains(e.target)) {
    sortMenu.classList.remove("open");
    sortToggle.setAttribute("aria-expanded", "false");
  }
});


filterMoreButtons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.filterMore;
    const block = document.querySelector(`[data-filter-block="${name}"]`);
    if (!block) return;
    block.classList.toggle("expanded");
    button.firstChild.nodeValue = block.classList.contains("expanded") ? "Show less " : "Show more ";
  });
});

window.addEventListener("resize", updateFilterControls);

clearBtn.addEventListener("click", () => {
  state.q = "";
  state.category = "All";
  state.tool = "All";
  state.algorithm = "All";
  state.categoryQuery = "";
  state.toolQuery = "";
  state.algorithmQuery = "";
  state.sort = "upload";
  state.page = 1;
  search.value = "";
  categoryFilterSearch.value = "";
  toolFilterSearch.value = "";
  algorithmFilterSearch.value = "";
  renderChips();
  sortMenu.classList.remove("open");
  sortToggle.setAttribute("aria-expanded", "false");
  render();
});

window.addEventListener("scroll", () => document.querySelector("nav").classList.toggle("scrolled", window.scrollY > 30));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, {threshold: 0.12});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

renderChips();
render();
