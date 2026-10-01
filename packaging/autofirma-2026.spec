Name:           autofirma-2026
Version:        1.9.1-autofirma-alexendros
Release:        1.9.1-autofirma-alexendros%{?dist}
Summary:        Autofirma 1.9.1 community build (Autofirma-2026)
License:        GPL-2.0-or-later AND EUPL-1.1
URL:            https://github.com/ctt-gob-es/clienteafirma
Source0:        autofirma-2026_%{version}-autofirma2026.%{release}_all.deb
BuildArch:      noarch
BuildRequires:  rpm-build, alien
Requires:       libnss3-tools, java-1.8.0-openjdk-headless
%global debug_package %{nil}

%description
Fork comunitario drop-in de Autofirma 1.9.1: mismo protocolo afirma:// y formatos.
Atribución CTT / AEAD. Licencia GPL-2+ / EUPL-1.1.

%prep
# Extract DEB contents
%{__alien} --to-rpm --scripts --generate --version=%{version} --bump=%{release}   %{SOURCE0}

%build
# Nothing to build; alien does the conversion

%install
rm -rf %{buildroot}
%{__alien} --to-rpm --scripts --install --version=%{version} --bump=%{release}   --target=%{_target_cpu} %{SOURCE0}

%post
update-desktop-database -q /usr/share/applications 2>/dev/null || true
xdg-mime default afirma.desktop x-scheme-handler/afirma 2>/dev/null || true

%files
%{_bindir}/autofirma
%{_libdir}/Autofirma/autofirma.jar
%{_datadir}/applications/afirma.desktop

%changelog
* jue oct 01 2026 Autofirma-2026 Community <noreply@localhost> - %{version}-%{release}
- Community build %{version}-autofirma2026.%{release}
