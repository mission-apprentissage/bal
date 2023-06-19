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
	docker compose run --rm test yarn test:server

clean:
	docker compose down; docker system prune --force --volumes

typecheck-server:
	docker compose run --no-deps --rm test yarn typecheck:server

typecheck-ui:
	docker compose run --no-deps --rm ui yarn typecheck:ui

typecheck:
	docker compose run --no-deps --rm ui yarn typecheck

ci:
	docker compose run --no-deps --rm test yarn ci
