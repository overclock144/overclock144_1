ENV_PREFIX=$(shell python -c "if __import__('pathlib').Path('.venv/bin/pip').exists(): print('.venv/bin/')")
PYTHON=`command -v python3.11 || command -v python3.10`

.PHONY: show
show:             ## Show the current environment.
	@echo "Current environment:"
	@echo "Running using $(ENV_PREFIX)"
	@$(ENV_PREFIX)python -V
	@$(ENV_PREFIX)python -m site

.PHONY: dev
dev:          ## Install the project in dev mode.
	@echo "Installing requirements"
	$(ENV_PREFIX)pip install -r ./requirements/development.txt
	$(ENV_PREFIX)pip install -r ./requirements/testing.txt


.PHONY: db
db:
	@echo "Setting up DB"
	$(ENV_PREFIX)flask db init
	@echo "Running Migrations"
	$(ENV_PREFIX)flask db upgrade
	@echo "run flask run"


.PHONY: install
install:          ## Install the project in prod mode.
	$(ENV_PREFIX)pip install -r ./requirements/base.txt


.PHONY: test
test: lint        ## Run tests and generate coverage report.
	$(ENV_PREFIX)pytest -v --cov-config .coveragerc --cov=indb -l --tb=short --maxfail=1 tests/
	$(ENV_PREFIX)coverage xml
	$(ENV_PREFIX)coverage html

.PHONY: watch-test
watch:            ## Run tests on every change.
	ls **/**.py | entr $(ENV_PREFIX)pytest -s -vvv -l --tb=long --maxfail=1 tests/

.PHONY: virtualenv
virtualenv:       ## Create a virtual environment.
	@echo "creating virtualenv ..."
	@python -m venv .venv
	@echo "!!! Please run 'source .venv/bin/activate' or '.venv\Scripts\activate' to activate the environment !!!"
