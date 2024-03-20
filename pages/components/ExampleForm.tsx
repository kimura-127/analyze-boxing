import { useForm, SubmitHandler } from "react-hook-form";
import React from 'react';
import styles from "../../styles/exampleForm.module.css"

type FormData = {
    select1: string;
    select2: string;
    select3: string;
}

const ExampleForm = ({ addCroppImageArray }: { addCroppImageArray: SubmitHandler<FormData> }) => {
    const { register, handleSubmit } = useForm<FormData>();

    return (
        <>
            <form className={styles.container} onSubmit={handleSubmit(addCroppImageArray)} encType="multipart/form-data">
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
                <div className={styles.underForm}>
                    <select {...register("select3", { required: true })} className={styles.form}>
                        <option value="hitJudgment">被弾判定</option>
                        <option value="impactJudgment">着弾判定</option>
                    </select>
                    <button type='submit'>学習</button>
                </div>
            </form>
        </>
    )
}

export default ExampleForm