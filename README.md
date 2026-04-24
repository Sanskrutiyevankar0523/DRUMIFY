# Drumify 🥁

Drumify is an applied edge-AI computer vision web application that transforms a standard laptop webcam into a zero-latency, 3D interactive drum kit. 

Built as a proof-of-concept for real-time spatial computing without the need for VR headsets or specialized hardware.

## 🚀 Technical Architecture

* **Frontend Engine:** React 18 with Vite for lightning-fast HMR.
* **Computer Vision:** Google MediaPipe (`@mediapipe/tasks-vision`). Utilizes the `HandLandmarker` (21-point skeletal tracking) and `FaceLandmarker` (468-point mesh tracking) running entirely on edge-device CPU.
* **Audio Engine:** Native Web Audio API (`AudioContext`) to bypass standard DOM audio limitations, achieving zero-latency audio buffer playback upon collision detection.
* **3D Graphics:** React Three Fiber (`@react-three/fiber`) and Three.js for rendering the holographic UI, dynamic lighting, and spatial geometry.
* **Styling:** Tailwind CSS for responsive, glassmorphism UI overlays.

## 🧠 Key Features
* **Zero-Latency Collision Math:** Custom bounding-box collision detection between 2D AI hand landmarks and 3D spatial coordinates.
* **Hardware Optimization:** Forced 720p @ 60FPS camera constraint to drastically reduce AI pixel-processing load, resulting in instantaneous gesture recognition.
* **Dynamic Styling:** Real-time face tracking to render personalized 3D augmented reality props (Cyber-Visor).

## 🔒 License & Copyright

**Copyright © 2026. All Rights Reserved.**

This repository and its contents are strictly private and proprietary. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited. This is not open-source software.
<img width="1919" height="960" alt="Screenshot 2026-04-24 161902" src="https://github.com/user-attachments/assets/aa628e74-450a-4697-8758-a2677153a26f" />
<img width="1919" height="928" alt="Screenshot 2026-04-24 162133" src="https://github.com/user-attachments/assets/f2438c48-4b68-4fd9-87d1-1831f3b372a8" />
<img width="1916" height="974" alt="Screenshot 2026-04-24 161924" src="https://github.com/user-attachments/assets/e2cb8f4f-7a68-4f0e-a9e1-6c53d76f4509" />

