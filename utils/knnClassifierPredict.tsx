import { Tensor4D } from '@tensorflow/tfjs-core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';


export const knnClassifierPredict = async (mobileNetModel: mobilenet.MobileNet, croppedImageData: Tensor4D, classifier: knnClassifier.KNNClassifier) => {

    const activation = (mobileNetModel as any).infer(croppedImageData, 'conv_preds')
    const result: any = await classifier.predictClass(activation)
    return result.classIndex
}