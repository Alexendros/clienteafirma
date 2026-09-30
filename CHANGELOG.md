# Changelog

### Propósito de este documento

- **Objetivos:** Registrar cambios de **este fork** (gobernanza, CI, higiene) sin reescribir el historial de producto de CTT.
- **Estructura:** Keep a Changelog → Unreleased → notas de alineación. La versión de producto sigue siendo **1.9.1**.
- **Contenido a integrar según contexto:** No copies un changelog de SaaS ni inventes releases de Autofirma. Los cambios de producto upstream se leen en [ctt-gob-es/clienteafirma](https://github.com/ctt-gob-es/clienteafirma).

Formato inspirado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [Unreleased]

### Added

- **Monorepo Autofirma-2026:** capa comunitaria (docs F0–F10, vectores, packaging, harness, Archify, gates 360º) absorbida desde `Alexendros/Autofirma-2026` @ `10996b6`. Este repo es el canónico.
- Jobs CI `community` + `build-baseline` in-tree (JAR + F2). `build-fork-bc` limitado a ramas `crypto/**`.
- Fachada ampliada: `make quality` / `make test-community` / `make validate` / gates `review360*`.

### Added (previo)

- Alineación P0 al contrato de repositorio: README con meta-sección Propósito, `LICENSE` de raíz (puntero SPDX; no pisa `license/`), SECURITY, CONTRIBUTING, CHANGELOG, CODEOWNERS, plantillas de issue/PR, Renovate y CI `quality` / `test` / `build` / `smoke`.
- Fachada `make lint` / `make test` / `make smoke` / `make build` sobre el núcleo `afirma-core`.

### Notes

- Fork de CTT (Cliente @firma 1.9.1) + programa comunitario. Meta histórico: [Autofirma-2026](https://github.com/Alexendros/Autofirma-2026) (archivado tras migración).
- `make build` empaqueta `afirma-core`; Autofirma.jar vía `-Denv=install` / `scripts/mvp.sh` / workflow `build-baseline`.
