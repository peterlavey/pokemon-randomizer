import React, {useEffect, useState} from "react";
import "./graph.styles.scss";

const data = [
    {
        key: 'test1',
        total: 80,
        completed: 33
    },
    {
        key: 'test2',
        total: 64,
        completed: 55
    }
]

const Graph = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const itemMapped = data.map((el) => {
            const percFr = el.completed / el.total;
            const progress = Math.round(percFr * 20);
            const progressRemaining = 20 - progress;
            el.perc = (el.completed / el.total * 100).toFixed(2) + "%";
            el.progressCompleted = [];
            el.progressRemaining = [];
            for (let i = 0; i <= progress; i++) {
                el.progressCompleted.push(i);
            }
            for (let i = 0; i <= progressRemaining; i++) {
                el.progressRemaining.push(i);
            }
            return el;
        });
        setItems(itemMapped);
    }, []);

    return (
        <div className="container">
            <div className="row">
                {
                    items.map((el) => (
                        <>
                            <div className="col-md-2">
                                <h1>{el.key}</h1>
                                <h5>{el.completed} out of {el.total}</h5>
                            </div>
                            <div className="col-md-10">
                                <div className="progress-box">
                                    { el.progressCompleted.map(() =>  <div className="progress-completed"/>) }
                                    { el.progressRemaining.map(() =>  <div className="progress-remaining"/>) }
                                </div>
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    );
};

export default Graph;