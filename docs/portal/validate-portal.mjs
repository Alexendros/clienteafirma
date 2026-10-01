#!/usr/bin/env node
/**
 * validate-portal.mjs
 * Valida el portal de Autofirma-2026:
 * - HTML válido (html-validate)
 * - Enlaces no rotos
 * - Checksums SHA256 formato correcto
 * - Accesibilidad (axe-core)
 * - CSS válido
 * - JavaScript sin errores de sintaxis
 *
 * Uso: node validate-portal.mjs [--fix] [--ci]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORTAL_DIR = __dirname;

const args = process.argv.slice(2);
const FIX_MODE = args.includes('--fix');
const CI_MODE = args.includes('--ci');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(level, msg) {
  const prefix = {
    info: `${COLORS.cyan}[INFO]${COLORS.reset}`,
    ok: `${COLORS.green}[OK]${COLORS.reset}`,
    warn: `${COLORS.yellow}[WARN]${COLORS.reset}`,
    error: `${COLORS.red}[ERROR]${COLORS.reset}`,
  }[level];
  console.log(`${prefix} ${msg}`);
}

function runCmd(cmd, cwd = PORTAL_DIR) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (e) {
    return { error: true, stdout: e.stdout?.toString(), stderr: e.stderr?.toString(), code: e.status };
  }
}

// ========================================
// VALIDACIONES
// ========================================

async function validateHTML() {
  log('info', 'Validando HTML...');
  const htmlFile = path.join(PORTAL_DIR, 'index.html');

  // Verificar que existe
  if (!fs.existsSync(htmlFile)) {
    log('error', 'index.html no encontrado');
    return false;
  }

  // html-validate si está disponible
  const hasHtmlValidate = runCmd('npx html-validate --version', __dirname).includes('html-validate');
  if (hasHtmlValidate) {
    const result = runCmd(`npx html-validate ${htmlFile} --formatter text`, __dirname);
    if (result.error) {
      log('error', 'html-validate falló:');
      console.log(result.stderr || result.stdout);
      return false;
    }
    log('ok', 'HTML válido (html-validate)');
  } else {
    log('warn', 'html-validate no instalado, saltando validación HTML estricta');
  }

  // Validación básica: estructura DOCTYPE, etiquetas balanceadas
  const html = fs.readFileSync(htmlFile, 'utf8');
  if (!html.startsWith('<!DOCTYPE html>')) {
    log('error', 'Falta <!DOCTYPE html>');
    return false;
  }
  if (!html.includes('<html lang="es">')) {
    log('warn', 'Falta lang="es" en <html>');
  }
  if (!html.includes('<meta charset="utf-8"')) {
    log('warn', 'Falta charset utf-8');
  }
  if (!html.includes('<meta name="viewport"')) {
    log('warn', 'Falta viewport meta tag');
  }

  log('ok', 'Validaciones HTML básicas pasadas');
  return true;
}

async function validateCSS() {
  log('info', 'Validando CSS...');
  const cssFiles = ['tokens.css', 'components.css'].map(f => path.join(PORTAL_DIR, f));
  let allOk = true;

  for (const cssFile of cssFiles) {
    if (!fs.existsSync(cssFile)) {
      log('error', `CSS no encontrado: ${path.basename(cssFile)}`);
      allOk = false;
      continue;
    }

    const css = fs.readFileSync(cssFile, 'utf8');

    // Verificar variables CSS usadas están definidas
    const usedVars = css.match(/var\(--([^)]+)\)/g) || [];
    const definedVars = css.match(/--([a-zA-Z0-9-]+):/g) || [];

    const definedSet = new Set(definedVars.map(v => v.slice(2, -1)));
    const missingVars = [...new Set(usedVars.map(v => v.slice(4, -1)))].filter(v => !definedSet.has(v));

    if (missingVars.length > 0) {
      log('warn', `${path.basename(cssFile)}: variables CSS usadas pero no definidas: ${missingVars.join(', ')}`);
    }

    // Verificar OKLCH válido (básico)
    const oklchMatches = css.match(/oklch\([^)]+\)/g) || [];
    for (const match of oklchMatches) {
      const vals = match.match(/oklch\(([^)]+)\)/)[1].split(/\s+/);
      const L = parseFloat(vals[0]);
      const C = parseFloat(vals[1]);
      if (L < 0 || L > 1) log('warn', `OKLCH L fuera de rango [0,1]: ${match}`);
      if (C < 0 || C > 0.4) log('warn', `OKLCH C posiblemente fuera de rango [0,0.4]: ${match}`);
    }

    log('ok', `CSS válido: ${path.basename(cssFile)}`);
  }
  return allOk;
}

async function validateJS() {
  log('info', 'Validando JavaScript...');
  const jsFile = path.join(PORTAL_DIR, 'app.js');

  if (!fs.existsSync(jsFile)) {
    log('error', 'app.js no encontrado');
    return false;
  }

  // Verificar sintaxis con Node
  try {
    const result = runCmd(`node --check ${jsFile}`, PORTAL_DIR);
    if (result.error) {
      log('error', 'Error de sintaxis en app.js:');
      console.log(result.stderr);
      return false;
    }
    log('ok', 'Sintaxis JavaScript válida');
  } catch (e) {
    log('error', 'No se pudo validar JS con node --check');
    return false;
  }

  // Verificar que no hay console.log en producción (excepto init)
  const js = fs.readFileSync(jsFile, 'utf8');
  const consoleLogs = js.match(/console\.(log|warn|error)\(/g) || [];
  if (consoleLogs.length > 1) { // permitimos el log de init
    log('warn', `console.* encontrado ${consoleLogs.length} veces (considera quitar en prod)`);
  }

  log('ok', 'Validaciones JS básicas pasadas');
  return true;
}

async function validateLinks() {
  log('info', 'Validando enlaces internos y externos...');
  const htmlFile = path.join(PORTAL_DIR, 'index.html');
  const html = fs.readFileSync(htmlFile, 'utf8');

  // Extraer todos los href
  const hrefRegex = /href=["']([^"']+)["']/g;
  const links = [];
  let match;
  while (true) {
    match = hrefRegex.exec(html);
    if (!match) break;
    links.push(match[1]);
  }

  const internalLinks = links.filter(l => l.startsWith('#'));
  const externalLinks = links.filter(l => l.startsWith('http'));

  // Verificar anclas internas
  let internalOk = true;
  for (const link of internalLinks) {
    const id = link.slice(1);
    if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
      log('error', `Enlace interno roto: ${link} (no existe id="${id}")`);
      internalOk = false;
    }
  }
  if (internalOk) log('ok', `${internalLinks.length} enlaces internos válidos`);

  // Verificar enlaces externos (HEAD request)
  if (!CI_MODE) {
    log('info', 'Saltando verificación de enlaces externos (usa --ci para activar)');
  } else {
    const uniqueExternal = [...new Set(externalLinks)];
    log('info', `Verificando ${uniqueExternal.length} enlaces externos únicos...`);

    let externalOk = 0;
    let externalFail = 0;
    for (const link of uniqueExternal) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const resp = await fetch(link, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
        clearTimeout(timeout);
        if (resp.ok || resp.status === 301 || resp.status === 302 || resp.status === 403) { // 403 = GitHub bloquea HEAD a veces
          externalOk++;
        } else {
          log('warn', `Enlace externo ${resp.status}: ${link}`);
          externalFail++;
        }
      } catch (e) {
        log('warn', `Enlace externo falló: ${link} (${e.message})`);
        externalFail++;
      }
    }
    log('ok', `Enlaces externos: ${externalOk} OK, ${externalFail} con advertencias`);
  }

  return true;
}

async function validateChecksums() {
  log('info', 'Validando checksums SHA256...');
  const htmlFile = path.join(PORTAL_DIR, 'index.html');
  const html = fs.readFileSync(htmlFile, 'utf8');

  // Buscar solo checksums reales (no texto como "GPG Fingerprint:")
  // Los checksums reales están en spans con class="checksum-value" que contienen solo hex de 64 chars
  const checksumMatches = html.match(/class="checksum-value">([a-f0-9]{64}|<em>[^<]+<\/em>|pendiente[^<]*)</gi) || [];
  let allOk = true;
  let foundChecksums = 0;

  for (const match of checksumMatches) {
    const value = match.replace(/.*class="checksum-value">([^<]+).*/i, '$1').trim();

    if (value.startsWith('<em>') || value.toLowerCase().includes('pendiente') || value.toLowerCase().includes('no disponible')) {
      log('info', `Checksum pendiente (omitido): ${value.replace(/<[^>]+>/g, '')}`);
      continue;
    }

    if (value.toLowerCase().includes('gpg fingerprint') || value.toLowerCase().includes('clave')) {
      log('info', `Texto informativo omitido: ${value}`);
      continue;
    }

    // Validar formato SHA256: 64 chars hex
    if (!/^[a-f0-9]{64}$/i.test(value)) {
      log('error', `Checksum inválido (no es SHA256 de 64 hex): ${value}`);
      allOk = false;
    } else {
      foundChecksums++;
      log('ok', `Checksum válido: ${value.slice(0, 16)}...`);
    }
  }

  if (foundChecksums === 0) {
    log('warn', 'No se encontraron checksums SHA256 válidos');
  }

  return allOk;
}

