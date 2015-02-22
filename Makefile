
# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# applications
NODE ?= $(shell which node)
NPM ?= $(NODE) $(shell which npm)

install: node_modules

node_modules: package.json
	@NODE_ENV= $(NPM) install
	@touch node_modules

test:
	$(NPM) run test


.PHONY: install test
