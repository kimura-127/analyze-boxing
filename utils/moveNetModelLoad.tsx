import * as poseDetection from '@tensorflow-models/pose-detection';


export const moveNetModelLoad = async () => {

    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
        EnableSmoothing: false,
        multiPoseMaxDimension: 256,
        EnableTracking: false,
    };

    console.log("MoveNetモデル読み込み開始")
    const movenetDetector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
    )
    return movenetDetector
}