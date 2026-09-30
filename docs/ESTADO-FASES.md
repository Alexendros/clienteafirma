# Autofirma-2026 — estado de fases

**Canónico:** monorepo `Alexendros/clienteafirma` (capa Autofirma-2026 absorbida).  
**MVP operativo:** [docs/MVP.md](MVP.md) — `bash scripts/mvp.sh`  
**v0.2.0:** fork BC `Alexendros/clienteafirma` @ `crypto/bouncycastle-jdk18on` + CI dual; ver [W2-BOUNCYCASTLE-PREFLIGHT.md](W2-BOUNCYCASTLE-PREFLIGHT.md)  
**Revisión 360º (2026-09-30):** [CODE-REVIEW-360.md](CODE-REVIEW-360.md) — `bash scripts/verify-code-review-360.sh`  
**Revisión 360º R2 estricta:** [CODE-REVIEW-360-R2.md](CODE-REVIEW-360-R2.md) — `make review360-r2`  
**Remediación 360º:** [REMEDIATION-360.md](REMEDIATION-360.md) — `make remediation360`  
**XXE fork:** [Alexendros/clienteafirma#4](https://github.com/Alexendros/clienteafirma/pull/4) @ `fee3debe1`  
**Archify monorepo canónico:** [`.archify/20261001-0010-monorepo-canonical/`](../.archify/20261001-0010-monorepo-canonical/SUITE-SUMMARY.json)  
**Archify e2e remediación:** [`.archify/20260930-2331-remediation-360-e2e/`](../.archify/20260930-2331-remediation-360-e2e/SUITE-SUMMARY.json)

| Fase | Estado | Evidencia |
|------|--------|-----------|
| F0 Manifiesto | Hecho | `propuesta-autofirma-2026.md` |
| F1 Línea base 1.9.1 | Hecho | `docs/BASELINE.txt`, `docs/build-f1.log` |
| F2 Vectores | Hecho | `scripts/f2-regression.sh`, `vectors/` |
| F3 Cadena suministro | Hecho | `.github/workflows/` (SHA pins), Dependabot, actionlint |
| F4 Inventario cripto | Hecho | `docs/F4-INVENTARIO-CRIPTO.md` (migración BC aplazada) |
| F5 JDK 21 runtime | Hecho | `docs/F5-JDK21.md` |
| F6 Paquetes Linux | Hecho | `packaging/*.deb`, portal de prueba |
| F7 Accesibilidad | Informe | `docs/F7-ACCESIBILIDAD.md` (sesión Orca pendiente) |
| F8 Trifásico | Hecho | WAR 2.9.1 + `docs/F8-TRIFASICA.md` |
| F9 Integr@/FIRe | Hecho | FIRe OK; Integr@ bloqueado iText HTTP — `docs/F9-INTEGRA-FIRE.md` |
| F10 Upstream | Tabla | `docs/F10-UPSTREAM.md` |
