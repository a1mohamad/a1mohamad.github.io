const projects = [
  {
    "title": "Titanic Survival Prediction Engine",
    "category": "Deep Learning",
    "status": "Featured",
    "year": "2026",
    "importance": "Core",
    "desc": "Feature-rich survival modeling with LightGBM + Random Forest age imputation, engineered social/family/cabin signals, and a 9-fold TensorFlow/Keras neural network.",
    "tools": [
      "Python",
      "Pandas",
      "TensorFlow",
      "Keras",
      "LightGBM",
      "Scikit-Learn"
    ],
    "tags": [
      "Classification",
      "Feature Engineering",
      "K-Fold CV",
      "Kaggle"
    ],
    "href": "https://a1mohamad.github.io/research/titanic/index.html",
    "image": "linear-gradient(135deg, rgba(99,102,241,.35), rgba(5,5,8,.8)), url(assets/projects/titanic.jpg)"
  },
  {
    "title": "Tesla Stock Direction Forecasting",
    "category": "Financial ML",
    "status": "Featured",
    "year": "2026",
    "importance": "High",
    "desc": "Next-day Tesla market direction modeling from OHLC signals, engineered trading features, and classifier comparison including XGBoost and Logistic Regression.",
    "tools": [
      "Python",
      "Pandas",
      "XGBoost",
      "Scikit-Learn",
      "Matplotlib",
      "Seaborn"
    ],
    "tags": [
      "Finance",
      "OHLC",
      "Classification",
      "ROC-AUC"
    ],
    "href": "https://a1mohamad.github.io/research/tesla-stock/index.html",
    "image": "linear-gradient(135deg, rgba(16,185,129,.28), rgba(5,5,8,.82)), url(assets/projects/tesla-stock.jpg)"
  },
  {
    "title": "Breast Cancer Diagnostic Classifier",
    "category": "Medical AI",
    "status": "Featured",
    "year": "2026",
    "importance": "High",
    "desc": "Wisconsin Breast Cancer diagnosis pipeline using ADASYN augmentation, seven model families, XGBoost benchmarking, and majority-vote ensemble analysis.",
    "tools": [
      "Python",
      "Scikit-Learn",
      "XGBoost",
      "Imbalanced-Learn",
      "Pandas",
      "Seaborn"
    ],
    "tags": [
      "Healthcare",
      "ADASYN",
      "Ensemble",
      "Diagnostics"
    ],
    "href": "https://a1mohamad.github.io/research/breast-cancer/index.html",
    "image": "linear-gradient(135deg, rgba(236,72,153,.30), rgba(5,5,8,.82)), url(assets/projects/breast-cancer.jpg)"
  },
  {
    "title": "Multi-Disease Identification",
    "category": "Medical AI",
    "status": "Research",
    "year": "2026",
    "importance": "High",
    "desc": "Deep-learning-oriented diagnostic system for identifying disease categories through structured validation and medical prediction workflow design.",
    "tools": [
      "Python",
      "TensorFlow",
      "Keras",
      "CNN",
      "NumPy",
      "Pandas"
    ],
    "tags": [
      "Medical AI",
      "CNN",
      "Deep Learning",
      "Classification"
    ],
    "href": "https://a1mohamad.github.io/research/multi-diseases/index.html",
    "image": "linear-gradient(135deg, rgba(14,165,233,.28), rgba(5,5,8,.82)), url(assets/projects/multi-disease.jpg)"
  },
  {
    "title": "Wine Quality Chemical Classifier",
    "category": "Machine Learning",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "Chemical quality prediction using physicochemical wine attributes, MinMax scaling, and model comparison across Logistic Regression, SVC, and XGBoost.",
    "tools": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "XGBoost"
    ],
    "tags": [
      "Classification",
      "ROC-AUC",
      "SVC",
      "XGBoost"
    ],
    "href": "https://a1mohamad.github.io/research/wine-quality/index.html",
    "image": "linear-gradient(135deg, rgba(168,85,247,.30), rgba(5,5,8,.82)), url(assets/projects/wine-quality.jpg)"
  },
  {
    "title": "Cardiovascular Risk Diagnostics",
    "category": "Medical AI",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "10-year coronary heart disease risk prediction from clinical records using mean imputation, Logistic Regression, and LogisticRegressionCV.",
    "tools": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Matplotlib"
    ],
    "tags": [
      "Clinical ML",
      "Risk Prediction",
      "Logistic Regression"
    ],
    "href": "https://a1mohamad.github.io/research/heart-disease/index.html",
    "image": "linear-gradient(135deg, rgba(248,113,113,.30), rgba(5,5,8,.82)), url(assets/projects/heart-disease.jpg)"
  },
  {
    "title": "House Price Prediction Engine",
    "category": "Regression",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "Residential price regression suite comparing SVR, Random Forest, Linear Regression, and optional CatBoost after cleaning and one-hot encoding.",
    "tools": [
      "Python",
      "Pandas",
      "Scikit-Learn",
      "CatBoost",
      "Matplotlib",
      "Seaborn"
    ],
    "tags": [
      "Regression",
      "SVR",
      "Random Forest",
      "CatBoost"
    ],
    "href": "https://a1mohamad.github.io/research/house-price/index.html",
    "image": "linear-gradient(135deg, rgba(245,158,11,.30), rgba(5,5,8,.82)), url(assets/projects/house-price.jpg)"
  },
  {
    "title": "California Housing Regression",
    "category": "Regression",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "Median California house value prediction from census block statistics using Linear Regression and standard regression diagnostics including MSE and MAE.",
    "tools": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Matplotlib",
      "Seaborn"
    ],
    "tags": [
      "Regression",
      "Linear Regression",
      "MSE",
      "MAE"
    ],
    "href": "https://a1mohamad.github.io/research/california-housing/index.html",
    "image": "linear-gradient(135deg, rgba(20,184,166,.28), rgba(5,5,8,.82)), url(assets/projects/california-housing.jpg)"
  },
  {
    "title": "Zomato Restaurant Market Analysis",
    "category": "Data Analysis",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "Restaurant ecosystem analysis covering online orders, table booking, ratings, votes, approximate costs, and consumer behavior through EDA.",
    "tools": [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn"
    ],
    "tags": [
      "EDA",
      "Market Analysis",
      "Visualization",
      "Consumer Behavior"
    ],
    "href": "https://a1mohamad.github.io/research/zomato-analysis/index.html",
    "image": "linear-gradient(135deg, rgba(249,115,22,.30), rgba(5,5,8,.82)), url(assets/projects/zomato-analysis.jpg)"
  },
  {
    "title": "New York Times Scraping Engine",
    "category": "Data Engineering",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "Automated news extraction pipeline combining RSS/XML feeds, DOM parsing, text-density extraction, newspaper3k, BeautifulSoup, and lxml.",
    "tools": [
      "Python",
      "feedparser",
      "newspaper3k",
      "BeautifulSoup",
      "lxml"
    ],
    "tags": [
      "Web Scraping",
      "RSS",
      "DOM Parsing",
      "Automation"
    ],
    "href": "https://a1mohamad.github.io/research/NewYorkTimes-scraping/index.html",
    "image": "linear-gradient(135deg, rgba(148,163,184,.28), rgba(5,5,8,.82)), url(assets/projects/nytimes-scraping.jpg)"
  },
  {
    "title": "Loan Approval Predictive System",
    "category": "Machine Learning",
    "status": "Complete",
    "year": "2026",
    "importance": "Medium",
    "desc": "Retail loan approval classification using data cleaning, categorical encoding, and comparison of Logistic Regression, SVC, KNN, and Random Forest.",
    "tools": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Seaborn"
    ],
    "tags": [
      "Classification",
      "Credit Risk",
      "KNN",
      "Random Forest"
    ],
    "href": "https://a1mohamad.github.io/research/loan-approval/index.html",
    "image": "linear-gradient(135deg, rgba(99,102,241,.24), rgba(5,5,8,.82)), url(assets/projects/loan-approval.jpg)"
  }
];

