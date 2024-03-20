import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';

export const croppedImage = (videoElement: HTMLVideoElement, analyze: poseDetection.Pose[], yPixelSize: number) => {

    const croppedImageTensor = tf.tidy(() => {
        const videoTensor = tf.browser.fromPixels(videoElement);
        const expandedVideoTensor: tf.Tensor4D = tf.expandDims(videoTensor, 0);
        const boxInd = tf.tensor1d([0], 'int32');
        const croppedImages = analyze.map((item: poseDetection.Pose) => {
            if (!item.box) {
                return;
            }
            const box = tf.tensor2d([
                [
                    item?.box?.yMin,
                    item?.box?.xMin,
                    item?.box?.yMax,
                    item?.box?.xMax
                ]
            ]);
            const cropSize: [number, number] = [
                yPixelSize,
                Math.floor(
                    (item.box.xMax - item.box.xMin) /
                    (item.box.yMax - item.box.yMin) *
                    yPixelSize
                )
            ];

            const cropped = tf.image.cropAndResize(expandedVideoTensor, box, boxInd, cropSize);
            return cropped
        });

        return croppedImages;
    })

    return croppedImageTensor;
}
