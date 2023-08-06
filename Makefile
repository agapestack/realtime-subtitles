SHELL := /bin/bash # Use bash syntax
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

SERVER_DIR="back"
CLIENT_DIR="front"

.PHONY: build-back start-back loop-back clean build-front start-front loop-front install-back install-front install

all: help

## GLOBAL MACRO
install: install-babck install-front # install

install-back: ## install-back
	cd ${SERVER_DIR}; npm i

install-front: ## install-front
	cd ${CLIENT_DIR}; npm i

build-back: ## build-back
	cd ${SERVER_DIR}; npm run build

start-back: build-back ## start-back
	cd ${SERVER_DIR}; npm run start

loop-back: ## loop-back
	cd ${SERVER_DIR}; find . -type f | grep -v node_modules | entr -sc 'npm run start & npm run build'

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



