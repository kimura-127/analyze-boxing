
export const measureOrientationAngle = (keyPoint: any) => {
    // 3D座標を持つ鼻、左肩、右肩のオブジェクト
    const nose = { x: keyPoint[0].x, z: keyPoint[0].z };
    const leftShoulder = { x: keyPoint[11].x, z: keyPoint[11].z };
    const rightShoulder = { x: keyPoint[12].x, z: keyPoint[12].z };

    // 人物の向いている角度を計算する関数（XZ平面での角度）
    const calculateOrientationAngle = (nose: any, leftShoulder: any, rightShoulder: any) => {
        // 肩の中点を計算
        const midShoulder = {
            x: (leftShoulder.x + rightShoulder.x) / 2,
            z: (leftShoulder.z + rightShoulder.z) / 2
        };

        // 鼻と肩の中点を結ぶベクトルを計算
        const directionVector = {
            x: nose.x - midShoulder.x,
            z: nose.z - midShoulder.z
        };

        // XZ平面での角度を計算（ラジアンから度に変換）
        const angleRadians = Math.atan2(directionVector.x, directionVector.z);
        const angleDegrees = angleRadians * (180 / Math.PI);

        // 角度を正規化（0〜360度の範囲に調整）
        return (angleDegrees + 360) % 360;
    }

    // 角度を計算して結果を表示
    const angle = calculateOrientationAngle(nose, leftShoulder, rightShoulder);
    console.log('人物の向いている角度:', angle.toFixed(2), '度');
    // Math.abs(angle - 90)

}