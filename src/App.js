import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        webcamRef.current.srcObject = stream;
      })
  }, [webcamRef.current]);

  useEffect(() => {
    if (webcamRef.current && canvasRef.current) {
      const draw = () => {
        const cWidth = canvasRef.current.width;
        const cHeight = canvasRef.current.height;
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, 1920, 1080);
        ctx.drawImage(
          webcamRef.current.video,
          0,
          0,
          cWidth,
          cHeight
        );
        drawOtherStuff(ctx, cWidth, cHeight);
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
      // ctx.drawImage(webcamRef.current.getScreenshot(), 0, 0);
    }
  }, [webcamRef.current, canvasRef.current]);

  const drawOtherStuff = useCallback((ctx, w, h) => {
    const randomX = Math.random() * w;
    const randomY = Math.random() * h;
    ctx.fillStyle = "blanchedalmond";
    ctx.fillRect(randomX, randomY, 100, 100);
  }, []);

  // All of the above is basically my own version of learning from your code.
  // Thanks team Coconut!
  useEffect(function startRecording() {
    if (recording) {
      const canvasStream = canvasRef.current.captureStream(30);
      const recorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm"
      });
      recorder.start();
      const chunks = [];
      recorder.addEventListener('dataavailable', ({ data }) => {
        chunks.push(data)
      });
      setTimeout(() => {
        recorder.stop();
        setTimeout(() => {
          const blob = new Blob(chunks, {
            type: "video/webm",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = url;
          a.download = "youandsquares.webm";
          a.click();
          window.URL.revokeObjectURL(url);
        }, 100);
        // a.remove();
      }, 5000);
    }
  }, [recording]);

  return (
    <div className="App">
      <div>
        <canvas width={1920} height={1080} ref={canvasRef} style={{ width: "1920px", height: "1080px", zoom: 0.5 }} />
        <Webcam ref={webcamRef} style={{ width: "0px" }} videoConstraints={{ width: 1920, height: 1080 }} />
        <button onClick={() => setRecording(true)}>Record and Download 5 seconds</button>
      </div>
    </div>
  );
}
