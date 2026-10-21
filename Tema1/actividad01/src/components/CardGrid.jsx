import MediaCard from './MediaCard.jsx'

function CardGrid({ catalog }) {
    return (
        <>
            {/* ARROW FUNCTION */}
            {catalog.map((item) => (
                <MediaCard 
                key={item.id} 
                {...item} >
                </MediaCard>
            ))}
        </>
    )
}

export default CardGrid
