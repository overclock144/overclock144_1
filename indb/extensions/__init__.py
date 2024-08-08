"""Extensions module. Each extension is initialized here and get passed to the Appinitializer."""

from flask_appbuilder import SQLA, AppBuilder
from flask_migrate import Migrate

db = SQLA()
app_builder = AppBuilder()
migrate = Migrate()
