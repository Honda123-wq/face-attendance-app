// src/components/RegisterFace.jsx
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export default function RegisterFace({ onRegister }) {
  const videoRef = useRef();
  const [name, setName] = useState("");
  const [descriptor, setDescriptor] = useState(null);

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]).then(startVideo);
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const capture = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      setDescriptor(detection.descriptor);
      alert("顔データを取得しました！");
    } else {
      alert("顔が検出できませんでした。");
    }
  };

  const handleSave = () => {
    if (name && descriptor) {
      const savedData = JSON.parse(
        localStorage.getItem("registeredFaces") || "[]"
      );
      savedData.push({ name, descriptor: Array.from(descriptor) });
      localStorage.setItem("registeredFaces", JSON.stringify(savedData));
      alert("登録完了！");
      if (onRegister) onRegister();
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">顔登録</h2>
      <video ref={videoRef} autoPlay muted className="w-64 h-48 border mb-2" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前または社員番号"
        className="mb-2 p-1 border"
      />
      <div className="space-x-2">
        <button
          onClick={capture}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          顔をキャプチャ
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          保存
        </button>
      </div>
    </div>
  );
}
