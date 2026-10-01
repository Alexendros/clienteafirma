# Autofirma comunitaria — estado de fases

**Canónico (hoy):** [Alexendros/clienteafirma](https://github.com/Alexendros/clienteafirma) · **Destino:** [Soluciones-Alexendros/clienteafirma-alexendros](https://github.com/Soluciones-Alexendros/clienteafirma-alexendros) (traslado pendiente).  
**MVP operativo:** [docs/MVP.md](MVP.md) — `bash scripts/mvp.sh`  
**Tareas vivas:** [TASKS.md](TASKS.md) · **Hoja de ruta:** [integration/ROADMAP.md](integration/ROADMAP.md) · **Comparativa CTT:** [COMPARATIVA-FORK-CTT.md](COMPARATIVA-FORK-CTT.md)  
**BouncyCastle en el fork:** integrado en `master` (PR #3); rama histórica `crypto/bouncycastle-jdk18on` ya no es el tip canónico. Ver [W2-BOUNCYCASTLE-PREFLIGHT.md](W2-BOUNCYCASTLE-PREFLIGHT.md).  
**Revisión 360º:** [CODE-REVIEW-360.md](CODE-REVIEW-360.md) — `bash scripts/verify-code-review-360.sh`  
**Revisión 360º R2:** [CODE-REVIEW-360-R2.md](CODE-REVIEW-360-R2.md) — `make review360-r2`  
**Remediación 360º:** [REMEDIATION-360.md](REMEDIATION-360.md) — `make remediation360`  
**XXE (XML malicioso) en el fork:** PR [#4](https://github.com/Alexendros/clienteafirma/pull/4) @ `fee3debe1`  
**Archify monorepo:** [`.archify/20261001-0010-monorepo-canonical/`](../.archify/20261001-0010-monorepo-canonical/SUITE-SUMMARY.json)  
**Archify e2e remediación:** [`.archify/20260930-2331-remediation-360-e2e/`](../.archify/20260930-2331-remediation-360-e2e/SUITE-SUMMARY.json)  
**Meta histórico:** [Alexendros/Autofirma-2026](https://github.com/Alexendros/Autofirma-2026) (a archivar tras el traslado de org)  
**Release management:** [docs/RELEASE-PROCESS.md](RELEASE-PROCESS.md) (pendiente) · Workflow: `.github/workflows/release.yml` (pendiente)  
**Empaquetado Linux:** [packaging/README.md](../packaging/README.md) · DEB funcional · RPM/Flatpak/AppImage en desarrollo

| Fase | Estado | Evidencia |
|------|--------|-----------|
| F0 Manifiesto | Hecho | `propuesta-autofirma-2026.md` |
| F1 Línea base 1.9.1 | Hecho | `docs/BASELINE.txt`, `docs/build-f1.log` |
| F2 Vectores | Hecho | `scripts/f2-regression.sh`, `vectors/` |
| F3 Cadena suministro | Hecho | `.github/workflows/` (SHA pins), Renovate, actionlint |
| F4 Inventario cripto | Hecho en el fork | `docs/F4-INVENTARIO-CRIPTO.md` + BC 1.78.1 en `master` (PR #3); reintegración CTT pendiente (#572) |
| F5 JDK 21 runtime | Hecho | `docs/F5-JDK21.md` |
| F6 Paquetes Linux | Hecho (dev) | `packaging/*.deb`, portal de prueba |
| F7 Accesibilidad | En curso | `docs/F7-ACCESIBILIDAD.md` (nombres accesibles en integración; sesión Orca pendiente) |
| F8 Trifásico | Hecho | WAR 2.9.1 + `docs/F8-TRIFASICA.md` |
| F9 Integr@/FIRe | Hecho | FIRe OK; Integr@ bloqueado iText HTTP — `docs/F9-INTEGRA-FIRE.md` |
| F10 Upstream | Tabla | `docs/F10-UPSTREAM.md` |

---

## Próximos hitos (Fases P2–P3 del ROADMAP)

| Hito | Fase relacionada | Estado | Evidencia esperada |
|------|------------------|--------|-------------------|
| Merge `prefs/strict-ssl` | F7 / P1-TLS | En curso | PR a `master` con CI verde |
| Merge `a11y/signing-flows` | F7 / P2-A11Y | En curso | PR a `master` con CI verde |
| Workflow `release.yml` | P2-RELEASE | Pendiente | Tag `v*` → Release GitHub firmado |
| Empaquetado RPM completo | F6 / P2-PACK | Pendiente | `.rpm` firmado + checksums en `dist/` |
| Empaquetado Flatpak | F6 / P2-PACK | Pendiente | Manifest + publicación Flathub |
| Empaquetado AppImage | F6 / P2-PACK | Pendiente | `.AppImage` firmado + checksums |
| Portal de descarga con firmas | F6 / P2-PACK | Pendiente | `packaging/portal-prueba/` actualizado |
| Transferencia de organización | P3-ORG | Pendiente | Remoto = `Soluciones-Alexendros/clienteafirma-alexendros` |
| Archivado meta histórico | P3-ARCHIVE | Pendiente | `gh repo archive Alexendros/Autofirma-2026` |
| Suite Archify post-canon | — | Pendiente | 5 diagramas en `.archify/…-canon-org/` |