install:
	yarn

start:
	docker compose up --build -d --remove-orphans

seed:
	docker compose run --rm -it server yarn cli seed

stop:
	docker compose stop

lint:
	yarn lint

test:
	docker compose run --build --rm -it server-test yarn test

coverage:
	docker compose run --build --rm -it server-test yarn test:coverage

clean:
	docker compose kill; docker system prune --force --volumes

typecheck:
	yarn --cwd server typecheck && yarn --cwd ui typecheck

ci: lint test typecheck
