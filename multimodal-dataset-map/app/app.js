const state = {
  catalog: [],
  filters: {
    query: "",
    source_label: new Set(),
    dataset_role_label: new Set(),
    openness_label: new Set(),
    modalities: new Set(),
    data_supervision: new Set(),
    language_granularity: new Set(),
    task_families: new Set(),
    concept_types: new Set(),
    environments: new Set(),
    year: "all",
  },
  sort: "role",
  matrixPreset: "task_modality",
  matrixScope: "all",
};

const filterDefs = [
  ["sourceFilters", "Source", "source_label"],
  ["roleFilters", "Dataset Role", "dataset_role_label"],
  ["opennessFilters", "Open Data", "openness_label"],
  ["modalityFilters", "Modality", "modalities"],
  ["supervisionFilters", "Data Supervision", "data_supervision"],
  ["languageFilters", "Language Annotation", "language_granularity"],
  ["taskFilters", "Task", "task_families"],
  ["conceptFilters", "Concept", "concept_types"],
  ["environmentFilters", "Environment", "environments"],
];

const modalityColumns = ["vision", "tactile", "audio", "force", "proprioception", "thermal", "language", "point cloud / 3D"];

const sourceLabels = {
  professor_survey_raw: "Professor Survey",
  dongyu_survey_raw: "Supplement",
  datasets_bot_raw: "Supplement",
};

const matrixPresets = {
  task_modality: {
    rowLabel: "Task family",
    colLabel: "Modality",
    rows: (items) => uniqueValues(items, (item) => item.task_families),
    cols: (items) => modalityColumns.filter((modality) => items.some((item) => item.modalities.includes(modality))),
    rowHas: (item, value) => item.task_families.includes(value),
    colHas: (item, value) => item.modalities.includes(value),
    subtitle: "Task coverage by sensor/language modality",
  },
  task_supervision: {
    rowLabel: "Task family",
    colLabel: "Data supervision",
    rows: (items) => uniqueValues(items, (item) => item.task_families),
    cols: (items) => uniqueValues(items, (item) => item.data_supervision),
    rowHas: (item, value) => item.task_families.includes(value),
    colHas: (item, value) => item.data_supervision.includes(value),
    subtitle: "Which task families have demonstrations, labels, simulation supervision, and self-supervised pairs",
  },
  concept_modality: {
    rowLabel: "Concept",
    colLabel: "Modality",
    rows: (items) => uniqueValues(items, (item) => item.concept_types),
    cols: (items) => modalityColumns.filter((modality) => items.some((item) => item.modalities.includes(modality))),
    rowHas: (item, value) => item.concept_types.includes(value),
    colHas: (item, value) => item.modalities.includes(value),
    subtitle: "Grounded concept types by perceptual channel",
  },
  environment_supervision: {
    rowLabel: "Environment",
    colLabel: "Data supervision",
    rows: (items) => uniqueValues(items, (item) => item.environments),
    cols: (items) => uniqueValues(items, (item) => item.data_supervision),
    rowHas: (item, value) => item.environments.includes(value),
    colHas: (item, value) => item.data_supervision.includes(value),
    subtitle: "Data-supervision coverage across real, simulated, human, web, and offline data",
  },
  modality_openness: {
    rowLabel: "Modality",
    colLabel: "Open data",
    rows: (items) => modalityColumns.filter((modality) => items.some((item) => item.modalities.includes(modality))),
    cols: () => ["open / public", "partial or indirect", "unknown", "not open"],
    rowHas: (item, value) => item.modalities.includes(value),
    colHas: (item, value) => item.openness_label === value,
    subtitle: "Where modalities are open, partial, unknown, or closed",
  },
  task_language_open: {
    rowLabel: "Task family",
    colLabel: "Language/open signal",
    rows: (items) => uniqueValues(items, (item) => item.task_families),
    cols: () => ["language annotation", "open data", "open + language", "closed/unknown + language"],
    rowHas: (item, value) => item.task_families.includes(value),
    colHas: (item, value) => {
      if (value === "language annotation") return item.has_language_annotation;
      if (value === "open data") return item.has_open_dataset;
      if (value === "open + language") return item.has_open_dataset && item.has_language_annotation;
      return !item.has_open_dataset && item.has_language_annotation;
    },
    subtitle: "Task families where language grounding and usable data overlap",
  },
  language_modality: {
    rowLabel: "Language annotation",
    colLabel: "Modality",
    rows: (items) => uniqueValues(items, (item) => item.language_granularity),
    cols: (items) => modalityColumns.filter((modality) => items.some((item) => item.modalities.includes(modality))),
    rowHas: (item, value) => item.language_granularity.includes(value),
    colHas: (item, value) => item.modalities.includes(value),
    subtitle: "Language annotation types by multimodal sensing channel",
  },
  dynamic_language: {
    rowLabel: "Dynamic concept",
    colLabel: "Language annotation",
    rows: () => ["state transition", "event", "correction signal", "object state"],
    cols: (items) => uniqueValues(items, (item) => item.language_granularity),
    rowHas: (item, value) => item.concept_types.includes(value),
    colHas: (item, value) => item.language_granularity.includes(value),
    subtitle: "Where dynamic state-change concepts are paired with language annotations",
  },
};

