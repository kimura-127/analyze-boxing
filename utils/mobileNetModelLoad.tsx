import * as mobilenet from '@tensorflow-models/mobilenet'

export const mobileNetModelLoad = async () => {
    console.log("MobileNetモデル読み込み開始")
    const mobileModel = await mobilenet.load();
    return mobileModel
}