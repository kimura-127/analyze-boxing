import * as tf from '@tensorflow/tfjs-core';
import { Tensor3D } from '@tensorflow/tfjs-core';

export const drawCanvas = (croppedData: any) => {

    //不要な次元を削除し、3Dテンソルに変換 
    const squeezedImage_1: Tensor3D = tf.squeeze(croppedData[0], [0]);
    const squeezedImage_2: Tensor3D = tf.squeeze(croppedData[1], [0]);
    const squeezedImage_3: Tensor3D = tf.squeeze(croppedData[2], [0]);
    const squeezedImage_4: Tensor3D = tf.squeeze(croppedData[3], [0]);

    // 画像データの各ピクセル値が0から1の範囲にスケーリング
    const normalizedImage_1: Tensor3D = tf.div(squeezedImage_1, 255);
    const normalizedImage_2: Tensor3D = tf.div(squeezedImage_2, 255);
    const normalizedImage_3: Tensor3D = tf.div(squeezedImage_3, 255);
    const normalizedImage_4: Tensor3D = tf.div(squeezedImage_4, 255);

    const normalizedImages = [normalizedImage_1, normalizedImage_2, normalizedImage_3, normalizedImage_4]

    return normalizedImages
}