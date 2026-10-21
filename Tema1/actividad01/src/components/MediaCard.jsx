import {useState} from 'react'
import './MediaCard.css'

function MediaCard({ title, description, duration, coverUrl }) {
    const [isSelected, setIsSelected] = useState(false); /* Hook */

    // Arrow function
    // const toggleColor = () => {
    //    setIsSelected(!isSelected);
    //}

    function toggleColor() {
        setIsSelected(!isSelected);
        console.log(isSelected);
    }

    const estilo = {
        backgroundColor: isSelected ? 'green' : 'red',
                 //está seleccionado?  //sí     //no
    }

    return (
        <article className="media-card" onClick={toggleColor} style={estilo}> {/*toglecolor no cambia el color directamente, le dice de modificar el estado*/}
            <img src={coverUrl} className="media-cover" alt={title} />
            <div className="media-metadata">
                <h1>{title}</h1>
                <p>Descripción: {description}</p>
                <p>Duración: {duration} minutos</p>
            </div>
        </article>
    )
}

export default MediaCard
