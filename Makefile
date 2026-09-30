# Fachada local del monorepo comunitario (Alexendros/clienteafirma).
# Contrato Maven P0 + capa Autofirma-2026 (vectores, gates, packaging).

COMMUNITY_SCRIPTS := $(wildcard scripts/*.sh)

.PHONY: help lint quality test test-community smoke build validate \
	review360 review360-r2 remediation360

help:
	@printf '%s\n' \
	  'make lint              contract checks (Propósito, LICENSE, POM)' \
	  'make quality           lint + bash -n + shellcheck on scripts/*.sh' \
	  'make test              mvn -pl afirma-core test' \
	  'make test-community    invariantes capa comunitaria (vectores, docs)' \
	  'make smoke             inventario fork + smoke comunitario' \
	  'make build             package afirma-core (+deps)' \
	  'make validate          lint + quality + test + test-community + smoke' \
	  'make review360         verify CODE-REVIEW-360 findings' \
	  'make review360-r2      verify CODE-REVIEW-360-R2 findings' \
	  'make remediation360    verify post-audit mitigations'

lint:
	bash scripts/ci/check-contract.sh

quality: lint
	@for f in $(COMMUNITY_SCRIPTS); do bash -n $$f && echo "OK $$f"; done
	@if command -v shellcheck >/dev/null 2>&1; then \
		shellcheck -S error -x $(COMMUNITY_SCRIPTS); \
	else \
		echo "shellcheck no instalado; omitido (CI lo instala)"; \
	fi

test:
	mvn -B -pl afirma-core test

test-community:
	bash scripts/ci-community-test.sh

smoke:
	bash scripts/ci/smoke.sh
	bash scripts/ci-smoke.sh

build:
	mvn -B -pl afirma-core -am package -DskipTests

validate: lint quality test test-community smoke

review360:
	bash scripts/verify-code-review-360.sh

review360-r2:
	bash scripts/verify-code-review-360-r2.sh

remediation360:
	bash scripts/verify-remediation-360.sh
