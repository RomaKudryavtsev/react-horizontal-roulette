import { rewards } from "../data/rewards";
import { Card } from "./Card";
import './Spinner.css';
import { useAnimate, motion, cubicBezier } from "motion/react";
import { useState, useEffect } from 'react';

function Spinner() {
    const rouletteRewards = rewards;
    const cardWidth = 75;
    const cardMargin = 2;
    const cardWidthWithMargins = cardWidth + cardMargin * 2;

    const [scope, animate] = useAnimate();
    const [startPosition, setStartPosition] = useState(0);

    // Normalize distance
    useEffect(() => {
        animate(scope.current, {
            x: cardWidthWithMargins / 2,
            transition: {
                ease: cubicBezier(0.12, 0, 0.39, 0),
                duration: 3,
            }
        });
        setStartPosition(cardWidthWithMargins / 2);
    }, [animate, cardWidthWithMargins, scope]);

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
        const rowsToSkip = 2;
        const distanceToSkip = rowsToSkip * rouletteRewards.length * cardWidthWithMargins;
        const landingPosition = distanceToSkip;
        return landingPosition * -1;
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
