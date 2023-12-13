import { useForm } from "react-hook-form";
import React from 'react';
import { useRecoilState } from "recoil";
import { myselfState } from "@/atoms/myselfState";
import { opponentState } from "@/atoms/opponentState";

const ExampleForm = () => {
    const { register, handleSubmit } = useForm();
    const [myself, setMyself] = useRecoilState(myselfState)
    const [opponent, setOpponent] = useRecoilState(opponentState)



    const addExample = (data: any) => {
        Object.entries(data).map(([key, value]) => {
            if (value === "myself") {
                setMyself(key)
            } else if (value === "opponent") {
                setOpponent(key)
            }
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit(addExample)} encType="multipart/form-data">
                <select {...register("select1", { required: true })} style={{ width: "100px" }} >
                    <option value="myself">自分</option>
                    <option value="opponent">相手</option>
                    <option value="other">その他</option>
                </select>
                <select {...register("select2", { required: true })} style={{ width: "100px" }}>
                    <option value="myself">自分</option>
                    <option value="opponent">相手</option>
                    <option value="other">その他</option>
                </select>
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
                <button type='submit'>更新</button>
            </form>
        </>
    )
}

export default ExampleForm