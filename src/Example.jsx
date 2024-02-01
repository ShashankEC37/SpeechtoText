import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Example = () => {
    const [transcription, setTranscription] = useState('');
    let recognition;
  
    const startRecording = () => {
      recognition = new window.webkitSpeechRecognition(); // For WebKit browsers (e.g., Chrome)
      recognition.onresult = handleSpeechResult;
      recognition.start();
    };
  
    const handleSpeechResult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscription(result);
    };
  
    const stopRecording = () => {
      if (recognition) {
        recognition.stop();
        sendToOpenAIWhisper(transcription);
      }
    };
  
    const sendToOpenAIWhisper = async (text) => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/whisper',
          {
            text: text,
          },
          {
            headers: {
              Authorization: 'Bearer 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',
            },
          }
        );
        console.log('OpenAI Whisper Response:', response.data);
        // Handle the response as needed
      } catch (error) {
        console.error('Error sending to OpenAI Whisper:', error);
        // Handle the error
      }
    };
  
    return (
      <div>
        <h1>Speech-to-Text</h1>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <p>{transcription}</p>
      </div>
    );
  };

export default Example;
