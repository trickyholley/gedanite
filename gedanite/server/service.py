from chatlas import ChatBedrockAnthropic
from enum import Enum
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

chat = ChatBedrockAnthropic(
    model="us.anthropic.claude-sonnet-4-20250514-v1:0",
)

class GEDSubject(Enum):
    MATH = "Math"
    SCIENCE = "Science"
    SOCIAL_STUDIES = "Social Studies"
    LANGUAGE_ARTS_READING = "Language Arts - Reading"
    LANGUAGE_ARTS_WRITING = "Language Arts - Writing"

@app.route('/question', methods=['POST'])
def ged_question():
    data = request.get_json()
    subject = data.get('subject', 'General')
    prompt = (
        f"Generate a truthful sample GED question for the subject '{GEDSubject[subject].value}' with 4 answer options in the following JSON format:\n"
        "{\n"
        "  'question': 'Your question here?',\n"
        "  'options': [\n"
        "    'Option 0',\n"
        "    'Option 1',\n"
        "    'Option 2',\n"
        "    'Option 3'\n"
        "  ],\n"
        "  'answer': 'Correct answer index (e.g., 2)'\n"
        "}\n"
    )
    response = chat.chat(prompt)
    return str(response)

@app.route('/evaluate', methods=['POST'])
def evaluate_student():
    data = request.get_json()
    question = data.get('question')
    correct_answer = data.get('correct_answer')
    student_answer = data.get('student_answer')
    student_explanation = data.get('student_explanation')

    prompt = (
        f"Evaluate the student's answer and explanation for the following question:\n"
        f"Question: {question}\n"
        f"Correct Answer: {correct_answer}\n"
        f"Student Answer: {student_answer}\n"
        f"Student Explanation: {student_explanation}\n\n"
        "Begin with an estimate of a letter grade. Provide feedback on whether the student's answer is correct, and if not, explain why. "
        "Write as though you're talking to the student directly."
    )

    response = chat.chat(prompt)
    return jsonify({'result': str(response)})

if __name__ == '__main__':
    app.run(debug=True)