const thumbColors = {
  vision: ["#5876b9", "#c7d7f5"],
  tactile: ["#2c8066", "#b9ded3"],
  audio: ["#704ea3", "#dcc9f4"],
  force: ["#9d6234", "#efd3b7"],
  thermal: ["#b65353", "#ffd6b8"],
  language: ["#1647ff", "#ccd6ff"],
  "point cloud / 3D": ["#477987", "#c4e3e6"],
  default: ["#5f646b", "#d9d5ca"],
};

async function init() {
  state.catalog = await fetch("../data/catalog.json").then((response) => response.json());
  state.catalog = state.catalog.map((item) => ({
    ...item,
    source_label: sourceLabel(item),
    data_supervision: dataSupervision(item),
    multimodal_nonvisual: nonvisualModalities(item).length >= 2,
  }));
  const routeId = new URLSearchParams(window.location.search).get("id");
  if (routeId) {
    renderDetailDocument(routeId);
    return;
  }
  buildFilters();
  bindEvents();
  render();
}

function buildFilters() {
  for (const [rootId, title, key] of filterDefs) {
    const values = uniqueValues(state.catalog, (item) => valueArray(item[key]));
    makeFilterGroup(rootId, title, key, values);
  }

  const years = uniqueValues(state.catalog, (item) => [item.year]).sort((a, b) => b - a);
  const yearFilter = document.querySelector("#yearFilter");
  for (const year of years) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.append(option);
  }
}

function makeFilterGroup(rootId, title, key, values) {
  const root = document.querySelector(`#${rootId}`);
  const counts = countValues(state.catalog, (item) => valueArray(item[key]));
  root.innerHTML = `
    <button class="accordion" type="button" aria-expanded="true">${escapeHtml(title)}</button>
    <div class="accordion-body">
      ${values
        .map(
          (value) => `
            <label class="check">
              <input type="checkbox" value="${escapeHtml(value)}" data-filter="${escapeHtml(key)}">
              <span>${escapeHtml(value)}</span>
              <b>${counts[value] || 0}</b>
            </label>
          `
        )
        .join("")}
    </div>
  `;
}

function bindEvents() {
  document.querySelector("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  document.querySelector("#searchInput").addEventListener("input", (event) => {
    state.filters.query = event.target.value.trim().toLowerCase();
    render();
  });

  document.querySelectorAll("[data-filter]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const set = state.filters[event.target.dataset.filter];
      if (event.target.checked) set.add(event.target.value);
      else set.delete(event.target.value);
      render();
    });
  });

  document.querySelectorAll(".accordion").forEach((button) => {
    button.addEventListener("click", () => {
      button.setAttribute("aria-expanded", button.getAttribute("aria-expanded") !== "false" ? "false" : "true");
    });
  });

  document.querySelector("#yearFilter").addEventListener("change", (event) => {
    state.filters.year = event.target.value;
    render();
  });

  document.querySelector("#sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  document.querySelector("#matrixPreset").addEventListener("change", (event) => {
    state.matrixPreset = event.target.value;
    render();
  });

  document.querySelector("#matrixScope").addEventListener("change", (event) => {
    state.matrixScope = event.target.value;
    render();
  });

  document.querySelector("#resetButton").addEventListener("click", () => {
    state.filters.query = "";
    for (const key of Object.keys(state.filters)) {
      if (state.filters[key] instanceof Set) state.filters[key].clear();
    }
    state.filters.year = "all";
    document.querySelector("#searchInput").value = "";
    document.querySelector("#yearFilter").value = "all";
    document.querySelectorAll("[data-filter]").forEach((input) => {
      input.checked = false;
    });
    render();
  });
}

