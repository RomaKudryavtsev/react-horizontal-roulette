import { rewards } from "../data/rewards"
import { Card } from "./Card";
import './Spinner.css';

function Spinner() {
    const renderRows = () => {
        const rows = []
        const rowContent = rewards.map((r, idx) => <Card key={idx} rewardStr={r} />);
        const row = <div className="row">{rowContent}</div>;
        for (let i = 0; i < 29; i++) {
            rows.push(row);
        }
        return rows;
    }

    return (
        <div>
            <div>
                <h1>DUMMY SPINNER</h1>
            </div>
            <div className="roulette-wrapper">
                <div className="selector"></div>
                <div className="wheel">
                    {renderRows()}
                </div>
            </div>
            <div className="button-wrapper">
                <button>SPIN</button>
            </div>
        </div>
    )
}

export { Spinner }