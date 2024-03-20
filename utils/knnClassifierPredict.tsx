import { Tensor4D } from '@tensorflow/tfjs-core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Tensor3D } from '@tensorflow/tfjs';


export const knnClassifierPredict = async (mobileNetModel: mobilenet.MobileNet, croppedImage: any, classifier: knnClassifier.KNNClassifier, blazePoseModel: poseDetection.PoseDetector, personName: string) => {
    let feature;
    let squeezedImage;

    try {
        feature = mobileNetModel.infer(croppedImage, true);
        const result = await classifier.predictClass(feature);
        if (result.label === personName && blazePoseModel) {
            squeezedImage = tf.squeeze(croppedImage, [0]);
            const keyPoint = await blazePoseModel.estimatePoses(squeezedImage as any);
            return keyPoint;
        } else {
            return null;
        }
    } finally {
        croppedImage.dispose();
        if (feature) {
            feature.dispose();
        }
        if (squeezedImage) {
            squeezedImage.dispose();
        }
    }
}
