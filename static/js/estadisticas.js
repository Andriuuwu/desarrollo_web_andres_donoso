// Aquí definimos las 3 funciones correspondientes a cada uno de los gráficos
// Cada una tiene un fetch que lo que hará será crear el gráfico a la par de que cargamos la página de estadisticas.

const completarDiasSinAvistamientos = (datosGrafico) => {
    if (datosGrafico.length === 0) return datosGrafico;

    let cantidadPorDia = new Map(datosGrafico);
    let primerDia = datosGrafico[0][0];
    let ultimoDia = datosGrafico[datosGrafico.length - 1][0];
    let diaEnMilisegundos = 24 * 60 * 60 * 1000;
    let datosCompletos = [];

    for (let dia = primerDia; dia <= ultimoDia; dia += diaEnMilisegundos) {
        datosCompletos.push([dia, cantidadPorDia.get(dia) || 0]);
    }

    return datosCompletos;
};

const graficarAvistamientosPorDia = () => {
    let grafico = Highcharts.chart("graficoLineas", {
        chart: {
            type: "line"
        },
        title: {
            text: "Avistamientos registrados por día"
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                day: "%e %b %Y"
            },
            title: {
                text: "Día"
            }
        },
        yAxis: {
            title: {
                text: "Cantidad de avistamientos"
            },
            allowDecimals: false,
            min: 0
        },
        tooltip: {
            xDateFormat: "%d/%m/%Y"
        },
        series: [
            {
                name: "Avistamientos",
                data: [],
                marker: {
                    enabled: true,
                    radius: 4
                }
            }
        ]
    });

    fetch("/datos-avistamientos-por-dia")
        .then((response) => response.json())
        .then((datos) => {
            let datosGrafico = completarDiasSinAvistamientos(
                datos.map((item) => {
                    let [anio, mes, dia] = item.fecha
                        .split("-")
                        .map((parte) => parseInt(parte, 10));
                    return [Date.UTC(anio, mes - 1, dia), item.cantidad];
                })
            );

            grafico.update({
                series: [
                    {
                        data: datosGrafico
                    }
                ]
            });
        })
        .catch((error) => console.error("Error:", error));
};

const graficarAvistamientosPorAve = () => {
    let grafico = Highcharts.chart("graficoTorta", {
        chart: {
            type: "pie"
        },
        title: {
            text: "Avistamientos por tipo de ave"
        },
        tooltip: {
            pointFormat: "<b>{point.y}</b> avistamientos ({point.percentage:.1f}%)"
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.y}"
                }
            }
        },
        series: [
            {
                name: "Avistamientos",
                data: []
            }
        ]
    });

    fetch("/datos-avistamientos-por-ave")
        .then((response) => response.json())
        .then((datos) => {
            let datosGrafico = datos.map((item) => {
                return {
                    name: item.ave,
                    y: item.cantidad
                };
            });

            grafico.update({
                series: [
                    {
                        data: datosGrafico
                    }
                ]
            });
        })
        .catch((error) => console.error("Error:", error));
};

const graficarVoluntariosPorComuna = () => {
    let grafico = Highcharts.chart("graficoBarras", {
        chart: {
            type: "column"
        },
        title: {
            text: "Voluntarios registrados por comuna"
        },
        xAxis: {
            categories: [],
            title: {
                text: "Comuna"
            }
        },
        yAxis: {
            title: {
                text: "Cantidad de voluntarios"
            },
            allowDecimals: false,
            min: 0
        },
        tooltip: {
            pointFormat: "<b>{point.y}</b> voluntarios"
        },
        legend: {
            enabled: false
        },
        series: [
            {
                name: "Voluntarios",
                data: []
            }
        ]
    });

    fetch("/datos-voluntarios-por-comuna")
        .then((response) => response.json())
        .then((datos) => {
            let comunas = datos.map((item) => item.comuna);
            let cantidades = datos.map((item) => item.cantidad);

            grafico.update({
                xAxis: {
                    categories: comunas
                },
                series: [
                    {
                        data: cantidades
                    }
                ]
            });
        })
        .catch((error) => console.error("Error:", error));
};

graficarAvistamientosPorDia();
graficarAvistamientosPorAve();
graficarVoluntariosPorComuna();