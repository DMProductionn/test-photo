'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Image src="/test.jpg" alt="photo" width={500} height={500} />
      <button onClick={() => router.push('/camera')}>Открыть</button>
    </div>
  );
}
