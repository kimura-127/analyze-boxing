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
import { knnClassifierPredict } from "@/utils/knnClassifierPredict";
import { Tensor3D } from '@tensorflow/tfjs-core';
import { Tensor4D } from '@tensorflow/tfjs-core';
import { hitJudgmentState } from "@/atoms/hitJudgmentState";




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
    const [hitJudgment, setHitJudgment] = useRecoilState(hitJudgmentState)
    const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null)
    const [moveNetModel, setMoveNetModel] = useState<poseDetection.PoseDetector | null>(null)
    const [blazePoseModel, setBlazePoseModel] = useState<poseDetection.PoseDetector>()
    const classifier = knnClassifier.create();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [example1Ctx, setExample1Ctx] = useState<CanvasRenderingContext2D | null | undefined>()
    const [example2Ctx, setExample2Ctx] = useState<CanvasRenderingContext2D | null | undefined>()
    const [lstmModel, setLstmModel] = useState<tf.Sequential>()
    const [xTrain, setXTrain] = useState<tf.Tensor3D>()
    const [xPredict, setXPredict] = useState<tf.Tensor3D>()
    const [yTrain, setYTrain] = useState<tf.Tensor2D>()
    const [xTestPredict, setXTestPredict] = useState<tf.Tensor3D>()
    const boxerKeypoint: any = []



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


                if (poses.length > 0 && mobileNetModel && blazePoseModel) {

                    canvasElement && ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    drawSkeleton(ctx, videoElement, poses[0])
                    drawSkeleton(ctx, videoElement, poses[1])

                    const predictKeypoint = (personName: string) => {
                        croppedImageData.forEach((croppedImage: any) => {
                            knnClassifierPredict(mobileNetModel, croppedImage, classifier, blazePoseModel, personName).then((result) => {
                                result && result.length > 0 && boxerKeypoint.push(result)
                                if (boxerKeypoint.length > 50) {
                                    boxerKeypoint.shift()
                                }
                            })
                        });
                    }
                    switch (hitJudgment) {
                        case true:
                            predictKeypoint("opponent")
                            break;
                        case false:
                            predictKeypoint("myself")
                            break;
                    }
                    if (lstmModel && xPredict) {
                        const prediction: any = lstmModel.predict(xPredict);
                        prediction.array().then((array: any) => {
                            // console.log(array); // この配列には、予測された値が含まれます。
                        });
                    }
                }

                videoElement?.paused || requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
        }

    };



    useEffect(() => {

        switch (myself) {
            case "select1":
                console.log("select1")
                if (mobileNetModel) {
                    const activation = (mobileNetModel as any).infer(canvasRef1.current, 'conv_preds')
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                }
                break;
            case "select2":
                console.log("select2")
                if (mobileNetModel) {
                    const activation = (mobileNetModel as any).infer(canvasRef2.current, 'conv_preds')
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
                    classifier.addExample(activation, "myself")
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
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                }
                break;
            case "select2":
                console.log("select2")
                if (mobileNetModel) {
                    const activation = (mobileNetModel as any).infer(canvasRef2.current, 'conv_preds')
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                    classifier.addExample(activation, "opponent")
                }
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
    }, [myself || opponent])


    const handleModelLoad = () => {
        const modelLoad = async () => {
            console.log("モデルロード開始")
            await tf.ready()

            const moveNetModel = await moveNetModelLoad()
            setMoveNetModel(moveNetModel)
            const mobileNetModel = await mobilenet.load()
            setMobileNetModel(mobileNetModel)
            const blazePoseModel = await blazePoseModelLoad()
            setBlazePoseModel(blazePoseModel)

            const xTrain = tf.tensor3d([[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]], [numSamples, inputSize, featureSize]);
            const yTrain = tf.tensor2d([[1, 0], [0, 1]], [numSamples, outputSize]);
            const predict = tf.tensor3d([[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]], [numSamples, inputSize, featureSize]);
            const testPredict = tf.tensor3d([[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]], [numSamples, inputSize, featureSize]);

            setXTrain(xTrain)
            setYTrain(yTrain)
            setXPredict(predict)
            setXTestPredict(testPredict)

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

    const inputSize = 2; // シーケンス長 []の数
    const featureSize = 10; // サンプル内の特徴量の数
    const outputSize = 2; // 出力の次元数,numSamplesと同じ値にすること
    const lstmUnits = 50;   // LSTMユニットの数
    const numSamples = 2; // サンプル数,データの総数のこと



    const createLSTMModel = (inputSize: any, featureSize: any, outputSize: any, lstmUnits: any) => {
        const model = tf.sequential();

        // LSTMレイヤーの追加
        model.add(tf.layers.lstm({
            units: lstmUnits,
            inputShape: [inputSize, featureSize]
        }));

        // 出力レイヤーの追加
        model.add(tf.layers.dense({
            units: outputSize, activation:
                'softmax'
            // 'sigmoid'
        }));

        return model;
    }


    const handleLstmLoad = () => {
        console.log("モデルロード開始開始")

        const lstmModel = createLSTMModel(inputSize, featureSize, outputSize, lstmUnits);
        setLstmModel(lstmModel)

        const learningRate = 0.001;
        const optimizer = tf.train.adam(learningRate);
        lstmModel.compile({
            optimizer: optimizer,
            loss:
                'categoricalCrossentropy' //多クラス分類のための損失関数 ※ワンホットエンコーディング必須
            // 'sparseCategoricalCrossentropy' //多クラス分類のための損失関数
            // 'binaryCrossentropy' //二値分類のための損失関数
            ,
            metrics: ['accuracy']
        });


        console.log("モデルロード終わり")
    }

    const handleTrain = () => {
        if (lstmModel && xTrain && yTrain) {
            console.log("学習開始")
            lstmModel.fit(xTrain, yTrain, { epochs: 20, batchSize: 1 }); // batchSizeを1に変更
            console.log("学習終了")
        }
    }


    const handlePredict = () => {
        if (lstmModel && xPredict) {
            const prediction: any = lstmModel.predict(xPredict);
            prediction.array().then((array: any) => {
                console.log(array); // この配列には、予測された値が含まれます。
            });
        }
    }

    const handleTestPredict = () => {
        if (lstmModel && xTestPredict) {
            const prediction: any = lstmModel.predict(xTestPredict);
            prediction.array().then((array: any) => {
                console.log(array); // この配列には、予測された値が含まれます。
            });
        }
    }

    const handleMemory = () => {
        // console.log(tf.memory())
        console.log(boxerKeypoint)
    }


    const handleJabSet = () => {

    }

    const handleSet = () => {

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
            <button onClick={handleLstmLoad}>LSTMモデルロードボタン</button>
            <button onClick={handleTrain}>LSTMモデル学習ボタン</button>
            <button onClick={handlePredict}>LSTM推定ボタン</button>
            <button onClick={handleTestPredict}>lstm0の追定ボタン</button>
            <button onClick={handleMemory}>メモリを調べる</button>
            <button onClick={handleJabSet}>通常時に設定</button>
            <button onClick={handleSet}>ジャブに設定</button>
            <button>学習</button>
        </>
    )
}