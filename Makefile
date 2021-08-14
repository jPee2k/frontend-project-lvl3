install:
	npm i

reinstall:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

setup:
	npm install
	make build

start:
	npm run watch

serve:
	npx webpack serve --open

test:
	npm run test-windows

test-watch:
	npm test -- --watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint ./src

lint-fix:
	npx eslint --fix ./src

publish:
	npm publish --dry-run

link:
	npm link
