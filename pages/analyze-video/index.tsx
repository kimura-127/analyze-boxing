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
import ExampleForm from "../components/ExampleForm";
import { drawExample } from "@/utils/drawExample";
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { croppedImage } from "@/utils/croppedImage";
import { knnClassifierPredict } from "@/utils/knnClassifierPredict";
import { hitJudgmentState } from "@/atoms/hitJudgmentState";
import { createLSTMModel } from "@/utils/createLSTMModel";
import styles from "../../styles/analyzeVideo.module.css"
import { drawKeypoint } from "@/utils/drawKeypoint";
import ProgressBar from "../components/ProgressBar";




export default function AnalyzeVideo() {

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [videoSrc, _] = useRecoilState(videoSrcState)
    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const [hitJudgment, setHitJudgment] = useRecoilState(hitJudgmentState)
    const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null)
    const [moveNetModel, setMoveNetModel] = useState<poseDetection.PoseDetector | null>(null)
    const [blazePoseModel, setBlazePoseModel] = useState<poseDetection.PoseDetector>()
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const classifier = knnClassifier.create();
    const [lstmModel, setLstmModel] = useState<any>()
    const [xTrain, setXTrain] = useState<tf.Tensor3D>()
    const [xPredict, setXPredict] = useState<tf.Tensor3D>()
    const [yTrain, setYTrain] = useState<tf.Tensor2D>()
    const [overlayVisible, setOverlayVisible] = useState(true);
    const [xTestPredict, setXTestPredict] = useState<tf.Tensor3D>()
    const [handleProgress, setHandleProgress] = useState(0)
    const boxerKeypoint: any = []
    const jabKeypoint: any = []
    const jabKeypoint2: any = []
    const noneJabKeypoint: any = []
    const handleAnalyze = useRef(true)
    const otherPeople = useRef(false)
    const yPixelSize = useRef(800)
    const handlePlayIndex = useRef(0)
    const moveNetPoses = useRef<poseDetection.Pose[]>()
    const nextAddClock = 3
    const addExampletimes = 4
    const personLength = 2
    const exampleTimeLag = 4
    const myselfRefArray = useRef([])
    const opponentRefArray = useRef([])
    const jabCount = useRef(0)
    const countRef = useRef<HTMLDivElement>(null)
    const modelUrl = '/models/myLSTMModels/v2/lstm-model.json';



    const handlePlay = () => {
        const videoElement = videoRef.current
        const canvasElement = canvasRef.current
        const example1CanvasElement = canvasRef1.current
        const example2CanvasElement = canvasRef2.current
        const example1Ctx = example1CanvasElement?.getContext('2d')
        const example2Ctx = example2CanvasElement?.getContext('2d')


        if (moveNetModel && videoElement && handlePlayIndex.current < addExampletimes) {

            const animate = async () => {
                const poses = await moveNetModel.estimatePoses(videoElement);
                console.log(poses)
                if (poses.length >= personLength) {
                    videoElement?.pause()
                    handlePlayIndex.current++
                    console.log(handlePlayIndex.current)
                    videoElement.style.pointerEvents = 'none';
                    drawKeypoint(ctx, videoElement, poses[0])
                    drawKeypoint(ctx, videoElement, poses[1])
                    drawExample(videoElement, poses[0], example1Ctx)
                    drawExample(videoElement, poses[1], example2Ctx)
                    moveNetPoses.current = poses
                }
                setTimeout(() => {
                    videoElement?.paused || requestAnimationFrame(animate)
                }, nextAddClock * 1000)
            }
            setTimeout(() => {
                requestAnimationFrame(animate)
            }, nextAddClock * 1000)
        } else if (moveNetModel && videoElement) {
            const animate = async () => {

                const poses = await moveNetModel.estimatePoses(videoElement);
                const croppedImageData = croppedImage(videoElement, poses, yPixelSize.current)


                if (poses.length > 0 && mobileNetModel && blazePoseModel) {
                    const predictKeypoint = (personName: string) => {
                        croppedImageData.forEach((croppedImage: any, index: number) => {
                            knnClassifierPredict(mobileNetModel, croppedImage, classifier, blazePoseModel, personName).then((result) => {
                                const array: any[] = []
                                if (result && result.length > 0) {
                                    canvasElement && ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
                                    drawSkeleton(ctx, videoElement, result[0].keypoints, poses[index], yPixelSize.current)
                                    array.push(result[0].keypoints[13].y - result[0].keypoints[11].y);
                                    boxerKeypoint.push(array);
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
                            if (array[0][1].toFixed(1) > 0.5 && countRef.current) {
                                jabCount.current++
                                countRef.current.textContent = jabCount.current.toString()
                            }
                        });
                    }
                }
                videoElement?.paused || requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
        }

    };

    const inputSize = 10; // シーケンス長 []の数
    const featureSize = 1; // サンプル内の特徴量の数
    const outputSize = 2; // 出力の次元数,numSamplesと同じ値にすること
    const lstmUnits = 50;   // LSTMユニットの数
    const numSamples = 2; // サンプル数,データの総数のこと


    const handleModelLoad = () => {
        const modelLoad = async () => {
            console.log("モデルロード開始")

            await tf.ready()
            setHandleProgress(15)
            const moveNetModel = await moveNetModelLoad()
            setMoveNetModel(moveNetModel)
            setHandleProgress(55)
            const mobileNetModel = await mobilenet.load()
            setMobileNetModel(mobileNetModel)
            setHandleProgress(75)
            const blazePoseModel = await blazePoseModelLoad()
            setBlazePoseModel(blazePoseModel)
            setHandleProgress(90)

            // 既存のLSTMモデルを使用する際のコード
            const lstmModel = async () => {
                console.log("LSTMモデルロード開始")
                const model = await tf.loadLayersModel(modelUrl);
                const learningRate = 0.001;
                const optimizer = tf.train.adam(learningRate);
                model.compile({
                    optimizer: optimizer,
                    loss:
                        'categoricalCrossentropy' //多クラス分類のための損失関数 ※ワンホットエンコーディング必須
                    // 'sparseCategoricalCrossentropy' //多クラス分類のための損失関数
                    // 'binaryCrossentropy' //二値分類のための損失関数
                    ,
                    metrics: ['accuracy']
                });
                setLstmModel(model)
            }
            lstmModel()
            setHandleProgress(100)

            // 独自のLSTMモデル用意する際のコード
            // const lstmModel = createLSTMModel(inputSize, featureSize, outputSize, lstmUnits);
            // setLstmModel(lstmModel)

            const yTrain = tf.tensor2d([[1, 0], [0, 1]], [numSamples, outputSize]);
            setYTrain(yTrain)
            setOverlayVisible(false);
            console.log("モデルロード完全終了")
        }


        modelLoad()


        const videoElement = videoRef.current
        const canvasElement = canvasRef.current
        if (videoElement && canvasElement) {
            const ctx = canvasElement.getContext('2d')
            setCtx(ctx)
            videoElement.width = videoElement.videoWidth;
            videoElement.height = videoElement.videoHeight;
        }
    }

    const addCroppImageArray = (data: any) => {
        const addArray = (key: any, array: any) => {
            if (key === "select1") {
                const videoTensor = tf.browser.fromPixels(canvasRef1.current as HTMLCanvasElement);
                console.log(videoTensor)
                array.current.push(videoTensor)
            } else if (key === "select2") {
                const videoTensor = tf.browser.fromPixels(canvasRef2.current as HTMLCanvasElement);
                array.current.push(videoTensor)
                console.log(videoTensor)
            }
        }
        otherPeople.current = false
        ctx?.clearRect(0, 0, canvasRef.current?.width as number, canvasRef.current?.height as number)
        Object.entries(data).map(([key, value]) => {
            switch (value) {
                case "myself":
                    addArray(key, myselfRefArray)
                    console.log(myselfRefArray.current)
                    break;
                case "opponent":
                    addArray(key, opponentRefArray)
                    console.log(opponentRefArray.current)
                    break;
                case "other":
                    otherPeople.current = true
                    break;
                case "impactJudgment":
                    setHitJudgment(false)
                    break;
            }
        })
        otherPeople.current && handlePlayIndex.current--
        if (handlePlayIndex.current === addExampletimes) {
            const addExample = (personRefArray: any, personName: string) => {
                personRefArray.forEach((croppedImageTensor: any) => {
                    const learningIndex = 5
                    const activation = (mobileNetModel as any).infer(croppedImageTensor, 'conv_preds')
                    for (let index = 0; index < learningIndex; index++) {
                        classifier.addExample(activation, personName)
                    }
                    activation.dispose()
                });
            }
            addExample(myselfRefArray.current, "myself")
            addExample(opponentRefArray.current, "opponent")
            console.log("学習しました")
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.style.pointerEvents = 'auto'
                    videoRef.current.play()
                }
            }, exampleTimeLag * 1000)
        } else if (videoRef.current) {
            console.log("人物の特徴量を収集OK")
            setTimeout(() => {
                if (videoRef.current) {
                    // videoRef.current.style.pointerEvents = 'auto'
                    videoRef.current.play()
                }
            }, exampleTimeLag * 1000)
        }
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
        // yPixelSize.current += 100
        // console.log(yPixelSize.current)
    }

    const handleSaveModel = () => {
        const saveModel = async () => {
            if (lstmModel) {
                await lstmModel.save('downloads://lstm-model');
            }
        }
        saveModel()

        // yPixelSize.current -= 100
        // console.log(yPixelSize.current)
    }

    return (
        <div className={styles.container}>
            {overlayVisible && (
                <div className={styles.overlay}>
                    {handleProgress === 100 || (
                        <ProgressBar progress={handleProgress} />
                    )}
                    <button onClick={handleModelLoad}>分析モデルをロードする</button>
                </div>
            )}
            <div className={styles.analyzeContainer}>
                <video
                    ref={videoRef}
                    className={styles.video}
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
                    className={styles.canvas}
                />
            </div>
            <div className={styles.spaceContainer}>
                <div className={styles.space} >
                    <div className={styles.indexSpace} />
                    <div className={styles.form}>
                        <Form />
                        {/* <button onClick={handleSet}>通常時に設定</button> */}
                        {/* <button onClick={handleJabSet}>ジャブに設定</button> */}
                        {/* <button onClick={handleJabSet2}>ジャブ2に設定</button> */}
                        {/* <button onClick={handleLearn}>学習</button> */}
                        {/* <button onClick={handleAddAnalyze}>分析処理追加</button> */}
                        {/* <button onClick={handlePixel}>ビクセル100プラス</button> */}
                        {/* <button onClick={handleSaveModel}>モデルセーブ</button> */}
                    </div>
                </ div>
                <div className={styles.canvasContainer}>
                    <div className={styles.subCanvasContainer}>
                        <canvas ref={canvasRef1} className={styles.subCanvas} />
                        <canvas ref={canvasRef2} className={styles.subCanvas} />
                    </div>
                    <ExampleForm addCroppImageArray={addCroppImageArray} />
                    <div className={styles.tableContainer}>
                        <table className={styles.clickTable}>
                            <thead>
                                <tr>
                                    <th>ジャブの回数</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div ref={countRef}>0</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    )
}