
export const measureOrientationAngle = (keyPoint: any) => {
    // 3D座標を持つ鼻、左肩、右肩のオブジェクト
    const nose = { x: keyPoint[0].x, z: keyPoint[0].z };
    const leftShoulder = { x: keyPoint[11].x, z: keyPoint[11].z };
    const rightShoulder = { x: keyPoint[12].x, z: keyPoint[12].z };
    const leftHip = { x: keyPoint[23].x, z: keyPoint[23].z }
    const rightHip = { x: keyPoint[24].x, z: keyPoint[24].z }

    // 人物の向いている角度を計算する関数（XZ平面での角度）
    const calculateOrientationAngle = (nose: any, leftShoulder: any, rightShoulder: any) => {
        // 肩の中点を計算
        const midShoulder = {
            x: (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4,
            z: (leftShoulder.z + rightShoulder.z + leftHip.z + rightHip.z) / 4
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

    // 座標を正規化
    const rotateY = (vector: any, angle: any) => {
        const rad = angle * Math.PI / 180; // 角度をラジアンに変換
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        return {
            x: vector.x * cos + vector.z * sin,
            y: vector.y,
            z: -vector.x * sin + vector.z * cos,
            score: vector.score
        };
    }

    const arrayKeypoint: any[] = []
    const changeAngle = Math.abs(angle - 180)

    keyPoint.slice(11, 26).forEach((kp: any) => {
        // 例: Y軸周りに45度回転
        const originalVector = { x: kp.x, y: kp.y, z: kp.z, score: kp.score };
        const rotatedVector = rotateY(originalVector, changeAngle);
        arrayKeypoint.push(rotatedVector)
    })
    // console.log('人物の向いている角度:', angle.toFixed(2), '度', arrayKeypoint)
    return arrayKeypoint
}