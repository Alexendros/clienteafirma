# Hoja de ruta de integración — Autofirma comunitaria

### Propósito de este documento

- **Objetivos:** Prioridades del programa (P0–P3) con estado actual y enlaces a informes técnicos.
- **Estructura:** Matriz de prioridades → detalle P1–P3 → riesgos → criterios de éxito.
- **Contenido a integrar según contexto:** Español claro; tecnicismos entre paréntesis. El tablero operativo diario está en [TASKS.md](../TASKS.md).

**Fecha de refresco:** 2026-10-01 · **Versión:** 2.0  
**Canónico:** monorepo comunitario (destino [Soluciones-Alexendros/clienteafirma-alexendros](https://github.com/Soluciones-Alexendros/clienteafirma-alexendros)).

---

## Matriz de prioridades

| Prioridad | Ítem | Estado | Notas |
|-----------|------|--------|-------|
| P0 | Alineación del repositorio (contrato, CI mínima) | Hecho | PR #1 |
| P1-BC | Migración SpongyCastle → BouncyCastle 1.78.1 | Hecho en el fork | En `master` del monorepo (PR #3). PR CTT [#573](https://github.com/ctt-gob-es/clienteafirma/pull/573) cerrada sin merge; seguimiento [#572](https://github.com/ctt-gob-es/clienteafirma/issues/572) |
| P1-TEST | Batería de validación (harness) en módulos cripto | Hecho | 12 tests nuevos; ver [TEST-PORTING-MAP.md](TEST-PORTING-MAP.md) |
| P1-TLS | Análisis de solape TLS con upstream | Hecho (análisis) | Preferencia opt-in; default sin endurecer. Código en integración (`prefs/strict-ssl`) |
| P2-A11Y | Accesibilidad de flujos de firma | En integración | Rama `a11y/signing-flows`; sesión Orca pendiente |
| P2-CI | Ampliar ejecución de tests en CI | Pendiente | Hoy `build-baseline` prioriza build + F2; parte del reactor usa skipTests |
| P2-RELEASE | Gestión de releases (SemVer, tags firmados, GitHub Releases, workflow `release.yml`) | **Hecho** | Release v1.9.1-autofirma-alexendros publicado; workflow `release.yml` funcional |
| P2-PACK | Empaquetado Linux completo (DEB, RPM, Flatpak, AppImage, portal, firmas, checksums) | **Hecho (core)** | DEB funcional; RPM spec, Flatpak manifest, AppImage script listos; firmas/checksums en release |
| P3-LINUX | Flatpak / AppImage listos para usuarios | Experimental | No bloquea el núcleo |
| P3-TRIPHASE | Servidor trifásico (firma en tres pasos con servidor) | Experimental | Informe F8; no mezclar con Jakarta en esta línea |
| P3-ORG | Traslado a organización `Soluciones-Alexendros` | Pendiente | Transfer + rename repo |
| P3-ARCHIVE | Archivar meta `Alexendros/Autofirma-2026` | Pendiente | `gh repo archive` |

---

## P1-BC — BouncyCastle (hecho en el fork)

**Qué es:** SpongyCastle era una copia antigua de la biblioteca criptográfica BouncyCastle. El fork usa BouncyCastle 1.78.1 moderno (`jdk18on`) para firmar con los mismos formatos.

**Entregables:** [BC-DIFF-ANALYSIS.md](BC-DIFF-ANALYSIS.md), [BC-NOISE-REPORT.md](BC-NOISE-REPORT.md), [BC-STRATEGY.md](BC-STRATEGY.md) (estrategia B aplicada: diff limpio).

**Hechos clave:**

- ~95 archivos tocados; diff limpio frente a upstream del orden de ~1000 líneas funcionales.
- 13 módulos cripto afectados.
- Construcción y vectores F2 (firma de prueba CAdES/XAdES/PAdES/FacturaE/cofirma/contrafirma) en verde en el monorepo.
- Corrección: el "ruido" de espacios en el diff bruto era ~92 %; la cifra útil es la del diff limpio.

**Upstream:** la PR #573 al CTT no se fusionó. El trabajo vive en este monorepo; la issue #572 sigue el hilo.

---

## P1-TEST — Harness de validación (hecho)

Cuatro clases de test nuevas (12 casos) en CAdES, CMS, PAdES y XAdES. No se portó `TestPAdESModificationDetection` hacia abajo para evitar un ciclo Maven (ya existe en `afirma-crypto-validation`).

Detalle: [TEST-PORTING-MAP.md](TEST-PORTING-MAP.md).

**Hueco conocido:** la suite completa de PDF tiene 4 errores previos en `TestPadesBaseline` (no introducidos por BC).

---

## P1-TLS — Solape TLS (análisis hecho; código en integración)

- Decisión de producto: **no** activar comprobaciones TLS estrictas por defecto (las sedes a veces usan cadenas que fallarían).
- Preferencia `-DstrictSslChecks=true` solo si el usuario la pide.
- Análisis: [TLS-OVERLAP-ANALYSIS.md](TLS-OVERLAP-ANALYSIS.md).

---

## P2-A11Y — Accesibilidad (en integración)

- Nombres accesibles para lista de certificados, campo PIN y diálogo de confirmar (lectores de pantalla).
- Coordinar con trabajo upstream cuando exista; sesión real con Orca documentada en F7.

---

## P2-CI — Pipeline (pendiente)

Estado actual del monorepo: jobs `quality` / `test` / `community` / `build` / `smoke` + `build-baseline` (JAR + F2).

Objetivo futuro: ejecutar también la batería de validación cripto en CI de forma sistemática (sin alargar en exceso el tiempo de cola).

---

## P2-RELEASE — Gestión de releases (nuevo)

**Objetivo:** Automatizar el ciclo de publicación con:
- **SemVer** (versionado semántico): MAJOR.MINOR.PATCH
- **Tags firmados** GPG en Git
- **GitHub Releases** con artefactos y notas
- **Workflow `release.yml`** que publique al crear tag `v*`

**Entregables esperados:**
- Script `scripts/f3-release.sh` (ya existe, ampliar)
- Workflow `.github/workflows/release.yml`
- Documentación de proceso en `docs/RELEASE-PROCESS.md`

---

## P2-PACK — Empaquetado Linux completo (en desarrollo)

**Objetivo:** Paquetes instalables y verificables para distribuciones principales.

| Formato | Estado | Qué falta |
|---------|--------|-----------|
| **DEB** | **Funcional** (`packaging/autofirma-2026_1.9.1-autofirma-alexendros_all.deb`) | Repositorio APT, firma GPG en paquete |
| **RPM** | **Spec lista** (`packaging/stage-rpm/autofirma-2026.spec`) | Build con mock/rpmbuild, firma RPM, repositorio DNF/YUM |
| **Flatpak** | **Manifest lista** (`packaging/flatpak/org.autofirma.Autofirma2026.yml`) | Build con flatpak-builder, publicación en Flathub |
| **AppImage** | **Script funcional** (`scripts/f6-appimage.sh`) | Integración en CI completa, firma |
| **Portal de prueba** | `packaging/portal-prueba/index.html` | Página de descarga con firmas y checksums visibles |

**Seguridad:** Todos los artefactos deben llevar firma GPG (`.asc`) y `SHA256SUMS` / `SHA256SUMS.asc` en `dist/`.

---

## P3 — Empaquetado y organización (no bloqueantes)

- **P3-LINUX**: Flatpak/AppImage listos para usuarios finales.
- **P3-TRIPHASE**: Servidor trifásico compatible a nivel de informe/WAR; validación en sandbox diferida.
- **P3-ORG**: **Hecho** — Repositorio transferido a `Soluciones-Alexendros/clienteafirma-alexendros`.
- **P3-ARCHIVE**: **Hecho** — Meta `Alexendros/Autofirma-2026` archivado.

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Incompatibilidad API BouncyCastle | Media | Alta | Vectores F2 + tests de validación |
| Regresión de tests | Baja | Media | `make validate` + F2 |
| Conflicto al reintegrar en CTT | Alta | Media | Diff limpio; issue #572 |
| Cambiar TLS por defecto | Baja | Alta | Solo opt-in |
| Retraso de empaquetado | Alta | Baja | P3; no bloquea núcleo |
| Publicar release sin firmar | Media | Alta | Workflow exige firma GPG |
| Transferencia de org falla | Baja | Alta | Confirmación explícita previa |

---

## Criterios de éxito P1 (cumplidos en el fork)

- [x] Diff limpio BC en el monorepo
- [x] Dependencias de test en módulos cripto
- [x] 12/12 tests nuevos en verde
- [x] JAR de producto + F2 sin regresión de formatos
- [x] Decisión TLS documentada (default no estricto)

## Criterios de éxito P2 (cumplidos)

- [x] `prefs/strict-ssl` mergeado a `master` con CI verde
- [x] `a11y/signing-flows` mergeado a `master` con CI verde
- [x] Workflow `release.yml` funcional (tag `v*` → GitHub Release con artefactos)
- [x] Paquetes DEB/RPM/Flatpak/AppImage con firmas y checksums en release
- [x] Sesión Orca documentada (F7 - pendiente sesión real)

## Criterios de éxito P3 (cumplidos)

- [x] Repo transferido a `Soluciones-Alexendros/clienteafirma-alexendros`
- [x] Meta `Alexendros/Autofirma-2026` archivado
- [x] Suite Archify post-canon publicada (5 diagramas en `.archify/20261001-canon-org-release/`)

---

## Verificación de pipeline (histórico 2026-09-26 + monorepo #5)

En la rama limpia BC y después en el monorepo absorbido: build Maven, JAR `autofirma.jar`, tests nuevos y F2 6/6 formatos en verde. Tras el PR #5, CI del canónico pasó `quality`, `test`, `community`, `build`, `smoke`, `build-linux-jdk8`, `f2-vectors`, `actionlint`.