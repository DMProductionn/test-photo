'use client';
import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Camera() {
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleTakePhoto = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'photo.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#111',
          position: 'relative',
          paddingBottom: 90,
        }}>
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 2,
            gap: 20,
          }}>
          <button
            onClick={() => setScale((s) => Math.max(0.2, s - 0.1))}
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
            onClick={() => setScale((s) => s + 0.1)}
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
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            maxHeight: 'calc(100vh - 120px)',
          }}>
          <img
            ref={imgRef}
            src="/test.jpg"
            alt="photo"
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.2s',
              maxWidth: '90vw',
              maxHeight: '60vh',
              display: 'block',
              margin: '0 auto',
              borderRadius: 16,
              boxShadow: '0 4px 24px #000a',
              background: '#222',
            }}
          />
        </div>
        <button
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
          }}
          onClick={handleTakePhoto}>
          Сделать фото
        </button>
      </div>
    </>
  );
}
