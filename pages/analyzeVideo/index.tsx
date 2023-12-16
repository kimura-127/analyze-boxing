import Form from "../components/Form"
import { mobileNetModelLoad } from "@/utils/mobileNetModelLoad";
import { moveNetModelLoad } from "@/utils/moveNetModelLoad";
import { blazePoseModelLoad } from "@/utils/blazePoseModelLoad";
import { useEffect, useRef, useState } from "react";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-core';
import { useRecoilState } from "recoil";
import { videoSrcState } from "@/atoms/videoSrcState";
import { croppedImage } from "@/utils/croppedImage";
import { drawCanvas } from "@/utils/drawCanvas";
import { drawSkeleton } from "@/utils/drawSkeleton";
import { myselfState } from "@/atoms/myselfState";
import { opponentState } from "@/atoms/opponentState";
import ExampleForm from "../components/ExampleForm";
import { Tensor3D } from '@tensorflow/tfjs-core';
import { drawExample } from "@/utils/drawExample";




export default function analyzeVideo() {

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [videoSrc, _] = useRecoilState(videoSrcState)
    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const canvasRef3 = useRef<HTMLCanvasElement>(null);
    const canvasRef4 = useRef<HTMLCanvasElement>(null);
    const [myself, setMyself] = useRecoilState(myselfState)
    const [opponent, setOpponent] = useRecoilState(opponentState)
    // let mobileNetModel: mobilenet.MobileNet
    let moveNetModel: poseDetection.PoseDetector
    // let blazePoseModel
    let ctx: any
    let example1Ctx: any
    let example2Ctx: any
    let handlePlayBoolean = false


    useEffect(() => {
        const videoElement = videoRef.current
        const canvasElement = canvasRef.current


        if (videoElement && canvasElement) {
            ctx = canvasElement.getContext('2d')
            videoElement.width = videoElement.videoWidth;
            videoElement.height = videoElement.videoHeight;
            videoElement.addEventListener('play', handlePlay)
        }

    }, [])

    const handlePlay = () => {
        const videoElement = videoRef.current
        const canvasElement = canvasRef.current
        const example1CanvasElement = canvasRef1.current
        const example2CanvasElement = canvasRef2.current
        example1Ctx = example1CanvasElement?.getContext('2d')
        example2Ctx = example2CanvasElement?.getContext('2d')


        if (!handlePlayBoolean && moveNetModel && videoElement) {
            const showExample = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                console.log(poses)
                drawExample(videoElement, poses[0], example1Ctx)
                drawExample(videoElement, poses[1], example2Ctx)
            }
            showExample()
            videoElement?.pause()
            handlePlayBoolean = true
        } else if (moveNetModel && videoElement) {
            const animate = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                const person_1 = await poses[0]
                const person_2 = await poses[1]
                const person_3 = await poses[2]
                console.log(poses)
                canvasElement && ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
                drawSkeleton(ctx, videoElement, person_1)
                drawSkeleton(ctx, videoElement, person_2)
                drawSkeleton(ctx, videoElement, person_3)
                videoElement?.paused || requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate)
        }

    };


    const handleModelLoad = () => {
        const modelLoad = async () => {
            console.log("モデルロード開始")
            await tf.ready()
            // mobileNetModel = await mobileNetModelLoad()
            moveNetModel = await moveNetModelLoad()
            // blazePoseModel = await blazePoseModelLoad()
            console.log("モデルロード終了")
        }
        modelLoad()
    }

    const handleBoolean = () => {
        handlePlayBoolean = false
    }

    return (
        <>
            <video
                ref={videoRef}
                style={{ height: '400px', width: '700px' }}
                height="400px"
                width="700px"
                controls
                playsInline
                src={videoSrc}
                preload="metadata"
            />
            <canvas
                ref={canvasRef}
                width="700px"
                height="400px"
                style={{ position: 'fixed', top: '0', left: '0', height: '400px', width: '700px', pointerEvents: 'none' }}
            />
            <canvas ref={canvasRef1} style={{ width: "100px", height: "240px" }} />
            <canvas ref={canvasRef2} style={{ width: "100px", height: "240px" }} />
            {/* <canvas ref={canvasRef3} style={{ width: "100px", height: "100px" }} /> */}
            {/* <canvas ref={canvasRef4} style={{ width: "100px", height: "100px" }} /> */}
            <ExampleForm />
            <Form />
            <button onClick={handleModelLoad}>分析モデルをロードする</button>
            <button onClick={handleBoolean}>真偽値をリセット</button>
        </>
    )
}