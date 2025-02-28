from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from dataset import df
import numpy as np

# Encode labels
label_encoder = LabelEncoder()
df["emotion"] = label_encoder.fit_transform(df["emotion"])

# Prepare feature and target arrays
X = np.array(df["features"].tolist())
y = np.array(df["emotion"].tolist())

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Reshape for CNN-LSTM input
X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
