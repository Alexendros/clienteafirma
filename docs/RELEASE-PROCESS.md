# Proceso de Release — Autofirma comunitaria

## Versionado (SemVer)

Este proyecto sigue **Semantic Versioning 2.0.0** (MAJOR.MINOR.PATCH):

| Tipo de cambio | Incremento | Ejemplo |
|----------------|------------|---------|
| Cambios incompatibles en API/protocolo `afirma://` | MAJOR | `1.9.0` → `2.0.0` |
| Nuevas funcionalidades compatibles | MINOR | `1.9.0` → `1.10.0` |
| Correcciones de bugs compatibles | PATCH | `1.9.0` → `1.9.1` |

**Prefijos de pre-release:** `-alpha`, `-beta`, `-rc` (ej: `v1.10.0-rc.1`)

---

## Flujo de publicación

### 1. Preparar la versión

```bash
# Actualizar versión en pom.xml raíz y módulos (si aplica)
# Actualizar CHANGELOG.md con los cambios
# Commit: "chore: prepare release vX.Y.Z"
```

### 2. Crear y empujar tag firmado GPG

```bash
# Requiere clave GPG configurada en git
git tag -s v1.9.1 -m "Release v1.9.1"
git push origin v1.9.1
```

> El workflow `.github/workflows/release.yml` se dispara automáticamente al empujar un tag `v*`.

### 3. Verificar el workflow

- Ir a **Actions** → **Release** → verificar que el job `release` pasa
- El workflow:
  1. Compila el JAR y ejecuta vectores F2
  2. Empaqueta DEB, RPM, AppImage (y Flatpak cuando esté listo)
  3. Firma todos los artefactos con GPG
  4. Genera `SHA256SUMS` y `SHA256SUMS.asc`
  5. Crea el **GitHub Release** con todos los archivos

### 4. Verificar el Release en GitHub

- Ir a **Releases** → comprobar que aparece la nueva versión
- Verificar que todos los artefactos están adjuntos con sus `.asc`
- Comprobar que `SHA256SUMS` y `SHA256SUMS.asc` están presentes

### 5. Actualizar portal de descarga (opcional)

```bash
# El portal en packaging/portal-prueba/index.html se actualiza manualmente
# para reflejar la nueva versión con enlaces a los artefactos y firmas
```

---

## Requisitos previos

### Clave GPG

El mantenedor debe tener una clave GPG configurada:

```bash
# Listar claves secretas
gpg --list-secret-keys --keyid-format LONG

# Configurar en git
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

### Secrets en GitHub

En el repositorio (Settings → Secrets and variables → Actions):

| Secret | Descripción |
|--------|-------------|
| `GPG_PRIVATE_KEY` | Clave privada GPG (exportada con `gpg --export-secret-keys --armor`) |
| `GPG_PASSPHRASE` | Passphrase de la clave GPG (si la tiene) |

---

## Estructura de artefactos publicados

```
GitHub Release vX.Y.Z/
├── autofirma-vX.Y.Z.jar
├── autofirma-vX.Y.Z.jar.asc
├── autofirma-2026_X.Y.Z_all.deb
├── autofirma-2026_X.Y.Z_all.deb.asc
├── autofirma-2026-X.Y.Z-1.x86_64.rpm
├── autofirma-2026-X.Y.Z-1.x86_64.rpm.asc
├── Autofirma-vX.Y.Z.AppImage
├── Autofirma-vX.Y.Z.AppImage.asc
├── org.autofirma.Autofirma2026.flatpak (cuando esté listo)
├── org.autofirma.Autofirma2026.flatpak.asc (cuando esté listo)
├── SHA256SUMS
└── SHA256SUMS.asc
```

---

## Verificación por el usuario final

```bash
# 1. Importar clave pública del mantenedor
gpg --import mantenedor.pub

# 2. Verificar firma de un artefacto
gpg --verify autofirma-v1.9.1.jar.asc autofirma-v1.9.1.jar

# 3. Verificar checksum
sha256sum -c SHA256SUMS
```

---

## Checklist de release

- [ ] Versión actualizada en `pom.xml` y `CHANGELOG.md`
- [ ] Tests pasan (`make validate`)
- [ ] Vectores F2 pasan (`bash scripts/f2-regression.sh`)
- [ ] Tag firmado GPG creado y empujado
- [ ] Workflow `release.yml` completado en verde
- [ ] Release visible en GitHub con todos los artefactos
- [ ] Firmas GPG y checksums presentes
- [ ] Portal de descarga actualizado (si aplica)
- [ ] Anuncio en canales de comunicación (si aplica)