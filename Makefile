install:
	npm i

reinstall:
	npm ci

test:
	npm run test-windows

test-watch:
	npm test -- --watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .

publish:
	npm publish --dry-run

link:
	npm link
