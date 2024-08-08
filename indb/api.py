"""Common API routes like healthcheck"""

from ansi2html import Ansi2HTMLConverter
from flask_appbuilder.api import BaseApi, expose
from flask_appbuilder.security.api import SecurityApi
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from langchain.memory import ConversationBufferMemory

from indb.utils.text2sql import execute_sql_memory, sql_agent, sqlresult2text, text2sql_memory


from indb.utils.text2sql import freechat_memory


class HealthCheckApi(BaseApi):
    """HealthCheck api"""

    resource_name = "healthcheck"

    @expose("/health", methods=["GET"])
    @jwt_required()
    def health(self):
        """Health check status route"""
        print(request)
        return self.response(200, message="ok!")

class ProcessQuestionApi(BaseApi):
    """Process question api"""
   
    resource_name = "process_question"

    @expose("/process_question", methods=["POST"])
    def process_question(self):
        memory = ConversationBufferMemory(return_messages=True)
       
        # Extract data from request
        data = request.json
        question = data.get('question')
        model_name = data.get('model_name')
        db_name = data.get('db_name')
       
        if not question:
            return jsonify({"error": "No question provided"}), 400

        def convert_newlines_to_html(text):
            text=f"{text}"
            return text.replace("\n", "<br>")
        
        try:
            
            if question.startswith("@"):
                question=question[1:]#remove @
                sqlfromtext = text2sql_memory(memory, model_name, db_name, question)
                print("AI response:", sqlfromtext)
                sql_result = execute_sql_memory(sqlfromtext, db_name, memory)
                print("SQL result:", sql_result)
                result_description = sqlresult2text(model_name, db_name, question, sqlfromtext, sql_result)
                # print("AI response:", result_description)
                sqlfromtext = convert_newlines_to_html(sqlfromtext)
                sql_result = convert_newlines_to_html(sql_result)

                return jsonify({
                    "Query": sqlfromtext,
                    "Result": sql_result,
                    "Description": f"{result_description}"[9:-1]
                })


            elif question.startswith("#"):
                question=question[1:]#remove #
                response = sql_agent(question,"Chinook")
                conv = Ansi2HTMLConverter()
                response = conv.convert(response)
                return jsonify({
                    "Query": response,
                    "Result": "null",
                    "Description": "null"
                })


            else:
                response = freechat_memory(memory, model_name, question)
                response = convert_newlines_to_html(response)
                return jsonify({
                    "Query": response,
                    "Result": "null",
                    "Description": "null"
                })
        except:
            return jsonify({
                "Query": question + "  网络不通",
                "Result": "null",
                "Description": "null"
            })


# class ChatApi(BaseApi):
    """Chat api"""


    resource_name = "chat"


    @expose("/chat", methods=["GET"])
    def chat(self):
        return self.render_template("chat.tsx")


# class GenerateResponseApi(BaseApi):
#     """Generate response api"""


#     resource_name = "generate_response"


#     @expose("/generate_response", methods=["POST"])
#     def generate_response(self):
#         user_message = request.json['message']


#         # Call your API or perform any desired processing
#         response_message = f"Received: {user_message}. This is a generated response."


#         return self.response(200, message=response_message)


# class SetModelApi(BaseApi):
#     """Set model api"""


#     resource_name = "set_model"


#     @expose("/api/set_model", methods=["POST"])
#     def set_model(self):
#         global selected_model
#         selected_model = request.json['model']
#         return self.response(200, message=f"Selected model set to {selected_model}")