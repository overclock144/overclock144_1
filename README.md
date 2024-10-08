# INDB Web Project

INDB web interface.

## Tech Stack

- Python3
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Nodejs
- Nextjs
- Typescript
- Tailwindcss

## Setup

in both routes you will need a env file `.flaskenv` with some required env variables such as:

```
APP_SETTINGS = "config.DevelopmentConfig"
FLASK_APP = "indb.app:create_app()"
FLASK_ENV = "development"
SECRET_KEY = 'secret'
SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
```

**Note you can generate secret with this command**
```bash
python -c 'import secrets; print(secrets.token_hex())'
```

### Dev

Step 1: Create Dev env

```bash
make dev
```

Step 2: DB setup

```bash
make db
```

### Manual

#### Backend

Step 1: Clone the repo

```bash
git clone https://github.com/inDB-ai/inDB-Web.git
```

Step 2: Create venv

```bash
python -m venv .venv
```

and activate it

```bash
.\.venv\Scripts\activate  # windows
source .venn/bin/activate # linux & mac
```

Step 2: Install Deps

```bash
pip install -r ./requirements/base.txt
pip install -r ./requirements/development.txt
pip install -r ./requirements/testing.txt
```
**Note: for linux and mac `pip3` will work**

Setup 3: Init the dev db

```bash
flask init db
```

Setup 4: Run the migrations

```bash
flask db upgrade
```

Setup 4: Run backend

```bash
flask run
```

#### Frontend

Check `indb-frontend/README.md`
#   o v e r c l o c k 1 4 4 _ 1  
 