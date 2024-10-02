const numFilas = 8;
const numColumnas = 8;
var array = [];
let contador2 = 0; //Hace posible que el primer clic siempre sea válido
const MAX_MINAS = 10; //Máximo número de minas
let totalCeldasSinMina = 0; //Contador de celdas sin mina reveladas

generarCuadricula();

function generarCuadricula() {
    const cuadriculaContainer = document.querySelector("#cuadricula");
    let tabla = document.createElement("table");
    tabla.id = "tablaJuego"; //Añadimos un id para poder referenciar la tabla
    let contador = 0;

    //Inicializar la cuadricula con celdas vacías
    for (let i = 0; i < numFilas; i++) {
        let tr = document.createElement("tr");
        array[i] = [];

        for (let j = 0; j < numColumnas; j++) {
            let td = document.createElement("td");
            //Al principio, todas las celdas son "cero"
            añadirClase(td, 0);
            array[i][j] = td; //Se almacena cada celda en el array bidimensional
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }

    //Colocar minas aleatoriamente
    while (contador < MAX_MINAS) {
        let fila = Math.floor(Math.random() * numFilas);
        let columna = Math.floor(Math.random() * numColumnas);

        //Colocar mina si la celda no tiene mina ya
        if (!array[fila][columna].classList.contains("uno")) {
            añadirClase(array[fila][columna], 1); //Añadir clase de mina
            contador++;
        }
    }

    //Calcular el total de celdas sin mina
    totalCeldasSinMina = (numFilas * numColumnas) - MAX_MINAS; //Total de celdas menos las minas

    //Añadir los eventos de clic a las celdas
    for (let i = 0; i < numFilas; i++) {
        for (let j = 0; j < numColumnas; j++) {
            array[i][j].addEventListener("click", function () {
                if (contador2 === 0) {
                    //En el primer clic, si pinchas en una mina, deja de serlo
                    if (array[i][j].classList.contains("uno")) {
                        array[i][j].className = "cero";
                    }
                    contador2++;
                }

                //Comprobar si hay mina y si no, revelar celdas vacías
                if (array[i][j].classList.contains("uno")) {
                    comprobarMina(i, j);
                } else {
                    revelarCeldas(i, j); //Llamar a la función para revelar celdas
                    comprobarVictoria(); //Verificar si el jugador ha ganado
                }
            });
        }
    }
    cuadriculaContainer.appendChild(tabla);
}

//Se le agrega la clase uno (mina) y cero (no mina) a cada celda
function añadirClase(td, numero) {
    if (numero === 1) {
        td.classList.add("uno");
    } else {
        td.classList.add("cero");
    }
}

//Si hay mina en la celda, muestra un mensaje y reinicia el juego
function comprobarMina(i, j) {
    if (array[i][j].classList.contains("uno")) {
        mostrarMensaje("Has perdido");
        reiniciarJuego();
    }
}

//Función que revela celdas vacías y adyacentes
function revelarCeldas(i, j) {
    //Si la celda ya ha sido revelada, no hacemos nada
    if (array[i][j].classList.contains("revelada")) {
        return;
    }

    //Revelar la celda
    array[i][j].classList.add("revelada");

    //Contar minas alrededor
    let contador = comprobarMinasAlrededor(i, j);

    //Muestra el número de minas alrededor
    array[i][j].textContent = contador > 0 ? contador : '';

    //Si no hay minas alrededor, revela celdas adyacentes
    if (contador === 0) {
        for (let I = -1; I <= 1; I++) {
            for (let J = -1; J <= 1; J++) {
                //Evitar el clic en la celda actual
                if (I === 0 && J === 0) continue;

                let fila = i + I;
                let columna = j + J;

                //Controla que las celdas no se salgan de los límites
                if (fila >= 0 && fila < numFilas && columna >= 0 && columna < numColumnas) {
                    revelarCeldas(fila, columna); //Revela las celdas adyacentes
                }
            }
        }
    }
}

//Búcle que comprueba las casillas que rodean a la casilla en la que se ha hecho clic
function comprobarMinasAlrededor(i, j) {
    let contador = 0;

    for (let I = -1; I <= 1; I++) {
        for (let J = -1; J <= 1; J++) {
            //Evitar el clic en la celda actual
            if (I === 0 && J === 0) continue;

            let fila = i + I;
            let columna = j + J;

            //Controla que las celdas no se salgan de los límites
            if (fila >= 0 && fila < numFilas && columna >= 0 && columna < numColumnas) {
                if (array[fila][columna].classList.contains("uno")) {
                    contador++;
                }
            }
        }
    }
    return contador; //Devuelve el número de minas alrededor
}

//Función que verifica si el jugador ha ganado
function comprobarVictoria() {
    let celdasReveladas = 0;

    //Contar cuántas celdas sin mina han sido reveladas
    for (let i = 0; i < numFilas; i++) {
        for (let j = 0; j < numColumnas; j++) {
            if (array[i][j].classList.contains("revelada") && !array[i][j].classList.contains("uno")) {
                celdasReveladas++;
            }
        }
    }

    //Si todas las celdas sin mina han sido reveladas, el jugador gana
    if (celdasReveladas === totalCeldasSinMina) {
        mostrarMensaje("¡Has ganado!");
        reiniciarJuego();
    }
}

//Función para mostrar mensajes animados
function mostrarMensaje(mensaje) {
    const contenedorMensaje = document.getElementById("mensaje");

    //Elimina cualquier mensaje previo dentro del contenedor
    contenedorMensaje.innerHTML = '';

    //Crear un nuevo elemento <p> para el mensaje
    const mensajeElemento = document.createElement("p");
    mensajeElemento.textContent = mensaje;

    //Agregar el nuevo elemento <p> al contenedor
    contenedorMensaje.appendChild(mensajeElemento);

    //Deshabilitar las celdas añadiendo la clase "tabla-desactivada"
    document.getElementById("tablaJuego").classList.add("tabla-desactivada");

    //Mostrar el mensaje añadiendo la clase "mostrar"
    contenedorMensaje.classList.add("mostrar");

    //Hacer que el mensaje desaparezca después de 5 segundos
    setTimeout(() => {
        contenedorMensaje.classList.remove("mostrar");

        //Volver a habilitar las celdas quitando la clase "tabla-desactivada"
        document.getElementById("tablaJuego").classList.remove("tabla-desactivada");
    }, 5000);
}


//Función que reinicia el juego sin recargar la página
function reiniciarJuego() {
    setTimeout(() => {
        //Vaciar la cuadricula actual
        const cuadriculaContainer = document.querySelector("#cuadricula");
        cuadriculaContainer.innerHTML = ""; //Vaciar el contenido de la cuadrícula

        //Reiniciar variables
        array = [];
        contador2 = 0;

        //Generar una nueva cuadricula
        generarCuadricula();
    }, 5000); //Espera 5 segundos antes de reiniciar el juego
}