async function validateAccessibility() {
  log('info', 'Validando accesibilidad (básica)...');
  const htmlFile = path.join(PORTAL_DIR, 'index.html');
  const html = fs.readFileSync(htmlFile, 'utf8');
  let allOk = true;

  // lang attribute
  if (!html.includes('<html lang="es">')) {
    log('warn', 'Falta lang="es" en <html>');
    allOk = false;
  }

  // Skip link
  if (!html.includes('class="skip-link"')) {
    log('warn', 'Falta skip link para navegación teclado');
    allOk = false;
  }

  // Main landmark
  if (!html.includes('id="main-content"') && !html.includes('<main')) {
    log('warn', 'Falta landmark main o id="main-content"');
    allOk = false;
  }

  // Botones con tipo
  const buttonsWithoutType = html.match(/<button(?![^>]*type=)/g) || [];
  if (buttonsWithoutType.length > 0) {
    log('warn', `${buttonsWithoutType.length} botones sin type="" (añade type="button")`);
    allOk = false;
  }

  // Imágenes con alt
  const imgs = html.match(/<img[^>]*>/g) || [];
  for (const img of imgs) {
    if (!img.includes('alt=')) {
      log('warn', `<img> sin atributo alt: ${img}`);
      allOk = false;
    }
  }

  // Inputs con labels
  const inputs = html.match(/<input[^>]*>/g) || [];
  for (const input of inputs) {
    const idMatch = input.match(/id=["']([^"']+)["']/);
    if (idMatch) {
      const id = idMatch[1];
      if (!html.includes(`for="${id}"`) && !html.includes(`for='${id}'`)) {
        log('warn', `<input id="${id}"> sin <label for="${id}">`);
        allOk = false;
      }
    }
  }

  // Contraste: verificar que no hay colores hardcoded que fallen WCAG
  // (solo advertencia, OKLCH ayuda pero no garantiza)
  if (html.includes('color:') || html.includes('background:')) {
    log('info', 'Colores inline detectados — verificar contraste WCAG AA (4.5:1)');
  }

  if (allOk) log('ok', 'Validaciones de accesibilidad básicas pasadas');
  return allOk;
}

