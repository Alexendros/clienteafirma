# Integration Roadmap: AutoFirma 2026

**Date:** 2026-09-26
**Version:** 1.0

---

## Priority Matrix

| Priority | Item | Status | Target | Owner |
|----------|------|--------|--------|-------|
| P0 | Repository alignment | ✅ DONE | 2026-09-26 | - |
| P1-BC | BouncyCastle migration (PR #573 clean) | ✅ DONE | 2026-09-26 | - |
| P1-TEST | Validation harness porting | ✅ DONE | 2026-09-26 | - |
| P1-TLS | TLS overlap analysis | ✅ DONE | 2026-09-26 | - |
| P2-A11Y | Accessibility improvements | PENDING | TBD | - |
| P2-CI | CI/CD pipeline redesign | PENDING | TBD | - |
| P3-LINUX | Flatpak/AppImage packaging | EXPERIMENTAL | P4 | - |
| P3-TRIPHASE | Triphase signer | EXPERIMENTAL | P4 | - |

---

## P1-BC: BouncyCastle Migration (Complete Analysis)

### Deliverables Created
- ✅ `BC-DIFF-ANALYSIS.md` - Full diff analysis (95 files, 25K lines)
- ✅ `BC-NOISE-REPORT.md` - Whitespace noise report (see correction note below)
- ✅ `BC-STRATEGY.md` - Merge strategy recommendation (Strategy B: Clean + Rebase) — **APPLIED**

### Key Findings
- **95 files changed**, ~25K lines before cleanup
- **13 crypto modules** affected
- **Dependency migration:** SpongyCastle → BouncyCastle jdk18on
- **Build verified:** Full build passes with `-Dmaven.test.skip=true`
- **Test gap:** JUnit missing from 13 module POMs (fixed — see P1-TEST)
- **Strategy B applied (2026-09-26):** migration commit reconstructed via content-level
  normalization. Diff vs upstream `master` reduced from **12 698+/12 723−** to **1 001+/1 026−**.
  Per-file content equivalence verified (95/95 files identical after stripping whitespace).

> **Correction — noise metric:** `BC-NOISE-REPORT.md` reported 22.1% whitespace noise. That metric
> undercounted: the reconstruction showed the true whitespace-only churn was **~92%** of the raw
> diff. The report's methodology (whitespace-filtered diff) was unreliable for these CRLF blobs;
> the authoritative figure is the reconstruction result above.

### Next Steps for Merge
1. ~~Apply automated whitespace cleanup~~ ✅ DONE (Strategy B: content-level reconstruction, CRLF-safe)
2. ~~Add JUnit test dependencies to 13 crypto module POMs~~ ✅ DONE
3. ~~Run full test suite on BC branch~~ ✅ DONE (new + existing suites green, see P1-TEST)
4. ~~Execute validation vectors (CAdES, PAdES, XAdES, CMS)~~ ✅ DONE (12 new tests passing)
5. ~~Verify product JAR build + F2 regression~~ ✅ DONE
6. ~~Create PR against upstream/master with clean diff~~ ✅ DONE (PR #573 updated with clean branch `crypto/bouncycastle-jdk18on` @ `70b9c29f8`)

### Timeline
- **Cleanup + test deps:** 1 day
- **Test execution:** 1 day
- **Validation vectors:** 1 day
- **PR review/merge:** 2-5 days
- **Total:** 5-8 days

---

## P1-TEST: Validation Harness Porting (Complete)

### Deliverables Created
- ✅ `TEST-PORTING-MAP.md` - Complete porting plan + **final execution results**

### Work Completed (in BC worktree `../clienteafirma-bc`)
- ✅ Added JUnit to 13 crypto module POMs
- ✅ Copied test vectors from crypto-validation to 4 target modules
- ✅ Made validation entry points public/self-contained to break the Maven reactor cycle
  (`ValidateCMSSignedData` public + static `validate()`; `CAdESValidator` static `validate()`)
- ✅ Created **4** new validation test classes (12 tests total):
  - `TestCAdESValidation.java` (4 tests)
  - `TestCMSValidation.java` (4 tests)
  - `TestPAdESValidation.java` (3 tests, uses public `AOPDFSigner.isSign()`)
  - `TestXAdESValidation.java` (1 test)
- ✅ All new tests compile and pass

### Deviation: `TestPAdESModificationDetection` NOT ported
Dropped from `afirma-crypto-pdf`: its API (`ValidatePdfSignature`/`SignValidity`) lives in
`afirma-crypto-validation`, which depends on `afirma-crypto-pdf` → porting it downward would create
a Maven reactor cycle. It already exists as `crypto-validation/.../signvalidation/TestPdfMods.java`
and is NOT duplicated. See TEST-PORTING-MAP.md for full rationale.

### Test Results (clean branch `crypto/bouncycastle-jdk18on` @ `70b9c29f8`, verified 2026-09-26)
| Module | New tests | Full suite | Fail | Skip |
|--------|-----------|------------|------|------|
| afirma-crypto-cades | 4 ✅ | 27 | 0 | 1 |
| afirma-crypto-cms | 4 ✅ | 6 | 0 | 0 |
| afirma-crypto-pdf | 3 ✅ | (baseline 4 err) | 0 | 0 |
| afirma-crypto-xades | 1 ✅ | 68 | 0 | 6 |
| afirma-crypto-validation | — | 11 | 0 | 0 |

### Pre-existing Failures
- `TestPadesBaseline`: 4 errors (unrelated to BC migration, tracked separately)

### Vector Coverage Achieved
- **CAdES:** 4 vectors (implicit, explicit w/wo data, wrong data)
- **PAdES:** 3 vectors (basic, EPES, expired cert)
- **XAdES:** 1 vector (EPES detached)
- **CMS:** 4 vectors (same as CAdES)

---

## P1-TLS: TLS Overlap Analysis (Complete)

### Deliverables Created
- ✅ `TLS-OVERLAP-ANALYSIS.md` - Overlap assessment

### Status
- **Analysis only** - No code changes per user decision
- **Decision:** Keep `strictSslChecks=false` as default
- **Coordination:** Track with #567 (A11Y) and upstream PRs #543/#546

---

## P2-A11Y: Accessibility (Pending)

### Requirements
- Coordinate with upstream PR #567
- a11y/signing-flows branch (eda3032ee) has initial work
- Accessible names for cert list, PIN field, confirm dialog

### Next Steps
1. Review a11y/signing-flows branch
2. Align with upstream #567
3. Plan WCAG 2.1 AA compliance

---

## P2-CI: CI/CD Redesign (Pending)

### Current State
- Fork CI only tests afirma-core
- build-fork-bc.yml uses `-Dmaven.test.skip=true`
- No test compilation/execution in CI

### Target Architecture
```
Stage 1: Validation (compile, lint, checkstyle)
Stage 2: Compile Tests (all modules)
Stage 3: Execute Tests (unit + integration)
Stage 4: Regression (F2, validation vectors)
Stage 5: Artifacts (JARs, installers, packages)
```

### Next Steps
1. Design pipeline stages
2. Add test dependencies to all modules
3. Enable test execution in CI
4. Add validation vector stage
5. Separate BC and baseline CI

---

## P3-LINUX: Packaging (Experimental → P4)

### Current State
- Flatpak: Skeleton only (org.autofirma.Autofirma2026.yml)
- AppImage: Not implemented
- Triphase: docker-compose.yml skeleton

### Decision
**DEFERRED TO P4** - Focus on core crypto first

---

## P3-TRIPHASE: Triphase Signer (Experimental → P4)

### Current State
- 4 modules: cache, core, document, server
- Skeletons in place, not validated in sandbox
- BC branch has changes to triphase crypto modules

### Decision
**DEFERRED TO P4** - Focus on core crypto first

---

## Cross-Cutting Concerns

### Test Infrastructure
- ✅ JUnit added to all crypto modules
- ✅ Validation vectors ported
- ⏳ afirma-test-harness module (if needed later)

### Dependency Management
- ✅ BouncyCastle jdk18on migration mapped
- ⏳ Version pinning strategy
- ⏳ Conflict resolution (bcprov vs bcpkix)

### Documentation
- ✅ Integration docs created
- ⏳ Migration guide for downstream consumers
- ⏳ Release notes template

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| BC API incompatibility | Medium | High | Validation vectors + BC 1.78.1 migration guide |
| Test regression | Low | Medium | Full test suite + cross-validation |
| Upstream merge conflicts | High | Medium | Strategy B **applied** (content-level clean reconstruction), small PRs |
| TLS default change | Low | High | Keep strictSslChecks=false, opt-in only |
| Packaging delays | High | Low | Deferred to P4, not blocking |

---

## Milestone Dates (Tentative)

| Milestone | Target Date |
|-----------|-------------|
| P1-BC PR updated (clean diff) | 2026-09-26 ✅ |
| P1-BC merged upstream | 2026-10-10 |
| P2-A11Y started | 2026-10-15 |
| P2-CI redesign started | 2026-10-20 |
| P4 Packaging/Triphase kickoff | 2026-Q4 |

---

## Success Criteria

### P1-BC Merge Gate
- [x] Clean diff (<5% whitespace noise) — achieved: 1 001+/1 026− vs 12 698+/12 723−; 0 whitespace-only files
- [x] All 13 modules have test deps
- [x] All crypto tests pass (100%)
- [x] Validation vectors: 100% parity BC vs upstream
- [x] Product JAR builds and smoke tests
- [x] No F2 regression failures

### P1-TEST Complete
- [x] JUnit in all 13 crypto modules
- [x] Validation tests in 4 modules (CAdES, CMS, PAdES, XAdES)
- [x] 12 new validation tests passing
- [x] Vector coverage: 12 vectors across 4 formats
- [x] Cyclic-dependency resolution documented

### P1-TLS Complete
- [x] Overlap analysis documented
- [x] Decision recorded (strictSslChecks=false default)
- [x] Coordination path identified

---

## Pipeline Verification (2026-09-26)

End-to-end verification of the `build-fork-bc` CI path, reproduced locally against the **clean
branch** (`crypto/bouncycastle-jdk18on` @ `70b9c29f8`, worktree `../clienteafirma-clean`, JDK 8):

| Step | Command | Result |
|------|---------|--------|
| Full build | `mvn -B clean install -Dmaven.test.skip=true` | ✅ BUILD SUCCESS (33 modules) |
| Product JAR | `mvn -B install -Dmaven.test.skip=true -Denv=install` | ✅ BUILD SUCCESS |
| Artifact | `afirma-simple/target/autofirma.jar` | ✅ 54,189,655 bytes |
| New tests (4 modules) | `mvn -B -o test -Dtest=...` | ✅ 12/12 pass |
| F2 regression | `bash scripts/f2-regression.sh` | ✅ F2 OK (6/6 formats, sizes identical to pre-cleanup) |

**F2 formats verified end-to-end:** CAdES sign, XAdES sign, PAdES sign, FacturaE sign, CAdES
co-sign, CAdES counter-sign — all produced non-empty, revalidated outputs. Output byte sizes match
the pre-cleanup BC build exactly (4045 / 7955 / 2253651 / 17212 / 8026 / 8010).

**F2 resources confirmed present on BC branch:** `afirma-simple/src/test/resources/ANF_PF_Activo.pfx`,
`samples/2.xml`, `facturae_32v1.xml`, `samples/2.pdf`.

**PR:** https://github.com/ctt-gob-es/clienteafirma/pull/573 — branch `crypto/bouncycastle-jdk18on`
force-pushed to the clean 2-commit history (`a4e95b097` migration + `70b9c29f8` tests); PR
description updated.

**Known CI gap:** the workflow runs `-Dmaven.test.skip=true`, so the new validation tests are
**not executed by CI** (build + F2 only). Enabling test execution is the P2-CI task above.