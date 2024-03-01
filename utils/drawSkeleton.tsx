

// export const drawSkeleton = async (ctx: CanvasRenderingContext2D | null, videoElement: HTMLVideoElement | null, analyze: any) => {
//     if (ctx && videoElement && analyze) {
//         ctx.fillStyle = "white"
//         ctx.strokeStyle = "white"
//         ctx.lineWidth = 2
//         // const nose = [analyze.keypoints[0].x / videoElement.videoWidth * 700, analyze.keypoints[0].y / videoElement.videoHeight * 400]
//         // const leftShoulder = [analyze.keypoints[5].x / videoElement.videoWidth * 700, analyze.keypoints[5].y / videoElement.videoHeight * 400]
//         // const rightShoulder = [analyze.keypoints[6].x / videoElement.videoWidth * 700, analyze.keypoints[6].y / videoElement.videoHeight * 400]
//         // const leftElbow = [analyze.keypoints[7].x / videoElement.videoWidth * 700, analyze.keypoints[7].y / videoElement.videoHeight * 400]
//         // const rightElbow = [analyze.keypoints[8].x / videoElement.videoWidth * 700, analyze.keypoints[8].y / videoElement.videoHeight * 400]
//         // const leftWrist = [analyze.keypoints[9].x / videoElement.videoWidth * 700, analyze.keypoints[9].y / videoElement.videoHeight * 400]
//         // const rightWrist = [analyze.keypoints[10].x / videoElement.videoWidth * 700, analyze.keypoints[10].y / videoElement.videoHeight * 400]
//         // const leftHip = [analyze.keypoints[11].x / videoElement.videoWidth * 700, analyze.keypoints[11].y / videoElement.videoHeight * 400]
//         // const rightHip = [analyze.keypoints[12].x / videoElement.videoWidth * 700, analyze.keypoints[12].y / videoElement.videoHeight * 400]
//         const leftTop = [analyze.box?.xMin * 665, analyze.box?.yMin * 400]
//         const rightTop = [analyze.box?.xMax * 735, analyze.box?.yMin * 400]
//         const leftUnder = [analyze.box?.xMin * 665, analyze.box?.yMax * 400]
//         const rightUnder = [analyze.box?.xMax * 735, analyze.box?.yMax * 400]
//         ctx.beginPath();
//         ctx.textAlign = "center"
//         // ctx.strokeText(analyze.id, nose[0], nose[1] - 25);
//         // ctx.arc(nose[0], nose[1], 10, 0, 2 * Math.PI);
//         // ctx.moveTo(leftWrist[0], leftWrist[1]);
//         // ctx.lineTo(leftElbow[0], leftElbow[1])
//         // ctx.lineTo(leftShoulder[0], leftShoulder[1])
//         // ctx.lineTo(rightShoulder[0], rightShoulder[1])
//         // ctx.lineTo(rightElbow[0], rightElbow[1])
//         // ctx.lineTo(rightWrist[0], rightWrist[1])
//         // ctx.moveTo(leftShoulder[0], leftShoulder[1])
//         // ctx.lineTo(leftHip[0], leftHip[1])
//         // ctx.lineTo(rightHip[0], rightHip[1])
//         // ctx.lineTo(rightShoulder[0], rightShoulder[1])
//         ctx.moveTo(leftTop[0], leftTop[1])
//         ctx.lineTo(rightTop[0], rightTop[1])
//         ctx.lineTo(rightUnder[0], rightUnder[1])
//         ctx.lineTo(leftUnder[0], leftUnder[1])
//         ctx.lineTo(leftTop[0], leftTop[1])
//         ctx.closePath();
//         ctx.stroke();
//     }
// }


// export const drawSkeleton = (ctx: any, videoElement: any, keypoints: any, poses: any, yPixelSize = 300) => {
//     if (ctx && videoElement && keypoints && poses) {
//         ctx.fillStyle = "white";
//         ctx.strokeStyle = "white";
//         ctx.lineWidth = 2;

//         const box = poses.box; // PoseNetによるバウンディングボックスの情報
//         // バウンディングボックスのサイズを調整
//         const cropSize = [
//             Math.floor((box.xMax - box.xMin) / (box.yMax - box.yMin) * yPixelSize),
//             yPixelSize
//         ];