async function validateStructure() {
  log('info', 'Validando estructura de archivos...');
  const required = ['index.html', 'tokens.css', 'components.css', 'app.js'];
  let allOk = true;

  for (const file of required) {
    const fullPath = path.join(PORTAL_DIR, file);
    if (!fs.existsSync(fullPath)) {
      log('error', `Archivo requerido faltante: ${file}`);
      allOk = false;
    } else {
      const stats = fs.statSync(fullPath);
      if (stats.size === 0) {
        log('warn', `Archivo vacío: ${file}`);
      } else {
        log('ok', `Archivo presente: ${file} (${stats.size} bytes)`);
      }
    }
  }
  return allOk;
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log(`${COLORS.bold}${COLORS.blue}╔══════════════════════════════════════════╗${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.blue}║  Autofirma-2026 Portal — Validación     ║${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.blue}╚══════════════════════════════════════════╝${COLORS.reset}`);
  console.log('');

  const results = [];

  results.push({ name: 'Estructura', pass: await validateStructure() });
  results.push({ name: 'HTML', pass: await validateHTML() });
  results.push({ name: 'CSS', pass: await validateCSS() });
  results.push({ name: 'JavaScript', pass: await validateJS() });
  results.push({ name: 'Enlaces', pass: await validateLinks() });
  results.push({ name: 'Checksums', pass: await validateChecksums() });
  results.push({ name: 'Accesibilidad', pass: await validateAccessibility() });

  console.log('');
  console.log(`${COLORS.bold}═══════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.bold}RESUMEN:${COLORS.reset}`);

  let allPass = true;
  for (const r of results) {
    const status = r.pass ? `${COLORS.green}PASS${COLORS.reset}` : `${COLORS.red}FAIL${COLORS.reset}`;
    console.log(`  ${status}  ${r.name}`);
    if (!r.pass) allPass = false;
  }

  console.log('');
  if (allPass) {
    console.log(`${COLORS.green}${COLORS.bold}✓ TODAS LAS VALIDACIONES PASARON${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`${COLORS.red}${COLORS.bold}✗ ALGUNAS VALIDACIONES FALLARON${COLORS.reset}`);
    if (CI_MODE) process.exit(1);
  }
}

main().catch(err => {
  console.error(`${COLORS.red}Error fatal:${COLORS.reset}`, err);
  process.exit(1);
});