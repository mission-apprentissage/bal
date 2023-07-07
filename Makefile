install:
	yarn install

start:
	docker compose --profile dev up -d --remove-orphans --build

seed:
	docker compose run --rm server yarn cli seed

migrations:
	docker compose run --rm server yarn cli migrations:status

stop:
	docker compose --profile dev down

test:
	yarn test

clean:
	docker compose --profile dev down; docker system prune --force --volumes
