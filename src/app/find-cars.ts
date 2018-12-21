import _ from 'lodash';

/* 
    Busca los vehiculos que cumplan con la condicion del filtro, para el 
    correcto funcionamiento necesita la libreria lodash
    Recibe: 
        data: arreglo con todos los vehiculos
        input_filter: el string con las palabras a buscar
    Retorna: Un arreglo que contiene los vehiculos ya filtrados
 */

export default function findCars(data, input_filter) {
  console.log(input_filter);
  let dataObtained = data;
  let array_formatted = [];
  let filters = []; // Array donde se guardaran los carros filtrados
  let object;
  /**********************************************************************
   * Funcion para formatear los filtros de la data obtenida en strings  *
   **********************************************************************/
  const formattingData = data => {
    object = {
      word_minimized: ''
    };

    for (let i = 0; i < data.length; i++) {
      // Asigno todos los filtros en un string minimizado para la busqueda mas eficiente
      object.word_minimized =
        data[i].body_type +
        data[i].car_make +
        data[i].car_model +
        data[i].car_trim +
        data[i].car_year +
        data[i].cylinder +
        data[i].doors +
        data[i].downpayment.toString() +
        data[i].ext_color +
        data[i].fepm.toString() +
        data[i].filter_status +
        data[i].fuel_type +
        data[i].horsepower +
        data[i].km +
        data[i].location_filter +
        data[i].market_price.toString() +
        data[i].passengers.toString() +
        data[i].price.toString() +
        data[i].savings.toString() +
        data[i].seats +
        data[i].status +
        data[i].traction +
        data[i].transmission +
        data[i].uber_type;

      object.word_minimized.replace(/ /g, ''); // Quito todos los espacios en blanco del string completo
      object.word_minimized = object.word_minimized.toLowerCase();
      let word_formatted;
      if (object.word_minimized) {
        word_formatted = takeOffAcents(object.word_minimized);
      }
      array_formatted.push(word_formatted); // Agrego el string nuevo de los filtros al arreglo formateado
      object.word_minimized = ''; // Limpio la variable local del objeto
    }
  };

  /*********************************************************************
   * Funcion para realizar la búsqueda mediante los filtros ingresados *
   *********************************************************************/

  const makeSearching = entry => {
    let split_filters = []; // Todos los filtros cada uno colocado en una posicion del arreglo
    let aux_array_formatted = [];
    filters = [];
    input_filter = takeOffAcents(entry) || null; // Si el entry no existe, le asigno null

    if (input_filter) {
      // Si la variable en entrada no es null ni vacia entonces ...
      split_filters = input_filter.toLowerCase().split(' ');
      for (let j = 0; j < split_filters.length; j++) {
        // Quiere decir que hay mas de un filtro para recorrer en el split
        if (j > 0) {
          filters = [];
          for (let h = 0; h < aux_array_formatted.length; h++) {
            if (aux_array_formatted[h].data.indexOf(split_filters[j]) !== -1) {
              filters.push(dataObtained[aux_array_formatted[h].pos]);
            } else {
              filters.splice(h, 1);
            }
          }
        } else {
          // Solamente el usuario coloco un filtro

          for (let i = 0; i < array_formatted.length; i++) {
            // Si los filtros ingresados son iguales al string en la pos del array, entonces ...
            if (array_formatted[i].indexOf(split_filters[j]) !== -1) {
              let new_info = {
                pos: i,
                data: array_formatted[i]
              };

              filters.push(dataObtained[i]);
              aux_array_formatted.push(new_info);
            }
          }
        }
      }
    } else {
      filters = dataObtained;
      input_filter = null;
    }

    filters = _.uniqBy(filters, 'id'); // Quito los registros que esten duplicados
    console.log('Filters ::: ', filters);
  };

  /*************************************************
   * Función para quitar los acentos de una palabra *
   **************************************************/
  const takeOffAcents = s => {
    let r = null;
    if (s) {
      r = s.toLowerCase();
    } else {
      return s;
    }

    //r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
    r = r.replace(new RegExp(/[èéêë]/g), 'e');
    r = r.replace(new RegExp(/[ìíîï]/g), 'i');
    r = r.replace(new RegExp(/ñ/g), 'n');
    r = r.replace(new RegExp(/[òóôõö]/g), 'o');
    r = r.replace(new RegExp(/[ùúûü]/g), 'u');

    return r;
  };

  formattingData(data);
  makeSearching(input_filter);
  return filters;
}
