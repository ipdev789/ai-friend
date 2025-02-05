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
        print("Initializing OpenSMILE and Speech Recognizer...")
        self.smile = opensmile.Smile(
            feature_set=opensmile.FeatureSet.ComParE_2016,
            feature_level=opensmile.FeatureLevel.Functionals
        )
        self.recognizer = sr.Recognizer()

    def record_audio(self, duration=5, sample_rate=44100):
        """Records audio and saves it to a WAV file."""
        print("Recording audio... Please speak clearly.")
        try:
            recording = sd.rec(int(duration * sample_rate), 
                               samplerate=sample_rate, 
                               channels=1, 
                               dtype='float64')
            sd.wait()  # Wait until recording is finished
            audio_file = 'user_audio.wav'
            sf.write(audio_file, recording, sample_rate)
            print(f"Audio recorded successfully: {audio_file}")
            return audio_file
        except Exception as e:
            print(f"Error during audio recording: {e}")
            return None

    def detect_emotion(self, audio_file):
        """Detects emotion from an audio file using OpenSMILE."""
        print("Analyzing emotions using OpenSMILE...")
        try:
            features = self.smile.process_file(audio_file)
            return self.interpret_emotion_features(features)
        except Exception as e:
            print(f"Emotion detection error: {e}")
            return self.default_emotion_analysis()

    def interpret_emotion_features(self, features):
        """Interprets extracted emotion features."""
        try:
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
        """Fallback emotion analysis result."""
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
        """Converts speech from an audio file to text."""
        print("Converting speech to text...")
        try:
            with sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
            text = self.recognizer.recognize_google(audio)
            print(f"Transcription: {text}")
            return text
        except sr.UnknownValueError:
            print("Speech was unintelligible.")
            return "Speech was unintelligible."
        except sr.RequestError as e:
            print(f"Speech recognition API error: {e}")
            return "Speech recognition API error."

    def text_to_speech(self, text, output_file='response.mp3'):
        """Converts text to speech and saves it to an MP3 file."""
        print(f"Converting text to speech: {text}")
        try:
            tts = gTTS(text=text, lang='en')
            tts.save(output_file)
            print(f"Response audio generated: {output_file}")
        except Exception as e:
            print(f"Error generating speech: {e}")

# Main Execution
if __name__ == "__main__":
    try:
        print("Starting AI Friend Speech Processor...")
        processor = AIFriendSpeechProcessor()
        
        # Step 1: Record audio
        audio_file = processor.record_audio()
        if not audio_file:
            print("❌ Audio recording failed. Exiting.")
            exit()

        # Step 2: Emotion detection
        emotion_result = processor.detect_emotion(audio_file)
        print("\n🔍 Emotion Analysis Results:")
        for key, value in emotion_result.items():
            print(f"{key.replace('_', ' ').title()}: {value}")

        # Step 3: Speech-to-text
        transcribed_text = processor.speech_to_text(audio_file)
        print(f"\n💬 Transcribed Text: {transcribed_text}")

        # Step 4: Text-to-speech
        processor.text_to_speech("Thank you! I have processed your audio.")
        print("\n✅ Processing completed successfully!")

    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
