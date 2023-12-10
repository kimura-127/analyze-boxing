import Link from 'next/link';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';



export default function Home() {


  const handleTfReady = async () => {
    await tf.ready()
  }

  return (
    <>
      <h1>トップページ</h1>
      <Link href="./analyzeVideo">
        <button onClick={handleTfReady}>転移ボタン</button>
      </Link>
    </>
  )
}