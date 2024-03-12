import * as tf from '@tensorflow/tfjs';

export const createLSTMModel = (inputSize: any, featureSize: any, outputSize: any, lstmUnits: any) => {
    const model = tf.sequential();

    // LSTMレイヤーの追加
    model.add(tf.layers.lstm({
        units: lstmUnits,
        inputShape: [inputSize, featureSize]
    }));

    // 出力レイヤーの追加
    model.add(tf.layers.dense({
        units: outputSize, activation:
            'softmax'
        // 'sigmoid'
    }));

    const learningRate = 0.001;
    const optimizer = tf.train.adam(learningRate);
    model.compile({
        optimizer: optimizer,
        loss:
            'categoricalCrossentropy' //多クラス分類のための損失関数 ※ワンホットエンコーディング必須
        // 'sparseCategoricalCrossentropy' //多クラス分類のための損失関数
        // 'binaryCrossentropy' //二値分類のための損失関数
        ,
        metrics: ['accuracy']
    });

    return model;
}