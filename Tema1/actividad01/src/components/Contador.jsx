import { useState, useEffect } from "react";
import './Contador.css'

function Contador() {
    const [contador, setContador] = useState(0);

    // Imprimir en consola SOLO en el momento de crearse
    useEffect(() => {
        console.log("Creado"); 
    }, []); // Array de dependencias (parámetro adicional) -> qué estados tiene que estar mirando para ejecutar el código. Solo se ejecuta cuando la dependencia cambie
    // Carga 2 veces porque está el strict mode activado

    function incrementar() {
        setContador(contador + 1);
    }

    // Imprimir en consola el valor de contador cuando cambie
    useEffect(() => {
        console.log(contador);
    }, [contador]); // Solo se ejecuta cuando la dependencia cambie


    // Cambiar según la rueda del ratón
    useEffect(() => {
        const evento = (e) => {
            console.log(e);
        }

        window.addEventListener("wheel", evento);

        // Limpiar el event listener cuando el componente se desmonte
        return () => {
            window.removeEventListener("wheel", evento);
        }
    }, []);
    

    return (
        <>
           {/* <button onClick={() => setContador(contador + 1)}>+1</button> */}

            {/*<button onClick={() => {
                setContador(contador + 1);
                console.log(contador + 1);
            }}>+1</button> */}

            <button onClick={incrementar}>+1</button>
            <p>{contador}</p>
        </>
    )
}

export default Contador