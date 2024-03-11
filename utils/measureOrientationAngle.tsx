
export const measureOrientationAngle = (keyPoint: any) => {

    const nose = { x: keyPoint[0].x, z: keyPoint[0].z };
    const leftShoulder = { x: keyPoint[11].x, z: keyPoint[11].z };
    const rightShoulder = { x: keyPoint[12].x, z: keyPoint[12].z };
    const leftHip = { x: keyPoint[23].x, z: keyPoint[23].z }
    const rightHip = { x: keyPoint[24].x, z: keyPoint[24].z }


    const midSpace = {
        x: (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4,
        z: (leftShoulder.z + rightShoulder.z + leftHip.z + rightHip.z) / 4
    };



    const calculateOrientationAngle = () => {

        const directionVector = {
            x: nose.x - midSpace.x,
            z: nose.z - midSpace.z
        };


        const angleRadians = Math.atan2(directionVector.x, directionVector.z);
        const angleDegrees = angleRadians * (180 / Math.PI);


        return (angleDegrees + 360) % 360;
    }


    const angle = calculateOrientationAngle();


    const rotateY = (vector: any, angle: any) => {
        const rad = angle * Math.PI / 180;
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
    const changeAngle = Math.abs(angle - 135)

    keyPoint.slice(11, 26).forEach((kp: any) => {
        const originalVector = { x: kp.x - midSpace.x, y: kp.y, z: kp.z - midSpace.z, score: kp.score };
        const rotatedVector = rotateY(originalVector, changeAngle);
        arrayKeypoint.push(rotatedVector)
    })

    return arrayKeypoint
}