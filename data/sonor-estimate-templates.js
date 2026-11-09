/* sonor-estimate-templates.js — CANONICAL MASTER (workspace root data/; synced to every estimate consumer's data/)
   v1.0.0 · 2026-11-09 · B-809 · sonor-platform §67.  window.__SONOR_ESTIMATE_TEMPLATES__ = { <kind>: template }
   The SAME JSON is seeded into Supabase `estimate_templates` (template column) — the table wins when it loads; this file is
   the offline tier and the seed source. Edit here, re-seed (sonor-master/supabase/estimates-*.sql), sync.

   template = { kind, title (document name), cover (covers.json key), progress[] (design apps it hands off to),
                inputs[{key,label,unit,default,step,min,max,kind:'num'|'bool'}],
                defaults{margin, labourSell, labourCost, contingency},
                sections[{key, service_nn | hex, title, note, optional, when, labour_label,
                          rows[{label, model_id, qty (expr), unit, labour_h (expr), sell_ex (number | expr — house price ex VAT,
                                from the latest WeQuote quote), optional, allowance, when (expr)}]}],
                basis[], flags[], included[], excluded[], overview{points[]} }
   Expressions use the input keys only (w, d, h in metres derived from *_mm; see SonorEstimate.evalQty). Sections run in
   Sonor service order (01 → 10); a section with a gold hex (fabric, joinery) sits where the job reads best.
   House prices = WeQuote #2805 rev 1 (1410, 2026-11-09) and the ENQ-MW01 R4 cost check (2026-11-09) until the WeQuote price
   mirror carries sell prices (gap — wq_products has no price columns today).
*/
(function (global) {
  'use strict';
  var GOLD = '#ad9978';
  var T = {};

  // ── CINEMA ESTIMATE ────────────────────────────────────────────────────────────────────────────────
  T.cinema = {
    kind: 'cinema', title: 'Cinema estimate', cover: 'cinema', app: 'estimate-cinema', version: '1.0.0',
    progress: [{ app: 'cinemaDesign', label: 'Cinema Design', param: 'project' }, { app: 'stretchedFabric', label: 'Stretched Fabric', param: 'project' }, { app: 'ledCalc', label: 'LED Calc', param: 'project' }, { app: 'seating', label: 'Seating', param: 'project' }],
    inputs: [
      { key: 'w_mm', label: 'Room width', unit: 'mm', default: 5000, step: 50 },
      { key: 'd_mm', label: 'Room depth', unit: 'mm', default: 6000, step: 50 },
      { key: 'h_mm', label: 'Ceiling height', unit: 'mm', default: 2400, step: 10 },
      { key: 'screen_in', label: 'Screen size', unit: 'in', default: 120, step: 5 },
      { key: 'projector', label: 'Projector (0 = TV)', unit: '', default: 1, kind: 'bool' },
      { key: 'seats', label: 'Seats', unit: '', default: 4, step: 1, min: 0 },
      { key: 'heights', label: 'Height speakers', unit: '', default: 4, step: 2, min: 0 },
      { key: 'fabric', label: 'Fabric walls', unit: '', default: 1, kind: 'bool' },
      { key: 'fabric_walls', label: 'Fabric walls (of 4)', unit: '', default: 4, step: 1, min: 0, max: 4 },
      { key: 'shades', label: 'Motorised blinds / curtains', unit: '', default: 0, step: 1, min: 0 }
    ],
    defaults: { margin: 0.3, labourSell: 62, labourCost: 31, contingency: 0 },
    sections: [
      { key: 'av', service_nn: '01', title: 'AV system', note: 'Speaker positions on the design drawings.', rows: [
        { model_id: 'SONY-XW5100ES', label: 'Sony VPL-XW5100ES 4K laser projector', when: 'projector', qty: 1, sell_ex: 5499, labour_h: 4 },
        { label: 'Acoustically transparent screen — {screen_in}-inch', when: 'projector', qty: 1, sell_ex: 'screen_in * 22', labour_h: 3, allowance: true },
        { label: 'Television — {screen_in}-inch', when: '!projector', qty: 1, sell_ex: 'screen_in * 30', labour_h: 1, allowance: true },
        { model_id: 'SANUS-VLF728', label: 'Sanus full-motion TV mount and fixings', when: '!projector', qty: 1, sell_ex: 265.95, labour_h: 1 },
        { model_id: 'YAMAHA-RX-A6A', label: 'Yamaha A6A Aventage AV receiver', qty: 1, sell_ex: 2333.6, labour_h: 2 },
        { model_id: 'MA-W2M', label: 'Monitor Audio W2M in-wall speakers — left, centre, right', qty: 3, sell_ex: 500, labour_h: 1.5 },
        { model_id: 'MA-W180', label: 'Monitor Audio W180 in-wall speakers — surrounds', qty: 'seats > 4 ? 4 : 2', sell_ex: 208.33, labour_h: 1 },
        { label: 'In-ceiling height speakers', qty: 'heights', sell_ex: 240, labour_h: 1 },
        { model_id: 'REL-T9X', label: 'REL T/9x subwoofer with wireless adapter', qty: 'seats > 6 ? 2 : 1', sell_ex: 1343.2, labour_h: 0.5 }
      ] },
      { key: 'seating', service_nn: '01', title: 'Cinema seating', when: 'seats', rows: [
        { label: 'Cinema recliners — {seats} seats', qty: 'seats', unit: 'seat', showQty: false, sell_ex: 1250, labour_h: 0.5, allowance: true }
      ] },
      { key: 'fabric', hex: GOLD, title: 'Stretched fabric walls', when: 'fabric', note: 'Acoustic stretched fabric over concealed track; per-wall figures follow the design.', labour: false, rows: [
        { label: 'Acoustic stretched fabric — walls', qty: '((w + d) * 2 * fabric_walls / 4) * h', unit: 'm²', sell_ex: 165, allowance: true },
        { label: 'Trim and builder works', qty: 1, sell_ex: '((w + d) * 2 * fabric_walls / 4) * 45', allowance: true }
      ] },
      { key: 'lighting', service_nn: '04', title: 'Lighting', rows: [
        { label: 'LED — perimeter and feature strips', qty: '(w + d) * 2', unit: 'm', sell_ex: 95, allowance: true, labour_h: 0.4 },
        { label: 'Dimming interface for the control system', qty: 1, sell_ex: 583.33, allowance: true }
      ] },
      { key: 'shades', service_nn: '05', title: 'Shades', when: 'shades', rows: [
        { label: 'Motorised blind or curtain', qty: 'shades', sell_ex: 900, labour_h: 2, allowance: true },
        { label: 'Bond Bridge with Control4 driver', qty: 1, sell_ex: 314.27, labour_h: 1 }
      ] },
      { key: 'control', service_nn: '07', title: 'Control system', labour_label: 'Programming and commissioning', rows: [
        { model_id: 'C4-CORE1', label: 'Control4 CORE 1 controller', qty: 1, sell_ex: 807, labour_h: 2 },
        { model_id: 'C4-HALO-TOUCH', label: 'Control4 Halo Touch remote', qty: 1, sell_ex: 852, labour_h: 0.6 },
        { model_id: 'C4-HALO-TOUCH', label: 'Second Halo Touch remote', qty: 1, sell_ex: 494, optional: true }
      ] },
      { key: 'infra', service_nn: '10', title: 'Cabling and first fix', rows: [
        { label: 'AV and speaker cabling, back boxes, conduit', qty: 1, sell_ex: 650, labour_h: 8, allowance: true }
      ] }
    ],
    basis: ['Room sizes as supplied; final quantities follow the survey and the design drawings.', 'Products as named, or an equivalent of the same standard.', 'Includes VAT at 20%; excludes decoration and anything not described.'],
    flags: [{ label: 'Electrical · by others', text: 'Electrical work is not included — supplies, circuits and connections by the site electrician.', hex: '#ec6061' }],
    included: ['Supply, installation and commissioning of the equipment listed.', 'Calibration of the sound system to the room.', 'Programming of the control system and a handover.'],
    excluded: ['Building, plastering and decorating, unless listed.', 'Electrical supplies and circuits (site electrician).', 'Furniture and soft furnishings beyond the seating listed.'],
    overview: { points: ['A preliminary budget to plan with — the design and a measured quotation follow.', 'Options are shown as the change they make and can be added at any stage.'] }
  };

  // ── MEDIA WALL ESTIMATE (ENQ-MW01 R4 pattern: build · finishes · lighting · electrical · fire · AV · making good, + 10 % contingency) ──
  T['media-wall'] = {
    kind: 'media-wall', title: 'Media wall estimate', cover: 'contract', app: 'estimate-media-wall', version: '1.0.0',
    progress: [{ app: 'mediaWall', label: 'Media Wall', param: 'project' }, { app: 'ledCalc', label: 'LED Calc', param: 'project' }],
    inputs: [
      { key: 'w_mm', label: 'Wall width', unit: 'mm', default: 4500, step: 10 },
      { key: 'h_mm', label: 'Ceiling height', unit: 'mm', default: 2400, step: 10 },
      { key: 'depth_mm', label: 'Wall depth', unit: 'mm', default: 450, step: 10 },
      { key: 'screen_in', label: 'TV size', unit: 'in', default: 65, step: 5 },
      { key: 'fire', label: 'Electric fire', unit: '', default: 1, kind: 'bool' },
      { key: 'shelf_runs', label: 'Lit shelf runs', unit: '', default: 4, step: 1, min: 0 },
      { key: 'remove_fire', label: 'Remove existing fireplace', unit: '', default: 0, kind: 'bool' },
      { key: 'mdf', label: 'Sprayed MDF instead of stud', unit: '', default: 0, kind: 'bool' },
      { key: 'new_av', label: 'New TV + soundbar', unit: '', default: 0, kind: 'bool' }
    ],
    defaults: { margin: 0.3, labourSell: 62, labourCost: 31, contingency: 0.1 },
    sections: [
      { key: 'build', hex: GOLD, title: 'Construction and joinery', labour: false, rows: [
        { label: 'Full-height stud wall, plastered and skimmed, cupboards with painted MDF doors, shelves', qty: 1, sell_ex: 'w * h * 410', when: '!mdf' },
        { label: 'Built MDF cabinetry, spray finished', qty: 1, sell_ex: 'w * h * 630', when: 'mdf' },
        { label: 'Survey, protection and removing the existing fireplace', qty: 1, sell_ex: 650, when: 'remove_fire' },
        { label: 'Built MDF cabinetry, spray finished, instead of the stud wall', qty: 1, sell_ex: 'w * h * 220', optional: true, when: '!mdf' }
      ] },
      { key: 'finishes', hex: GOLD, title: 'Finishes and mouldings', labour: false, rows: [
        { label: 'Painting, cornice, skirting and picture rail', qty: 1, sell_ex: 'w * 460' }
      ] },
      { key: 'av', service_nn: '01', title: 'AV', rows: [
        { label: 'AV installation — your existing TV and soundbar', qty: 1, sell_ex: 250, when: '!new_av' },
        { label: 'New {screen_in}-inch TV and mount', qty: 1, sell_ex: 'screen_in * 15', labour_h: 2, when: 'new_av', allowance: true },
        { label: 'Soundbar to match your TV', qty: 1, sell_ex: 583, when: 'new_av', allowance: true },
        { label: 'Sonos Arc Ultra in place of the soundbar', qty: 1, sell_ex: 917, optional: true }
      ] },
      { key: 'lighting', service_nn: '04', title: 'Shelf lighting', when: 'shelf_runs', labour: false, rows: [
        { label: 'Continuous LED shelf runs with drivers and dimming', qty: 'shelf_runs', sell_ex: 162.5 }
      ] },
      { key: 'fire', service_nn: '06', title: 'Electric fire', when: 'fire', labour: false, rows: [
        { label: 'Linear electric fire — supply and fitting', qty: 1, sell_ex: 1800, allowance: true }
      ] },
      { key: 'electrical', service_nn: '10', title: 'Electrical work', labour: false, rows: [
        { label: 'Sockets and spurs for the TV, AV and fire, LED feed, testing', qty: 1, sell_ex: 900 },
        { label: 'Pendant left in place', qty: 1, sell_ex: -330, optional: true }
      ] }
    ],
    basis: ['Sizes as supplied; everything is measured at the survey.', 'Finishes and colours are confirmed from samples before anything is made.', 'Includes VAT at 20%.'],
    flags: null,   // the electrical work is in scope on media walls — no "by others" bar by default
    included: ['The wall built, finished and decorated as described.', 'Shelf lighting, electrical work, fire supply and fitting, and AV installation.'],
    excluded: ['Gas, flue, chimney or structural work.', 'Rewiring, a new consumer unit, or whole-room decorating.', 'New AV equipment, unless chosen from the options.'],
    overview: { points: ['A guide budget for the wall — a measured quotation follows the survey.', 'Changes are shown as the difference they make to the budget.'] }
  };

  // ── MEDIA ROOM ESTIMATE (the cinema pattern without the dedicated room: TV, sound, lighting, control) ──
  T['media-room'] = {
    kind: 'media-room', title: 'Media room estimate', cover: 'cinema', app: 'estimate-media-room', version: '1.0.0',
    progress: [{ app: 'cinemaDesign', label: 'Cinema Design', param: 'project' }, { app: 'mediaWall', label: 'Media Wall', param: 'project' }, { app: 'ledCalc', label: 'LED Calc', param: 'project' }],
    inputs: [
      { key: 'w_mm', label: 'Room width', unit: 'mm', default: 4500, step: 50 },
      { key: 'd_mm', label: 'Room depth', unit: 'mm', default: 5000, step: 50 },
      { key: 'h_mm', label: 'Ceiling height', unit: 'mm', default: 2400, step: 10 },
      { key: 'screen_in', label: 'TV size', unit: 'in', default: 77, step: 5 },
      { key: 'surround', label: 'Surround channels (2 / 4)', unit: '', default: 2, step: 2, min: 0 },
      { key: 'heights', label: 'Height speakers', unit: '', default: 0, step: 2, min: 0 },
      { key: 'shades', label: 'Motorised blinds', unit: '', default: 0, step: 1, min: 0 }
    ],
    defaults: { margin: 0.3, labourSell: 62, labourCost: 31, contingency: 0 },
    sections: [
      { key: 'av', service_nn: '01', title: 'AV system', rows: [
        { label: 'Television — {screen_in}-inch', qty: 1, sell_ex: 'screen_in * 30', labour_h: 1, allowance: true },
        { model_id: 'SANUS-VLF728', label: 'Sanus full-motion TV mount and fixings', qty: 1, sell_ex: 265.95, labour_h: 1 },
        { model_id: 'YAMAHA-RX-A6A', label: 'Yamaha A6A Aventage AV receiver', qty: 1, sell_ex: 2333.6, labour_h: 2 },
        { model_id: 'MA-W2M', label: 'Monitor Audio W2M in-wall speakers — left, centre, right', qty: 3, sell_ex: 500, labour_h: 1.5 },
        { model_id: 'MA-W180', label: 'Monitor Audio W180 in-wall speakers — surrounds', qty: 'surround', sell_ex: 208.33, labour_h: 1 },
        { label: 'In-ceiling height speakers', qty: 'heights', sell_ex: 240, labour_h: 1 },
        { model_id: 'REL-T9X', label: 'REL T/9x subwoofer with wireless adapter', qty: 1, sell_ex: 1343.2, labour_h: 0.5 }
      ] },
      { key: 'lighting', service_nn: '04', title: 'Lighting', rows: [
        { label: 'LED — feature strips', qty: '(w + d)', unit: 'm', sell_ex: 95, allowance: true, labour_h: 0.4 },
        { label: 'Dimming interface for the control system', qty: 1, sell_ex: 583.33, allowance: true }
      ] },
      { key: 'shades', service_nn: '05', title: 'Shades', when: 'shades', rows: [
        { label: 'Motorised blind', qty: 'shades', sell_ex: 900, labour_h: 2, allowance: true }
      ] },
      { key: 'control', service_nn: '07', title: 'Control system', labour_label: 'Programming and commissioning', rows: [
        { model_id: 'C4-CORE1', label: 'Control4 CORE 1 controller', qty: 1, sell_ex: 807, labour_h: 2 },
        { model_id: 'C4-HALO-TOUCH', label: 'Control4 Halo Touch remote', qty: 1, sell_ex: 852, labour_h: 0.6 }
      ] },
      { key: 'infra', service_nn: '10', title: 'Cabling and first fix', rows: [
        { label: 'AV and speaker cabling, back boxes, conduit', qty: 1, sell_ex: 450, labour_h: 6, allowance: true }
      ] }
    ],
    basis: ['Room sizes as supplied; final quantities follow the survey.', 'Products as named, or an equivalent of the same standard.', 'Includes VAT at 20%; excludes decoration and anything not described.'],
    flags: [{ label: 'Electrical · by others', text: 'Electrical work is not included — supplies, circuits and connections by the site electrician.', hex: '#ec6061' }],
    included: ['Supply, installation and commissioning of the equipment listed.', 'Programming of the control system and a handover.'],
    excluded: ['Building and decorating.', 'Electrical supplies and circuits (site electrician).'],
    overview: { points: ['A preliminary budget to plan with — the design and a measured quotation follow.'] }
  };

  // ── the pattern for the next kinds (title + cover + progress only until their sections are agreed) ──
  T['garden-lighting'] = { kind: 'garden-lighting', title: 'Garden lighting estimate', cover: 'garden', app: 'estimate-garden-lighting', version: '0.0.0', draft: true, progress: [{ app: 'gardenLighting', label: 'Garden Lighting', param: 'project' }], inputs: [{ key: 'fittings', label: 'Fittings', default: 12 }, { key: 'zones', label: 'Zones', default: 3 }], sections: [] };
  T['whole-home'] = { kind: 'whole-home', title: 'Whole home estimate', cover: 'scope', app: 'estimate-whole-home', version: '0.0.0', draft: true, progress: [{ app: 'takeoffs', label: 'Takeoffs', param: 'project' }], inputs: [{ key: 'rooms', label: 'Rooms', default: 10 }, { key: 'floors', label: 'Floors', default: 2 }], sections: [] };

  global.__SONOR_ESTIMATE_TEMPLATES__ = T;
  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
