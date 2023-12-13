import Link from 'next/link';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';



export default function Home() {


  const handleAnalyze = async () => {
    // await tf.ready()
  }

  return (
    <>
      <h1>トップページ</h1>
      <Link href="./analyzeVideo">
        <button onClick={handleAnalyze}>転移ボタン</button>
      </Link>
    </>
  )
}