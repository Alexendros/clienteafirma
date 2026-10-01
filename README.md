# ![Logo de la Suite @firma](logo_autofirma.png)

### Propósito de este documento

- **Objetivos:** Explicar qué es este monorepo comunitario, cómo se diferencia del cliente oficial y cómo construirlo y verificarlo.
- **Estructura:** Quiénes somos → comparativa → arranque rápido → construcción Maven → módulos.
- **Contenido a integrar según contexto:** Conserva Java 8 + Maven y licencias GPL-2.0+ / EUPL-1.1 del CTT. No copies un README de SaaS.

> **Canónico comunitario (hoy):** [Alexendros/clienteafirma](https://github.com/Alexendros/clienteafirma) — fork de [ctt-gob-es/clienteafirma](https://github.com/ctt-gob-es/clienteafirma) (Autofirma **1.9.1**) más el programa Autofirma-2026. **Destino de org:** `Soluciones-Alexendros/clienteafirma-alexendros` (traslado pendiente). **No sustituye** al cliente oficial del Estado ni a VALIDe, Cl@ve o la plataforma `@firma`.

[![License: GPL-2.0+ OR EUPL-1.1](https://img.shields.io/badge/license-GPL--2.0%2B%20%7C%20EUPL--1.1-blue.svg)](LICENSE)
[![Baseline](https://img.shields.io/badge/baseline-Autofirma%201.9.1-informational.svg)](docs/BASELINE.txt)
[![Upstream](https://img.shields.io/badge/upstream-ctt--gob--es%2Fclienteafirma-success.svg)](https://github.com/ctt-gob-es/clienteafirma)

**Programa:** [docs/ESTADO-FASES.md](docs/ESTADO-FASES.md) · **Tareas:** [docs/TASKS.md](docs/TASKS.md) · **Hoja de ruta:** [docs/integration/ROADMAP.md](docs/integration/ROADMAP.md) · **MVP:** `bash scripts/mvp.sh` ([docs/MVP.md](docs/MVP.md))  
**Comparativa fork ↔ oficial:** [docs/COMPARATIVA-FORK-CTT.md](docs/COMPARATIVA-FORK-CTT.md) · Guía ciudadana: [docs/CIUDADANO.md](docs/CIUDADANO.md)  
**Meta histórico:** [Alexendros/Autofirma-2026](https://github.com/Alexendros/Autofirma-2026) (archivado tras la migración)

---

## ¿Qué es Autofirma aquí?

Autofirma es la herramienta de **firma electrónica de escritorio** de la suite @firma: genera firmas con **tu certificado** (por ejemplo DNIe o FNMT) en formatos que las sedes ya entienden (CAdES, XAdES, PAdES, FacturaE…).

Cuando una página web usa el protocolo `afirma://`, el navegador puede abrir esta aplicación para completar la firma. Es **software libre** (GPL 2+ y EUPL 1.1). El código oficial vive en la forja del [Centro de Transferencia de Tecnología (CTT)](https://github.com/ctt-gob-es/).

Este repositorio es un **fork comunitario**: mismo producto usable, más capas de pruebas, CI, documentación de fases y endurecimientos locales. No es un sustituto de los servicios de validación del Estado.

---

## Fork comunitario vs Autofirma oficial (resumen)

| | Oficial CTT | Este fork |
|---|-------------|-----------|
| Protocolo `afirma://` y formatos de firma | Sí | Sí (misma línea 1.9.x) |
| Biblioteca criptográfica | SpongyCastle | BouncyCastle 1.78.1 |
| Vectores de no-regresión (F2) y `mvp.sh` | No equivalentes en el repo | Sí |
| CI comunitaria (`make validate`, gates 360º) | No | Sí |
| Sustituye VALIDe / Cl@ve / `@firma` | — | **No** |

Tabla ampliada: [docs/COMPARATIVA-FORK-CTT.md](docs/COMPARATIVA-FORK-CTT.md).

---

## Arranque rápido

Necesitas **JDK 8** (kit de desarrollo Java 8) y **Maven** (herramienta de construcción) en el `PATH`, o bajo `./tools/`.

```bash
bash scripts/mvp.sh                 # construye el JAR, lanza vectores F2 y empaqueta si puede
bash scripts/mvp.sh --skip-build    # si ya tienes afirma-simple/target/autofirma.jar
make validate                       # contrato del repo + quality + tests + humo
```

Manifiesto del programa: [`propuesta-autofirma-2026.md`](propuesta-autofirma-2026.md).

---

## Construcción con Maven

Los módulos se compilan con **Apache Maven**. El cliente de escritorio se orienta a **Java 8**. Puedes añadir `-DskipTests` para omitir pruebas unitarias (JUnit).

### Módulos básicos

```bash
mvn clean install
```

### Autofirma (JAR) y servicios (perfil `env-install`)

```bash
mvn clean install -Denv=install
```

Artefactos relevantes:

* `afirma-simple` → JAR autoejecutable (`Autofirma.jar` / `autofirma.jar`)
* `afirma-ui-simple-configurator` → configurador de instalación
* `afirma-server-triphase-signer` → WAR del servicio de **firma trifásica** (firma en varios pasos con un servidor)
* `afirma-signature-retriever` / `afirma-signature-storage` → WAR del servidor intermedio

### Despliegue en repositorio de artefactos

```bash
mvn clean deploy -Denv=deploy
```

El perfil `env-deploy` añade fuentes, JavaDoc y firma de artefactos; no hace falta para el uso diario de compilación.

---

## Módulos del proyecto

### Módulos vigentes

* `afirma-core`: componentes principales
* `afirma-core-keystores`: almacenes de claves (certificados) del usuario
* `afirma-core-massive`: firmas masivas
* `afirma-crypto-batch-client`: cliente de firma por lotes en servidor
* `afirma-crypto-cades` / `afirma-crypto-cades-multi`: firmas CAdES (y cofirma/contrafirma)
* `afirma-crypto-cadestri-client`: cliente trifásico CAdES
* `afirma-crypto-cms`: firmas CMS
* `afirma-crypto-core-pkcs7`: estructuras PKCS#7 (base ASN.1 de CAdES/PAdES…)
* `afirma-crypto-core-xml`: estructuras XML (base de XAdES, ODF, OOXML…)
* `afirma-crypto-odf` / `afirma-crypto-ooxml`: firmas ODF y OOXML
* `afirma-crypto-pdf` / `afirma-crypto-pdf-common`: firmas PAdES (PDF)
* `afirma-crypto-padestri-client`: cliente trifásico PAdES
* `afirma-crypto-validation`: integridad de firmas (no sustituye validación de certificados del Estado)
* `afirma-crypto-xades` / `afirma-crypto-xadestri-client`: XAdES, ASiC-XAdES, FacturaE
* `afirma-crypto-xmlsignature`: XMLdSig
* `afirma-keystores-filters` / `afirma-keystores-mozilla`: filtros de certificados y Firefox
* `afirma-server-triphase-signer*` / `afirma-signature-*`: servicios de servidor
* `afirma-simple` / `afirma-simple-installer` / plugins hash y validación
* `afirma-ui-core-jse*` / `afirma-ui-simple-configurator` / `afirma-ui-miniapplet-deploy` (AutoScript)

### Módulos sin mantenimiento

Se conservan en el árbol pero **sin soporte**: antiguos Applets, WebStart, StandAlone, Windows Store, etc. (lista histórica del README CTT: `afirma-ui-applet`, `afirma-standalone`, `afirma-windows-store`, …). No uses estos caminos para producción nueva.

---

## Gobernanza y fachada comunitaria

- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md) · [CHANGELOG.md](CHANGELOG.md) · [LICENSE](LICENSE) · [AGENTS.md](AGENTS.md)
- Fachada: `make lint` / `make quality` / `make test` / `make test-community` / `make smoke` / `make build` / `make validate`
- Gates 360º: `make review360` / `make review360-r2` / `make remediation360`
- CI: `quality` / `test` / `community` / `build` / `smoke` + `build-baseline` (JAR + vectores F2)
- Mapas Archify (HTML interactivo): carpeta [`.archify/`](.archify/)
