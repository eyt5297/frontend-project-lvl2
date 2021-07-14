install:
	npm install
publish:
	npm publish --dry-run
lint:
	npx eslint .

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

t: ## show tree of project without node modules
	tree --dirsfirst -I node_modules

.PHONY: test
