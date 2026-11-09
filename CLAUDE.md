# Media Wall Estimate — Claude Code Context (v0.2.0)

> **Current version: v0.2.0** — 2026-11-09: estimates now sit in the Hub's **Business** section; the Whole House estimate reads Takeoffs (`projects.metadata.takeoff_summary`) and the room estimates replace their service; Demo is the worked example (1410 floorplans = Demo). Fonts use the shared brand.css tokens.
> v0.1.0 — 2026-11-09 BIRTH (B-809 · sonor-platform §67 · Bryn: "a quick takeoff + preliminary budget we can send a client BEFORE a WeQuote exists, with everything stored against the project so it can be progressed at any stage (survey → design app → WeQuote) without re-entering anything"). Folder name per Bryn 2026-11-09: "name the new apps, APP - ESTIMATE - Cinema for example". First fixture: ENQ-MW01 (Rohela media wall) — R1 from the R4 budget (base £14,982 inc. VAT + 10 % contingency).

> **Spine version: 1.3** (SONOR-APP-SPINE.md — SonorShell-mounted, graphite)
> Inherits: `../CLAUDE.md` (master brand rules + cross-project references)
> Brand source: `../Branding - CORE/brand-core.xml`
> Repo: `sonor-estimate-media-wall` · Pages: https://apps.sonor.co.uk/sonor-estimate-media-wall/
> **Active theme: graphite** — back-end default (sonor-platform §2); the PDF is the client surface.

## What this is
One of the **Estimates** family (Master Hub section "Business"): a quick client-facing media wall estimate — inputs → sections by
system → live budget cards → the one-pack PDF (Cover · Overview · Product cards · Preliminary budget · Basis · Rear, A3 / A4,
landscape default) — stored against the project in `estimates`, so the survey, the design apps and WeQuote pick it up later.

**This app has no app body of its own.** Everything is the shared estimate stack (root masters, synced):
| Master | What |
|---|---|
| `sonor-estimate.js` | SonorEstimate — section model, budget maths (VAT, £10 rounding, contingency, options as ± increments, allowances), template seeding, `record()` for `cost_estimates`, `wqPlan()`, the shared **Preliminary budget** page + `pdf.generate()` |
| `sonor-estimate-app.js` + `.css` | EstimateApp — the UI (project bar, inputs, drag-sortable sections + rows, live cards, export modal, revisions, Progress →, Push to WeQuote) |
| `data/sonor-estimate-templates.js` | offline tier of `estimate_templates` (kind `media-wall`) |

Host page `dashboard/sonor-estimate-media-wall.html` sets `window.__ESTIMATE_APP__ = { kind: 'media-wall', appKey: 'estimate-media-wall' }`; `data/estimate-media-wall-config.js` carries `wqSingleLineProduct`.

## Data
- `estimates` (this app's only table writes — drafts only; a `sent` rev is frozen by the `estimates_guard` trigger) · RPCs `estimate_link` (first save → `projects.metadata.links.estimate_ids[]`), `estimate_issue` (freeze, supersede older sent revs, write the `cost_estimates[]` record `estimate-media-wall-rN` + `links.estimate_media_wall_id`), `estimate_new_rev`.
- Reads: `projects`, `estimate_templates`, `av_catalogue` (names, `metadata.hero_image`, `metadata.specs`, `msrp_gbp`, `metadata.wq`), and the inputs from Media Wall (wall width / ceiling from the latest media_wall_configs design), LED Calc through `projects.metadata.links` (§66 — never typed twice).
- Prices: WeQuote sell (when the product mirror carries it — not today) → Library trade ÷ (1 − margin) → the template's house price (latest WeQuote quote) → Library MSRP ex VAT → TBC allowance.

## Shared seams consumed
SonorShell + SonorProjectBar/Bus/List, sonor-db.js, brand.css, sonor-components.css, sonor-sortable.js, sonor-wq-push.js (1.4+ single-line), sonor-pdf-theme.js + sonor-pdf-luxury.js (pdf-lib 1.17.1 + fontkit, Gilroy in `data/fonts/`), cover art `data/estimate-cover(-landscape).jpg` from covers.json.

## Upstream / downstream
- Upstream: project record, design-app rows by link, Library, templates.
- Downstream: `projects.metadata.cost_estimates[]` (Stretched Fabric compare, Project Master card — B-808 a), `links.estimate_ids[]`, WeQuote (one priced line per section, OPTIONAL lines for options), the design apps via **Progress →** (`?project=<id>&estimate=<id>`).

## Brand overrides
None.

## Drawing model
**Drawing model: n/a (no canvas).**

## Rules
1. Never overwrite a sent revision — a change is a new rev (the trigger refuses it anyway).
2. Client PDF: no internal costs, no hosted links (§35), no dark boxes (2026-11-07), options as the change they make, one survey line in Basis.
3. New behaviour goes in the shared masters, never in this folder; a new kind = a template + a host page (`gen_apps.py` pattern).
4. Version bump = 5 sites (`APP_VERSION`, CHANGELOG/banner here, `app_versions`, SESSION-LOG, BACKLOG when relevant).

## Feature timeline
- v0.1.0 (2026-11-09) — birth on the shared estimate stack (B-809).
- v0.2.0 (2026-11-09) — Business section; Takeoffs linkage + Whole House; linked room estimates; shared font tokens; budget paginates.