//         keypoints.forEach((keypoint: any) => {
//             // if (keypoint.score > 0.5) { // スコアが0.5以上のキーポイントのみ描画
//             // キーポイントの座標をバウンディングボックスに基づいて調整
//             const x = (keypoint.x - box.xMin) / (box.xMax - box.xMin) * cropSize[0];
//             const y = (keypoint.y - box.yMin) / (box.yMax - box.yMin) * cropSize[1];

//             // キャンバス上での正しい位置にキーポイントを描画
//             ctx.beginPath();
//             ctx.arc(x, y, 5, 0, 2 * Math.PI);
//             ctx.fill();
//             // }
//         });

//         // // キーポイント間を線で結ぶ関数
//         // const connectPoints = (point1: any, point2: any) => {
//         //     const x1 = (point1.x - box.xMin) / (box.xMax - box.xMin) * cropSize[0];
//         //     const y1 = (point1.y - box.yMin) / (box.yMax - box.yMin) * cropSize[1];
//         //     const x2 = (point2.x - box.xMin) / (box.xMax - box.xMin) * cropSize[0];
//         //     const y2 = (point2.y - box.yMin) / (box.yMax - box.yMin) * cropSize[1];

//         //     ctx.beginPath();
//         //     ctx.moveTo(x1, y1);
//         //     ctx.lineTo(x2, y2);
//         //     ctx.stroke();
//         // };

//         // // 例: 鼻から左肩への線を描画
//         // if (keypoints.length > 12) { // キーポイントの配列長をチェック
//         //     connectPoints(keypoints[0], keypoints[11]); // 鼻と左肩
//         //     connectPoints(keypoints[11], keypoints[12]); // 左肩と右肩
//         //     // 他のキーポイントも同様に結んでいく...
//         // }
//     }
// };

export const drawSkeleton = (ctx: any, videoElement: any, keypoints: any, poses: any, yPixelSize = 300) => {
    if (ctx && videoElement && keypoints && poses) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        const box = poses.box; // PoseNetによるバウンディングボックスの情報
        // バウンディングボックスまでのピクセル数を計算
        const boxStartX = box.xMin * ctx.canvas.width; // videoElementの幅に基づく
        const boxStartY = box.yMin * ctx.canvas.height; // videoElementの高さに基づく


        keypoints.slice(11, 26).forEach((keypoint: any) => {
            if (keypoint.score > 0.5) { // スコアが0.5以上のキーポイントのみ描画
                // キーポイントの座標をバウンディングボックス内でサイズ調整
                // const adjustedX = ((keypoint.x - box.xMin) / (box.xMax - box.xMin))
                //     * (box.xMax - box.xMin) * ctx.canvas.width / videoElement.videoWidth;
                // const adjustedY = ((keypoint.y - box.yMin) / (box.yMax - box.yMin))
                //     * yPixelSize;

                // 最終的な座標を計算
                // const finalX = Math.floor(boxStartX + adjustedX)
                // const finalY = Math.floor(boxStartY + 40)
                // console.log((poses.box.yMax - poses.box.yMin) * ctx.canvas.height)

                const leftTop = [box?.xMin * 700, box?.yMin * 400]
                const rightTop = [box?.xMax * 700, box?.yMin * 400]
                const leftUnder = [box?.xMin * 700, box?.yMax * 400]
                const rightUnder = [box?.xMax * 700, box?.yMax * 400]

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
                console.log(finalX, finalY, keypoint.x, keypoint.y, keypointX, keypointY)
                // console.log(videoElement.videoWidth, ctx.canvas.width)

                // キャンバス上での正しい位置にキーポイントを描画
                ctx.beginPath();
                ctx.textAlign = "center"
                ctx.arc(finalX, finalY, 5, 0, 1 * Math.PI);
                ctx.moveTo(leftTop[0], leftTop[1])
                ctx.lineTo(rightTop[0], rightTop[1])
                ctx.lineTo(rightUnder[0], rightUnder[1])
                ctx.lineTo(leftUnder[0], leftUnder[1])
                ctx.lineTo(leftTop[0], leftTop[1])
                ctx.closePath();
                ctx.stroke();
                // ctx.fill();
            }
        });

        // キーポイント間を線で結ぶ関数（connectPoints）は、同様にfinalXとfinalYを使用
        // ここでは省略...
    }
};

