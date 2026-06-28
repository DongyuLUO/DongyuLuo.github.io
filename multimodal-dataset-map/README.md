# Multimodal Dataset Map

This is a static visualization tool for surveying datasets related to language grounding, multimodal perception, and robotic manipulation.

## Contents

- 149 catalog entries
- 91 entries from the Professor Survey
- 58 supplemental entries
- 140 dataset-relevant rows
- 92 rows that introduce a dataset, benchmark, or simulator
- 87 rows with open or partial data availability
- Evidence-backed filters for modalities, language annotations, data supervision, task families, concept types, environments, and data availability

## How to View

Run a small local static server from this folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/app/
```

If port 8000 is already in use:

```powershell
python -m http.server 8010
```

Then open:

```text
http://localhost:8010/app/
```

## Included Files

- `app/`: static frontend
- `data/`: generated catalog JSON files
- `source_materials/*/knowledge/`: local HTML summaries used by the Summary links
- `source_materials/professor_survey_raw/index.html`: original professor survey navigation page
- `reports/filter_audit_2026-06-28.md`: audit summary and per-row evidence
- `reports/filter_audit_2026-06-28.csv`: full audit table

The share package intentionally excludes raw PDFs, development scripts, git metadata, cache folders, and temporary files. Paper links in the app point to online pages such as arXiv or project pages when available.
