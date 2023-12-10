import Form from "../components/Form"
import { mobileNetModelLoad } from "@/utils/mobileNetModelLoad";
import { moveNetModelLoad } from "@/utils/moveNetModelLoad";
import { blazePoseModelLoad } from "@/utils/blazePoseModelLoad";

export default function analyzeVideo() {
    let mobileNetModel
    let moveNetModel
    let blazePoseModel

    const handleModelLoad = async () => {
        console.log("モデルロード開始")
        mobileNetModel = await mobileNetModelLoad()
        moveNetModel = await moveNetModelLoad()
        // blazePoseModel = await blazePoseModelLoad()
        console.log("モデルロード終了")
    }

    return (
        <>
            <Form />
            <button onClick={handleModelLoad}>分析モデルをロードする</button>
        </>
    )
}