# Fachada local del contrato P0. No sustituye los perfiles Maven del producto.
.PHONY: lint test smoke build validate

lint:
	bash scripts/ci/check-contract.sh

test:
	mvn -B -pl afirma-core test

smoke:
	bash scripts/ci/smoke.sh

build:
	mvn -B -pl afirma-core -am package -DskipTests

validate: lint test smoke
