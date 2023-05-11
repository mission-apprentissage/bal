install:
	yarn

start:
	docker-compose up --build --force-recreate

seed:
	yarn --cwd server cli seed

stop:
	docker-compose stop

lint:
	yarn lint

test:
	yarn --cwd server test

coverage:
	yarn --cwd server test:coverage

clean:
	docker-compose kill && docker system prune --force --volumes

typecheck:
	yarn --cwd server typecheck && yarn --cwd ui typecheck

ci: lint test typecheck
