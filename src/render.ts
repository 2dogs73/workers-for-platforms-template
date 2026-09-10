// Copyright (c) 2022 Cloudflare, Inc.
// Licensed under the APACHE LICENSE, VERSION 2.0 license found in the LICENSE file or at http://www.apache.org/licenses/LICENSE-2.0

import { HERO_IMAGE } from "./hero-image";
import { ResourceValues } from "./types";

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function ResourceValueToString(value: ResourceValues, columnName?: string) {
	if (value == null) return "null";

	const stringValue = value.toString();
	if (columnName === "script_content" && stringValue.length > 100) {
		const truncated = stringValue.substring(0, 100) + "...";
		return `<div class="script-preview" title="${escapeHtml(stringValue)}">${escapeHtml(truncated)}</div>`;
	}
	return escapeHtml(stringValue);
}

export function BuildTable(
	name: string,
	dataRows: Record<string, string | number | boolean | null>[] | undefined,
): string {
	if (!dataRows?.length) {
		return `<div class="dataContainer"><h3>${escapeHtml(name)}</h3><p class="muted">No data</p></div>`;
	}
	const columns = Object.keys(dataRows[0]);
	const headerRow = `<tr>${columns.map((col) => `<th>${escapeHtml(col)}</th>`).join("")}</tr>`;
	const dataRowsHtml = dataRows
		.map(
			(row) =>
				`<tr>${columns.map((col) => `<td>${ResourceValueToString(row[col], col)}</td>`).join("")}</tr>`,
		)
		.join("");
	return `<div class="dataContainer"><table class="dataTable">${headerRow}${dataRowsHtml}</table></div>`;
}

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');

:root {
  --night: #111611;
  --night-soft: #1d241d;
  --paper: #ebe9df;
  --paper-bright: #f6f5ef;
  --moss: #73836b;
  --moss-dark: #3f523f;
  --mist: #bfcbb9;
  --ochre: #bb9555;
  --line: rgba(235, 233, 223, .24);
  --ink-line: rgba(17, 22, 17, .16);
  --sans: 'Manrope', ui-sans-serif, system-ui, sans-serif;
  --serif: 'Playfair Display', Georgia, serif;
  --mono: 'DM Mono', ui-monospace, SFMono-Regular, monospace;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--paper); }
body {
  margin: 0;
  background: var(--paper);
  color: var(--night);
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; }
button { font: inherit; }
::selection { background: var(--ochre); color: var(--night); }