function render() {
  const rows = sortRows(filteredRows());
  renderHero();
  renderToolbar(rows);
  renderBars("#roleChart", countValues(rows, (item) => [item.dataset_role_label]));
  renderBars("#openChart", countValues(rows, (item) => [item.openness_label]));
  renderBars("#languageChart", countValues(rows, (item) => item.language_granularity && item.language_granularity.length ? item.language_granularity : ["none apparent"]));
  renderBars("#modalityChart", countValues(rows, (item) => item.modalities));
  renderMatrix(rows);
  renderCards(rows);
}

function renderHero() {
  document.querySelector("#paperTotal").textContent = state.catalog.length;
  document.querySelector("#dataRelevantTotal").textContent = state.catalog.filter((item) => item.dataset_relevant).length;
  document.querySelector("#introducedTotal").textContent = state.catalog.filter((item) => item.introduces_data_artifact).length;
  document.querySelector("#openTotal").textContent = state.catalog.filter((item) => item.has_open_dataset).length;
  document.querySelector("#languageTotal").textContent = state.catalog.filter((item) => item.has_language_annotation).length;
  document.querySelector("#nonvisualTotal").textContent = state.catalog.filter((item) => item.multimodal_nonvisual).length;
}

function renderToolbar(rows) {
  document.querySelector("#resultCount").textContent = rows.length;
}

function filteredRows() {
  return state.catalog.filter((item) => {
    const text = [
      item.title,
      item.name,
      item.source_label,
      item.authors,
      item.venue,
      item.year,
      item.tags.join(" "),
      item.dataset_role_label,
      item.openness_label,
      item.modalities.join(" "),
      item.data_supervision.join(" "),
      item.language_granularity.join(" "),
      item.task_families.join(" "),
      item.concept_types.join(" "),
      item.datasets_evidence,
      item.openness_evidence,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!state.filters.query || text.includes(state.filters.query)) &&
      matchesSet(item.source_label, state.filters.source_label) &&
      matchesSet(item.dataset_role_label, state.filters.dataset_role_label) &&
      matchesSet(item.openness_label, state.filters.openness_label) &&
      matchesSet(item.modalities, state.filters.modalities) &&
      matchesSet(item.data_supervision, state.filters.data_supervision) &&
      matchesSet(item.language_granularity, state.filters.language_granularity) &&
      matchesSet(item.task_families, state.filters.task_families) &&
      matchesSet(item.concept_types, state.filters.concept_types) &&
      matchesSet(item.environments, state.filters.environments) &&
      (state.filters.year === "all" || String(item.year) === state.filters.year)
    );
  });
}

function sortRows(rows) {
  const order = {
    "introduces dataset": 0,
    "introduces benchmark": 1,
    "introduces simulator": 2,
    "self-collected eval data": 3,
    "uses existing datasets": 4,
    "method, no dataset contribution": 5,
    "sensor / foundation paper": 6,
    "survey / review": 7,
  };
  const openOrder = { "open / public": 0, "partial or indirect": 1, unknown: 2, "not open": 3, "not applicable": 4 };
  return [...rows].sort((a, b) => {
    if (state.sort === "newest") return (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title);
    if (state.sort === "oldest") return (a.year || 9999) - (b.year || 9999) || a.title.localeCompare(b.title);
    if (state.sort === "name") return a.title.localeCompare(b.title);
    if (state.sort === "open") return (openOrder[a.openness_label] ?? 9) - (openOrder[b.openness_label] ?? 9) || a.title.localeCompare(b.title);
    return (order[a.dataset_role_label] ?? 9) - (order[b.dataset_role_label] ?? 9) || (b.year || 0) - (a.year || 0);
  });
}

