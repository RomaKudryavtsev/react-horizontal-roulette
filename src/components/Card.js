import './Card.css'

function Card({ rewardStr }) {
    return (
        <div className="card">
            <span className="card-content">{rewardStr}</span>
        </div>
    );
}

export { Card }