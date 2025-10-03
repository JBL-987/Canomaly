from services.scalper_detector import ScalperDetectorAPI
import pickle

# Load model dengan 14 features
api_detector = ScalperDetectorAPI()

with open("canomaly.pkl", "rb") as f:
    model_assets = pickle.load(f)

api_detector.model = model_assets['model']
api_detector.scaler = model_assets['scaler']
api_detector.feature_names = model_assets.get('feature_names', api_detector.feature_names)
api_detector.contamination = model_assets.get('contamination', 0.05)

print(f"Model loaded successfully!")
print(f"Features: {len(api_detector.feature_names)}")
print(f"Contamination: {api_detector.contamination}")