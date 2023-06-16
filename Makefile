ci-install:
	docker compose --profile test build --build-arg YARN_FLAGS="--immutable"

install:
	docker compose run --no-deps --rm repo_modules

start:
	docker compose up --profile dev -d --remove-orphans

seed:
	docker compose run --rm server yarn cli seed

migrations:
	docker compose run --rm server yarn cli migrations:status

stop:
	docker compose down

lint:
	docker compose run --no-deps --rm repo_modules yarn lint

test:
	docker compose run --rm server-test yarn test

coverage:
	docker compose run --rm server-test yarn test:coverage

clean:
	docker compose down; docker system prune --force --volumes

typecheck-server:
	docker compose run --rm server yarn typecheck

typecheck-ui:
	docker compose run --rm ui yarn typecheck

typecheck: typecheck-server typecheck-ui

ci: lint coverage typecheck
