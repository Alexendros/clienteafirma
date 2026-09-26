# BC Diff Analysis: crypto/bouncycastle-jdk18on vs upstream/master

**Branch:** crypto/bouncycastle-jdk18on (874570fbd)
**Base:** upstream/master (0d7f3cf01)
**Date:** 2026-09-26

---

## Executive Summary

The BouncyCastle migration branch contains **95 changed files** with **~25,421 lines changed** (12,698 added, 12,723 removed).

- **Whitespace/formatting noise:** 22.1% (5,607 lines)
- **Functional changes:** 77.9% (19,814 lines)
- **Module categories affected:** 16 modules

---

## Module Breakdown

| Module | Files | Added | Removed | Whitespace | Functional | Type |
|--------|-------|-------|---------|------------|------------|------|
| afirma-crypto-cms | 7 | 3,185 | 3,185 | 1,355 | 5,015 | Core crypto |
| afirma-crypto-cms-enveloper | 17 | 2,048 | 2,048 | 1,084 | 3,012 | Core crypto |
| afirma-crypto-cades | 8 | 540 | 540 | 155 | 925 | Core crypto |
| afirma-crypto-cades-multi | 7 | 1,321 | 1,321 | 448 | 2,194 | Core crypto |
| afirma-crypto-core-pkcs7 | 8 | 227 | 228 | 106 | 349 | Core crypto |
| afirma-crypto-core-pkcs7-tsp | 2 | 547 | 547 | 231 | 863 | Core crypto |
| afirma-crypto-pdf | 2 | 778 | 778 | 385 | 1,171 | Core crypto |
| afirma-crypto-xades | 2 | 459 | 459 | 181 | 737 | Core crypto |
| afirma-crypto-validation | 3 | 75 | 75 | 21 | 129 | Validation |
| afirma-crypto-jarverifier | 2 | 414 | 417 | 163 | 668 | JAR verify |
| afirma-keystores-filters | 4 | 366 | 368 | 137 | 597 | Keystore |
| afirma-server-triphase-signer-core | 4 | 1,066 | 1,066 | 521 | 1,611 | Triphase |
| afirma-simple-plugin-validatecerts | 2 | 565 | 565 | 186 | 944 | Validation |
| afirma-simple | 5 | 1,935 | 1,937 | 528 | 3,344 | Product |
| afirma-ui-simple-configurator | 2 | 371 | 371 | 114 | 628 | UI |
| Root POM | 1 | 11 | 11 | 2 | 20 | Config |

---

## Dependency Migration (POM Changes)

All crypto modules migrate from **SpongyCastle** to **BouncyCastle jdk18on**:

### Before (SpongyCastle)
```xml
<dependency>
    <groupId>com.madgag.spongycastle</groupId>
    <artifactId>core</artifactId>
</dependency>
<dependency>
    <groupId>com.madgag.spongycastle</groupId>
    <artifactId>prov</artifactId>
</dependency>
<dependency>
    <groupId>com.madgag.spongycastle</groupId>
    <artifactId>bcpkix-jdk15on</artifactId>
</dependency>
```

### After (BouncyCastle jdk18on)
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk18on</artifactId>
</dependency>
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcutil-jdk18on</artifactId>
</dependency>
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcpkix-jdk18on</artifactId>
</dependency>
```

**Affected modules:** afirma-crypto-cades, afirma-crypto-cades-multi, afirma-crypto-cms, afirma-crypto-cms-enveloper, afirma-crypto-core-pkcs7, afirma-crypto-core-pkcs7-tsp, afirma-crypto-validation, afirma-simple-plugin-validatecerts, afirma-simple, afirma-keystores-filters, afirma-server-triphase-signer-core

---

## Java Import Migration Pattern

**Systematic find/replace across all 83 Java files:**

| Old Import | New Import |
|------------|------------|
| `org.spongycastle.*` | `org.bouncycastle.*` |

**Examples:**
- `org.spongycastle.asn1.*` → `org.bouncycastle.asn1.*`
- `org.spongycastle.cms.*` → `org.bouncycastle.cms.*`
- `org.spongycastle.jce.*` → `org.bouncycastle.jce.*`
- `org.spongycastle.operator.*` → `org.bouncycastle.operator.*`
- `org.spongycastle.pkcs.*` → `org.bouncycastle.pkcs.*`
- `org.spongycastle.tsp.*` → `org.bouncycastle.tsp.*`
- `org.spongycastle.util.*` → `org.bouncycastle.util.*`
- `org.spongycastle.x509.*` → `org.bouncycastle.x509.*`

---

## Functional Change Categories

### 1. Core CMS/CAdES Signing (High Impact)
- `CounterSigner.java` - Complete rewrite due to import changes
- `CMSAuthenticatedData.java` / `CMSAuthenticatedEnvelopedData.java` - Authenticated enveloped data
- `GenSignedData.java` - Signed data generation
- `CoSigner.java` / `CounterSigner.java` - Co-signing logic
- `AOCMSSigner.java` / `AOPDFSigner.java` / `AOXMLAdvancedSignature.java` - High-level signers

### 2. Timestamping (High Impact)
- `CMSTimestamper.java` - RFC 3161 timestamping

### 3. Certificate Validation (Medium Impact)
- `CrlHelper.java` / `OcspHelper.java` - CRL/OCSP validation
- `CertHolderBySignerIdSelector.java` - Cert selector
- `ValidateBinarySignature.java` / `ValidateCMS.java` - Validation entry points

### 4. Triphase Signing (Medium Impact)
- `AOCAdESTriPhaseCoSigner.java` / `AOCAdESTriPhaseCounterSigner.java` - Triphase co-signing
- `KeyHelperEcdsa.java` / `KeyHelperFactory.java` - ECDSA key handling

### 5. Utilities (Lower Impact)
- `Utils.java` (CMS enveloper) - Large utility class
- `TimestampsAnalyzer.java` - Timestamp analysis
- `CertUtil.java` (simple & configurator) - Certificate utilities

---

## Test Coverage Gap

**Critical Finding:** The CI (`build-fork-bc.yml`) uses `-Dmaven.test.skip=true` which:
1. Skips test compilation entirely
2. Skips test execution
3. **Test dependencies (JUnit) are missing from crypto module POMs**

Modules missing JUnit test dependency:
- afirma-crypto-cades
- afirma-crypto-cades-multi
- afirma-crypto-cms
- afirma-crypto-cms-enveloper
- afirma-crypto-core-pkcs7
- afirma-crypto-core-pkcs7-tsp
- afirma-crypto-pdf
- afirma-crypto-xades
- afirma-crypto-validation
- afirma-crypto-jarverifier
- afirma-keystores-filters
- afirma-server-triphase-signer-core
- afirma-simple-plugin-validatecerts

Only `afirma-core` has JUnit dependency declared.

---

## Build Verification

✅ **Full build with `-Dmaven.test.skip=true`:** SUCCESS
✅ **Product JAR (`afirma-simple/target/autofirma.jar`):** Built (54MB)
✅ **All modules compile:** SUCCESS
❌ **Test compilation:** FAILS (missing JUnit dependencies)
❌ **Test execution:** NOT VERIFIED

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Whitespace noise (22%) | Medium | Strategy B: clean up noise before merge |
| Missing test dependencies | High | Add JUnit to affected POMs |
| No test execution in CI | High | Enable test phase in CI |
| Large functional surface | High | Incremental validation with test vectors |
| Triphase modules untested | Medium | Mark as EXPERIMENTAL (P3) |

---

## Recommendations

See [BC-STRATEGY.md](./BC-STRATEGY.md) for merge strategy options.