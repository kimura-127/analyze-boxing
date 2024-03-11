import * as tf from '@tensorflow/tfjs-core';

export const croppedImage = (videoElement: any, analyze: any, yPixelSize: number) => {

    const croppedImageTensor = tf.tidy(() => {
        const videoTensor = tf.browser.fromPixels(videoElement);
        const expandedVideoTensor: tf.Tensor4D = tf.expandDims(videoTensor, 0);
        const boxInd = tf.tensor1d([0], 'int32');
        const croppedImages = analyze.map((item: any) => {
            const box = tf.tensor2d([
                [
                    item?.box?.yMin ?? 0,
                    item?.box?.xMin ?? 0,
                    item?.box?.yMax ?? 0,
                    item?.box?.xMax ?? 0
                ]
            ]);
            const cropSize: [number, number] = [
                yPixelSize,
                Math.floor((item?.box?.xMax - item?.box?.xMin) / (item?.box?.yMax - item?.box?.yMin) * yPixelSize)
            ];

            const cropped = tf.image.cropAndResize(expandedVideoTensor, box, boxInd, cropSize);
            return cropped
        });

        return croppedImages;
    })

    return croppedImageTensor;
}
