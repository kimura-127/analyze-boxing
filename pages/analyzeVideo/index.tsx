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

        if (!handlePlayBoolean && moveNetModel && videoElement) {
            const showExample = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                console.log(poses)
            }
            showExample()
            videoElement?.pause()
            handlePlayBoolean = true
        } else if (moveNetModel && videoElement) {
            const animate = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                console.log(poses)
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
            <canvas ref={canvasRef1} style={{ width: "100px", height: "100px" }} />
            <canvas ref={canvasRef2} style={{ width: "100px", height: "100px" }} />
            <canvas ref={canvasRef3} style={{ width: "100px", height: "100px" }} />
            <canvas ref={canvasRef4} style={{ width: "100px", height: "100px" }} />
            <ExampleForm />
            <Form />
            <button onClick={handleModelLoad}>分析モデルをロードする</button>
        </>
    )
}