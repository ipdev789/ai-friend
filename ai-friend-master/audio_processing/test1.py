import os
import numpy as np
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
from gtts import gTTS
import opensmile

class AIFriendSpeechProcessor:
    def __init__(self):
        # Initialize OpenSmile feature extractor
        self.smile = opensmile.Smile(
            feature_set=opensmile.FeatureSet.ComParE_2016,
            feature_level=opensmile.FeatureLevel.Functionals
        )
        self.recognizer = sr.Recognizer()

    def record_audio(self, duration=5, sample_rate=44100):
        """Record audio from microphone"""
        print("Recording audio...")
        recording = sd.rec(int(duration * sample_rate), 
                            samplerate=sample_rate, 
                            channels=1, 
                            dtype='float64')
        sd.wait()
        # Save the recording
        sf.write('user_audio.wav', recording, sample_rate)
        return 'user_audio.wav'

    def detect_emotion(self, audio_file):
        """
        Detect emotion using OpenSmile
        
        Returns:
            dict: Emotion-related features
        """
        try:
            # Extract features
            features = self.smile.process_file(audio_file)
            return features
        except Exception as e:
            print(f"Emotion detection error: {e}")
            return None

    def speech_to_text(self, audio_file):
        """Convert speech to text"""
        with sr.AudioFile(audio_file) as source:
            audio = self.recognizer.record(source)
            
        try:
            text = self.recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Speech was unintelligible"
        except sr.RequestError:
            return "Could not request results"

    def text_to_speech(self, text, output_file='response.mp3'):
        """Convert text to speech"""
        tts = gTTS(text=text, lang='en')
        tts.save(output_file)

# Example usage
if __name__ == "__main__":
    processor = AIFriendSpeechProcessor()
    
    # Record audio
    audio_file = processor.record_audio()
    
    # Detect emotion features
    emotion_features = processor.detect_emotion(audio_file)
    print("Emotion Features:")
    print(emotion_features)
    
    # Convert speech to text
    text = processor.speech_to_text(audio_file)
    print(f"Transcribed Text: {text}")
    
    # Convert text back to speech
    processor.text_to_speech("I've processed your audio.")