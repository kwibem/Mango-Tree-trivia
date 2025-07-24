import React from "react";

interface IPointTracker{
    points: number;
}
const PointTracker: React.FC<IPointTracker>= React.memo(props => {

    const { points } = props
    return (
        <>
            <div>
                <p>Points: <small> { points } </small></p>
            </div>

        </>
    );
});

export default PointTracker;