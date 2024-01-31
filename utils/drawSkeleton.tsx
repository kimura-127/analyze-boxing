

export const drawSkeleton = async (ctx: CanvasRenderingContext2D | null, videoElement: HTMLVideoElement | null, analyze: any) => {
    if (ctx && videoElement && analyze) {
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        // const nose = [analyze.keypoints[0].x / videoElement.videoWidth * 700, analyze.keypoints[0].y / videoElement.videoHeight * 400]
        // const leftShoulder = [analyze.keypoints[5].x / videoElement.videoWidth * 700, analyze.keypoints[5].y / videoElement.videoHeight * 400]
        // const rightShoulder = [analyze.keypoints[6].x / videoElement.videoWidth * 700, analyze.keypoints[6].y / videoElement.videoHeight * 400]
        // const leftElbow = [analyze.keypoints[7].x / videoElement.videoWidth * 700, analyze.keypoints[7].y / videoElement.videoHeight * 400]
        // const rightElbow = [analyze.keypoints[8].x / videoElement.videoWidth * 700, analyze.keypoints[8].y / videoElement.videoHeight * 400]
        // const leftWrist = [analyze.keypoints[9].x / videoElement.videoWidth * 700, analyze.keypoints[9].y / videoElement.videoHeight * 400]
        // const rightWrist = [analyze.keypoints[10].x / videoElement.videoWidth * 700, analyze.keypoints[10].y / videoElement.videoHeight * 400]
        // const leftHip = [analyze.keypoints[11].x / videoElement.videoWidth * 700, analyze.keypoints[11].y / videoElement.videoHeight * 400]
        // const rightHip = [analyze.keypoints[12].x / videoElement.videoWidth * 700, analyze.keypoints[12].y / videoElement.videoHeight * 400]
        const leftTop = [analyze.box?.xMin * 665, analyze.box?.yMin * 400]
        const rightTop = [analyze.box?.xMax * 735, analyze.box?.yMin * 400]
        const leftUnder = [analyze.box?.xMin * 665, analyze.box?.yMax * 400]
        const rightUnder = [analyze.box?.xMax * 735, analyze.box?.yMax * 400]
        ctx.beginPath();
        ctx.textAlign = "center"
        // ctx.strokeText(analyze.id, nose[0], nose[1] - 25);
        // ctx.arc(nose[0], nose[1], 10, 0, 2 * Math.PI);
        // ctx.moveTo(leftWrist[0], leftWrist[1]);
        // ctx.lineTo(leftElbow[0], leftElbow[1])
        // ctx.lineTo(leftShoulder[0], leftShoulder[1])
        // ctx.lineTo(rightShoulder[0], rightShoulder[1])
        // ctx.lineTo(rightElbow[0], rightElbow[1])
        // ctx.lineTo(rightWrist[0], rightWrist[1])
        // ctx.moveTo(leftShoulder[0], leftShoulder[1])
        // ctx.lineTo(leftHip[0], leftHip[1])
        // ctx.lineTo(rightHip[0], rightHip[1])
        // ctx.lineTo(rightShoulder[0], rightShoulder[1])
        ctx.moveTo(leftTop[0], leftTop[1])
        ctx.lineTo(rightTop[0], rightTop[1])
        ctx.lineTo(rightUnder[0], rightUnder[1])
        ctx.lineTo(leftUnder[0], leftUnder[1])
        ctx.lineTo(leftTop[0], leftTop[1])
        ctx.closePath();
        ctx.stroke();
    }
}
