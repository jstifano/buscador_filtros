export function findValueInObject(o, s: string) {
  s = takeOffAcents(s.toLowerCase());
  if (o.car_model.toLowerCase().indexOf(s) > -1) return true;
  else if (o.car_make.toLowerCase().indexOf(s) > -1) return true;
  else if (o.car_trim.toLowerCase().indexOf(s) > -1) return true;
  else if (o.car_year.toLowerCase().indexOf(s) > -1) return true;
  else if (o.body_type.toLowerCase().indexOf(s) > -1) return true;
  else if (o.cylinder.toLowerCase().indexOf(s) > -1) return true;
  else if (o.doors.toLowerCase().indexOf(s) > -1) return true;
  else if (o.ext_color.toLowerCase().indexOf(s) > -1) return true;
  else if (o.fuel_type.toLowerCase().indexOf(s) > -1) return true;
  else if (o.horsepower.toLowerCase().indexOf(s) > -1) return true;
  else if (o.location_filter.toLowerCase().indexOf(s) > -1) return true;
  else if (
    o.passengers
      .toString()
      .toLowerCase()
      .indexOf(s) > -1
  )
    return true;
  else if (o.seats.toLowerCase().indexOf(s) > -1) return true;
  else if (o.status.toLowerCase().indexOf(s) > -1) return true;
  else if (o.traction.toLowerCase().indexOf(s) > -1) return true;
  else if (o.transmission.toLowerCase().indexOf(s) > -1) return true;
  return false;
}

export function filterTextInArrayOfObjects(data, search: string, include?) {
  let filtered = data;
  //   Separar los parametros de busqueda
  let parameters = search.split(' ');
  //   Recorrer todos los parametros
  for (let i = 0; i < parameters.length; i++) {
    // Filtrar la data por el parametro
    filtered = filtered.filter(object =>
      findValueInObject(object, parameters[i])
    );
  }
  return filtered;
}

export function filterAndAutocompleteTextInArrayOfObjects(
  data,
  search: string
) {
  let filtered = data;
  let aux = [];
  let autocompleteRaw = {
    car_model: {},
    car_make: {},
    ext_color: {}
  };
  let autocomplete = [];
  //   Separar los parametros de busqueda
  let parameters = search.split(' ');
  //   Recorrer todos los parametros
  for (let i = 0; i < parameters.length; i++) {
    aux = [];
    const parametro = takeOffAcents(parameters[i].toLowerCase());
    // Recorrer todos los carros
    if (parametro !== '') {
      for (let j = 0; j < filtered.length; j++) {
        const carro = filtered[j];
        if (
          carro.car_model.toLowerCase().indexOf(parametro) > -1 ||
          carro.car_make.toLowerCase().indexOf(parametro) > -1
        ) {
          aux.push(carro);
          if (!autocompleteRaw['car_make'][carro.car_make]) {
            autocompleteRaw['car_make'][carro.car_make] = carro.car_make;
          }
          if (!autocompleteRaw['car_model'][carro.car_model]) {
            autocompleteRaw['car_model'][carro.car_model] =
              carro.car_make + ' ' + carro.car_model;
          }
        } else if (carro.ext_color.toLowerCase().indexOf(parametro) > -1) {
          aux.push(carro);
          autocompleteRaw['ext_color'][carro.ext_color] = carro.ext_color;
        } else if (
          carro.car_trim.toLowerCase().indexOf(parametro) > -1 ||
          carro.body_type.toLowerCase().indexOf(parametro) > -1 ||
          carro.location_filter.toLowerCase().indexOf(parametro) > -1 ||
          carro.car_year.toLowerCase().indexOf(parametro) > -1 ||
          carro.cylinder.toLowerCase().indexOf(parametro) > -1 ||
          carro.fuel_type.toLowerCase().indexOf(parametro) > -1 ||
          carro.doors.toLowerCase().indexOf(parametro) > -1 ||
          carro.horsepower.toLowerCase().indexOf(parametro) > -1 ||
          carro.passengers
            .toString()
            .toLowerCase()
            .indexOf(parametro) > -1 ||
          carro.seats.toLowerCase().indexOf(parametro) > -1 ||
          carro.traction.toLowerCase().indexOf(parametro) > -1 ||
          carro.transmission.toLowerCase().indexOf(parametro) > -1
        ) {
          aux.push(carro);
        }
      }
      filtered = aux;
    }
  }

  if (autocompleteRaw.car_make) {
    for (const key in autocompleteRaw.car_make) {
      if (autocompleteRaw.car_make.hasOwnProperty(key)) {
        const element = autocompleteRaw.car_make[key];
        autocomplete.push({ value: element });
      }
    }
  }
  if (autocompleteRaw.car_model) {
    for (const key in autocompleteRaw.car_model) {
      if (autocompleteRaw.car_model.hasOwnProperty(key)) {
        const element = autocompleteRaw.car_model[key];
        autocomplete.push({ value: element });
      }
    }
  }
  if (autocompleteRaw.ext_color) {
    for (const key in autocompleteRaw.ext_color) {
      if (autocompleteRaw.ext_color.hasOwnProperty(key)) {
        const element = autocompleteRaw.ext_color[key];
        autocomplete.push({ value: element });
      }
    }
  }

  return { filtered: filtered, autocomplete: autocomplete };
}

function takeOffAcents(s) {
  let r = null;
  if (s && typeof s === 'string') {
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
}
