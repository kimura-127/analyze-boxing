import * as poseDetection from '@tensorflow-models/pose-detection';

export const drawExample = (videoElement: HTMLVideoElement, poses: poseDetection.Pose, exampleCtx: CanvasRenderingContext2D | null | undefined) => {
    if (poses.box && exampleCtx) {
        const croppXMin = videoElement.videoWidth * poses.box.xMin
        const croppYMin = videoElement.videoHeight * poses.box.yMin
        const croppWidth = videoElement.videoWidth * poses.box.width
        const croppHeight = videoElement.videoHeight * poses.box.height
        poses && exampleCtx.drawImage(videoElement, croppXMin, croppYMin, croppWidth, croppHeight, 0, 0, 300, 150)
    }
}