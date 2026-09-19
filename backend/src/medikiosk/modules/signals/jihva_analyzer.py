"""Jihva tongue image analyzer — supporting signal, not diagnostic."""


def analyze_jihva(image: bytes) -> dict:
    if not image:
        raise ValueError("A tongue image is required")
    try:
        import cv2
        import numpy as np

        decoded = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
        if decoded is None:
            raise ValueError("The image could not be decoded")
        lab = cv2.cvtColor(decoded, cv2.COLOR_BGR2LAB)
        lightness, channel_a, channel_b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = cv2.cvtColor(
            cv2.merge((clahe.apply(lightness), channel_a, channel_b)),
            cv2.COLOR_LAB2BGR,
        )
        hsv = cv2.cvtColor(enhanced, cv2.COLOR_BGR2HSV)
        height, width = enhanced.shape[:2]
        crop = hsv[int(height * 0.3) : int(height * 0.7), int(width * 0.3) : int(width * 0.7)]
        mean_h, mean_s, mean_v = (float(v) for v in np.mean(crop, axis=(0, 1)))
        if 15 < mean_h < 35 and mean_s > 60:
            coating, signal = "yellowish", "Pitta"
        elif mean_s < 40 and mean_v > 160:
            coating, signal = "thick white", "Kapha"
        else:
            coating, signal = "pale or dark", "Vata"
        edges = cv2.Canny(cv2.cvtColor(enhanced, cv2.COLOR_BGR2GRAY), 50, 150)
        scalloping = "present" if float(np.mean(edges > 0)) > 0.05 else "absent"
        return {
            "signal_id": f"jihva-{len(image)}",
            "coating": coating,
            "texture": "contrast-enhanced",
            "moisture": "indeterminate",
            "prakriti_signal": signal,
            "scalloping_edges": scalloping,
            "confidence_score": 0.55,
            "label": "supporting signal — clinician review required",
            "diagnosis": None,
        }
    except ImportError:
        return {
            "signal_id": f"jihva-{len(image)}",
            "coating": "indeterminate",
            "texture": "indeterminate",
            "moisture": "indeterminate",
            "label": "supporting signal — clinician review required",
            "diagnosis": None,
        }
