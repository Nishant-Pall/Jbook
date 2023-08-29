app-build:
	docker-compose -f docker-compose.yml build
build:app-build

app-run:
	docker-compose -f docker-compose.yml up
run:app-run