class Nafta {
    constructor(distancia, consumo, cantidad, precio) {
        this.distancia = distancia;
        this.consumo = consumo;
        this.cantidad = cantidad;
        this.precio = precio;
    }

    calcularInput() {
        $('input[name="nafta"]').each((i, e) => {
            if (e.checked) {
                let nuevoValor;

                switch (e.id) {
                    case 'distancia-nafta':
                        nuevoValor = this.calcularDistancia();
                        break;
                    case 'cantidad-nafta':
                        nuevoValor = this.calcularCantidad();
                        break;
                    case 'consumo-nafta':
                        nuevoValor = this.calcularConsumo();
                        break;
                }

                $(`#valor-${e.id}`).val(nuevoValor);

                if (e.id === 'cantidad-nafta')
                    $('#costo-trayecto-nafta').text(nafta.calcularCosto());
            }
        });

        sessionStorage.setItem('distanciaNafta', this.distancia);
        sessionStorage.setItem('consumoNafta', this.consumo);
        sessionStorage.setItem('cantidadNafta', this.cantidad);
    }

    toggleInputs(id) {
        $('input[name="nafta"]').each((i, e) => {
            if (e.id === id)
                $(`#valor-${id}`).attr('disabled', true);
            else
                $(`#valor-${e.id}`).removeAttr('disabled');
        });

        sessionStorage.setItem('radio', id);
    }

    calcularDistancia() {
        this.distancia = Math.round(this.consumo * this.cantidad * 100) / 100;
        return isNaN(this.distancia) ? 0 : this.distancia;
    }

    calcularConsumo() {
        this.consumo = Math.round((this.distancia / this.cantidad) * 100) / 100;
        return isNaN(this.consumo) ? 0 : this.consumo;
    }

    calcularCantidad() {
        this.cantidad = Math.round((this.distancia / this.consumo) * 100) / 100;
        return isNaN(this.cantidad) ? 0 : this.cantidad;
    }

    calcularCosto() {
        let costo = Math.round(this.cantidad * this.precio * 100) / 100;
        return isNaN(costo) ? 0 : costo;
    }
}

class Neumatico {
    constructor(costo, kilometros, recapados) {
        this.costo = costo;
        this.kilometros = kilometros;
        this.recapados = recapados;
    }

    agregarInputs(cantidad) {
        // Para mostrar los inputs
        for (let i = 0; i < cantidad; i++) {
            $(`#recapado-${i + 1}`).fadeIn("slow");
        }

        // Para remover los inputs que sobran
        for (let j = 5; j > cantidad; j--) {
            $(`#recapado-${j}`).fadeOut("fast");
        }
    }

    calcularInversion() {
        let inversion = this.costo;

        for (const recauchutado of this.recapados) {
            if (!isNaN(recauchutado.costo))
                inversion += recauchutado.costo;
        }

        return isNaN(inversion) ? 0 : inversion;
    }
    
    calcularKilometros() {
        let kilometros = this.kilometros;

        for (const recauchutado of this.recapados) {
            if (!isNaN(recauchutado.kilometros))
                kilometros += recauchutado.kilometros;
        }
        

        return isNaN(kilometros) ? 0 : kilometros;
    }

    calcularCostoTotal() {
        let costoTotal = Math.round((this.calcularInversion() / this.calcularKilometros()) * 10000) / 10000;
        return isNaN(costoTotal) ? 0 : costoTotal;
    }
}