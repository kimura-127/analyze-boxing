import * as tf from '@tensorflow/tfjs-core';

export const croppedImage = async (videoElement: any, analyze: any) => {

    const croppedImageTensor = tf.tidy(() => {
        // ビデオフレームのピクセルデータを取得し、テンソルに変換
        const videoTensor = tf.browser.fromPixels(videoElement);

        // テンソルを4Dに拡張 (batch dimensionを追加)
        const expandedVideoTensor: tf.Tensor4D = tf.expandDims(videoTensor, 0);



        // 切り抜く領域が1番目の画像に関連していることを示す
        const boxInd = tf.tensor1d([0], 'int32');

        // analyze[] の配列の数に応じて処理を行う
        const croppedImages = analyze.map((item: any) => {
            const box = tf.tensor2d([
                [
                    item?.box?.yMin ?? 0,
                    item?.box?.xMin * 0.85 ?? 0,
                    item?.box?.yMax ?? 0,
                    item?.box?.xMax * 1.15 ?? 0
                ]
            ]);

            // 切り抜かれた画像のサイズを指定
            const cropSize: [number, number] = [Math.floor((item?.box?.xMax - item?.box?.xMin) * videoElement.videoWidth / 2), Math.floor((item?.box?.yMax - item?.box?.yMin) * videoElement.videoHeight / 2)]; // 例: 100x240にリサイズ

            const cropped = tf.image.cropAndResize(expandedVideoTensor, box, boxInd, cropSize);
            return cropped
        });

        return croppedImages;
    })

    return croppedImageTensor;
}
