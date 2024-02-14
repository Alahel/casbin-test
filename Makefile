# Expose the UID.
# This is required to avoid permission issues.
export UID?=$(shell id -u)
export GID?=$(shell id -g)

.PHONY: up
up:
	docker compose up -d

.PHONY: down
down:
	docker compose down