import * as poseDetection from '@tensorflow-models/pose-detection';
import '@mediapipe/pose';


export const blazePoseModelLoad = async () => {

    console.log("BlazePoseモデル読み込み開始")
    const blazePoseDetector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'tfjs',
        enableSmoothing: true,
        modelType: 'full'
    });
    return blazePoseDetector
}