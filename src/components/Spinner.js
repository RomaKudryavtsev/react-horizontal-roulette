import { rewards } from "../data/rewards"
import { Card } from "./Card";
import './Spinner.css';
import { useAnimate, motion, cubicBezier } from "motion/react"

function Spinner() {
    const [scope, animate] = useAnimate();

    const renderRows = () => {
        const rows = []
        const rowContent = rewards.map((r, idx) => <Card key={idx} rewardStr={r} />);
        const row = <div className="row">{rowContent}</div>;
        for (let i = 0; i < 29; i++) {
            rows.push(row);
        }
        return rows;
    };

    const calculateLandingPosition = () => {
        const cardWidth = 75 + 2 * 2;
        return cardWidth * -1;
    };

    const handleSpin = () => {
        const landingPosition = calculateLandingPosition();
        animate(scope.current, {
            x: landingPosition, transition: {
                ease: cubicBezier(0.12, 0, 0.39, 0),
                duration: 3,
            }
        })
    };

    return (
        <div>
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
                <button
                    onClick={handleSpin}
                >
                    <span>SPIN</span>
                </button>
            </div>
        </div>
    );
}

export { Spinner }