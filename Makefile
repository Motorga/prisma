.PHONY: start stop restart

start:
	docker-compose up -d && npm start

stop:
	docker-compose down

restart: stop start