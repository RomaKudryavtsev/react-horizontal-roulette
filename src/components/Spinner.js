import { rewards } from "../data/rewards";
import { Card } from "./Card";
import './Spinner.css';
import { useAnimate, motion, cubicBezier } from "motion/react";
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const TARGET_CARD = "zero";

const calculateLandingPosition = ({ rowsToSkip, currentCardIndex, targetCardIndex, cardWidthWithMargins, rouletteRewards }) => {
    // Skip a number of rows to the currentCardIndex in next row
    const distanceToSkip = rowsToSkip * rouletteRewards.length * cardWidthWithMargins;
    const targetDistance = Math.abs(currentCardIndex - targetCardIndex) * cardWidthWithMargins;
    const landingPosition = targetCardIndex > currentCardIndex
        // Move inside the current row
        ? distanceToSkip + targetDistance
        // Move to the next row
        : distanceToSkip + (rouletteRewards.length * cardWidthWithMargins) - targetDistance;
    return landingPosition * -1;
};

const getTargetIndex = () => {
    return rewards.indexOf(TARGET_CARD);
}

const parseCardIndexFromId = (cardId) => {
    const splittedCardId = cardId.split('-');
    return splittedCardId.slice(-1)[0];
}

function Spinner() {
    const rouletteRewards = rewards;
    const cardWidth = 75;
    const cardMargin = 2;

    const transition = useMemo(() => ({
        ease: cubicBezier(0.12, 0, 0.39, 0),
        duration: 3,
    }), []);
    const cardWidthWithMargins = useMemo(() => cardWidth + cardMargin * 2, [cardWidth, cardMargin]);
    const [scope, animate] = useAnimate();
    const [startPosition, setStartPosition] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [initialCardUnderSelectorId, setInitialCardUnderSelectorId] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const selectorRef = useRef(null);
    const wrapperRef = useRef(null);

    // Find the card selector is pointing to
    const getCardFromSelector = useCallback(() => {
        if (selectorRef.current) {
            const selectorRect = selectorRef.current.getBoundingClientRect();
            const selectorCenter = selectorRect.left + selectorRect.width / 2;
            const cards = Array.from(document.getElementsByClassName('card'));
            const cardUnderSelector = cards.find(card => {
                const cardPosition = card.getBoundingClientRect();
                return selectorCenter >= cardPosition.left && selectorCenter <= cardPosition.right;
            });
            return cardUnderSelector;
        }
        return null;
    }, []);

    useEffect(() => {
        // Normalize distance upon first render
        animate(scope.current, {
            x: cardWidthWithMargins / 2,
            transition
        })
        setStartPosition(cardWidthWithMargins / 2);
        // Save card under selector for the reset cases
        const timeoutId = setTimeout(() => {
            setInitialCardUnderSelectorId(getCardFromSelector().id);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [animate, cardWidthWithMargins, transition, scope, getCardFromSelector]);

    // Reset when spinner right edge is reached
    useEffect(() => {
        const wrapperRightEdge = wrapperRef.current.getBoundingClientRect().right;
        if (Math.abs(translateX) > wrapperRightEdge - 1000) {
            // Recalculate landing position using initial selector position
            const landingPosition = calculateLandingPosition({
                rowsToSkip: 1,
                currentCardIndex: parseCardIndexFromId(initialCardUnderSelectorId),
                targetCardIndex: getTargetIndex(),
                cardWidthWithMargins,
                rouletteRewards,
            });
            animate(scope.current, {
                x: cardWidthWithMargins / 2 + landingPosition,
                transition
            });
            setStartPosition(cardWidthWithMargins / 2 + landingPosition);
        }
    }, [animate, cardWidthWithMargins, initialCardUnderSelectorId, rouletteRewards, scope, transition, translateX]);

    // Prepare cards for spinner
    const renderRows = () => {
        return Array.from({ length: 29 }, (_, rowIdx) => (
            <div key={rowIdx} className="row">
                {rouletteRewards.map((r, cardIdx) => (
                    <Card key={`card-${r}-${rowIdx}-${cardIdx}`} id={`card-${r}-${rowIdx}-${cardIdx}`} rewardStr={r} />
                ))}
            </div>
        ));
    };

    const handleSpin = () => {
        setIsButtonDisabled(true);
        const newLandingPosition = calculateLandingPosition({
            rowsToSkip: 12,
            currentCardIndex: parseCardIndexFromId(getCardFromSelector().id),
            targetCardIndex: getTargetIndex(),
            cardWidthWithMargins,
            rouletteRewards
        });
        animate(scope.current, {
            x: startPosition + newLandingPosition,
            transition
        }).then(() => {
            setTimeout(() => setIsButtonDisabled(false), 5000); // Re-enable button after 5 seconds
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
                <button onClick={handleSpin} disabled={isButtonDisabled}>
                    <span>SPIN</span>
                </button>
            </div>
        </div>
    );
}

export { Spinner };
