app-build:
	docker-compose -f docker-compose.yml build
build:app-build

app-shell:
	docker-compose exec -it app /bin/sh
shell:app-shell

app-run:
	docker-compose -f docker-compose.yml up
run:app-run