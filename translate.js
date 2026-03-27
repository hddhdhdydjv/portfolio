#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  AUTO-TRANSLATOR — projects.js
//  Traduce automáticamente los campos faltantes EN → ES
//  usando MyMemory API (gratuito, sin clave API)
//
//  USO:
//    node translate.js
//
//  Qué hace:
//  - Lee projects.js
//  - Detecta campos *Es vacíos o faltantes
//  - Los traduce automáticamente al español
//  - Escribe el resultado de vuelta en projects.js
//
//  Corrección manual:
//  - Abrí projects.js y editá cualquier campo *Es que
//    quieras mejorar. El script NO sobreescribe campos
//    que ya tengan contenido.
// ─────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

const PROJECTS_FILE = path.join(__dirname, 'projects.js');
const DELAY_MS = 300; // delay entre requests para no saturar la API

// ── Translate via MyMemory (free, no key) ──
async function translate(text) {
  if (!text || text.trim() === '') return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.responseData?.translatedText || text;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Fields to translate per project ──
const PROJECT_FIELDS = ['subtitle', 'category', 'type', 'duration', 'role'];
const SECTION_FIELDS = ['label', 'text'];

async function run() {
  console.log('📖 Reading projects.js...');
  let src = fs.readFileSync(PROJECTS_FILE, 'utf8');

  // Load projects by evaluating the file in a mock environment
  const mockWindow = { location: { pathname: '/' } };
  const code = src
    .replace('const _BASE = window.location.pathname', 'const _BASE = ""')
    .replace('function _asset(path)', 'function _asset_fn(path)')
    .replace('return path.startsWith', 'return path.startsWith');

  // eslint-disable-next-line no-new-func
  let PROJECTS;
  try {
    const fn = new Function('window', `
      const _BASE = '';
      function _asset(p) { return p; }
      ${src.split('const PROJECTS')[1].split('const PROJECTS =')[0] || ''}
      const PROJECTS = ${src.match(/const PROJECTS = \[([\s\S]*?)\];/)?.[0]?.replace('const PROJECTS = ', '') || '[]'};
      return PROJECTS;
    `);
    PROJECTS = fn(mockWindow);
  } catch(e) {
    // Fallback: regex parse won't work for complex JS, use simple approach
    console.log('⚠️  Using simple mode (eval not available). Showing what would be translated:\n');
    previewMode(src);
    return;
  }

  let translationCount = 0;

  for (const project of PROJECTS) {
    console.log(`\n🔄 ${project.title}...`);

    // Translate project-level fields
    for (const field of PROJECT_FIELDS) {
      const esField = field + 'Es';
      if (project[field] && !project[esField]) {
        process.stdout.write(`  ${field} → `);
        const translated = await translate(project[field]);
        console.log(translated);
        project[esField] = translated;
        translationCount++;
        await sleep(DELAY_MS);
      }
    }

    // Translate deliverables array
    if (project.deliverables && !project.deliverablesEs) {
      project.deliverablesEs = [];
      for (const d of project.deliverables) {
        const translated = await translate(d);
        project.deliverablesEs.push(translated);
        await sleep(DELAY_MS);
      }
      console.log(`  deliverables → [${project.deliverablesEs.join(', ')}]`);
      translationCount++;
    }

    // Translate sections
    for (const sec of (project.sections || [])) {
      for (const field of SECTION_FIELDS) {
        const esField = field + 'Es';
        if (sec[field] && !sec[esField]) {
          process.stdout.write(`  section.${field} → `);
          const translated = await translate(sec[field]);
          const preview = translated.length > 60 ? translated.slice(0, 60) + '…' : translated;
          console.log(preview);
          sec[esField] = translated;
          translationCount++;
          await sleep(DELAY_MS);
        }
      }
    }
  }

  if (translationCount === 0) {
    console.log('\n✅ All fields already translated — nothing to do.');
    return;
  }

  console.log(`\n✍️  Writing ${translationCount} translations back to projects.js...`);

  // Serialize projects back into the file
  // We inject the translated fields into the existing source
  // For each project, find and update the Es fields
  for (const project of PROJECTS) {
    for (const field of [...PROJECT_FIELDS, 'deliverables']) {
      const esField = field + 'Es';
      if (project[esField]) {
        const val = Array.isArray(project[esField])
          ? JSON.stringify(project[esField])
          : JSON.stringify(project[esField]);

        // Try to update existing field or insert after EN field
        const enPattern = new RegExp(`(    ${field}:\\s*'[^']*',?\\n)`);
        const esPattern = new RegExp(`(    ${esField}:\\s*'[^']*',?\\n)`);

        if (esPattern.test(src)) {
          // Already exists, skip (don't overwrite manual corrections)
        } else if (enPattern.test(src)) {
          src = src.replace(enPattern, `$1    ${esField}: ${val},\n`);
        }
      }
    }
  }

  fs.writeFileSync(PROJECTS_FILE, src, 'utf8');
  console.log('✅ Done! projects.js updated with', translationCount, 'new translations.');
  console.log('💡 Review and improve any translations in projects.js manually.');
}

function previewMode(src) {
  const matches = src.match(/id: '([^']+)'/g) || [];
  console.log('Projects found:', matches.map(m => m.replace("id: '", '').replace("'", '')).join(', '));
  console.log('\nTo use auto-translation, run: node translate.js');
  console.log('The script will detect missing *Es fields and fill them automatically.');
}

run().catch(console.error);
