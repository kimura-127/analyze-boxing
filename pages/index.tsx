import Link from 'next/link';



export default function Home() {
  return (
    <>
      <h1>ヘッダー</h1>
      <Link href="./analyzeVideo">
        <button>転移ボタン</button>
      </Link>
    </>
  )
}