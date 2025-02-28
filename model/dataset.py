import os
import librosa
import numpy as np
import pandas as pd

# Define emotions mapping (RAVDESS dataset labels)
EMOTION_MAP = {
    "01": "neutral", "02": "calm", "03": "happy", "04": "sad",
    "05": "angry", "06": "fearful", "07": "disgust", "08": "surprised"
}

# Extract MFCC features
def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=16000)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    return np.mean(mfcc.T, axis=0)

# Load dataset
data = []
dataset_path = "dataset/"
for file in os.listdir(dataset_path):
    if file.endswith(".wav"):
        emotion_label = EMOTION_MAP[file.split("-")[2]]  # Extract emotion from filename
        features = extract_features(os.path.join(dataset_path, file))
        data.append([features, emotion_label])

df = pd.DataFrame(data, columns=["features", "emotion"])
df["features"] = df["features"].apply(lambda x: np.array(x))
print(df.head())
