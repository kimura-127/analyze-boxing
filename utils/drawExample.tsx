export const drawExample = (videoElement: any, poses: any, exampleCtx: any) => {
    const croppXMin = videoElement.videoWidth * poses?.box.xMin
    const croppYMin = videoElement.videoHeight * poses?.box.yMin
    const croppWidth = videoElement.videoWidth * poses?.box.width
    const croppHeight = videoElement.videoHeight * poses?.box.height
    poses && exampleCtx.drawImage(videoElement, croppXMin, croppYMin, croppWidth, croppHeight, 0, 0, 300, 150)
}