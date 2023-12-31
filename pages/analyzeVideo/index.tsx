import Form from "../components/Form"
import { mobileNetModelLoad } from "@/utils/mobileNetModelLoad";
import { moveNetModelLoad } from "@/utils/moveNetModelLoad";
import { blazePoseModelLoad } from "@/utils/blazePoseModelLoad";
import { useEffect, useRef, useState } from "react";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { useRecoilState } from "recoil";
import { videoSrcState } from "@/atoms/videoSrcState";
import { drawSkeleton } from "@/utils/drawSkeleton";
import { myselfState } from "@/atoms/myselfState";
import { opponentState } from "@/atoms/opponentState";
import ExampleForm from "../components/ExampleForm";
import { drawExample } from "@/utils/drawExample";
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { croppedImage } from "@/utils/croppedImage";
import { Tensor3D } from '@tensorflow/tfjs-core';




export default function analyzeVideo() {

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [videoSrc, _] = useRecoilState(videoSrcState)
    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const canvasRef3 = useRef<HTMLCanvasElement>(null);
    const canvasRef4 = useRef<HTMLCanvasElement>(null);
    const [handlePlayBoolean, setHnadlePlayBoolean] = useState(false)
    const [myself, setMyself] = useRecoilState(myselfState)
    const [opponent, setOpponent] = useRecoilState(opponentState)
    const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null)
    const [moveNetModel, setMoveNetModel] = useState<poseDetection.PoseDetector | null>(null)
    const [blazePoseModel, setBlazePoseModel] = useState<poseDetection.PoseDetector>()
    const classifier = knnClassifier.create();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [example1Ctx, setExample1Ctx] = useState<CanvasRenderingContext2D | null | undefined>()
    const [example2Ctx, setExample2Ctx] = useState<CanvasRenderingContext2D | null | undefined>()






    const handlePlay = () => {
        const videoElement = videoRef.current
        const canvasElement = canvasRef.current
        const example1CanvasElement = canvasRef1.current
        const example2CanvasElement = canvasRef2.current
        const example1Ctx = example1CanvasElement?.getContext('2d')
        const example2Ctx = example2CanvasElement?.getContext('2d')

        setExample1Ctx(example1Ctx)
        setExample2Ctx(example2Ctx)


        if (!handlePlayBoolean && moveNetModel && videoElement) {
            const showExample = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                console.log(poses)
                drawExample(videoElement, poses[0], example1Ctx)
                drawExample(videoElement, poses[1], example2Ctx)
            }
            showExample()
            videoElement?.pause()
            setHnadlePlayBoolean(true)
        } else if (moveNetModel && videoElement) {
            const animate = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                const croppedImageData = await croppedImage(videoElement, poses)
                const person_1 = await poses[0]
                const person_2 = await poses[1]
                canvasElement && ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
                drawSkeleton(ctx, videoElement, person_1)
                drawSkeleton(ctx, videoElement, person_2)
                drawExample(videoElement, poses[0], example1Ctx)
                drawExample(videoElement, poses[1], example2Ctx)
                if (mobileNetModel) {
                    const activation = (mobileNetModel as any).infer(croppedImageData[0], 'conv_preds')
                    const resultTL: any = await classifier.predictClass(activation)
                    // console.log("FPS")
                }
                if (blazePoseModel) {
                    const squeezedImage = tf.squeeze(croppedImageData[0] as any, [0])
                    const result = await blazePoseModel.estimatePoses(squeezedImage as any)
                    console.log(result)
                }
                videoElement?.paused || requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate)
        }

    };


    useEffect(() => {

        switch (myself) {
            case "select1":
                console.log("select1")
                break;
            case "select2":
                console.log("select2")
                if (mobileNetModel) {
                    const activation = (mobileNetModel as any).infer(canvasRef2.current, 'conv_preds')
                    console.log(activation)
                    classifier.addExample(activation, 2)
                    classifier.addExample(activation, 2)
                    classifier.addExample(activation, 2)
                }
                break;
            // case "select3":
            //     console.log("select3")
            //     break;
            // case "select4":
            //     console.log("select4")
            //     break;
        }
        switch (opponent) {
            case "select1":
                console.log("select1")
                if (mobileNetModel) {
                    const activation = (mobileNetModel as any).infer(canvasRef1.current, 'conv_preds')
                    console.log(activation)
                    classifier.addExample(activation, 1)
                    classifier.addExample(activation, 1)
                    classifier.addExample(activation, 1)
                }
                break;
            case "select2":
                console.log("select2")
                break;
            // case "select3":
            //     console.log("select3")
            //     break;
            // case "select4":
            //     console.log("select4")
            //     break;
        }


        // if (canvasRef.current) {
        //     canvasRef.current.style.pointerEvents = 'auto';
        // }
    }, [myself, opponent])


    const handleModelLoad = () => {
        const modelLoad = async () => {
            console.log("モデルロード開始")
            await tf.ready()
            const mobileNetModel = await mobilenet.load()
            setMobileNetModel(mobileNetModel)
            const moveNetModel = await moveNetModelLoad()
            setMoveNetModel(moveNetModel)
            const blazePoseModel = await blazePoseModelLoad()
            setBlazePoseModel(blazePoseModel)

            const inputSize = 100;  // 入力シーケンスの長さ
            const outputSize = 10;  // 出力の次元数
            const lstmUnits = 50;   // LSTMユニットの数
            const lstmModel = createLSTMModel(inputSize, outputSize, lstmUnits);

            const learningRate = 0.001;
            const optimizer = tf.train.adam(learningRate);
            lstmModel.compile({
                optimizer: optimizer,
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            console.log("モデルロード終了")
        }
        const videoElement = videoRef.current
        const canvasElement = canvasRef.current

        modelLoad()

        if (videoElement && canvasElement) {
            const ctx = canvasElement.getContext('2d')
            setCtx(ctx)
            videoElement.width = videoElement.videoWidth;
            videoElement.height = videoElement.videoHeight;
        }
    }

    const handleBoolean = () => {

        const bunnseki = async () => {
            if (mobileNetModel) {
                const activation = (mobileNetModel as any).infer(canvasRef2.current, 'conv_preds')
                const resultTL: any = await classifier.predictClass(activation)
                console.log(resultTL)
            }
        }
        bunnseki()
    }

    const handleExample = () => {
        console.log(moveNetModel)
    }

    const createLSTMModel = (inputSize: any, outputSize: any, lstmUnits: any) => {
        const model = tf.sequential();

        // LSTMレイヤーの追加
        model.add(tf.layers.lstm({
            units: lstmUnits,
            inputShape: [inputSize, outputSize]
        }));

        // 出力レイヤーの追加
        model.add(tf.layers.dense({ units: outputSize, activation: 'softmax' }));

        return model;
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
                onPlay={handlePlay}
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
            <button onClick={handleExample}>学習ボタン~~~</button>
            <button onClick={handleBoolean}>解析ボタン~~~~</button>
        </>
    )
}