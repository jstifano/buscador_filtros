export function findValueInObject(object: {}, search: string, include?: []) {
  //   Recorrer todo el objeto
  for (let i = 0; i < include.length; i++) {
    // // Si el objeto tiene el campo key y no esta excluido
    // if (object.hasOwnProperty(key)) {
    const element = takeOffAcents(object[include[i]]);
    //   Si el elemento es un objeto
    // if (element instanceof Object) {
    //   //   Si dentro de la propiedad esta la palabra a buscar
    //   if (findValueInObject(element, search)) return true;
    // }
    // //   Si el elemento es de tipo string
    // else
    // if (typeof element === 'string') {
    //   Si la palabra a guscar esta dentro del objeto
    if (
      element.toLowerCase().indexOf(takeOffAcents(search.toLowerCase())) !== -1
    )
      return true;
    // }
    // }
  }
  return false;
}

export function filterTextInArrayOfObjects(data, search: string, include?) {
  let filtered = data;
  //   Separar los parametros de busqueda
  let parameters = search.split(' ');
  //   Recorrer todos los parametros
  for (let i = 0; i < parameters.length; i++) {
    // Faltrar la data por el parametro
    filtered = filtered.filter(object =>
      findValueInObject(object, parameters[i], include)
    );
  }
  return filtered;
}

const takeOffAcents = s => {
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
};
