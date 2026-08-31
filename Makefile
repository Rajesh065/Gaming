.PHONY: all install build dev test clean docker-build docker-run

all: install build test

install:
	npm install

build:
	npm run build

dev:
	npm run dev

test:
	npm run test

clean:
	npm run clean

docker-build:
	docker build -t nexusplay-platform:latest .

docker-run:
	docker-compose up -d
