from stt import speech_to_text
from nlp import generate_response
from tts import text_to_speech

def chatbot():
    print("Starting AI Chatbot. Say 'quit' to exit.")
    while True:
        # Step 1: Speech-to-Text
        user_input = speech_to_text()
        if not user_input or user_input.lower() == "quit":
            print("Exiting chatbot. Goodbye!")
            break

        # Step 2: Generate Response
        bot_response = generate_response(user_input)

        # Step 3: Text-to-Speech
        text_to_speech(bot_response)

if __name__ == "__main__":
    chatbot()
