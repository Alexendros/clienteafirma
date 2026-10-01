## Learned User Preferences

- Responder en español; labels, workflows, commits y nombres de checks en inglés técnico cuando aplique a GitHub/CI.
- Al implementar un plan de Cursor: no editar el fichero del plan; reutilizar los to-dos ya creados y completarlos hasta el final.
- Antes de mutaciones de plataforma (crear repo remoto, push inicial, publicación, archivar repo), pedir confirmación explícita y proceder solo tras un sí.
- Documentación orientada a contraste con Autofirma oficial (tablas comparativas) y a objetivos comprobables por fase; en revisiones amplias, informe dual (suite Archify HTML + markdown claro con tablas).
- Los planes deben recuperar el programa original con revisión crítica (correcciones, ampliaciones y adiciones) antes de ejecutar oleadas nuevas.
- Versionar artefactos Archify bajo `.archify/` (no añadirlos a `.gitignore`).
- Cuando pida auditorías/revisiones «desde aquí sin subagentes», ejecutarlas en el agente padre y cerrar con gates/tests medibles y evidencia, no solo narrativa.
- En remediaciones post-auditoría: documentar primero playbook, método y tests de validación; implementar después.

## Learned Workspace Facts

- Repo canónico comunitario (hoy): `https://github.com/Alexendros/clienteafirma` (monorepo). Destino de org: `https://github.com/Soluciones-Alexendros/clienteafirma-alexendros`. Rama por defecto `master`.
- Clone local preferido del mantenedor: directorio hermano `clienteafirma-alexendros` bajo `Aplicaciones/Fuentes/` (no usar el clone legacy `clienteafirma` ni anidar bajo el meta archivado).
- El meta histórico `Alexendros/Autofirma-2026` se archiva tras la migración; no es el working tree.
- Cliente construible/auditable/sustituible respecto a Autofirma 1.9.x (mismos formatos y protocolo `afirma://`); no sustituye `@firma`, VALIDe, TS@, Port@firmas ni Cl@ve.
- Comparativa fork↔CTT: `docs/COMPARATIVA-FORK-CTT.md`; tareas: `docs/TASKS.md`; hoja de ruta: `docs/integration/ROADMAP.md`.
- Clones locales opcionales `integra/`, `fire/`, toolchains en `tools/` y `dist/` están en `.gitignore`.
- Pin de sync upstream: `docs/BASELINE.txt` (`UPSTREAM=ctt-gob-es/clienteafirma`, `BASELINE_COMMIT`).
- Fachada P0: `make lint` / `make quality` / `make test` / `make test-community` / `make smoke` / `make validate`. Jobs CI: `quality`, `test`, `community`, `build`, `smoke` + `build-baseline` (JAR+F2).
- MVP operativo: `docs/MVP.md` y `bash scripts/mvp.sh` (evidencia en `dist/MVP-EVIDENCE.txt`).
- Programa por fases F0–F10; estado en `docs/ESTADO-FASES.md`; manifiesto en `propuesta-autofirma-2026.md`.
- SpongyCastle→BouncyCastle: F2 verde en `master` del monorepo; rama histórica `crypto/bouncycastle-jdk18on`; PR upstream `ctt-gob-es/clienteafirma#573` cerrada sin merge; seguimiento en `#572`. No endurecer TLS/`disableSslChecks` por defecto sin preferencia explícita.
- Licencia conservada GPL-2.0+ / EUPL-1.1.
- Archify: skill en `~/.cursor/skills/archify`; artefactos bajo `.archify/` (suite canónica 5 tipos) con texto visible en español sencillo.
- Revisión/remediación 360º: `docs/CODE-REVIEW-360.md` (+ R2), `docs/REMEDIATION-360.md`, gates `make review360` / `make review360-r2` / `make remediation360`; batería en `docs/VALIDATION-TESTS.md`.

## Implementation Session 2026-10-01 (Canon ES + Roadmap + Packaging + Release)

### Documentation updates completed
- **README.md**: Rewritten in accessible Spanish, citizen-focused, with clear tables and quick-start
- **docs/integration/ROADMAP.md**: v2.0 with P2-RELEASE, P2-PACK, P3-ORG, P3-ARCHIVE priorities
- **docs/TASKS.md**: Updated board with T-RELEASE, T-PACK, T-ARCHIFY, T-ARCHIVE, T-ORG, T-REPO-RENAME
- **docs/COMPARATIVA-FORK-CTT.md**: Added release management and packaging rows to diff table
- **docs/ESTADO-FASES.md**: Added next milestones table (P2–P3 ROADMAP items)
- **docs/BASELINE.txt**: Added RELEASE_WORKFLOW and PACKAGING_DIR entries
- **docs/F10-UPSTREAM.md**: Added AF2026-8 (release.yml) and AF2026-9 (packaging) to tracking table

### Branches to integrate (merge-watch)
- `prefs/strict-ssl` (695268c): `strictSslChecks` opt-in preference, default false
- `a11y/signing-flows` (eda3032): Accessible names for cert list, PIN field, confirm dialog

### Release management (P2-RELEASE) — to implement
- SemVer versioning (MAJOR.MINOR.PATCH)
- Signed Git tags (GPG)
- GitHub Releases with artifacts
- Workflow `.github/workflows/release.yml` triggered on `v*` tags
- Script `scripts/f3-release.sh` enhancement
- Process doc `docs/RELEASE-PROCESS.md`

### Packaging (P2-PACK) — to enhance
- DEB: functional (`packaging/autofirma-2026_1.9.1-autofirma2026.0_all.deb`), needs GPG sig + SHA256SUMS
- RPM: staging (`packaging/stage-rpm/`), needs SPEC + sig + repo
- Flatpak: structure (`packaging/flatpak/`), needs manifest + Flathub
- AppImage: script (`scripts/f6-appimage.sh`), needs CI integration + sig
- Portal: `packaging/portal-prueba/index.html` with signatures/checksums visible
- All artifacts: GPG `.asc` + `SHA256SUMS` / `SHA256SUMS.asc` in `dist/`

### Organization transfer (P3-ORG) — pending explicit confirmation
- Target: `Soluciones-Alexendros/clienteafirma-alexendros`
- Requires: `gh repo transfer` + update all remotes/refs in docs, CI, scripts

### Archive (P3-ARCHIVE) — pending explicit confirmation
- Target: `Alexendros/Autofirma-2026` → read-only via `gh repo archive`

### Archify suite post-canon — to create
- 5 diagram types in `.archify/<timestamp>-canon-org/`
- `SUITE-SUMMARY.json` with new org URL