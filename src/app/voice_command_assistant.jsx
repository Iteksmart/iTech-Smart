// components/VoiceCommandAssistant.jsx
"use client";
import React, { useState } from "react";

export default function VoiceCommandAssistant() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      setListening(false);
    };

    recognition.onerror = (event) => {
      setError(`Voice error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    setTranscript("");
    setListening(true);
    recognition.start();
  };

  return (
    <div className="p-6 border rounded bg-white shadow space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Voice Command Assistant</h2>
      <p className="text-sm text-gray-600">Describe your issue aloud and let AI suggest fixes.</p>

      <button
        onClick={handleToggleListening}
        className={`px-4 py-2 rounded text-white ${listening ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {listening ? "Listening..." : "Start Voice Input"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {transcript && (
        <div className="p-4 bg-gray-50 border rounded text-sm text-gray-800">
          <strong>Recognized:</strong> {transcript}
        </div>
      )}
    </div>
  );
}
