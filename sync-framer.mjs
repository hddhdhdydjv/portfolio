#!/usr/bin/env node

const FRAMER_URL = 'https://loving-slides-198460.framer.app';
const PAGES = ['/', '/about', '/projects', '/projects/brikka', '/projects/fan-raise', '/projects/thinknube-ai'];
const REPO_DIR = import.meta.dirname;

import { writeFile, mkdir, rm, readdir, stat } from 'fs/promises';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

const downloaded = new Set();

async function dl(url, outPath) {
  if (downloaded.has(url)) return;
  downloaded.add(url);
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
  } catch {}
}

function extractUrls(text) {
  const urls = new Set();
  const patterns = [
    /(?:href|src)="(https:\/\/framerusercontent\.com\/[^"]+)"/g,
    /(?:href|src)="(https:\/\/fonts\.gstatic\.com\/[^"]+)"/g,
    /url\((https:\/\/framerusercontent\.com\/[^)]+)\)/g,
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g,
    /["'](https:\/\/framerusercontent\.com\/[^"'\s]+)["']/g,
  ];
  for (const p of patterns) {
    for (const m of text.matchAll(p)) urls.add(m[1]);
  }
  return urls;
}

function urlToPath(url) {
  const u = new URL(url);
  return join(REPO_DIR, 'assets', u.hostname + u.pathname);
}

function rewriteHtml(html) {
  return html
    .replace(/https:\/\/framerusercontent\.com\//g, '/assets/framerusercontent.com/')
    .replace(/https:\/\/fonts\.gstatic\.com\//g, '/assets/fonts.gstatic.com/')
    .replace(/<script>try\{if\(localStorage\.get\("__framer_force_showing_editorbar_since"\).*?<\/script>/g, '');
}

function fixImageUrls(html) {
  return html.replace(/(\/assets\/framerusercontent\.com\/images\/[^"'\s?]+)\?[^"'\s]*/g, '$1');
}

async function cleanOldAssets() {
  const assetsDir = join(REPO_DIR, 'assets');
  if (existsSync(assetsDir)) {
    await rm(assetsDir, { recursive: true });
    console.log('🧹 Cleaned old assets');
  }
}

async function downloadSite() {
  const allAssets = new Set();

  for (const page of PAGES) {
    const url = FRAMER_URL + page;
    process.stdout.write(`📄 ${page || '/'} ... `);
    const res = await fetch(url);
    let html = await res.text();

    for (const u of extractUrls(html)) allAssets.add(u);

    html = fixImageUrls(rewriteHtml(html));

    const outPath = page === '/'
      ? join(REPO_DIR, 'index.html')
      : join(REPO_DIR, page.slice(1), 'index.html');

    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html);
    console.log('OK');
  }

  console.log(`\n📦 Downloading ${allAssets.size} assets...`);
  const batches = [...allAssets];
  for (let i = 0; i < batches.length; i += 15) {
    const batch = batches.slice(i, i + 15);
    await Promise.all(batch.map(u => dl(u, urlToPath(u))));
    process.stdout.write(`\r   ${Math.min(i + 15, batches.length)}/${batches.length}`);
  }
  console.log('');

  const jsFiles = batches.filter(u => u.endsWith('.mjs') || u.endsWith('.js'));
  let extra = 0;
  for (const jsUrl of jsFiles) {
    try {
      const res = await fetch(jsUrl);
      const text = await res.text();
      const moreUrls = [...extractUrls(text)].filter(u => !downloaded.has(u));
      extra += moreUrls.length;
      for (let i = 0; i < moreUrls.length; i += 15) {
        const batch = moreUrls.slice(i, i + 15);
        await Promise.all(batch.map(u => dl(u, urlToPath(u))));
      }
    } catch {}
  }
  if (extra > 0) console.log(`   +${extra} assets from JS files`);

  // Rewrite CDN URLs inside downloaded JS/MJS files to local paths
  console.log('🔗 Rewriting URLs in JS files...');
  const { readFile: rf } = await import('fs/promises');
  const jsLocalFiles = [];
  const sitesDir = join(REPO_DIR, 'assets', 'framerusercontent.com', 'sites');
  if (existsSync(sitesDir)) {
    const { readdirSync } = await import('fs');
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.mjs') || entry.name.endsWith('.js')) jsLocalFiles.push(full);
      }
    };
    walk(sitesDir);
  }
  for (const f of jsLocalFiles) {
    let content = await rf(f, 'utf8');
    const original = content;
    content = content
      .replace(/https:\/\/framerusercontent\.com\//g, '/assets/framerusercontent.com/')
      .replace(/https:\/\/fonts\.gstatic\.com\//g, '/assets/fonts.gstatic.com/');
    if (content !== original) await writeFile(f, content);
  }

  console.log(`✅ Downloaded ${downloaded.size} total assets`);
}

function gitCommitAndPush() {
  const run = (cmd) => execSync(cmd, { cwd: REPO_DIR, stdio: 'inherit' });

  run('git add -A');

  const status = execSync('git status --porcelain', { cwd: REPO_DIR }).toString().trim();
  if (!status) {
    console.log('⚡ No changes detected, skipping deploy');
    return false;
  }

  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  run(`git commit -m "Sync from Framer — ${timestamp}"`);
  run('git push origin main');
  console.log('📤 Pushed to GitHub');
  return true;
}

function deploy() {
  execSync('npx vercel deploy --prod --yes', { cwd: REPO_DIR, stdio: 'inherit' });
  console.log('\n🚀 Live on hddhdhdydjv.com');
}

async function main() {
  console.log('🔄 Syncing Framer site → hddhdhdydjv.com\n');

  await cleanOldAssets();
  await downloadSite();

  console.log('');
  const hasChanges = gitCommitAndPush();
  if (hasChanges) deploy();

  console.log('\n✨ Done!');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
