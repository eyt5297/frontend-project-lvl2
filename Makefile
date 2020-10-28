install:
	npm install
publish:
	npm publish --dry-run
lint:
	npx eslint .

t: ## show tree of project without node modules
	tree --dirsfirst -I node_modules



