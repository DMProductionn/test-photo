'use client';
import { useEffect, useRef, useState } from 'react';

function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export default function Camera() {
  const [mobile, setMobile] = useState(false);
  const [error, setError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  const startCamera = async () => {
    setError('');
    setPermissionDenied(false);
    let stream: MediaStream | undefined;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e: any) {
      if (e && (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError')) {
        setPermissionDenied(true);
        setError('Доступ к камере запрещён.');
      } else {
        setError('Не удалось получить доступ к камере');
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  };

  useEffect(() => {
    if (!mobile) return;
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Наложим PNG по центру с учетом масштаба
    const baseOverlayWidth = canvas.width * 0.7;
    const overlayWidth = baseOverlayWidth * scale;
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

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#111',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          textAlign: 'center',
          padding: 24,
        }}>
        <div style={{ marginBottom: 24 }}>{error}</div>
        {permissionDenied ? (
          <>
            <div style={{ marginBottom: 24 }}>
              Вы запретили доступ к камере.
              <br />
              Чтобы использовать функцию, разрешите доступ к камере в настройках браузера или
              устройства.
              <br />
              <br />
              <b>Инструкция:</b>
              <br />
              1. Откройте настройки браузера (или значок замка в адресной строке).
              <br />
              2. Найдите раздел "Разрешения" или "Камера".
              <br />
              3. Разрешите доступ к камере для этого сайта.
              <br />
              4. Перезагрузите страницу.
            </div>
            <button
              style={{
                fontSize: 20,
                padding: '12px 32px',
                borderRadius: 8,
                border: 'none',
                background: '#0af',
                color: '#fff',
                fontWeight: 600,
              }}
              onClick={startCamera}>
              Попробовать снова
            </button>
          </>
        ) : (
          <button
            style={{
              fontSize: 20,
              padding: '12px 32px',
              borderRadius: 8,
              border: 'none',
              background: '#0af',
              color: '#fff',
              fontWeight: 600,
            }}
            onClick={startCamera}>
            Попробовать снова
          </button>
        )}
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
      {/* Overlay PNG по центру с масштабированием */}
      <img
        ref={overlayRef}
        src="/test.jpg"
        alt="overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${70 * scale}vw`,
          maxWidth: 400 * scale,
          transform: `translate(-50%, -50%) scale(${scale})`,
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'transform 0.2s, width 0.2s',
        }}
      />
      {/* Кнопки масштабирования */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
          gap: 20,
        }}>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          style={{
            fontSize: 32,
            width: 56,
            height: 56,
            borderRadius: 28,
            border: 'none',
            background: '#222',
            color: '#fff',
            marginRight: 10,
            boxShadow: '0 2px 8px #0006',
          }}>
          -
        </button>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          style={{
            fontSize: 32,
            width: 56,
            height: 56,
            borderRadius: 28,
            border: 'none',
            background: '#222',
            color: '#fff',
            boxShadow: '0 2px 8px #0006',
          }}>
          +
        </button>
      </div>
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
