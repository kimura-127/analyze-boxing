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
import { hitJudgmentState } from "@/atoms/hitJudgmentState";
import { addExampleIndexState } from "@/atoms/addExampleIndexState";
import { createLSTMModel } from "@/utils/createLSTMModel";



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
    const [addExampleIndex, setAddExampleIndex] = useRecoilState(addExampleIndexState)
    const [hitJudgment, setHitJudgment] = useRecoilState(hitJudgmentState)
    const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null)
    const [moveNetModel, setMoveNetModel] = useState<poseDetection.PoseDetector | null>(null)
    const [blazePoseModel, setBlazePoseModel] = useState<poseDetection.PoseDetector>()
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [example1Ctx, setExample1Ctx] = useState<CanvasRenderingContext2D | null | undefined>()
    const [example2Ctx, setExample2Ctx] = useState<CanvasRenderingContext2D | null | undefined>()
    const classifier = knnClassifier.create();
    const [lstmModel, setLstmModel] = useState<any>()
    const [xTrain, setXTrain] = useState<tf.Tensor3D>()
    const [xPredict, setXPredict] = useState<tf.Tensor3D>()
    const [yTrain, setYTrain] = useState<tf.Tensor2D>()
    const [xTestPredict, setXTestPredict] = useState<tf.Tensor3D>()
    const boxerKeypoint: any = []
    const jabKeypoint: any = []
    const jabKeypoint2: any = []
    const noneJabKeypoint: any = []
    const handleAnalyze = useRef(false)
    const yPixelSize = useRef(300)
    const handlePlayIndex = useRef(0)
    const moveNetPoses = useRef<poseDetection.Pose[]>()
    const nextAddExampleTime = 1




    const handlePlay = () => {
        const videoElement = videoRef.current
        const canvasElement = canvasRef.current
        const example1CanvasElement = canvasRef1.current
        const example2CanvasElement = canvasRef2.current
        const example1Ctx = example1CanvasElement?.getContext('2d')
        const example2Ctx = example2CanvasElement?.getContext('2d')

        setExample1Ctx(example1Ctx)
        setExample2Ctx(example2Ctx)


        if (moveNetModel && videoElement && handlePlayIndex.current < 2) {

            const animate = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                moveNetPoses.current = poses
                if (poses.length > 1) {
                    videoElement?.pause()
                    handlePlayIndex.current++
                    console.log(handlePlayIndex.current)
                    videoElement.style.pointerEvents = 'none';
                    drawExample(videoElement, poses[0], example1Ctx)
                    drawExample(videoElement, poses[1], example2Ctx)
                }
                setTimeout(() => { videoElement?.paused || requestAnimationFrame(animate) }, 3000)
            }
            setTimeout(() => { requestAnimationFrame(animate) }, nextAddExampleTime * 1000)
        } else if (moveNetModel && videoElement) {
            const animate = async () => {

                const poses = await moveNetModel.estimatePoses(videoElement);
                const croppedImageData = await croppedImage(videoElement, poses, yPixelSize.current)


                if (poses.length > 0 && mobileNetModel && blazePoseModel) {
                    const predictKeypoint = (personName: string) => {
                        croppedImageData.forEach((croppedImage: any, index: number) => {
                            knnClassifierPredict(mobileNetModel, croppedImage, classifier, blazePoseModel, personName).then((result) => {
                                const array: any[] = []
                                if (result && result.length > 0) {
                                    canvasElement && ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
                                    drawSkeleton(ctx, videoElement, result[0].keypoints, poses[index], yPixelSize.current)
                                    // result[0].keypoints.forEach((kp: any) => {
                                    //     array.push(kp.x, kp.y, kp.z, kp.score);
                                    // });

                                    // array.push(result[0].keypoints[13].x, result[0].keypoints[13].y, result[0].keypoints[13].z, result[0].keypoints[13].score);
                                    // array.push(result[0].keypoints[15].x, result[0].keypoints[15].y, result[0].keypoints[15].z, result[0].keypoints[15].score);
                                    array.push(result[0].keypoints[11].y - result[0].keypoints[13].y);
                                    boxerKeypoint.push(array);
                                    console.log(result)
                                    croppedImage.dispose()
                                }
                                while (boxerKeypoint.length > inputSize) {
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
                    if (handleAnalyze.current && lstmModel && boxerKeypoint.length == inputSize) {
                        const xTrain = tf.tensor3d([boxerKeypoint, boxerKeypoint], [numSamples, inputSize, featureSize]);
                        const prediction: any = lstmModel.predict(xTrain);
                        prediction.array().then((array: any) => {
                            console.log(array[0][0].toFixed(1), array[0][1].toFixed(1));
                        });
                    }
                }
                videoElement?.paused || requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
        }

    };



    useEffect(() => {
        if (addExampleIndex > 0 && videoRef.current) {
            videoRef.current.style.pointerEvents = 'auto'
            const croppedImageData = croppedImage(videoRef.current, moveNetPoses.current, yPixelSize.current)
            switch (myself) {
                case "select1":
                    console.log("select1")
                    if (mobileNetModel && canvasRef1.current) {
                        const activation = (mobileNetModel as any).infer(croppedImageData[0], 'conv_preds')
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        activation.dispose()
                    }
                    break;
                case "select2":
                    console.log("select2")
                    if (mobileNetModel && canvasRef2.current) {
                        const activation = (mobileNetModel as any).infer(croppedImageData[1], 'conv_preds')
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        classifier.addExample(activation, "myself")
                        activation.dispose()
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
                    if (mobileNetModel && canvasRef1.current) {
                        const activation = (mobileNetModel as any).infer(croppedImageData[0], 'conv_preds')
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        activation.dispose()
                    }
                    break;
                case "select2":
                    console.log("select2")
                    if (mobileNetModel && canvasRef2.current) {
                        const activation = (mobileNetModel as any).infer(croppedImageData[1], 'conv_preds')
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        classifier.addExample(activation, "opponent")
                        activation.dispose()
                    }
                    break;
                // case "select3":
                //     console.log("select3")
                //     break;
                // case "select4":
                //     console.log("select4")
                //     break;
            }


            croppedImageData.forEach((croppedImage: any) => {
                croppedImage.dispose()
            });
        }
    }, [addExampleIndex])


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


            const yTrain = tf.tensor2d([[1, 0], [0, 1]], [numSamples, outputSize]);
            // const predict = tf.tensor3d([[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]], [numSamples, inputSize, featureSize]);
            // const testPredict = tf.tensor3d([[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]], [numSamples, inputSize, featureSize]);
            // console.log([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]])
            // setXTrain(xTrain)
            setYTrain(yTrain)
            // setXPredict(predict)
            // setXTestPredict(testPredict)

            console.log("モデルロード完全終了")
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

    const inputSize = 40; // シーケンス長 []の数
    const featureSize = 1; // サンプル内の特徴量の数
    const outputSize = 2; // 出力の次元数,numSamplesと同じ値にすること
    const lstmUnits = 50;   // LSTMユニットの数
    const numSamples = 2; // サンプル数,データの総数のこと


    const handleLstmLoad = () => {
        console.log("モデルロード開始開始")


        // const modelUrl = '/models/myLSTMModels/v1/lstm-model.json';
        // const lstmModel = async () => {
        //     const model = await tf.loadLayersModel(modelUrl);
        //     const learningRate = 0.001;
        //     const optimizer = tf.train.adam(learningRate);
        //     model.compile({
        //         optimizer: optimizer,
        //         loss:
        //             'categoricalCrossentropy' //多クラス分類のための損失関数 ※ワンホットエンコーディング必須
        //         // 'sparseCategoricalCrossentropy' //多クラス分類のための損失関数
        //         // 'binaryCrossentropy' //二値分類のための損失関数
        //         ,
        //         metrics: ['accuracy']
        //     });
        //     setLstmModel(model)
        // }
        // lstmModel()

        // 独自のLSTMモデル用意する際のコード
        const lstmModel = createLSTMModel(inputSize, featureSize, outputSize, lstmUnits);
        setLstmModel(lstmModel)
        console.log("モデルロード終わり")
    }


    const handleJabSet2 = () => {
        jabKeypoint2.length = 0
        boxerKeypoint.map((kp: any) => { jabKeypoint2.push(kp) })
        console.log(jabKeypoint2)
    }

    const handleSet = () => {
        noneJabKeypoint.length = 0
        boxerKeypoint.map((kp: any) => { noneJabKeypoint.push(kp) })
        console.log(noneJabKeypoint)
    }


    const handleJabSet = () => {
        jabKeypoint.length = 0
        boxerKeypoint.map((kp: any) => { jabKeypoint.push(kp) })
        console.log(jabKeypoint)
    }

    const handleLearn = () => {
        if (lstmModel && yTrain) {
            const xTrain = tf.tensor3d([noneJabKeypoint, jabKeypoint], [numSamples, inputSize, featureSize]);
            console.log("学習開始")
            lstmModel.fit(xTrain, yTrain, { epochs: 20, batchSize: 50 });
            console.log("学習終了")
        } else {
            console.log("学習")
        }
    }

    const handleAddAnalyze = () => {
        if (handleAnalyze.current) {
            handleAnalyze.current = false
            console.log(handleAnalyze)
        } else {
            handleAnalyze.current = true
            console.log(handleAnalyze)
        }
    }

    const handlePixel = () => {
        yPixelSize.current += 100
        console.log(yPixelSize.current)
    }

    const handleSaveModel = () => {
        // const saveModel = async () => {
        //     if (lstmModel) {
        //         await lstmModel.save('downloads://lstm-model');
        //     }
        // }
        // saveModel()

        // const rotateY = (vector: any, angle: any) => {
        //     const rad = angle * Math.PI / 180; // 角度をラジアンに変換
        //     const cos = Math.cos(rad);
        //     const sin = Math.sin(rad);

        //     return {
        //         x: vector.x * cos + vector.z * sin,
        //         y: vector.y,
        //         z: -vector.x * sin + vector.z * cos
        //     };
        // }

        // // 例: Y軸周りに45度回転
        // const originalVector = { x: 10, y: 10, z: 10 };
        // const rotatedVector = rotateY(originalVector, 360);
        // console.log(rotatedVector);

        console.log(tf.memory())
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
            <button onClick={handleSet}>通常時に設定</button>
            <button onClick={handleJabSet}>ジャブに設定</button>
            <button onClick={handleJabSet2}>ジャブ2に設定</button>
            <button onClick={handleLearn}>学習</button>
            <button onClick={handleAddAnalyze}>分析処理追加</button>
            <button onClick={handlePixel}>ビクセル100プラス</button>
            <button onClick={handleSaveModel}>モデルセーブ</button>
        </>
    )
}