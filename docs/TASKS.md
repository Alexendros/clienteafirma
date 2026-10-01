# Tareas vivas — Autofirma comunitaria

### Propósito de este documento

- **Objetivos:** Tablero único de trabajo (Hecho / En curso / Pendiente) con criterio comprobable.
- **Estructura:** Bloques por prioridad y por fase F0–F10.
- **Contenido a integrar según contexto:** Actualizar al cerrar PRs o fases. Complementa [ROADMAP](integration/ROADMAP.md) y [ESTADO-FASES](ESTADO-FASES.md).

**Canónico:** [Soluciones-Alexendros/clienteafirma-alexendros](https://github.com/Soluciones-Alexendros/clienteafirma-alexendros) (traslado desde `Alexendros/clienteafirma`).

---

## En curso

| ID | Tarea | Criterio de salida | Evidencia |
|----|-------|--------------------|-----------|
| T-A11Y | Integrar nombres accesibles (lista de certificados, PIN, confirmar) | PR mergeado + CI verde; sin cambiar el comportamiento de firma | Rama `a11y/signing-flows` → PR a `master` |
| T-TLS | Preferencia `strictSslChecks` opt-in (por defecto off) | PR mergeado; default sigue compatible con sedes | Rama `prefs/strict-ssl` → PR a `master` |
| T-ORG | Trasladar repo a `Soluciones-Alexendros/clienteafirma-alexendros` | Remoto canónico = nueva URL; Actions responden | Transfer + rename |
| T-RELEASE | Workflow `release.yml` (SemVer, tags firmados, GitHub Releases) | Tag `v*` → Release publicado con artefactos firmados | `.github/workflows/release.yml` |
| T-PACK | Empaquetado completo: DEB, RPM, Flatpak, AppImage + firmas/checksums | Artefactos en `dist/` con `.asc` y `SHA256SUMS*` | `packaging/` + `scripts/f6-*.sh` |
| T-ARCHIFY | Suite Archify post-canon (5 diagramas en español) | `finalize` 5/5 pass + `SUITE-SUMMARY` con URL nueva | `.archify/…-canon-org/` |
| T-ARCHIVE | Archivar meta `Alexendros/Autofirma-2026` | Repo read-only en GitHub | `gh repo archive` |

---

## Hecho (reciente)

| ID | Tarea | Criterio | Evidencia |
|----|-------|----------|-----------|
| T-P0 | Alineación de contrato de repositorio | README/SECURITY/CI P0 | PR [#1](https://github.com/Alexendros/clienteafirma/pull/1) |
| T-P1-DOCS | Informes P1 (BC, tests, TLS, roadmap) | Docs bajo `docs/integration/` | PR [#2](https://github.com/Alexendros/clienteafirma/pull/2) |
| T-BC | SpongyCastle → BouncyCastle 1.78.1 + harness | Build + F2 verdes en monorepo | PR [#3](https://github.com/Alexendros/clienteafirma/pull/3) |
| T-XXE | `SecureXmlBuilder` en sinks XML de usuario/servidor | Compila; remediación SEC-007/008 | PR [#4](https://github.com/Alexendros/clienteafirma/pull/4) |
| T-MONO | Absorber Autofirma-2026 como monorepo | `make validate` + MVP + gates 360 | PR [#5](https://github.com/Alexendros/clienteafirma/pull/5) |
| T-F0…T-F6, T-F8, T-F9 | Fases de programa (salvo a11y Orca) | Ver ESTADO-FASES | Docs + scripts en árbol |

---

## Pendiente

| ID | Tarea | Criterio | Notas |
|----|-------|----------|-------|
| T-ORCA | Sesión real con Orca (lector de pantalla) en los 3 flujos | Informe F7 actualizado con evidencia | No bloquea merge de nombres accesibles |
| T-CI-TESTS | Ejecutar tests de validación cripto también en CI (hoy parte del build usa skipTests) | Job CI documentado en verde | ROADMAP P2-CI |
| T-CTT-573 | Reintegración BC en upstream CTT | PR/issue CTT avanza | [#572](https://github.com/ctt-gob-es/clienteafirma/issues/572); #573 cerrada sin merge |
| T-FLATPAK | AppImage/Flatpak usable | Paquete instalable documentado | Experimental / P3 |
| T-OPENPDF | Coordinar PAdES con `openpdf-afirma` | Sin duplicar fork | F10 AF2026-4 |
| T-REPO-RENAME | Actualizar referencias a nuevo remoto tras transfer | README, docs, CI, scripts | Post T-ORG |

---

## Fases F0–F10 (resumen)

| Fase | Estado tablero | Cómo comprobarlo |
|------|----------------|------------------|
| F0 Manifiesto | Hecho | `propuesta-autofirma-2026.md` |
| F1 Línea base 1.9.1 | Hecho | `docs/BASELINE.txt` |
| F2 Vectores | Hecho | `bash scripts/f2-regression.sh` |
| F3 Cadena de suministro | Hecho | Workflows con SHA pins + `make quality` |
| F4 Cripto | Hecho en fork (BC en `master`) | Inventario + PR #3; upstream CTT pendiente |
| F5 JDK 21 runtime | Hecho (informe) | `docs/F5-JDK21.md` |
| F6 Paquetes Linux | Hecho (dev) | `packaging/` + MVP |
| F7 Accesibilidad | En curso | T-A11Y + T-ORCA |
| F8 Trifásico | Hecho (informe/WAR) | `docs/F8-TRIFASICA.md` |
| F9 Integr@/FIRe | Hecho | FIRe OK; Integr@ bloqueado iText HTTP — `docs/F9-INTEGRA-FIRE.md` |
| F10 Upstream | Tabla viva | [F10-UPSTREAM.md](F10-UPSTREAM.md) |

---

## Comandos rápidos de verificación

```bash
make validate          # contrato + quality + tests + smoke
make review360-r2      # gates revisión 360 R2
make remediation360    # gates remediación
bash scripts/mvp.sh    # build + F2 + empaquetado best-effort
bash scripts/f3-release.sh --help   # ayuda release (cuando esté listo)
```