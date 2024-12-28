import { rewards } from "../data/rewards";
import { Card } from "./Card";
import './Spinner.css';
import { useAnimate, motion, cubicBezier } from "motion/react";
import { useState } from 'react';

function Spinner() {
    const rouletteRewards = rewards;
    const [scope, animate] = useAnimate();
    const [startPosition, setStartPosition] = useState(0);

    const renderRows = () => {
        const rows = []
        const rowContent = rouletteRewards.map((r, idx) => <Card key={idx} rewardStr={r} />);
        const row = <div className="row">{rowContent}</div>;
        for (let i = 0; i < 29; i++) {
            rows.push(row);
        }
        return rows;
    };

    const calculateLandingPosition = () => {
        const cardWidth = 75 + 2 * 2; // card width + padding
        return cardWidth * -1;
    };

    const handleSpin = () => {
        const newLandingPosition = calculateLandingPosition();
        animate(scope.current, {
            x: startPosition + newLandingPosition,
            transition: {
                ease: cubicBezier(0.12, 0, 0.39, 0),
                duration: 3,
            }
        });
        setStartPosition(startPosition + newLandingPosition);
    };

    return (
        <div className="the-spinner">
            <div>
                <h1>DUMMY SPINNER</h1>
            </div>
            <div className="roulette-wrapper">
                <div className="selector"></div>
                <motion.div
                    className="wheel"
                    ref={scope}
                >
                    {renderRows()}
                </motion.div>
            </div>
            <div className="button-wrapper">
                <button onClick={handleSpin}>
                    <span>SPIN</span>
                </button>
            </div>
        </div>
    );
}

export { Spinner };
