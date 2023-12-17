import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { videoSrcState } from "@/atoms/videoSrcState";

const Form = () => {
    const [videoSrc, setVideoSrc] = useRecoilState(videoSrcState)
    const { register, handleSubmit } = useForm<FormData>();
    type FormData = {
        video: FileList;
    };

    const tfReady = (videoData: any) => {
        if (videoData) {
            const file = videoData.video[0];
            const videoURL = URL.createObjectURL(file);
            setVideoSrc(videoURL);
        }
    }
    return (
        <form onSubmit={handleSubmit(tfReady)} encType="multipart/form-data">
            <input type="file" {...register("video")} />
            <button type='submit'>びでお</button>
        </form>
    )
}

export default Form;