const state = {
  q: "",
  category: "All",
  tool: "All",
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
const pagination = document.getElementById("pagination");

const categories = ["All", ...new Set(projects.map(p => p.category))];
const tools = ["All", "Python", "Pandas", "Scikit-Learn", "TensorFlow", "Keras", "XGBoost", "LightGBM", "CatBoost", "Seaborn"];

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

function renderChips() {
  catWrap.innerHTML = "";
  toolWrap.innerHTML = "";
  categories.forEach(c => catWrap.appendChild(makeChip(c, "category")));
  tools.forEach(t => toolWrap.appendChild(makeChip(t, "tool")));
}

function matches(p) {
  const q = state.q.toLowerCase().trim();
  const haystack = [
    p.title, p.category, p.status, p.year, p.importance, p.desc,
    ...p.tools, ...p.tags
  ].join(" ").toLowerCase();

  return (!q || haystack.includes(q)) &&
         (state.category === "All" || p.category === state.category) &&
         (state.tool === "All" || p.tools.includes(state.tool));
}

function card(p) {
  return `<a class="project-card" href="${p.href}" target="_blank" rel="noopener">
    <div class="thumb" style="--image:${p.image}"></div>
    <div>
      <div class="tool-row"><span class="status">${p.status}</span><span class="status">${p.category}</span><span class="status">${p.year}</span></div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="tool-row">${p.tools.slice(0, 6).map(t => `<span class="tool">${t}</span>`).join("")}</div>
      <div class="tag-row" style="margin-top:8px">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </div>
  </a>`;
}

function filteredProjects() {
  return projects.filter(matches);
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

  renderPagination(totalPages);
}

search.addEventListener("input", e => {
  state.q = e.target.value;
  state.page = 1;
  render();
});

clearBtn.addEventListener("click", () => {
  state.q = "";
  state.category = "All";
  state.tool = "All";
  state.page = 1;
  search.value = "";
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
