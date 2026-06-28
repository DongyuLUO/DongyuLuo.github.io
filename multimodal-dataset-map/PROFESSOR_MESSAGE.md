Hi Professor,

I organized a static version of the multimodal dataset map for review.

It contains:

- 149 catalog entries: 91 from the professor survey and 58 supplemental entries
- evidence-backed filters for dataset role, open-data status, modalities, data supervision, language annotations, task family, concept type, and environment
- per-paper/project detail pages with online paper/project links
- local HTML links to the survey summaries
- an audit report for the language-annotation and filter classifications

To view it locally after unzipping:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/app/
```

The audit files are included under:

- `reports/filter_audit_2026-06-28.md`
- `reports/filter_audit_2026-06-28.csv`

I excluded raw PDFs and development files from this sharing version. Paper links in the app point to online sources such as arXiv/project pages when available.