function renderBars(selector, counts) {
  const root = document.querySelector(selector);
  root.innerHTML = "";
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = Math.max(1, ...entries.map((entry) => entry[1]));
  for (const [name, count] of entries) {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${escapeHtml(name)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div>
      <strong>${count}</strong>
    `;
    root.append(row);
  }
}

function renderMatrix(rows) {
  const preset = matrixPresets[state.matrixPreset] || matrixPresets.task_modality;
  const baseRows = (state.matrixScope === "filtered" ? rows : state.catalog).filter((item) => item.dataset_relevant);
  const root = document.querySelector("#gapMatrix");
  const subtitle = document.querySelector("#matrixSubtitle");
  const matrixRows = preset.rows(baseRows).slice(0, 12);
  const columns = preset.cols(baseRows).slice(0, 12);

  subtitle.textContent = `${preset.subtitle} · ${state.matrixScope === "filtered" ? "current filters" : "full catalog"}`;

  if (!matrixRows.length || !columns.length) {
    root.innerHTML = "<p>No matrix cells in this scope.</p>";
    return;
  }

  const cellRecords = [];
  for (const rowValue of matrixRows) {
    for (const colValue of columns) {
      const count = baseRows.filter((item) => preset.rowHas(item, rowValue) && preset.colHas(item, colValue)).length;
      cellRecords.push({ rowValue, colValue, count });
    }
  }

  const totalCells = cellRecords.length;
  const gaps = cellRecords.filter((cell) => cell.count === 0);
  const sparse = cellRecords.filter((cell) => cell.count > 0 && cell.count <= 2);
  const covered = totalCells - gaps.length;
  const gapList = [...gaps, ...sparse]
    .slice(0, 10)
    .map((cell) => `<li><strong>${escapeHtml(cell.rowValue)}</strong> x ${escapeHtml(cell.colValue)} <span>${cell.count ? `${cell.count} paper${cell.count > 1 ? "s" : ""}` : "gap"}</span></li>`)
    .join("");

  const head = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const body = matrixRows
    .map((rowValue) => {
      const cells = columns
        .map((colValue) => {
          const count = cellRecords.find((cell) => cell.rowValue === rowValue && cell.colValue === colValue).count;
          const cls = count === 0 ? "cell-empty" : count <= 2 ? "cell-sparse" : "cell-filled";
          return `<td class="${cls}" title="${escapeHtml(rowValue)} x ${escapeHtml(colValue)}">${count || "gap"}</td>`;
        })
        .join("");
      return `<tr><td>${escapeHtml(rowValue)}</td>${cells}</tr>`;
    })
    .join("");

  root.innerHTML = `
    <div class="matrix-summary">
      <span><strong>${covered}</strong> covered cells</span>
      <span><strong>${gaps.length}</strong> empty gaps</span>
      <span><strong>${sparse.length}</strong> sparse cells</span>
      <span><strong>${baseRows.length}</strong> rows in scope</span>
    </div>
    <table><thead><tr><th>${escapeHtml(preset.rowLabel)} \\ ${escapeHtml(preset.colLabel)}</th>${head}</tr></thead><tbody>${body}</tbody></table>
    ${gapList ? `<div class="gap-list"><h3>Underexplored Cells</h3><ul>${gapList}</ul></div>` : ""}
  `;
}

function renderCards(rows) {
  const root = document.querySelector("#cardGrid");
  root.innerHTML = "";

  for (const item of rows) {
    const primaryModality = item.modalities[0] || "default";
    const colors = thumbColors[primaryModality] || thumbColors.default;
    const card = document.createElement("article");
    card.className = "dataset-card";
    card.style.setProperty("--thumb-a", colors[0]);
    card.style.setProperty("--thumb-b", colors[1]);
    const openClass = item.openness === "open" || item.openness === "partial" ? "green" : item.openness === "closed" ? "red" : "";
    const chips = [
      `<span class="chip blue">${escapeHtml(item.dataset_role_label)}</span>`,
      `<span class="chip ${openClass}">${escapeHtml(item.openness_label)}</span>`,
      ...item.modalities.slice(0, 4).map((value) => `<span class="chip">${escapeHtml(value)}</span>`),
      ...item.data_supervision.slice(0, 2).map((value) => `<span class="chip">${escapeHtml(value)}</span>`),
      ...languageAnnotationValues(item).map((value) => `<span class="chip language-chip">${escapeHtml(`Language: ${value}`)}</span>`),
    ].join("");
    const languageTags = languageAnnotationTags(item);

    card.innerHTML = `
      <a class="thumb" href="?id=${encodeURIComponent(item.id)}" data-label="${escapeHtml(item.source_package === "dongyu_survey_raw" ? "PROJECT" : "PAPER")}">
        <img src="${escapeHtml(item.thumbnail)}" alt="" loading="lazy" onerror="this.closest('.thumb').classList.add('fallback'); this.remove();">
        <span class="source-badge ${escapeHtml(sourceClass(item))}">${escapeHtml(item.source_label)}</span>
        <span class="star">${item.has_open_dataset ? "*" : item.introduces_data_artifact ? "+" : "-"}</span>
      </a>
      <div class="card-body">
        <div>
          <h3><a href="?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></h3>
          <div class="meta">${escapeHtml(item.institution_display || "Institution not listed")} · ${escapeHtml(item.year || "n.d.")}</div>
          ${languageTags}
        </div>
        <div class="chips">${chips}</div>
        <p class="evidence">${escapeHtml(trim(item.datasets_evidence || item.one_liner || item.title, 170))}</p>
        <div class="card-actions">${cardActionLinks(item)}</div>
      </div>
    `;
    root.append(card);
  }
}

function showDetails(id) {
  const item = state.catalog.find((row) => row.id === id);
  const body = document.querySelector("#detailBody");
  body.innerHTML = `
    <h2>${escapeHtml(item.title)}</h2>
    <dl class="detail-grid">
      <dt>Artifact name</dt><dd>${escapeHtml(item.name && item.name !== item.title ? item.name : "same as paper title / not separately inferred")}</dd>
      <dt>Dataset role</dt><dd>${tag(item.dataset_role_label, "blue")}</dd>
      <dt>Open data</dt><dd>${tag(item.openness_label, item.has_open_dataset ? "green" : item.openness === "closed" ? "red" : "")}</dd>
      <dt>Institution</dt><dd>${escapeHtml(item.institution_display || "Institution not listed")}</dd>
      <dt>Year / venue</dt><dd>${escapeHtml(item.year || "unknown")} · ${escapeHtml(item.venue || "venue not listed")}</dd>
      <dt>Modalities</dt><dd>${tags(item.modalities)}</dd>
      <dt>Data supervision</dt><dd>${tags(item.data_supervision)}</dd>
      <dt>Language annotation</dt><dd>${tags(item.language_granularity)}</dd>
      <dt>Language evidence</dt><dd class="detail-evidence">${escapeHtml(item.language_annotation_evidence || "not found in summary")}</dd>
      <dt>Tasks</dt><dd>${tags(item.task_families)}</dd>
      <dt>Concepts</dt><dd>${tags(item.concept_types)}</dd>
      <dt>Environment</dt><dd>${tags(item.environments)}</dd>
      <dt>Formats</dt><dd>${tags(item.data_formats)}</dd>
      <dt>Scale</dt><dd>${escapeHtml(formatScale(item.data_scale))}</dd>
      <dt>Dataset evidence</dt><dd class="detail-evidence">${escapeHtml(item.datasets_evidence || "not found in summary")}</dd>
      <dt>Open evidence</dt><dd class="detail-evidence">${escapeHtml(item.openness_evidence || "not found in summary")}</dd>
      <dt>Links</dt><dd>${links(item)}</dd>
    </dl>
  `;
  document.querySelector("#detailDialog").showModal();
}

function renderDetailDocument(id) {
  const item = state.catalog.find((row) => row.id === id);
  const main = document.querySelector("main");
  if (!item) {
    main.innerHTML = `
      <section class="detail-page">
        <a class="back-link" href="./">Back to catalog</a>
        <h1>Dataset not found</h1>
      </section>
    `;
    return;
  }

  document.title = `${item.title} | Multimodal Dataset Map`;
  main.innerHTML = `
    <section class="detail-page">
      <a class="back-link" href="./">Back to catalog</a>
      <div class="detail-hero">
        <div class="detail-media" data-label="${escapeHtml(item.source_package === "dongyu_survey_raw" ? "PROJECT" : "PAPER")}">
          <img src="${escapeHtml(item.thumbnail)}" alt="" onerror="this.closest('.detail-media').classList.add('fallback'); this.remove();">
        </div>
        <div class="detail-summary">
          <div class="chips">
            ${tag(item.dataset_role_label, "blue")}
            ${tag(item.openness_label, item.has_open_dataset ? "green" : item.openness === "closed" ? "red" : "")}
            ${tag(item.source_label)}
          </div>
          <h1>${escapeHtml(item.title)}</h1>
          <p class="detail-meta">${escapeHtml(item.institution_display || "Institution not listed")} · ${escapeHtml(item.year || "n.d.")}</p>
          <p>${escapeHtml(item.one_liner || item.datasets_evidence || "")}</p>
          <div class="online-actions">${onlineLinks(item)}</div>
        </div>
      </div>

      <div class="detail-layout">
        <section class="detail-panel">
          <h2>Dataset Evidence</h2>
          <p>${escapeHtml(item.datasets_evidence || "not listed")}</p>
        </section>
        <section class="detail-panel">
          <h2>Open Data Evidence</h2>
          <p>${escapeHtml(item.openness_evidence || "not listed")}</p>
        </section>
        <section class="detail-panel">
          <h2>Metadata</h2>
          <dl class="detail-grid">
            <dt>Institution</dt><dd>${escapeHtml(item.institution_display || "Institution not listed")}</dd>
            <dt>Year / venue</dt><dd>${escapeHtml(item.year || "unknown")} · ${escapeHtml(item.venue || "venue not listed")}</dd>
            <dt>License</dt><dd>${escapeHtml(item.license || "not reported")}</dd>
            <dt>Scale</dt><dd>${escapeHtml(formatScale(item.data_scale))}</dd>
            <dt>Modalities</dt><dd>${tags(item.modalities)}</dd>
            <dt>Data supervision</dt><dd>${tags(item.data_supervision)}</dd>
            <dt>Language annotation</dt><dd>${tags(item.language_granularity)}</dd>
            <dt>Language evidence</dt><dd class="detail-evidence">${escapeHtml(item.language_annotation_evidence || "not found in summary")}</dd>
            <dt>Tasks</dt><dd>${tags(item.task_families)}</dd>
            <dt>Concepts</dt><dd>${tags(item.concept_types)}</dd>
            <dt>Environment</dt><dd>${tags(item.environments)}</dd>
            <dt>Formats</dt><dd>${tags(item.data_formats)}</dd>
          </dl>
        </section>
      </div>
    </section>
  `;
}

function matchesSet(values, selected) {
  if (!selected.size) return true;
  return valueArray(values).some((value) => selected.has(value));
}

function sourceLabel(item) {
  return sourceLabels[item.source_package] || item.source_package || "Unknown source";
}

function sourceClass(item) {
  if (item.source_package === "professor_survey_raw") return "source-professor";
  if (item.source_package === "dongyu_survey_raw" || item.source_package === "datasets_bot_raw") return "source-dongyu";
  return "";
}

function dataSupervision(item) {
  if (item.data_supervision && item.data_supervision.length) return item.data_supervision;
  const languageOnly = new Set(["captions/descriptions", "instructions / commands", "predicates / constraints"]);
  return (item.annotation_types || []).filter((value) => !languageOnly.has(value));
}

function nonvisualModalities(item) {
  return ["tactile", "audio", "force", "thermal", "proprioception"].filter((modality) => item.modalities.includes(modality));
}

function languageAnnotationTags(item) {
  const values = languageAnnotationValues(item);
  if (!values.length) return "";
  return `
    <div class="language-tags" aria-label="Language annotations">
      <span class="language-label">Language</span>
      ${values.map((value) => `<span class="language-tag">${escapeHtml(value)}</span>`).join("")}
    </div>
  `;
}

function languageAnnotationValues(item) {
  return (item.language_granularity || []).filter((value) => value && value !== "none apparent");
}

function valueArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function uniqueValues(items, getter) {
  return [...new Set(items.flatMap(getter).filter(Boolean))].sort();
}

function countValues(items, getter) {
  const counts = {};
  for (const item of items) {
    for (const value of getter(item).filter(Boolean)) {
      counts[value] = (counts[value] || 0) + 1;
    }
  }
  return counts;
}

function formatScale(scale) {
  const entries = Object.entries(scale || {}).filter(([, value]) => value);
  return entries.length ? entries.map(([key, value]) => `${key}: ${value}`).join(", ") : "not reported";
}

function tag(value, cls = "") {
  return `<span class="chip ${cls}">${escapeHtml(value)}</span>`;
}

function tags(values) {
  return values && values.length ? values.map((value) => tag(value)).join(" ") : "not apparent";
}

function links(item) {
  const links = [];
  if (summaryUrl(item)) links.push(`<a href="${escapeHtml(summaryUrl(item))}" target="_blank" rel="noreferrer">summary</a>`);
  if (paperUrl(item)) links.push(`<a href="${escapeHtml(paperUrl(item))}" target="_blank" rel="noreferrer">paper</a>`);
  if (item.project_url) links.push(`<a href="${escapeHtml(item.project_url)}" target="_blank" rel="noreferrer">project</a>`);
  if (item.download_url) links.push(`<a href="${escapeHtml(item.download_url)}" target="_blank" rel="noreferrer">download</a>`);
  if (item.code_url) links.push(`<a href="${escapeHtml(item.code_url)}" target="_blank" rel="noreferrer">code</a>`);
  return links.join(" · ");
}

function cardActionLinks(item) {
  const actions = [`<a class="details-button" href="?id=${encodeURIComponent(item.id)}">Details</a>`];
  if (summaryUrl(item)) actions.push(`<a class="summary-link" href="${escapeHtml(summaryUrl(item))}" target="_blank" rel="noreferrer">Summary</a>`);
  if (paperUrl(item)) actions.push(`<a class="summary-link" href="${escapeHtml(paperUrl(item))}" target="_blank" rel="noreferrer">Paper</a>`);
  if (item.project_url) actions.push(`<a class="summary-link" href="${escapeHtml(item.project_url)}" target="_blank" rel="noreferrer">Project</a>`);
  return actions.join("");
}

function summaryUrl(item) {
  return item.source_summary_url || "";
}

function paperUrl(item) {
  return item.url || onlinePdfUrl(item);
}

function onlinePdfUrl(item) {
  if (item.pdf && /^https?:\/\//i.test(item.pdf) && /\/pdf\//i.test(item.pdf)) return item.pdf;
  const arxiv = item.arxiv_id || arxivIdFromUrl(item.url) || arxivIdFromUrl(item.pdf);
  return arxiv ? `https://arxiv.org/pdf/${arxiv}` : "";
}

function arxivIdFromUrl(value) {
  const match = String(value || "").match(/arxiv\.org\/(?:abs|pdf)\/([0-9.]+)/i);
  return match ? match[1] : "";
}

function onlineLinks(item) {
  const html = links(item);
  return html || "<span>No online link listed.</span>";
}

function trim(text, length) {
  return text.length > length ? `${text.slice(0, length - 1)}...` : text;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

init().catch((error) => {
  document.body.innerHTML = `<pre>Failed to load catalog: ${escapeHtml(error.message)}</pre>`;
});
