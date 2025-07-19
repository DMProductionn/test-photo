'use client';
import { useEffect, useRef, useState } from 'react';

function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export default function Camera() {
  const [mobile, setMobile] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  useEffect(() => {
    if (!mobile) return;
    let stream: MediaStream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setError('Не удалось получить доступ к камере');
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mobile]);

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !overlayRef.current) return;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Установим размер canvas как у видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // Нарисуем кадр с камеры
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Наложим PNG по центру
    const overlayWidth = canvas.width * 0.7;
    const overlayHeight = overlay.height * (overlayWidth / overlay.width);
    ctx.drawImage(
      overlay,
      (canvas.width - overlayWidth) / 2,
      (canvas.height - overlayHeight) / 2,
      overlayWidth,
      overlayHeight,
    );
    setPhotoUrl(canvas.toDataURL('image/png'));
  };

  if (!mobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#111',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          textAlign: 'center',
        }}>
        Доступно только на мобильных устройствах
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}>
      {error && (
        <div
          style={{
            color: '#fff',
            background: '#a00',
            padding: 16,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 10,
          }}>
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* Overlay PNG по центру */}
      <img
        ref={overlayRef}
        src="/test.jpg"
        alt="overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '70vw',
          maxWidth: 400,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      {/* Кнопка сделать фото */}
      <button
        onClick={handleTakePhoto}
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100vw',
          height: 70,
          background: '#0af',
          color: '#fff',
          fontSize: 24,
          border: 'none',
          borderRadius: 0,
          boxShadow: '0 -2px 12px #0008',
          zIndex: 10,
          fontWeight: 600,
          letterSpacing: 1,
        }}>
        Сделать фото
      </button>
      {/* Canvas для снимка (скрыт) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* Показать фото после снимка */}
      {photoUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setPhotoUrl(null)}>
          <img
            src={photoUrl}
            alt="photo"
            style={{
              maxWidth: '90vw',
              maxHeight: '70vh',
              borderRadius: 16,
              boxShadow: '0 4px 24px #000a',
            }}
          />
          <button
            style={{
              marginTop: 24,
              fontSize: 22,
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              background: '#0af',
              color: '#fff',
              fontWeight: 600,
            }}
            onClick={() => setPhotoUrl(null)}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}
