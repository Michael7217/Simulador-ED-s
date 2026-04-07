import { useState, useRef } from 'react';
import { Stage } from 'react-konva';

export default function ZoomableStage({ width, height, children }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef(null);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;
    const clampedScale = Math.max(0.7, Math.min(3, newScale));

    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  const handleDragEnd = (e) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* Controles */}
      <div className='absolute bottom-3 right-3 z-20 flex gap-2 pointer-events-auto'>
        <button
          onClick={() => setScale(s => Math.min(3, s * 1.2))}
          className='bg-azul text-amarelo border-2 border-amarelo rounded-lg px-3 py-1 text-xs font-bold hover:bg-amarelo hover:text-azul transition-colors'
          title='Zoom In'
        >
          +
        </button>
        <button
          onClick={() => setScale(s => Math.max(0.7, s * 0.8))}
          className='bg-azul text-amarelo border-2 border-amarelo rounded-lg px-3 py-1 text-xs font-bold hover:bg-amarelo hover:text-azul transition-colors'
          title='Zoom Out'
        >
          −
        </button>
        <button
          onClick={handleReset}
          className='bg-azul text-amarelo border-2 border-amarelo rounded-lg px-3 py-1 text-xs font-bold hover:bg-amarelo hover:text-azul transition-colors'
          title='Reset'
        >
          ⟲
        </button>
      </div>

      {/* Info de zoom */}
      <div className='absolute bottom-3 left-3 z-20 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded'>
        Zoom: {Math.round(scale * 100)}% | Arraste para mover
      </div>

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: '#ffffff' }}
      >
        {children}
      </Stage>
    </div>
  );
}
