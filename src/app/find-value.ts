export function findValueInObject(object: {}, search: string, exclude?: []) {
  let exc;
  for (const key in object) {
    exc = false;
    if (exclude) {
      exclude.forEach(e => {
        if (e === key) exc = true;
      });
    }
    if (object.hasOwnProperty(key) && !exc) {
      const element = object[key];
      if (element instanceof Object) {
        if (findValueInObject(element, search)) return true;
      } else if (typeof element === 'string') {
        if (element.toLowerCase().indexOf(search.toLowerCase()) !== -1)
          return true;
      }
    }
  }
  return false;
}

export function filterTextInArrayOfObjects(data, search: string, exclude?) {
  let filtered = data;
  let f;
  let parameters = search.split(' ');
  parameters.forEach(parameter => {
    filtered = filtered.filter(object =>
      findValueInObject(object, parameter, exclude)
    );
  });
  return filtered;
}
