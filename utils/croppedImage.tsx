import * as tf from '@tensorflow/tfjs-core';

export const croppedImage = async (videoElement: any, analyze: any) => {


    // ビデオフレームのピクセルデータを取得し、テンソルに変換
    const videoTensor = tf.browser.fromPixels(videoElement);

    // // 2. テンソルを4Dに拡張 (batch dimensionを追加)
    const expandedVideoTensor: tf.Tensor4D = tf.expandDims(videoTensor, 0);

    // // 3. 切り抜く領域を指定 ([yStart, xStart, yEnd, xEnd])
    const box_1 = tf.tensor2d([
        [
            analyze[0]?.box?.yMin ?? 0,
            analyze[0]?.box?.xMin ?? 0,
            analyze[0]?.box?.yMax ?? 0,
            analyze[0]?.box?.xMax ?? 0
        ]
    ]);

    const box_2 = tf.tensor2d([
        [
            analyze[1]?.box?.yMin ?? 0,
            analyze[1]?.box?.xMin ?? 0,
            analyze[1]?.box?.yMax ?? 0,
            analyze[1]?.box?.xMax ?? 0
        ]
    ]);

    const box_3 = tf.tensor2d([
        [
            analyze[2]?.box?.yMin ?? 0,
            analyze[2]?.box?.xMin ?? 0,
            analyze[2]?.box?.yMax ?? 0,
            analyze[2]?.box?.xMax ?? 0
        ]
    ]);

    const box_4 = tf.tensor2d([
        [
            analyze[3]?.box?.yMin ?? 0,
            analyze[3]?.box?.xMin ?? 0,
            analyze[3]?.box?.yMax ?? 0,
            analyze[3]?.box?.xMax ?? 0
        ]
    ]);

    // 4. 切り抜く領域が1番目の画像に関連していることを示す
    const boxInd = tf.tensor1d([0], 'int32');

    // // 5. 切り抜かれた画像のサイズを指定
    const cropSize: [number, number] = [100, 100]; // 例: 64x64にリサイズ

    // // 6. 画像を切り抜く
    const croppedImage_1 = tf.image.cropAndResize(expandedVideoTensor, box_1, boxInd, cropSize);

    const croppedImage_2 = tf.image.cropAndResize(expandedVideoTensor, box_2, boxInd, cropSize);

    const croppedImage_3 = tf.image.cropAndResize(expandedVideoTensor, box_3, boxInd, cropSize);

    const croppedImage_4 = tf.image.cropAndResize(expandedVideoTensor, box_4, boxInd, cropSize);

    const croppedImages = [croppedImage_1, croppedImage_2, croppedImage_3, croppedImage_4]

    return croppedImages
}