import requests



data = {
    "model_name": "gpt3",
    "db_name": "aitools/Chinook",
    "question": "good"
}
res = requests.post(url="http://127.0.0.1:5000/api/v1/process_question/process_question",json=data)
print(res)
print(res.text)