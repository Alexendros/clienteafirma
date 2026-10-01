# Hoja de ruta de integración — Autofirma comunitaria

### Propósito de este documento

- **Objetivos:** Prioridades del programa (P0–P3) con estado actual y enlaces a informes técnicos.
- **Estructura:** Matriz de prioridades → detalle P1–P3 → riesgos → criterios de éxito.
- **Contenido a integrar según contexto:** Español claro; tecnicismos entre paréntesis. El tablero operativo diario está en [TASKS.md](../TASKS.md).

**Fecha de refresco:** 2026-10-01 · **Versión:** 1.1  
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
| P3-LINUX | Flatpak / AppImage | Experimental | No bloquea el núcleo |
| P3-TRIPHASE | Servidor trifásico (firma en tres pasos con servidor) | Experimental | Informe F8; no mezclar con Jakarta en esta línea |

---

## P1-BC — BouncyCastle (hecho en el fork)

**Qué es:** SpongyCastle era una copia antigua de la biblioteca criptográfica BouncyCastle. El fork usa BouncyCastle 1.78.1 moderno (`jdk18on`) para firmar con los mismos formatos.

**Entregables:** [BC-DIFF-ANALYSIS.md](BC-DIFF-ANALYSIS.md), [BC-NOISE-REPORT.md](BC-NOISE-REPORT.md), [BC-STRATEGY.md](BC-STRATEGY.md) (estrategia B aplicada: diff limpio).

**Hechos clave:**

- ~95 archivos tocados; diff limpio frente a upstream del orden de ~1000 líneas funcionales.
- 13 módulos cripto afectados.
- Construcción y vectores F2 (firma de prueba CAdES/XAdES/PAdES/FacturaE/cofirma/contrafirma) en verde en el monorepo.
- Corrección: el “ruido” de espacios en el diff bruto era ~92 %; la cifra útil es la del diff limpio.

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

## P3 — Empaquetado y trifásico (no bloqueantes)

- Linux moderno (Flatpak/AppImage): experimental.
- Servidor trifásico: compatible a nivel de informe/WAR; validación en sandbox diferida.

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Incompatibilidad API BouncyCastle | Media | Alta | Vectores F2 + tests de validación |
| Regresión de tests | Baja | Media | `make validate` + F2 |
| Conflicto al reintegrar en CTT | Alta | Media | Diff limpio; issue #572 |
| Cambiar TLS por defecto | Baja | Alta | Solo opt-in |
| Retraso de empaquetado | Alta | Baja | P3; no bloquea núcleo |

---

## Criterios de éxito P1 (cumplidos en el fork)

- [x] Diff limpio BC en el monorepo
- [x] Dependencias de test en módulos cripto
- [x] 12/12 tests nuevos en verde
- [x] JAR de producto + F2 sin regresión de formatos
- [x] Decisión TLS documentada (default no estricto)

---

## Verificación de pipeline (histórico 2026-09-26 + monorepo #5)

En la rama limpia BC y después en el monorepo absorbido: build Maven, JAR `autofirma.jar`, tests nuevos y F2 6/6 formatos en verde. Tras el PR #5, CI del canónico pasó `quality`, `test`, `community`, `build`, `smoke`, `build-linux-jdk8`, `f2-vectors`, `actionlint`.
