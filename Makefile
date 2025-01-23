# Define the default target
.DEFAULT_GOAL := help

# Define the docker-compose command
DOCKER_COMPOSE := docker-compose

DOCKER_COMPOSE_FILE := docker-compose.yml

new: ## Create a new project
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build --no-cache

up: ## Start all or c=<name> containers in background
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d

build: ## Build all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build

stop: ## Stop all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop

status: ## Show status of containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) ps

restart: ## Restart all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d

renew: ## Restart all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build --no-cache
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d
	node src/lib/prisma/seed.ts

renew-log: ## Restart all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build --no-cache --progress=plain
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d

logs: ## Show logs for all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs --tail=100 -f

down: ## Clean all data
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --volumes --remove-orphans
	docker volume prune -f

clean: ## Clean all data
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --volumes --remove-orphans
	docker volume prune -f
	sudo rm -rf ./node_modules

node: ## node.jsをインストールしている場合これで実行
	npm install
	npx prisma generate
	npm run dev

clean-cache:
	sudo rm -rf ./.next/cache/fetch-cache/*

clean-image:
	sudo rm -rf ./.next/cache/images/*

# Define the help target
help:
	@echo "Available targets:"
	@echo "  up        : Start the containers"
	@echo "  down      : Stop and remove the containers"
	@echo "  restart   : Restart the containers"
	@echo "  logs      : Show the logs of the containers"
	@echo "  help      : Show this help message"