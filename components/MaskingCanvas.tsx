import React, { useRef, useEffect, useState, useCallback } from 'react';

interface MaskingCanvasProps {
  imageUrl: string;
  onComplete: (dataUrl: string) => void;
  onCancel: () => void;
}

const BrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const EraserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3.09 3.09a5 5 0 00-6.82 0L5 5m9 14l-3.09-3.09a5 5 0 010-6.82L14 9" />
    </svg>
);

export const MaskingCanvas: React.FC<MaskingCanvasProps> = ({ imageUrl, onComplete, onCancel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [mode, setMode] = useState<'brush' | 'eraser'>('brush');
  
  const drawImageToCanvas = useCallback(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      const bgCanvas = bgCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      const container = containerRef.current;
      if (!bgCanvas || !drawingCanvas || !container) return;
      
      const { clientWidth: containerWidth, clientHeight: containerHeight } = container;
      const imageAspectRatio = image.width / image.height;
      const containerAspectRatio = containerWidth / containerHeight;
      
      let canvasWidth, canvasHeight;
      if (imageAspectRatio > containerAspectRatio) {
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imageAspectRatio;
      } else {
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * imageAspectRatio;
      }

      bgCanvas.width = canvasWidth;
      bgCanvas.height = canvasHeight;
      drawingCanvas.width = canvasWidth;
      drawingCanvas.height = canvasHeight;

      const bgCtx = bgCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    drawImageToCanvas();
    window.addEventListener('resize', drawImageToCanvas);
    return () => {
      window.removeEventListener('resize', drawImageToCanvas);
    };
  }, [drawImageToCanvas]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e); // Draw a dot on click
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if(ctx) ctx.beginPath(); // Reset the path
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getMousePos(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (mode === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Semi-transparent red
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    } else { // Eraser
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const handleComplete = () => {
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      onComplete(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in">
      <div 
        ref={containerRef}
        className="relative w-full h-full max-w-[90vw] max-h-[80vh] flex items-center justify-center"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
      >
        <canvas ref={bgCanvasRef} className="absolute"></canvas>
        <canvas ref={drawingCanvasRef} className="absolute cursor-crosshair"></canvas>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-base-200 p-3 rounded-lg shadow-2xl flex items-center gap-6">
        <div className="flex items-center gap-3">
            <label htmlFor="brushSize" className="text-sm font-medium text-text-secondary">画笔大小</label>
            <input
                id="brushSize"
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-32"
            />
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setMode('brush')}
                className={`p-2 rounded-md transition-colors ${mode === 'brush' ? 'bg-brand-primary text-black' : 'bg-base-300 text-text-secondary hover:bg-base-100'}`}
                title="绘制模式"
                aria-label="Activate brush mode"
            >
                <BrushIcon />
            </button>
            <button 
                onClick={() => setMode('eraser')}
                className={`p-2 rounded-md transition-colors ${mode === 'eraser' ? 'bg-brand-primary text-black' : 'bg-base-300 text-text-secondary hover:bg-base-100'}`}
                title="橡皮擦模式"
                aria-label="Activate eraser mode"
            >
                <EraserIcon />
            </button>
        </div>
        <div className="flex items-center gap-3">
             <button
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium rounded-md text-text-primary bg-base-300 hover:bg-base-100 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2 text-sm font-medium rounded-md text-black bg-green-500 hover:bg-green-600 transition-colors"
            >
              完成
            </button>
        </div>
      </div>
    </div>
  );
};
