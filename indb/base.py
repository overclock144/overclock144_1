from flask_cors import CORS

def base(app):
    CORS(app)
    return app