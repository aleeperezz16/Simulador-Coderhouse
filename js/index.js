const neumatico = new Neumatico(0, 0, []);
const nafta = new Nafta(0, 0, 0, 0);

$(() => {
    /*
     * Esta seccion es todo respecto a la calculadora de nafta
     */

    $('input[name="nafta"]').on('change', function () {
        nafta.toggleInputs(this.id);
    });

    $('#valor-distancia-nafta').on('input', function () {
        nafta.distancia = this.value;
        nafta.calcularInput();
    });

    $('#valor-consumo-nafta').on('input', function () {
        nafta.consumo = this.value;
        nafta.calcularInput();
    });

    $('#valor-cantidad-nafta').on('input', function () {
        nafta.cantidad = this.value;
        nafta.calcularInput();
        $('#costo-trayecto-nafta').text(nafta.calcularCosto());
    });

    $('#valor-precio-nafta').on('input', function () {
        nafta.precio = this.value;
        sessionStorage.setItem('precioNafta', nafta.precio);
        $('#costo-trayecto-nafta').text(nafta.calcularCosto());
    });

    /*
     * Esta seccion es todo respecto a la calculadora de neumáticos
     */

    $('#cantidad-recapados').on('change', function () {
        neumatico.agregarInputs(this.value);
    });

    $('#calcular-neumaticos').on('click', () => {
        neumatico.costo = parseFloat($('#costo-neumatico').val());
        neumatico.kilometros = parseFloat($('#kilometros-neumatico').val());
        let cantRecapados = parseInt($('#cantidad-recapados').val());

        // Reseteo la cantidad de recapados a 0 otra vez (esto sirve para limpiar un array google mi buen amigo :p)
        neumatico.recapados.length = 0;

        for (let i = 0; i < cantRecapados; i++) {
            const recapado = {
                costo: parseFloat($(`#costo-recapado-${i + 1}`).val()),
                kilometros: parseFloat($(`#km-recapado-${i + 1}`).val())
            }

            neumatico.recapados.push(recapado);
        }

        $('#total-inversion-neumaticos').text(neumatico.calcularInversion());
        $('#total-costo-neumaticos').text(neumatico.calcularCostoTotal());
        $('#total-kilometros-neumaticos').text(neumatico.calcularKilometros());

        sessionStorage.setItem('neumaticos', JSON.stringify(neumatico));
    });

    /*
     * Esta seccion es todo respecto a cubiertas de neumáticos
     */

    $.getJSON('json/cubiertas.json', (data) => {
        data.forEach(neumatico => {
            crearCarta(neumatico);
        });
    });

    /*
     * Cargamos las cosas desde la storage
     */

    cargarStorage();
});

function crearCarta(neumatico) {
    $('#neumaticos').append(
        `
        <div class="card no-display" style="width: 18rem;" id="${neumatico.id}">
            <img src="${neumatico.img}" class="card-img-top" alt="${neumatico.modelo}" height=250px>
            <div class="card-body bg-opacity-25 bg-dark">
                <h5 class="card-title">${neumatico.modelo}</h5>
                <div class="card-text">
                    <h6 class="mb-0">Precio</h6>
                    <span>$${neumatico.precio}</span>

                    <h6 class="mb-0">Tamaño y rodado</h6>
                    <span>${neumatico.tmrd}</span>

                    <h6 class="mb-0">Velocidad máxima</h6>
                    <span>${neumatico.velocidad} km/h</span>
                </div>
            </div>
        </div>
        `
    );

    console.log($(`#${neumatico.id}`).fadeIn("slow"));
}

function cargarStorage() {
    /*
     * Se carga las cosas de la nafta
     */

    // Convierto a Number lo que sea, en caso de no estar en el storage devolveria null. Convertir ese 'null' me lo devuelve a 0
    nafta.distancia = Number(sessionStorage.getItem('distanciaNafta'));
    nafta.consumo = Number(sessionStorage.getItem('consumoNafta'));
    nafta.cantidad = Number(sessionStorage.getItem('cantidadNafta'));
    nafta.precio = Number(sessionStorage.getItem('precioNafta'));

    // ponemos los valores en el input
    $('#valor-distancia-nafta').val(nafta.distancia);
    $('#valor-consumo-nafta').val(nafta.consumo);
    $('#valor-cantidad-nafta').val(nafta.cantidad);
    $('#valor-precio-nafta').val(nafta.precio);

    // bloqueamos en input
    const radio = sessionStorage.getItem('radio');
    if (radio != null) {
        $(`#${radio}`).attr('checked', true);
        nafta.toggleInputs(radio);
    }

    // realizamos los calculos
    nafta.calcularInput();
    $('#costo-trayecto-nafta').text(nafta.calcularCosto());

    /*
     * Se carga las cosas del neumático
     */

    const guardadoNeumatico = JSON.parse(sessionStorage.getItem('neumaticos'));

    if (guardadoNeumatico != null) {
        // cargamos todo a nuestro objeto
        neumatico.costo = guardadoNeumatico.costo;
        neumatico.kilometros = guardadoNeumatico.kilometros;
        neumatico.recapados = guardadoNeumatico.recapados;

        // Ponemos en los inputs los valores almacenados
        $('#costo-neumatico').val(neumatico.costo);
        $('#kilometros-neumatico').val(neumatico.kilometros);

        // Ejecutamos el trigger para que haga los efectitos del fade
        $('#cantidad-recapados').val(neumatico.recapados.length).trigger('change');

        // Cargamos las cosas almacenadas en los recauchutados
        let i = 1;
        for (const recapado of neumatico.recapados) {
            $(`#costo-recapado-${i}`).val(recapado.costo);
            $(`#km-recapado-${i}`).val(recapado.kilometros);

            i++;
        }
    }
}