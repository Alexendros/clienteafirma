# F10 — Reintegración upstream

## Política

Cada mejora **genérica** de F4–F8 se ofrece como PR a [ctt-gob-es/clienteafirma](https://github.com/ctt-gob-es/clienteafirma) (u otros repos CTT afectados). El merge del Estado **no** es criterio de cierre de esta fase.

## Tabla viva

| ID | Cambio | Destino | Estado | Notas |
|----|--------|---------|--------|-------|
| AF2026-0 | Manifiesto / programa corregido (docs) | Meta-repo Autofirma-2026 | Local | No es PR de código al CTT |
| AF2026-1 | Inventario F4 (SpongyCastle / iText / TLS dummy) | clienteafirma | **Abierto** — [#572](https://github.com/ctt-gob-es/clienteafirma/issues/572) | Propuesta de migración BC; sin diff aún |
| AF2026-2 | Vectores F2 + script CI | Alexendros/clienteafirma (monorepo) | **Hecho** (capa comunitaria) | Ofrecer a CTT cuando proceda |
| AF2026-3 | Endurecimiento SSL por preferencia (sin default) | clienteafirma | Pendiente diseño | No activar trust estricto por defecto |
| AF2026-4 | Parches PAdES → openpdf-afirma | ctt-gob-es/openpdf-afirma | Coordinar | No duplicar fork |
| AF2026-5 | Accesibilidad EN 301 549 (3 flujos) | clienteafirma | Tras sesión Orca (F7) | |
| AF2026-6 | Integr@ iText 2.2 HTTP blocker | ctt-gob-es/integra | **Candidato a issue** | Sustituir repo HTTP / coordenada iText |
| AF2026-7 | SecureXmlBuilder en sinks XXE (hash/OOXML/triphase) | Alexendros/clienteafirma | **Hecho** — [#4](https://github.com/Alexendros/clienteafirma/pull/4) @ `fee3debe1` | Sin PR a CTT en esta tanda; SEC-007/008 |

## Primer aporte

Issue abierta: https://github.com/ctt-gob-es/clienteafirma/issues/572  
Detalle técnico: `docs/F4-INVENTARIO-CRIPTO.md` y `docs/F9-INTEGRA-FIRE.md`.

## Criterio de salida

- [x] Tabla pública de seguimiento
- [x] Al menos un aporte **preparado** (issue AF2026-1 / AF2026-6)
- [x] Issue abierto en GitHub: https://github.com/ctt-gob-es/clienteafirma/issues/572

Actualizar esta tabla en cada fase.
