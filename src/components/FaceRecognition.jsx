import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition = ({ mode, onMatch }) => {
  const videoRef = useRef(null);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    };

    loadModels();
  }, []);

  const handleRegister = async () => {
    if (!nameInput.trim()) {
      alert("名前を入力してください！");
      return;
    }

    console.log("📸 顔検出中...");
    const detections = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5,
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert("顔が検出できませんでした");
      return;
    }

    const descriptor = Array.from(detections.descriptor);
    const newUser = {
      name: nameInput.trim(),
      id: `EMP${Date.now()}`,
      descriptor,
    };

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    alert("顔データを登録しました！");
    setNameInput("");
  };

  const handleRecognize = async () => {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (users.length === 0) return alert("登録された顔がありません");

    const detections = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5,
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert("顔が検出できませんでした");
      return;
    }

    const queryDescriptor = detections.descriptor;
    const labeledDescriptors = users.map(
      (user) =>
        new faceapi.LabeledFaceDescriptors(user.name, [
          new Float32Array(user.descriptor),
        ])
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const bestMatch = faceMatcher.findBestMatch(queryDescriptor);

    const matchedUser = users.find((user) => user.name === bestMatch.label);
    if (matchedUser) {
      onMatch({ name: matchedUser.name, id: matchedUser.id });
    } else {
      alert("一致する顔が見つかりませんでした");
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        className="border"
      />

      {mode === "登録" && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="名前を入力"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border px-2 py-1 mr-2"
          />
          <button onClick={handleRegister} className="btn">
            顔を登録
          </button>
        </div>
      )}

      {mode === "認証" && (
        <div className="mt-2">
          <button onClick={handleRecognize} className="btn">
            顔で認証
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
