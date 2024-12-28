import { rewards } from "../data/rewards";
import { Card } from "./Card";
import './Spinner.css';
import { useAnimate, motion, cubicBezier } from "motion/react";
import { useState, useEffect, useRef } from 'react';

const TARGET_CARD = "spin-3";

function Spinner() {
    const rouletteRewards = rewards;
    const cardWidth = 75;
    const cardMargin = 2;
    const cardWidthWithMargins = cardWidth + cardMargin * 2;

    const [scope, animate] = useAnimate();
    const [startPosition, setStartPosition] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const selectorRef = useRef(null);
    const wrapperRef = useRef(null);

    // Find the card selector is pointing to
    const getCardFromSelector = () => {
        if (selectorRef.current) {
            const selectorRect = selectorRef.current.getBoundingClientRect();
            const selectorLeft = parseFloat(selectorRect.left);
            const selectorWidth = parseFloat(selectorRect.width);
            const selectorCenter = selectorLeft + selectorWidth / 2;
            // Convert HTMLCollection to an array for easy iteration
            const cards = Array.from(document.getElementsByClassName('card'));
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

    // Normalize distance upon first render
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

    // Reset when spinner right edge is reached
    useEffect(() => {
        const wrapperRightEdge = wrapperRef.current.getBoundingClientRect().right;
        if (Math.abs(translateX) > wrapperRightEdge - 1000) {
            animate(scope.current, {
                x: cardWidthWithMargins / 2,
                transition: {
                    ease: cubicBezier(0.12, 0, 0.39, 0),
                    duration: 3,
                }
            });
            setStartPosition(cardWidthWithMargins / 2);
        }
    }, [animate, cardWidthWithMargins, scope, translateX]);

    // Prepare cards for spinner
    const renderRows = () => {
        const rows = [];
        for (let rowIdx = 0; rowIdx < 29; rowIdx++) {
            const rowContent = rouletteRewards.map((r, cardIdx) => {
                // Unique ID for each card (for parsing)
                const cardId = `$card-${r}-${rowIdx}-${cardIdx}`;
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

    const calculateLandingPosition = (cardUnderSelectorId, targetCardIndex) => {
        const parsedCardId = cardUnderSelectorId.split('-');
        const currentCardIndex = parsedCardId[parsedCardId.length - 1];
        const rowsToSkip = 12;
        // Skip a number of rows to the currentCardIndex in next row
        const distanceToSkip = rowsToSkip * rouletteRewards.length * cardWidthWithMargins;
        const targetDistance = Math.abs(currentCardIndex - targetCardIndex) * cardWidthWithMargins
        const landingPosition = targetCardIndex > currentCardIndex
            // Move inside the current row
            ? distanceToSkip + targetDistance
            // Move to the next row
            : distanceToSkip + (rouletteRewards.length * cardWidthWithMargins) - targetDistance;
        return landingPosition * -1;
    };

    const handleSpin = () => {
        const cardUnderSelector = getCardFromSelector();
        const targetCardIndex = rouletteRewards.indexOf(TARGET_CARD);
        const newLandingPosition = calculateLandingPosition(cardUnderSelector.id, targetCardIndex);
        console.log(`LANDING POS: ${newLandingPosition}`);
        console.log(`SPINNER WIDTH: ${wrapperRef.current.getBoundingClientRect().right}`)
        animate(scope.current, {
            x: startPosition + newLandingPosition,
            transition: {
                ease: cubicBezier(0.12, 0, 0.39, 0),
                duration: 6,
            }
        });
        setStartPosition(startPosition + newLandingPosition);
    };

    return (
        <div className="the-spinner">
            <div>
                <h1>DUMMY SPINNER</h1>
            </div>
            <div ref={wrapperRef} className="roulette-wrapper">
                <div ref={selectorRef} className="selector"></div>
                <motion.div
                    className="wheel"
                    ref={scope}
                    onUpdate={latest => setTranslateX(latest.x)}
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
