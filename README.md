# Autofirma 2026 — Cliente comunitario de firma electrónica

![Logo de la Suite @firma](logo_autofirma.png)

[![Licencia: GPL-2.0+ o EUPL-1.1](https://img.shields.io/badge/license-GPL--2.0%2B%20%7C%20EUPL--1.1-blue.svg)](LICENSE)
[![Línea base: Autofirma 1.9.1](https://img.shields.io/badge/baseline-Autofirma%201.9.1-informational.svg)](docs/BASELINE.txt)
[![Upstream: CTT](https://img.shields.io/badge/upstream-ctt--gob--es%2Fclienteafirma-success.svg)](https://github.com/ctt-gob-es/clienteafirma)

**Repositorio canónico (hoy):** [Alexendros/clienteafirma](https://github.com/Alexendros/clienteafirma) — fork de [ctt-gob-es/clienteafirma](https://github.com/ctt-gob-es/clienteafirma) (Autofirma **1.9.1**) más el programa Autofirma-2026.
**Destino de la organización:** `Soluciones-Alexendros/clienteafirma-alexendros` (traslado pendiente).
**Meta histórico:** [Alexendros/Autofirma-2026](https://github.com/Alexendros/Autofirma-2026) (archivado tras la migración).

> **No sustituye** al cliente oficial del Estado ni a los servicios de validación: VALIDe, Cl@ve, TS@, Port@firmas ni la plataforma `@firma`.

---

## Propósito de este documento

Este README describe el repositorio comunitario **Autofirma-2026** (fork de CTT 1.9.1), su estructura, cómo construirlo, probarlo y empaquetarlo, y la hoja de ruta de mejoras (F0–F10). Sirve como punto de entrada único para desarrolladores, auditores y usuarios avanzados que quieran contribuir o usar el fork.

---

## ¿Qué es esto y para qué sirve?

Autofirma es la aplicación de **firma electrónica de escritorio** de la suite `@firma`. Sirve para firmar documentos en las sedes electrónicas de las Administraciones Públicas.

Cuando una página web te pide firmar y usa el protocolo `afirma://`, el navegador abre esta aplicación para que elijas tu certificado (DNIe, FNMT, etc.) y completes la firma. Los formatos que genera son los que ya entienden las sedes: **CAdES, XAdES, PAdES, FacturaE** (y cofirma/contrafirma).

Este repositorio es un **fork comunitario**: mismo producto usable, más pruebas automáticas, integración continua, documentación por fases y mejoras locales. Es **software libre** (licencias GPL 2+ y EUPL 1.1).

---

## Diferencias clave frente al cliente oficial

| Qué | Oficial (CTT) | Este fork comunitario |
|-----|---------------|----------------------|
| Protocolo `afirma://` y formatos de firma | Sí | **Iguales** (línea 1.9.x) |
| Biblioteca criptográfica | SpongyCastle (antigua) | **BouncyCastle 1.78.1** (moderna, misma familia) |
| Pruebas de no-regresión (vectores F2) | No hay batería pública equivalente | **Sí**: scripts + vectores en `scripts/f2-regression.sh` |
| Integración continua (CI) abierta | Limitada / no equivalente | **Jobs**: `quality`, `test`, `community`, `build`, `smoke`, `build-baseline` |
| Empaquetado Linux de prueba | `.deb`/`.rpm` oficiales en descarga del Estado | **Empaquetado de desarrollo** + `scripts/mvp.sh` |
| Parsers XML endurecidos (XXE) | Parcial | **SecureXmlBuilder** en sinks de usuario/servidor |
| TLS estricto | Comportamiento histórico | **Preferencia opt-in** `strictSslChecks` (por defecto **desactivada**) |
| Accesibilidad (EN 301 549) | Deuda | **Nombres accesibles** en elegir certificado / PIN / confirmar (en integración) |
| Documentación de programa | README de producto | **Fases F0–F10**, ROADMAP, TASKS, Archify |

Tabla ampliada: [docs/COMPARATIVA-FORK-CTT.md](docs/COMPARATIVA-FORK-CTT.md).

---

## Arranque rápido

Necesitas **JDK 8** (kit de desarrollo Java 8) y **Maven** en el `PATH`, o bajo `./tools/`.

```bash
# Construye el JAR, ejecuta vectores F2 y empaqueta si puede
bash scripts/mvp.sh

# Si ya tienes el JAR construido
bash scripts/mvp.sh --skip-build

# Contrato completo del repositorio (lint + quality + tests + humo)
make validate
```

**Manifiesto del programa:** [`propuesta-autofirma-2026.md`](propuesta-autofirma-2026.md)  
**Guía para la ciudadanía:** [docs/CIUDADANO.md](docs/CIUDADANO.md)  
**MVP operativo:** [docs/MVP.md](docs/MVP.md) · Evidencia en `dist/MVP-EVIDENCE.txt`

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

**Artefactos principales:**

| Módulo | Qué produce |
|--------|-------------|
| `afirma-simple` | JAR autoejecutable (`Autofirma.jar` / `autofirma.jar`) |
| `afirma-ui-simple-configurator` | Configurador de instalación |
| `afirma-server-triphase-signer` | WAR del servicio de **firma trifásica** (firma en varios pasos con un servidor) |
| `afirma-signature-retriever` / `afirma-signature-storage` | WAR del servidor intermedio |

### Despliegue en repositorio de artefactos

```bash
mvn clean deploy -Denv=deploy
```

El perfil `env-deploy` añade fuentes, JavaDoc y firma de artefactos; no hace falta para el uso diario de compilación.

---

## Módulos del proyecto

### Módulos vigentes (activos)

- `afirma-core`: componentes principales
- `afirma-core-keystores`: almacenes de claves (certificados) del usuario
- `afirma-core-massive`: firmas masivas
- `afirma-crypto-batch-client`: cliente de firma por lotes en servidor
- `afirma-crypto-cades` / `afirma-crypto-cades-multi`: firmas CAdES (y cofirma/contrafirma)
- `afirma-crypto-cadestri-client`: cliente trifásico CAdES
- `afirma-crypto-cms`: firmas CMS
- `afirma-crypto-core-pkcs7`: estructuras PKCS#7 (base ASN.1 de CAdES/PAdES…)
- `afirma-crypto-core-xml`: estructuras XML (base de XAdES, ODF, OOXML…)
- `afirma-crypto-odf` / `afirma-crypto-ooxml`: firmas ODF y OOXML
- `afirma-crypto-pdf` / `afirma-crypto-pdf-common`: firmas PAdES (PDF)
- `afirma-crypto-padestri-client`: cliente trifásico PAdES
- `afirma-crypto-validation`: integridad de firmas (no sustituye validación de certificados del Estado)
- `afirma-crypto-xades` / `afirma-crypto-xadestri-client`: XAdES, ASiC-XAdES, FacturaE
- `afirma-crypto-xmlsignature`: XMLdSig
- `afirma-keystores-filters` / `afirma-keystores-mozilla`: filtros de certificados y Firefox
- `afirma-server-triphase-signer*` / `afirma-signature-*`: servicios de servidor
- `afirma-simple` / `afirma-simple-installer` / plugins hash y validación
- `afirma-ui-core-jse*` / `afirma-ui-simple-configurator` / `afirma-ui-miniapplet-deploy` (AutoScript)

### Módulos sin mantenimiento (históricos)

Se conservan en el árbol pero **sin soporte**: antiguos Applets, WebStart, StandAlone, Windows Store, etc. No uses estos caminos para producción nueva.

---

## Gobernanza y fachada comunitaria

- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md) · [CHANGELOG.md](CHANGELOG.md) · [LICENSE](LICENSE) · [AGENTS.md](AGENTS.md)
- **Fachada Make:** `make lint` / `make quality` / `make test` / `make test-community` / `make smoke` / `make build` / `make validate`
- **Gates 360º:** `make review360` / `make review360-r2` / `make remediation360`
- **Jobs CI:** `quality` / `test` / `community` / `build` / `smoke` + `build-baseline` (JAR + vectores F2)
- **Mapas Archify (HTML interactivo):** carpeta [`.archify/`](.archify/)

---

## Documentación del programa

| Documento | Qué contiene |
|-----------|--------------|
| [docs/ESTADO-FASES.md](docs/ESTADO-FASES.md) | Estado de cada fase F0–F10 con evidencia |
| [docs/TASKS.md](docs/TASKS.md) | Tablero vivo de tareas (Hecho / En curso / Pendiente) |
| [docs/integration/ROADMAP.md](docs/integration/ROADMAP.md) | Hoja de ruta por prioridades P0–P3 |
| [docs/COMPARATIVA-FORK-CTT.md](docs/COMPARATIVA-FORK-CTT.md) | Tabla comparativa fork vs oficial |
| [docs/BASELINE.txt](docs/BASELINE.txt) | Pin de sincronización con upstream CTT |
| [docs/F10-UPSTREAM.md](docs/F10-UPSTREAM.md) | Seguimiento de reintegración upstream |
| [docs/CIUDADANO.md](docs/CIUDADANO.md) | Qué firma y qué no firma (lenguaje llano) |
| [docs/MVP.md](docs/MVP.md) | Definición del MVP operativo |

---

## Cómo comprobar que funciona

```bash
# 1. Construye y prueba todo (MVP)
bash scripts/mvp.sh

# 2. Contrato completo del repo
make validate

# 3. Gates de revisión 360º
make review360-r2
make remediation360
```

---

## Licencia

Dual **GPL-2.0-or-later** / **EUPL-1.1** (igual que el cliente oficial del CTT).