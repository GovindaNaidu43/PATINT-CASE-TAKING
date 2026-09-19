# Pinned face model assets

Place the approved, locally reviewed `@vladmandic/face-api` model files in this directory before enabling biometric capture:

- `ssd_mobilenetv1_model-weights_manifest.json` and shard files
- `face_landmark_68_model-weights_manifest.json` and shard files
- `face_recognition_model-weights_manifest.json` and shard files

The browser loads only from `/models`; it does not fetch model weights from a CDN. Keep model versions pinned and review their license and provenance before committing the binary assets.
