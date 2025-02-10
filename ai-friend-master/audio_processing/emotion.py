import os
import numpy as np
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
from gtts import gTTS
import opensmile
import pandas as pd

class AIFriendSpeechProcessor:
    def __init__(self):
        self.smile = opensmile.Smile(
            feature_set=opensmile.FeatureSet.ComParE_2016,
            feature_level=opensmile.FeatureLevel.Functionals
        )
        self.recognizer = sr.Recognizer()

    def record_audio(self, duration=5, sample_rate=44100):
        print("Recording audio... Please speak clearly")
        recording = sd.rec(int(duration * sample_rate), 
                            samplerate=sample_rate, 
                            channels=1, 
                            dtype='float64')
        sd.wait()
        sf.write('user_audio.wav', recording, sample_rate)
        return 'user_audio.wav'

    def detect_emotion(self, audio_file):
        try:
            features = self.smile.process_file(audio_file)
            return self.interpret_emotion_features(features)
        except Exception as e:
            print(f"Emotion detection error: {e}")
            return self.default_emotion_analysis()

    def interpret_emotion_features(self, features):
        """
        Interpret OpenSmile features with fallback
        """
        try:
            # Use more robust feature extraction
            energy = features['audspec_lengthL1norm_sma_range'].mean() if 'audspec_lengthL1norm_sma_range' in features.columns else 3
            pitch_variation = features['pitch_sma'].mean() if 'pitch_sma' in features.columns else 15
            
            return {
                'energy_level': self._categorize_energy(energy),
                'pitch_stability': self._categorize_pitch(pitch_variation),
                'overall_emotional_state': self._determine_emotional_state(energy, pitch_variation)
            }
        except Exception as e:
            print(f"Feature interpretation error: {e}")
            return self.default_emotion_analysis()

    def default_emotion_analysis(self):
        """Fallback emotion analysis"""
        return {
            'energy_level': 'Moderate Energy (Neutral)',
            'pitch_stability': 'Stable Pitch (Controlled)',
            'overall_emotional_state': 'Neutral/Balanced'
        }

    def _categorize_energy(self, energy_value):
        if energy_value < 2:
            return 'Low Energy (Calm/Sad)'
        elif energy_value < 4:
            return 'Moderate Energy (Neutral)'
        else:
            return 'High Energy (Excited/Angry)'

    def _categorize_pitch(self, pitch_variation):
        if pitch_variation < 10:
            return 'Stable Pitch (Controlled)'
        elif pitch_variation < 20:
            return 'Moderate Pitch Variation (Moderate Emotion)'
        else:
            return 'High Pitch Variation (Intense Emotion)'

    def _determine_emotional_state(self, energy, pitch_variation):
        if energy < 2 and pitch_variation < 10:
            return 'Calm/Sad'
        elif energy > 4 and pitch_variation > 20:
            return 'Excited/Angry'
        elif energy > 4 and pitch_variation < 10:
            return 'Determined/Focused'
        else:
            return 'Neutral/Balanced'

    def speech_to_text(self, audio_file):
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
        tts = gTTS(text=text, lang='en')
        tts.save(output_file)

# Example usage
if __name__ == "__main__":
    processor = AIFriendSpeechProcessor()
    
    # Record audio
    audio_file = processor.record_audio()
    
    # Detect emotion features
    emotion_result = processor.detect_emotion(audio_file)
    print("\n🔍 Emotion Analysis:")
    for key, value in emotion_result.items():
        print(f"{key.replace('_', ' ').title()}: {value}")
    
    # Convert speech to text
    text = processor.speech_to_text(audio_file)
    print(f"\n💬 Transcribed Text: {text}")
    
    # Convert text back to speech
    processor.text_to_speech("I've processed your audio.")
