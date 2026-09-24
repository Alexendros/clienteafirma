# Changelog

### Propósito de este documento

- **Objetivos:** Registrar cambios de **este fork** (gobernanza, CI, higiene) sin reescribir el historial de producto de CTT.
- **Estructura:** Keep a Changelog → Unreleased → notas de alineación. La versión de producto sigue siendo **1.9.1**.
- **Contenido a integrar según contexto:** No copies un changelog de SaaS ni inventes releases de Autofirma. Los cambios de producto upstream se leen en [ctt-gob-es/clienteafirma](https://github.com/ctt-gob-es/clienteafirma).

Formato inspirado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [Unreleased]

### Added

- Alineación P0 al contrato de repositorio: README con meta-sección Propósito, `LICENSE` de raíz (puntero SPDX; no pisa `license/`), SECURITY, CONTRIBUTING, CHANGELOG, CODEOWNERS, plantillas de issue/PR, Renovate y CI `quality` / `test` / `build` / `smoke`.
- Fachada `make lint` / `make test` / `make smoke` / `make build` sobre el núcleo `afirma-core`.

### Notes

- Este árbol es un fork de CTT (Cliente @firma 1.9.1). No se clona a ciegas el layout P1/P2 de un producto propio (sin AGENTS/ARCHITECTURE/docs canónicos).
- El job `build` empaqueta `afirma-core` (JAR). Autofirma.jar y los WARs (`-Denv=install`) siguen documentados en el README y se construyen en [Autofirma-2026](https://github.com/Alexendros/Autofirma-2026).
