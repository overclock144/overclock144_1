"""Defines the application factory fucntion."""

import logging
import os
from typing import Optional

from flask import Flask, request, jsonify
from indb.utils.text2sql import text2sql, execute_sql,sqlresult2text, text2sql_end2end, sql_agent, sql_explaination, text2sql_memory, execute_sql_memory, freechat_memory

from indb.initialization import AppInitializer
from langchain.memory import ConversationBufferMemory

logger = logging.getLogger(__name__)

memory=ConversationBufferMemory()

def create_app(config: Optional[str] = None) -> Flask:
    """Creates application and initializes it

    :param config: config of the application
    :returns: initialized flask app
    """

    app = Flask(__name__, instance_relative_config=True)

    try:
        env_config = "config.DevelopmentConfig"

        if config is None:
            env_config = os.getenv("APP_SETTINGS")
        else:
            env_config = config

        app.config.from_object(env_config)

        app_initializer = AppInitializer(app)
        app_initializer.init_app()

        # for testing
        @app.route("/health")
        def health():
            return "OK"
        
        # basic api endpoints
        @app.route('/text2sql', methods=['POST'])
        def handle_text2sql():
            data = request.get_json()
            model_name = data['model_name']
            db_name = data['db_name']
            question = data['question']
            response = text2sql(model_name, db_name, question)
            return jsonify(response)
    
        @app.route('/execute_sql', methods=['POST'])
        def handle_execute_sql():
            data = request.get_json()
            query = data['query']
            db_name = data['db_name']
            result = execute_sql(query, db_name)
            return jsonify({"result": result})

        @app.route('/sqlresult2text', methods=['POST'])
        def handle_sqlresult2text():
            data = request.get_json()
            model_name = data['model_name']
            db_name = data['db_name']
            question = data['question']
            sql_query = data['sql_query']
            sql_result = data['sql_result']
            response = sqlresult2text(model_name, db_name, question, sql_query, sql_result)
            return jsonify(response)

        @app.route('/text2sql_end2end', methods=['POST'])
        def handle_text2sql_end2end():
            data = request.get_json()
            model_name = data['model_name']
            db_name = data['db_name']
            question = data['question']
            response = text2sql_end2end(model_name, db_name, question)
            return jsonify(response)

        @app.route('/sql_agent', methods=['POST'])
        def handle_sql_agent():
            data = request.get_json()
            question = data['question']
            db_name = data.get('db_name', "Chinook")
            response = sql_agent(question, db_name)
            return jsonify({"response": response})

        @app.route('/sql_explanation', methods=['POST'])
        def handle_sql_explanation():
            data = request.get_json()
            model_name = data['model_name']
            db_name = data['db_name']
            question = data['question']
            sql_query = data['sql_query']
            sql_result = data['sql_result']
            response = sql_explaination(model_name, db_name, question, sql_query, sql_result)
            return jsonify(response)

        @app.route('/text2sql_memory', methods=['POST'])
        def handle_text2sql_memory():
            data = request.get_json()
            model_name = data['model_name']
            db_name = data['db_name']
            question = data['question']
            response = text2sql_memory(memory, model_name, db_name, question)
            return jsonify(response)

        @app.route('/execute_sql_memory', methods=['POST'])
        def handle_execute_sql_memory():
            data = request.get_json()
            query = data['query']
            db_name = data['db_name']
            result = execute_sql_memory(query, db_name, memory)
            return jsonify({"result": result})

        @app.route('/freechat_memory', methods=['POST'])
        def handle_freechat_memory():
            data = request.get_json()
            model_name = data['model_name']
            user_input = data['user_input']
            response = freechat_memory(memory, model_name, user_input)
            return jsonify(response)

        return app

    # Make sure that bootstrap errors ALWAYS get logged
    except Exception as ex:
        logger.exception("Failed to create app")
        raise ex