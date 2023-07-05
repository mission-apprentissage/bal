ci-install:
	docker build --build-arg YARN_FLAGS="--immutable" --platform linux/amd64 --tag bal_root:latest .

install:
	docker compose run --no-deps --rm --build root

start:
	docker compose --profile dev up -d --remove-orphans --build

debug:
	docker compose -f docker-compose.yml -f docker-compose.debug.yml --profile dev up -d

seed:
	docker compose run --rm server yarn cli seed

migrations:
	docker compose run --rm server yarn cli migrations:status

stop:
	docker compose --profile dev down

test:
	docker compose run --rm -it test yarn test:server

debug-test-server:
	docker compose run -p 9231:9231 --rm -it --workdir /app/server test sh -c 'node --inspect-brk=0.0.0.0:9231 `yarn bin vitest` --single-thread --isolate false -c ./vitest.config.ts --run --test-timeout=300000'

clean:
	docker compose down; docker system prune --force --volumes

ci:
	docker compose run --no-deps --rm ci yarn ci
