import { useForm } from "react-hook-form";
import React from 'react';
import { useRecoilState } from "recoil";
import { myselfState } from "@/atoms/myselfState";
import { opponentState } from "@/atoms/opponentState";
import { hitJudgmentState } from "@/atoms/hitJudgmentState";
import { addExampleIndexState } from "@/atoms/addExampleIndexState";
import styles from "../../styles/exampleForm.module.css"

const ExampleForm = () => {
    const { register, handleSubmit } = useForm();
    const [myself, setMyself] = useRecoilState(myselfState)
    const [opponent, setOpponent] = useRecoilState(opponentState)
    const [hitJudgment, setHitJudgment] = useRecoilState(hitJudgmentState)
    const [addExampleIndex, setAddExampleIndex] = useRecoilState(addExampleIndexState)



    const addExample = (data: any) => {
        console.log(data)
        setAddExampleIndex(addExampleIndex + 1)
        Object.entries(data).map(([key, value]) => {
            switch (value) {
                case "myself":
                    setMyself(key)
                    break;
                case "opponent":
                    setOpponent(key)
                    break;
                case "impactJudgment":
                    setHitJudgment(false)
                    break;
            }
        });
    }

    return (
        <>
            <form className={styles.container} onSubmit={handleSubmit(addExample)} encType="multipart/form-data">
                <div className={styles.topForm}>
                    <select {...register("select1", { required: true })} className={styles.form} style={{ width: "100px" }} >
                        <option value="myself">自分</option>
                        <option value="opponent">相手</option>
                        <option value="other">その他</option>
                    </select>
                    <select {...register("select2", { required: true })} className={styles.form} style={{ width: "100px" }}>
                        <option value="myself">自分</option>
                        <option value="opponent">相手</option>
                        <option value="other">その他</option>
                    </select>
                </div>
                {/* <select {...register("select3", { required: true })} style={{ width: "100px" }}>
                    <option value="myself">自分</option>
                    <option value="opponent">相手</option>
                    <option value="other">その他</option>
                </select>
                <select {...register("select4", { required: true })} style={{ width: "100px" }}>
                    <option value="myself">自分</option>
                    <option value="opponent">相手</option>
                    <option value="other">その他</option>
                </select> */}
                <div className={styles.underForm}>
                    <select {...register("select3", { required: true })} className={styles.form}>
                        <option value="hitJudgment">被弾判定</option>
                        <option value="impactJudgment">着弾判定</option>
                    </select>
                    <button type='submit'>更新</button>
                </div>
            </form>
        </>
    )
}

export default ExampleForm