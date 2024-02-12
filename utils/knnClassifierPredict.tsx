import { Tensor4D } from '@tensorflow/tfjs-core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';



export const knnClassifierPredict = async (mobileNetModel: mobilenet.MobileNet, croppedImage: Tensor4D, classifier: knnClassifier.KNNClassifier, blazePoseModel: poseDetection.PoseDetector, personName: string) => {

    const feature = (mobileNetModel as any).infer(croppedImage, 'conv_preds')
    const result: any = await classifier.predictClass(feature)
    if (result.label === personName && blazePoseModel) {
        const squeezedImage = tf.squeeze(croppedImage as any, [0])
        const keyPoint = await blazePoseModel.estimatePoses(squeezedImage as any)
        croppedImage.dispose()
        squeezedImage.dispose()
        feature.dispose()
        return keyPoint
    } else {
        return null
    }
}