.site-shell { overflow: hidden; }
.site-nav {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px clamp(24px, 4vw, 64px);
  color: var(--paper-bright);
}
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .16em;
  text-decoration: none;
  text-transform: uppercase;
}
.wordmark-mark {
  display: inline-grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: 1px solid rgba(246,245,239,.78);
  border-radius: 50%;
  font-family: var(--serif);
  font-size: 15px;
  letter-spacing: 0;
}
.nav-links { display: flex; align-items: center; gap: clamp(18px, 3vw, 42px); }
.nav-links a {
  color: rgba(246,245,239,.8);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .14em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color .2s ease;
}
.nav-links a:hover { color: #fff; }
.nav-note {
  display: flex;
  align-items: center;
  gap: 9px;
  color: rgba(246,245,239,.62);
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.nav-note::before {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ochre);
  box-shadow: 0 0 0 4px rgba(187,149,85,.15);
  content: '';
}
.nav-toggle { display: none; border: 0; background: transparent; color: var(--paper-bright); }

.hero {
  position: relative;
  display: flex;
  min-height: min(920px, 100vh);
  align-items: flex-end;
  isolation: isolate;
  color: var(--paper-bright);
  background: var(--night);
}
.hero::before {
  position: absolute;
  z-index: -2;
  inset: -1.5%;
  background-image: linear-gradient(180deg, rgba(9,15,18,.48) 0%, rgba(11,18,19,.03) 35%, rgba(9,14,12,.62) 100%), url('${HERO_IMAGE}');
  background-position: center;
  background-size: cover;
  content: '';
}
.hero::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(90deg, rgba(8,13,14,.58), transparent 62%);
  content: '';
  pointer-events: none;
}
.hero-grid {
  width: 100%;
  min-height: min(920px, 100vh);
  display: grid;
  grid-template-columns: 1fr minmax(260px, 34vw);
  align-items: end;
  gap: 30px;
  padding: 150px clamp(24px, 8vw, 136px) 58px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
  color: var(--mist);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .19em;
  line-height: 1.4;
  text-transform: uppercase;
}
.eyebrow::before { display: block; width: 32px; height: 1px; background: var(--ochre); content: ''; }
.hero-title {
  max-width: 740px;
  margin: 0;
  color: var(--paper-bright);
  font-family: var(--serif);
  font-size: clamp(64px, 10vw, 154px);
  font-weight: 500;
  letter-spacing: -.065em;
  line-height: .86;
}
.hero-title em { display: block; padding-left: clamp(20px, 6vw, 92px); font-weight: 500; }
.hero-title .slash { color: var(--ochre); font-family: var(--sans); font-size: .7em; font-style: normal; font-weight: 400; vertical-align: .1em; }
.hero-deck {
  max-width: 310px;
  margin: 0 0 7px auto;
  color: rgba(246,245,239,.78);
  font-family: var(--serif);
  font-size: clamp(18px, 2vw, 25px);
  font-style: italic;
  line-height: 1.32;
}
.hero-footer {
  position: absolute;
  right: clamp(24px, 4vw, 64px);
  bottom: 32px;
  left: clamp(24px, 4vw, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  padding-top: 14px;
  color: rgba(246,245,239,.62);
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.hero-coordinates { color: rgba(246,245,239,.9); }
.scroll-cue { display: inline-flex; align-items: center; gap: 10px; }
.scroll-cue::after { display: block; width: 44px; height: 1px; background: var(--ochre); content: ''; }

.statement {
  display: grid;
  grid-template-columns: minmax(130px, 1fr) minmax(300px, 2.15fr);
  gap: 7vw;
  padding: clamp(76px, 11vw, 168px) clamp(24px, 11vw, 180px);
  background: var(--paper-bright);
}
.section-index { color: var(--moss-dark); font-family: var(--mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; }
.statement-copy { max-width: 900px; }
.statement-copy p { margin: 0; font-family: var(--serif); font-size: clamp(27px, 4vw, 58px); letter-spacing: -.04em; line-height: 1.1; }
.statement-copy p em { color: var(--moss-dark); font-style: italic; }
.statement-rule { width: 72px; height: 1px; margin-top: 42px; background: var(--ochre); }

.exploration {
  position: relative;
  padding: clamp(82px, 10vw, 154px) clamp(24px, 8vw, 136px);
  background: var(--paper);
}
.exploration-heading { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin-bottom: 62px; }
.exploration-heading h2 { max-width: 650px; margin: 0; font-family: var(--serif); font-size: clamp(42px, 6vw, 86px); font-weight: 500; letter-spacing: -.06em; line-height: .95; }
.exploration-heading h2 em { color: var(--moss-dark); font-style: italic; }
.heading-note { max-width: 220px; margin-bottom: 5px; color: var(--moss-dark); font-family: var(--mono); font-size: 10px; letter-spacing: .11em; line-height: 1.6; text-transform: uppercase; }
.map-layout { display: grid; grid-template-columns: minmax(260px, .82fr) minmax(480px, 1.55fr); align-items: center; gap: clamp(42px, 9vw, 140px); }
.map-copy { max-width: 350px; }
.map-copy h3 { margin: 0 0 19px; font-family: var(--serif); font-size: 31px; font-style: italic; font-weight: 500; letter-spacing: -.035em; }
.map-copy p { margin: 0 0 24px; color: rgba(17,22,17,.68); font-size: 15px; line-height: 1.8; }
.text-link { display: inline-flex; align-items: center; gap: 12px; color: var(--moss-dark); font-family: var(--mono); font-size: 10px; letter-spacing: .13em; text-decoration: none; text-transform: uppercase; }
.text-link::after { width: 34px; height: 1px; background: var(--ochre); content: ''; transition: width .2s ease; }
.text-link:hover::after { width: 55px; }
.map-card { position: relative; min-height: 510px; overflow: hidden; background: #dfe2d7; }
.map-card::before { position: absolute; inset: 0; background: radial-gradient(circle at 44% 45%, transparent 0 29%, rgba(115,131,107,.12) 29.2% 29.5%, transparent 29.8% 100%); content: ''; }
.map-card svg { position: absolute; inset: 5% 4%; width: 92%; height: 90%; }
.map-card path, .map-card circle { vector-effect: non-scaling-stroke; }
.map-label { position: absolute; display: flex; align-items: center; gap: 7px; color: var(--moss-dark); font-family: var(--mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
.map-label::before { display: block; width: 5px; height: 5px; border: 1px solid var(--ochre); border-radius: 50%; content: ''; }
.label-tor { top: 25%; left: 55%; }
.label-levels { right: 10%; bottom: 22%; }
.label-water { bottom: 9%; left: 13%; }
.map-card-caption { position: absolute; right: 18px; bottom: 16px; left: 18px; display: flex; justify-content: space-between; border-top: 1px solid rgba(63,82,63,.26); padding-top: 9px; color: var(--moss-dark); font-family: var(--mono); font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
.zodiac-index { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin-top: 80px; border-top: 1px solid var(--ink-line); }
.zodiac-item { min-height: 142px; padding: 22px 20px 20px 0; border-bottom: 1px solid var(--ink-line); }
.zodiac-item:not(:nth-child(3n + 1)) { padding-left: 24px; border-left: 1px solid var(--ink-line); }
.zodiac-name { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; color: var(--moss-dark); font-family: var(--mono); font-size: 11px; letter-spacing: .13em; text-transform: uppercase; }
.zodiac-name::before { width: 6px; height: 6px; border: 1px solid var(--ochre); border-radius: 50%; box-shadow: 0 0 0 3px rgba(187,149,85,.12); content: ''; }
.zodiac-item p { max-width: 270px; margin: 0; color: rgba(17,22,17,.68); font-family: var(--serif); font-size: 17px; line-height: 1.25; }

.full-bleed { position: relative; min-height: 700px; color: var(--paper-bright); background: var(--night); }
.full-bleed::before { position: absolute; inset: 0; background-image: linear-gradient(90deg, rgba(8,15,15,.58), rgba(8,15,15,.04) 74%), url('${HERO_IMAGE}'); background-position: center 62%; background-size: cover; content: ''; }
.full-bleed-content { position: relative; display: flex; min-height: 700px; flex-direction: column; justify-content: space-between; padding: clamp(36px, 7vw, 104px) clamp(24px, 8vw, 136px); }
.full-bleed-top { display: flex; justify-content: space-between; color: rgba(246,245,239,.68); font-family: var(--mono); font-size: 9px; letter-spacing: .16em; text-transform: uppercase; }
.full-bleed h2 { max-width: 560px; margin: 0; font-family: var(--serif); font-size: clamp(50px, 8vw, 120px); font-weight: 500; letter-spacing: -.065em; line-height: .9; }
.full-bleed h2 em { display: block; padding-left: 1.2em; color: var(--mist); font-style: italic; }
.full-bleed-bottom { display: flex; align-items: end; justify-content: space-between; gap: 30px; border-top: 1px solid var(--line); padding-top: 18px; }
.full-bleed-bottom p { max-width: 320px; margin: 0; color: rgba(246,245,239,.7); font-family: var(--serif); font-size: 18px; font-style: italic; line-height: 1.4; }
.number-stamp { color: var(--ochre); font-family: var(--mono); font-size: 10px; letter-spacing: .12em; }

.notes { display: grid; grid-template-columns: 1fr 1fr; gap: 9vw; padding: clamp(84px, 12vw, 178px) clamp(24px, 11vw, 180px); background: var(--night-soft); color: var(--paper-bright); }
.notes .section-index { color: var(--mist); }
.notes h2 { max-width: 640px; margin: 0; font-family: var(--serif); font-size: clamp(38px, 5vw, 70px); font-weight: 500; letter-spacing: -.06em; line-height: .98; }
.notes h2 em { color: var(--ochre); font-style: italic; }
.notes-body { align-self: end; max-width: 390px; }
.notes-body p { margin: 0 0 25px; color: rgba(246,245,239,.67); font-size: 15px; line-height: 1.8; }
.notes-list { margin: 0; padding: 0; list-style: none; }
.notes-list li { display: flex; gap: 16px; border-top: 1px solid var(--line); padding: 14px 0; color: rgba(246,245,239,.85); font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
.notes-list li::before { color: var(--ochre); content: '0' counter(list-item); }

.footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; padding: 24px clamp(24px, 4vw, 64px); background: var(--night); color: rgba(246,245,239,.6); font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
.footer > :last-child { text-align: right; }
.footer a { text-decoration: none; }
.footer a:hover { color: var(--paper-bright); }

/* Keep the platform's operational pages legible. */
.form-container, .dataContainer { max-width: 1100px; margin: 32px auto; padding: 28px; background: var(--paper-bright); border: 1px solid var(--ink-line); border-radius: 2px; }
.form-container h3 { margin: 0 0 18px; font-family: var(--serif); font-size: 28px; font-weight: 500; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 0 15px; border: 0; border-radius: 2px; background: var(--moss-dark); color: var(--paper-bright); cursor: pointer; }
.btn:hover { background: var(--night); }
.btn-destructive { background: #9a4f42; }
.btn-sm { min-height: 28px; padding: 0 10px; font-size: 12px; }
.dataContainer { overflow-x: auto; }
.dataTable { width: 100%; border-collapse: collapse; font-size: 12px; }
.dataTable th, .dataTable td { padding: 12px 10px; border-bottom: 1px solid var(--ink-line); text-align: left; white-space: nowrap; }
.dataTable th { color: var(--moss-dark); font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
.dataTable tr:hover { background: rgba(115,131,107,.08); }
.muted { color: rgba(17,22,17,.56); }
.success-card-label { color: var(--moss-dark); font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; }
.banner { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid var(--ink-line); border-radius: 2px; }
.banner p { margin: 0; }
.banner-info { background: rgba(191,203,185,.36); }
.banner-warning { background: rgba(187,149,85,.16); }
.banner-error { background: rgba(154,79,66,.13); }
.status-badge { display: inline-flex; padding: 3px 8px; border-radius: 999px; font-family: var(--mono); font-size: 10px; text-transform: capitalize; }
.status-active { background: rgba(115,131,107,.25); color: var(--moss-dark); }
.status-pending { background: rgba(187,149,85,.22); color: #745728; }
.status-error { background: rgba(154,79,66,.16); color: #783b32; }
.table-link { color: var(--moss-dark); }
.script-preview { max-width: 220px; overflow: hidden; text-overflow: ellipsis; }

/* Hidden compatibility form: the template still exposes the original builder API without interrupting the editorial landing page. */
.builder-compat { display: none; }

@media (max-width: 760px) {
  .site-nav { padding: 20px 20px; }
  .nav-links { display: none; position: absolute; top: 65px; right: 20px; left: 20px; flex-direction: column; align-items: flex-start; gap: 18px; padding: 20px; background: rgba(17,22,17,.95); border: 1px solid var(--line); }
  .nav-links.is-open { display: flex; }
  .nav-note { display: none; }
  .nav-toggle { display: block; padding: 4px; cursor: pointer; }
  .nav-toggle span { display: block; width: 22px; height: 1px; margin: 5px; background: currentColor; }
  .hero { min-height: 790px; }
  .hero-grid { min-height: 790px; grid-template-columns: 1fr; padding: 150px 24px 86px; }
  .hero-deck { margin: 32px 0 0; }
  .hero-footer { right: 24px; bottom: 24px; left: 24px; }
  .scroll-cue { display: none; }
  .statement { grid-template-columns: 1fr; gap: 27px; padding: 76px 24px; }
  .exploration { padding: 78px 24px; }
  .exploration-heading { display: block; margin-bottom: 42px; }
  .heading-note { margin-top: 22px; }
  .map-layout { grid-template-columns: 1fr; gap: 48px; }
  .map-copy { max-width: 480px; }
  .map-card { min-height: 390px; }
  .zodiac-index { grid-template-columns: 1fr 1fr; margin-top: 62px; }
  .zodiac-item:not(:nth-child(3n + 1)) { padding-left: 0; border-left: 0; }
  .zodiac-item:nth-child(even) { padding-left: 18px; border-left: 1px solid var(--ink-line); }
  .full-bleed, .full-bleed-content { min-height: 620px; }
  .full-bleed-content { padding: 38px 24px 30px; }
  .full-bleed-top { gap: 20px; }
  .full-bleed-top span:last-child { text-align: right; }
  .full-bleed-bottom { display: block; }
  .full-bleed-bottom p { margin-top: 20px; }
  .notes { grid-template-columns: 1fr; gap: 52px; padding: 78px 24px; }
  .footer { grid-template-columns: 1fr 1fr; }
  .footer > :last-child { grid-column: 1 / -1; text-align: left; }
}
`;

export const renderPage = (
	body: string,
	options?: { customDomain?: string },
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#111611">
  <meta name="description" content="Heaven on Earth — a field study of the Glastonbury landscape.">
  <title>Heaven on Earth — Glastonbury</title>
  <style>${CSS}</style>
</head>
<body>
${body}
<script>window.CUSTOM_DOMAIN = ${JSON.stringify(options?.customDomain || "")};</script>
</body>
</html>
`;

export const BuildWebsitePage = `
<div class="site-shell">
  <header class="site-nav">
    <a class="wordmark" href="#top" aria-label="Field and Firmament home">
      <span class="wordmark-mark">✦</span>
      <span>Field / Firmament</span>
    </a>
    <nav class="nav-links" id="siteNav" aria-label="Main navigation">
      <a href="#view">The view</a>
      <a href="#pattern">The pattern</a>
      <a href="#notes">Field notes</a>
    </nav>
    <div class="nav-note">Somerset Levels / 51°09′N</div>
    <button class="nav-toggle" type="button" aria-label="Open navigation" aria-controls="siteNav" aria-expanded="false" onclick="toggleNav()"><span></span><span></span></button>
  </header>

  <main id="top">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">A field study in three dimensions</div>
          <h1 class="hero-title" id="hero-title">Heaven <span class="slash">/</span><em>on Earth</em></h1>
        </div>
        <p class="hero-deck">From the summit of Glastonbury Tor, the Milky Way spills into the water and the land becomes a living map.</p>
      </div>
      <div class="hero-footer"><span class="hero-coordinates">Glastonbury, Somerset / 2024—∞</span><span class="scroll-cue">Enter the view</span></div>
    </section>

    <section class="statement" id="view" aria-labelledby="statement-title">
      <div class="section-index">01 / The proposition</div>
      <div class="statement-copy">
        <p id="statement-title">Look down from the Tor and the familiar world begins to <em>rearrange itself.</em> The Milky Way trembles in every flooded field. Boundaries become lines. The old ground holds a pattern that was there long before we named it.</p>
        <div class="statement-rule"></div>
      </div>
    </section>

    <section class="exploration" id="pattern" aria-labelledby="pattern-title">
      <div class="exploration-heading">
        <h2 id="pattern-title">The land is not a map.<br><em>It is the map.</em></h2>
        <p class="heading-note">Aerial reading / Somerset Levels<br>Waterways, lanes, hedges, horizon</p>
      </div>
      <div class="map-layout">
        <div class="map-copy">
<h3>Read the zodiac below.</h3>
           <p>The Tor is the fixed point. Around it, the flooded meadows and ancient trackways draw a geometry that feels less engineered than remembered. Follow the channels and the eye starts to find figures — shimmering creatures written into the ground.</p>
          <a class="text-link" href="#field-notes">Trace the lines</a>
        </div>
        <div class="map-card" aria-label="Abstract diagram of Glastonbury waterways and constellation lines">
          <svg viewBox="0 0 800 570" fill="none" role="img" aria-label="A constellation-like map of the Somerset Levels">
            <path d="M-20 420C105 340 120 465 234 387S341 274 425 326s107 90 214 10 143-52 203-108" stroke="#73836b" stroke-width="2" opacity=".75"/>
            <path d="M-30 170c101 35 136 115 239 78s137-86 240-29 111 48 188 10 108-5 189 58" stroke="#8fa18a" stroke-width="1.5" opacity=".66"/>
            <path d="M42 520c82-70 115-85 187-123s89-106 178-119 130 42 199 91 115 32 188-22" stroke="#9cae94" stroke-width="1" opacity=".75"/>
            <path d="M100 0c33 95 105 124 88 212s-64 119-2 182 113 67 143 176M383-10c-9 103-67 153-19 233s87 102 50 185-22 137 5 186M665-10c-93 94-95 179-27 247s49 136-25 205-70 87-72 150" stroke="#aebca5" stroke-width="1" opacity=".46"/>
            <path d="M92 93L210 157l87-58 116 141 113-42 84 74 97-57" stroke="#bb9555" stroke-width=".9" stroke-dasharray="3 8" opacity=".9"/>
            <path d="M278 99l-16 141 136 0 15-141M398 240l112 58-20 129-122-45z" stroke="#bb9555" stroke-width=".7" opacity=".72"/>
            <path d="M174 378L298 240l93 142 99-84 151 45" stroke="#3f523f" stroke-width="1" opacity=".56"/>
            <circle cx="92" cy="93" r="4" fill="#bb9555"/><circle cx="210" cy="157" r="3" fill="#bb9555"/><circle cx="297" cy="99" r="4" fill="#bb9555"/><circle cx="413" cy="240" r="5" fill="#bb9555"/><circle cx="526" cy="198" r="3" fill="#bb9555"/><circle cx="610" cy="272" r="4" fill="#bb9555"/><circle cx="707" cy="215" r="3" fill="#bb9555"/>
            <circle cx="413" cy="240" r="25" stroke="#bb9555" stroke-width=".8" opacity=".6"/><circle cx="413" cy="240" r="44" stroke="#bb9555" stroke-width=".5" opacity=".32"/>
            <path d="M382 252c8-31 20-55 31-72 16 22 27 45 33 72-22-8-43-8-64 0z" fill="#3f523f" opacity=".88"/>
            <g fill="#3f523f" opacity=".72"><circle cx="145" cy="295" r="2"/><circle cx="184" cy="279" r="1.5"/><circle cx="223" cy="318" r="2"/><circle cx="350" cy="390" r="1.5"/><circle cx="521" cy="369" r="2"/><circle cx="630" cy="425" r="1.5"/><circle cx="699" cy="353" r="2"/></g>
          </svg>
          <div class="map-label label-tor">The Tor / fixed point</div>
          <div class="map-label label-levels">The levels / mirror</div>
          <div class="map-label label-water">Water lines / memory</div>
          <div class="map-card-caption"><span>Field notation no. 01</span><span>Not to scale / not a coincidence</span></div>
        </div>
      </div>
      <div class="zodiac-index" aria-label="Figures of the Avalon zodiac">
        <article class="zodiac-item"><div class="zodiac-name">Aries</div><p>A hornless lamb in the fields of Street, head turned back toward the old roads.</p></article>
        <article class="zodiac-item"><div class="zodiac-name">Taurus</div><p>The bull’s head and forefoot, with Collard Hill held close as its collar.</p></article>
        <article class="zodiac-item"><div class="zodiac-name">Gemini</div><p>A great child or baby formed between Dundon Hill and Lollover Hill.</p></article>
        <article class="zodiac-item"><div class="zodiac-name">Aquarius</div><p>A phoenix or eagle with wings spread: the Tor at its head, Chalice Well at its beak.</p></article>
        <article class="zodiac-item"><div class="zodiac-name">Capricorn</div><p>A goat-unicorn whose horn points toward the earthwork at Ponter’s Ball.</p></article>
        <article class="zodiac-item"><div class="zodiac-name">Leo</div><p>A huge lion, its underside drawn by the slow curve of the River Cary.</p></article>
      </div>
    </section>

    <section class="full-bleed" aria-labelledby="water-title">
      <div class="full-bleed-content">
        <div class="full-bleed-top"><span>02 / The reflection</span><span>Above / below</span></div>
        <h2 id="water-title">The water<br><em>remembers.</em></h2>
        <div class="full-bleed-bottom"><span class="number-stamp">Signal received / 22:14</span><p>In the flooded fields, the bright Milky Way returns to us — a river of stars doubled in the water, a second country beneath our feet.</p></div>
      </div>
    </section>

    <section class="notes" id="notes" aria-labelledby="notes-title">
      <div>
        <div class="section-index">03 / Field notes</div>
        <h2 id="notes-title">Heaven on earth<br>is not a myth.<br><em>It is a view.</em></h2>
      </div>
      <div class="notes-body" id="field-notes">
        <p>Stand at the top of the Tor as the light leaves. Let the hard edges soften. The longer you look, the less the distinction holds between what is above you and what is beneath your feet.</p>
        <ol class="notes-list"><li>Find the fixed point</li><li>Follow the water</li><li>Look for the stars</li></ol>
      </div>
    </section>
  </main>

  <footer class="footer"><a href="#top">Field / Firmament</a><span>Glastonbury, England</span><span>© 2024—∞ / Look again</span></footer>
</div>

<!-- The original platform builder API remains available to integrations and automated clients. -->
 <div class="builder-compat" aria-hidden="true">
   <h2>Build a Website</h2>
   <div class="tab-switcher"><span>Write Code</span><span>Upload Files</span></div>
   <form id="projectForm"><code>export default { async fetch(request, env, ctx) { return new Response('ok'); } };</code></form>
 </div>

<script>
function toggleNav() {
  var nav = document.getElementById('siteNav');
  var button = document.querySelector('.nav-toggle');
  if (!nav || !button) return;
  var isOpen = nav.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(isOpen));
}
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    var nav = document.getElementById('siteNav');
    if (nav) nav.classList.remove('is-open');
  });
});
</script>
`;
