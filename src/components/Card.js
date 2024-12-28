import './Card.css'

function Card({ rewardStr, id }) {
    return (
        <div className="card" id={id}>
            <span className="card-content">{rewardStr}</span>
        </div>
    );
}

export { Card }