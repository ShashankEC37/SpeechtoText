import React, { useRef, useState } from 'react';

const Example = () => {
  const mediaRecorderRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState(null);

  const startRecording = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      mediaRecorderRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const blob = new Blob([transcript], { type: 'audio/wav' });
        setFile(blob);
      };

      recognition.onend = () => {
        setIsRecording(false);
        // Automatically fetch the audio file when recording ends
        fetchAudioFile();
      };

      recognition.start();
      setIsRecording(true);
    } else {
      console.error('SpeechRecognition is not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const fetchAudioFile = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${'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'}`,
        },
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: '', padding: '20px', borderRadius: '8px,' }}>
      Whisper
      <button
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        onTouchCancel={stopRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {response && <div>{JSON.stringify(response, null, 2)}</div>}
    </div>
  );
};

export default Example;
