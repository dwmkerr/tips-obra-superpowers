.PHONY: build dev test lint clean install uninstall help

build: node_modules
	npm run build

dev: node_modules
	npm run dev

test: node_modules
	npm test

lint: node_modules
	npm run lint

lint-check: node_modules
	npm run lint:check

clean:
	rm -rf dist node_modules coverage

install: build
	npm link

uninstall:
	npm unlink -g tips

node_modules: package.json
	npm install
	touch node_modules

help:
	@echo "Available targets:"
	@echo "  build      - Compile TypeScript"
	@echo "  dev        - Watch mode for development"
	@echo "  test       - Run tests with coverage"
	@echo "  lint       - Fix lint and format issues"
	@echo "  lint-check - Check lint and format (no fix)"
	@echo "  clean      - Remove build artifacts"
	@echo "  install    - Build and link globally"
	@echo "  uninstall  - Remove global link"
