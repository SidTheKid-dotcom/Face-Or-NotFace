import sys
import cv2
import os

# Get the current working directory
current_directory = os.getcwd()
print(f"Current directory: {current_directory}")

# Specify the relative path to the image
image_path = os.path.join(current_directory, 'frame.jpg')

# Load the image
image = cv2.imread(image_path)

# Check if the image is loaded correctly
if image is None:
    print("Failed to load image. Check the file path and integrity.")
else:
    # Proceed with face detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load the pre-trained Haar Cascade classifier for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Check if faces are detected
    if len(faces) > 0:
        print("Face")
    else:
        print("Not face")



sys.stdout.flush()  # Ensure the output is immediately flushed