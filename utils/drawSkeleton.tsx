export const drawSkeleton = (ctx: any, videoElement: any, keypoints: any, poses: any, yPixelSize: number) => {
    if (ctx && videoElement && keypoints && poses) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        const drawScore = 0.2
        const box = poses.box;

        const leftTop = [box?.xMin * 700 * 0.85, box?.yMin * 400]
        const rightTop = [box?.xMax * 700 * 1.15, box?.yMin * 400]
        const leftUnder = [box?.xMin * 700 * 0.85, box?.yMax * 400]
        const rightUnder = [box?.xMax * 700 * 1.15, box?.yMax * 400]

        ctx.beginPath();
        ctx.moveTo(leftTop[0], leftTop[1])
        ctx.lineTo(rightTop[0], rightTop[1])
        ctx.lineTo(rightUnder[0], rightUnder[1])
        ctx.lineTo(leftUnder[0], leftUnder[1])
        ctx.lineTo(leftTop[0], leftTop[1])
        ctx.closePath();
        ctx.stroke();

        keypoints.slice(11, 16).forEach((keypoint: any) => {
            if (keypoint.score > drawScore) {

                const xMinLarge = 1
                const xMaxLarge = 1

                const canvasXPixeltoBox = box.xMin * ctx.canvas.width
                const canvasYPixeltoBox = box.yMin * ctx.canvas.height

                const boxWidth = (box.xMax - box.xMin) * ctx.canvas.width
                const boxHeight = (box.yMax - box.yMin) * ctx.canvas.height

                const test = (((box?.xMax * xMaxLarge) - (box?.xMin * xMinLarge)) / (box?.yMax - box?.yMin) * yPixelSize)

                const keypointX = keypoint.x / test
                const keypointY = keypoint.y / yPixelSize

                const finalX = canvasXPixeltoBox + (boxWidth * keypointX)
                const finalY = canvasYPixeltoBox + (boxHeight * keypointY)

                ctx.beginPath();
                ctx.textAlign = "center"
                ctx.arc(finalX, finalY, 3, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
                // ctx.fill();
            }
        });
        keypoints.slice(23, 26).forEach((keypoint: any) => {
            if (keypoint.score > drawScore) {

                const xMinLarge = 1
                const xMaxLarge = 1

                const canvasXPixeltoBox = box.xMin * ctx.canvas.width
                const canvasYPixeltoBox = box.yMin * ctx.canvas.height

                const boxWidth = (box.xMax - box.xMin) * ctx.canvas.width
                const boxHeight = (box.yMax - box.yMin) * ctx.canvas.height

                const test = (((box?.xMax * xMaxLarge) - (box?.xMin * xMinLarge)) / (box?.yMax - box?.yMin) * yPixelSize)

                const keypointX = keypoint.x / test
                const keypointY = keypoint.y / yPixelSize

                const finalX = canvasXPixeltoBox + (boxWidth * keypointX)
                const finalY = canvasYPixeltoBox + (boxHeight * keypointY)

                ctx.beginPath();
                ctx.textAlign = "center"
                ctx.arc(finalX, finalY, 3, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
                // ctx.fill();
            }
        });
    }
};

