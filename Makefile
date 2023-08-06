SHELL := /bin/bash # Use bash syntax

SERVER_DIR="back"
SERVER_PORT=4444
CLIENT_DIR="front"
COMPOSE_DEV="docker-compose.dev.yml"

.PHONY: build-back start-back loop-back clean build-front start-front loop-front install-back install-front install build-docker-front run-compose-dev stop-compose-dev build-docker-back install-compose-dev

all: help

## GLOBAL MACRO


build-docker-front:  ## build-docker-front
	docker build -f ${CLIENT_DIR}/Dockerfile -t realtime_front .

build-docker-back: ## build-docker-back
	docker build -f ${SERVER_DIR}/Dockerfile -t realtime_back .

build-compose-dev: ## run and force build docker-compose.dev.yml
	docker compose -f ${COMPOSE_DEV} up -d --build

run-compose-dev: ## run docker-compose.dev.yml
	docker compose -f ${COMPOSE_DEV} up -d

stop-compose-dev: ## stop docker-compose.dev.yml
	docker compose -f ${COMPOSE_DEV} down

install: install-back install-front # install

install-front: ## install-front
	cd ${CLIENT_DIR}; npm i

start-back: ## start-back
	cd ${SERVER_DIR}; uvicorn main:app --port 4444 --reload

build-front: ## build-front
	cd ${CLIENT_DIR}; npm run build

start-front: ## start-front
	cd ${CLIENT_DIR}; npm run start

help: ## Show this help.
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-30s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)



