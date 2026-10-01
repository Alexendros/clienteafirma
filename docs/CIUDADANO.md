# Qué firma Autofirma (y qué no) — Guía para la ciudadanía

## Qué hace este programa

**Autofirma** es una aplicación que se instala en tu ordenador y sirve para **firmar documentos electrónicamente** usando tu certificado digital.

- Tu certificado puede ser un **DNIe** (el chip del DNI electrónico), un certificado de la **FNMT** (archivo `.p12` o `.pfx`), o cualquier otro certificado válido.
- Cuando una página web de la Administración te pide firmar, el navegador abre Autofirma automáticamente (usa el protocolo `afirma://`).
- Los formatos de firma que genera son **CAdES, XAdES, PAdES y FacturaE** —los mismos que usan las sedes oficiales— y también permite **cofirma** (varios firmantes) y **contrafirma** (firmar una firma ya existente).

Puedes **verificar una versión publicada**: en la carpeta `dist/` encontrarás los archivos `SHA256SUMS` (sumas de verificación) y, si existe, `SHA256SUMS.asc` (firma GPG de esas sumas).

---

## Qué **no** hace este programa

| No hace | Quién lo hace |
|---------|---------------|
| **No valida** si tu certificado está revocado o caducado frente a la plataforma del Estado | `@firma`, **VALIDe**, **Integr@** (servidores de la Administración) |
| **No sustituye** a **Cl@ve** (identificación con usuario/contraseña o certificado en la nube) | Cl@ve (Administración) |
| **No sustituye** a **Port@firmas** (firma en la nube desde el navegador) | Port@firmas (Administración) |
| **No sustituye** a **TS@** (sellado de tiempo cualificado) | TS@ (Administración) |
| **No es la plataforma `@firma`** (validación federada de certificados) | `@firma` / CTT |

> **En resumen:** Autofirma solo **genera** la firma con tu certificado. La **validez jurídica completa** (que el certificado no esté revocado, que la firma sea legalmente válida, etc.) la dan los **servicios de validación oficiales** del Estado.

---

## Confianza y transparencia

- El código está basado en el **cliente oficial del CTT** (Centro de Transferencia de Tecnología).
- Licencia **dual GPL-2.0+ / EUPL-1.1** (software libre: puedes usarlo, estudiarlo, modificarlo y distribuirlo).
- **Puedes compilarlo tú mismo** siguiendo las instrucciones en `docs/BASELINE.txt`.
- **Puedes repetir las pruebas** de formatos de firma ejecutando `scripts/f2-regression.sh`.

---

## Descarga segura

Si descargas una versión compilada (`.jar`, `.deb`, `.rpm`, `.AppImage`, etc.):

1. Verifica la **firma GPG** (archivo `.asc`) si está disponible.
2. Verifica el **checksum SHA256** comparando con el archivo `SHA256SUMS`.
3. La página de descarga de prueba está en `packaging/portal-prueba/index.html` (muestra firmas y checksums).

---

## Dónde informarse

- **Repositorio oficial (CTT):** https://github.com/ctt-gob-es/clienteafirma
- **Fork comunitario (este):** https://github.com/Alexendros/clienteafirma → pronto en `Soluciones-Alexendros/clienteafirma-alexendros`
- **Descargas oficiales del Estado:** https://firmaelectronica.gob.es
- **Manual de usuario (PDF):** incluido en el instalador oficial