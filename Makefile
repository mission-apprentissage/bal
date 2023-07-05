ci-install:
	docker build --build-arg YARN_FLAGS="--immutable" --platform linux/amd64 --tag bal_root:latest .

install:
	docker compose run --no-deps --rm --build root

start:
	docker compose --profile dev up -d --remove-orphans --build

seed:
	docker compose run --rm server yarn cli seed

migrations:
	docker compose run --rm server yarn cli migrations:status

stop:
	docker compose --profile dev down

test:
	docker compose run --rm test yarn test:server

clean:
	docker compose down; docker system prune --force --volumes

ci:
	docker compose run --no-deps --rm ci yarn ci
