import Form from "../components/Form"
import { mobileNetModelLoad } from "@/utils/mobileNetModelLoad";
import { moveNetModelLoad } from "@/utils/moveNetModelLoad";
import { blazePoseModelLoad } from "@/utils/blazePoseModelLoad";
import { useState } from "react";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-core';
import AnalyzeVideo from "../components/AnalyzeVideo";



export default function analyzeVideo() {

    const [mobileNetModel, setMobileNetModel] = useState<mobilenet.MobileNet | null>(null)
    const [moveNetModel, setMoveNetModel] = useState<poseDetection.PoseDetector | null>(null)
    const [blazePoseModel, setBlazePoseModel] = useState<poseDetection.PoseDetector | null>(null)

    const handleModelLoad = async () => {
        console.log("モデルロード開始")
        await tf.ready()
        const mobileNetModel = await mobileNetModelLoad()
        const moveNetModel = await moveNetModelLoad()
        // const blazePoseModel = await blazePoseModelLoad()
        setMobileNetModel(mobileNetModel)
        setMoveNetModel(moveNetModel)
        // setBlazePoseModel(blazePoseModel)
        console.log("モデルロード終了")
    }

    return (
        <>
            <AnalyzeVideo />
            <Form />
            <button onClick={handleModelLoad}>分析モデルをロードする</button>
        </>
    )
}