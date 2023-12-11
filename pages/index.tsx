import Link from 'next/link';
import '@tensorflow/tfjs-backend-webgl';



export default function Home() {



  return (
    <>
      <h1>トップページ</h1>
      <Link href="./analyzeVideo">
        <button>転移ボタン</button>
      </Link>
    </>
  )
}