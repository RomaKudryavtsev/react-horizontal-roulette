import { rewards } from "../data/rewards";
import { Card } from "./Card";
import './Spinner.css';
import { useAnimate, motion, cubicBezier } from "motion/react";
import { useState, useEffect, useRef } from 'react';

function Spinner() {
    const rouletteRewards = rewards;
    const cardWidth = 75;
    const cardMargin = 2;
    const cardWidthWithMargins = cardWidth + cardMargin * 2;

    const [scope, animate] = useAnimate();
    const [startPosition, setStartPosition] = useState(0);
    const selectorRef = useRef(null);

    // Find the card selector is pointing to
    const getCardFromSelector = () => {
        if (selectorRef.current) {
            const selectorRect = selectorRef.current.getBoundingClientRect();
            const selectorLeft = parseFloat(selectorRect.left);
            const selectorWidth = parseFloat(selectorRect.width);
            const selectorCenter = selectorLeft + selectorWidth / 2;
            // Convert HTMLCollection to an array for easy iteration
            const cards = Array.from(document.getElementsByClassName('card'));
            // Find the card that the selector is pointing to
            const cardUnderSelector = cards.find(card => {
                const cardPosition = card.getBoundingClientRect();
                const cardLeft = parseFloat(cardPosition.left);
                const cardRight = parseFloat(cardPosition.right);
                return selectorCenter >= cardLeft && selectorCenter <= cardRight;
            });
            return cardUnderSelector;
        }
        return null;
    };

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
        const rows = [];
        for (let rowIdx = 0; rowIdx < 29; rowIdx++) {
            const rowContent = rouletteRewards.map((r, cardIdx) => {
                const cardId = `card-${rowIdx}-${cardIdx}`;  // Unique ID for each card
                return (
                    <Card
                        key={cardId}
                        id={cardId}
                        rewardStr={r}
                    />
                );
            });
            rows.push(<div key={rowIdx} className="row">{rowContent}</div>);
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
        const cardUnderSelector = getCardFromSelector();
        console.log(cardUnderSelector)
        console.log(cardUnderSelector.querySelector('.card-content').innerText);
        console.log(cardUnderSelector.id);
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
                <div ref={selectorRef} className="selector"></div>
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
