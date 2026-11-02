Tarea 3 - Desarrollo de Aplicaciones Web
Hecho por: Andres Donoso

Esta tercera entrega consiste en una continuación sobre la Tarea 2 al implementar la sección de Estadísticas y al agregar detalles a cada uno de los avistamientos en el caso de los comentarios. A continuación explico algunas de las decisiones que tomé al momento de desarrollar esta tarea:

1. Para los gráficos usé la biblioteca Highcharts importada directamente desde el bloque scripts en estadisticas.html
2. En el gráfico de líneas, sucede que la consulta solamente entrega los días que tienen avistamientos, por lo que se decidió en completar con un 0 los días que no tienen nada registrado.
3. Elegí fetch para las peticiones asíncronas porque es más simple y fue lo que se vio en los auxiliares
4. Para testear la funcionalidad de los gráficos creé 3 avistamientos junto con 3 voluntarios, los registros de prueba fueron 2 zorzales y 1 gorrión, todos guardados en static/uploads
5. El estilo de las nuevas interfaces sigue el mismo diseño que el aplicado para la tarea 2
6. Me apoyé en los auxiliares 6, 7 y 8 en cuanto toda la estructura del código como también en herramientas a usar (en el caso de fetch y highcharts)