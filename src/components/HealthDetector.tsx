"use client";

import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface HealthDetectorProps {
  onScanComplete: (result: { grade: string; disease: string; confidence: number }) => void;
}

export function HealthDetector({ onScanComplete }: HealthDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load model on mount
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load model:", err);
        setError("AI initialization failed. Check connection.");
      }
    }
    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied.");
    }
  };

  const analyzeImage = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const predictions = await model.classify(canvas);
        
        // Mocking disease detection logic based on ImageNet results for demo
        // In a real app, you'd use a fine-tuned model for plant diseases
        const topResult = predictions[0];
        const confidence = topResult.probability;
        
        let grade = "A";
        let disease = "Healthy";

        if (confidence < 0.6) {
          grade = "C";
          disease = "Possible Spotting (Minor)";
        } else if (confidence < 0.8) {
          grade = "B";
          disease = "Healthy (Wait-and-watch)";
        }

        onScanComplete({ grade, disease, confidence: Math.round(confidence * 100) });
        
        // Stop camera
        const tracks = (video.srcObject as MediaStream)?.getTracks();
        tracks?.forEach(track => track.stop());
        setIsCameraActive(false);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("AI analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative aspect-square w-full bg-muted rounded-3xl overflow-hidden border-2 border-primary/10">
        {!isCameraActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-serif text-primary mb-2">Crop Health Scan</h3>
            <p className="text-sm text-foreground/40 mb-8">Align your crop in the center. Our AI detects disease and calculates Grade (A/B/C) automatically.</p>
            <Button 
              onClick={startCamera} 
              disabled={!model}
              className="rounded-full bg-primary px-8"
            >
              {model ? "Open Camera" : "Initializing AI..."}
            </Button>
            {error && <p className="mt-4 text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="h-full w-full object-cover"
            />
            {/* Viewfinder overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-secondary/50 rounded-xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary translate-x-1 translate-y-1" />
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8 gap-4">
              <Button 
                onClick={analyzeImage} 
                className="flex-1 rounded-full h-14 bg-secondary text-primary font-bold shadow-xl active:scale-95 transition-transform"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Capture & Scan"}
              </Button>
              <button 
                onClick={() => setIsCameraActive(false)}
                className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
