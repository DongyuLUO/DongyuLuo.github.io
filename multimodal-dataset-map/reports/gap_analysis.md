# Gap Analysis Draft

Generated from the expanded 91-paper catalog.

## Corpus Snapshot

- Paper summaries scanned: 91.
- Papers with dataset-related evidence: 82.
- Papers that appear to introduce a new dataset, benchmark, or simulator: 34.
- Papers with open or partial data availability evidence: 31.

## Classification Used

- `introduces dataset`: the paper appears to contribute a named or newly collected dataset.
- `introduces benchmark`: the paper contributes a benchmark or dataset+benchmark artifact.
- `introduces simulator`: the paper contributes a simulator or simulation platform.
- `self-collected eval data`: the paper collects task-specific data for evaluation/training but does not clearly present it as a reusable dataset.
- `uses existing datasets`: the paper trains/evaluates on existing datasets or benchmarks.
- `sensor / foundation paper`: foundational sensor/model/theory work where dataset contribution is not the main artifact.
- `survey / review`: survey papers.

## Early Trends

The survey is data-rich, but much of the data is task-specific or benchmark-use rather than reusable, open, language-annotated manipulation data.

Vision and tactile are heavily represented. Audio appears often enough to be a serious thread. Force/proprioception are control-critical but less often packaged as reusable language-grounded datasets. Thermal remains sparse.

Annotation coverage is uneven. Class/property labels, self-supervised pairs, demonstrations, and simulation labels are common. Explicit predicates, captions/descriptions, instructions, temporal event labels, and state-transition annotations are much less common.

## Likely Contribution Gaps

1. Open dynamic state-change datasets.
   The field has many static property or representation datasets, but fewer open datasets with temporal labels such as onset, transition, completion, failure, or correction.

2. Language + non-visual monitoring.
   Touch-language exists, but language grounded in audio, force, proprioception, and thermal signals is much thinner.

3. Thermal-language manipulation data.
   Thermal appears in cooking/material-state papers, but the catalog still suggests little reusable language-grounded thermal manipulation data.

4. Predicate-level annotations.
   The BLADE-style question needs predicates like `is_grasped`, `is_inserted`, `is_full`, `is_screwed_tight`, or `boiling_now`; these are less common than category/property labels.

5. Reusable closed-loop correction datasets.
   Several methods do online monitoring or recovery, but the reusable dataset artifact for closed-loop correction remains unclear or closed in many rows.

## Next Manual Review Targets

Start with rows classified as:

- `introduces dataset`
- `introduces benchmark`
- `introduces simulator`
- `unknown` openness

High-value papers to verify manually:

- Any2Policy / RoboAny
- AnyTouch / TacQuad
- Kaiwu
- Touch100k, TVL, TLV, Touch and Go
- ObjectFolder, ObjectFolder 2.0, ObjectFolder Benchmark
- VTDexManip
- TAF-VLA / TaF-Dataset
- ForceVLA-Data
- SonicSense
- Sound of Water / Making Sense of Audio Vibration
- Thermal tactile material database
