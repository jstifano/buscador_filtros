export function findValueInObject(data, search: string, exclude?) {
  let exc;
  for (const key in data) {
    exc = false;
    exclude.forEach(e => {
      if (e === key) exc = true;
    });
    if (data.hasOwnProperty(key) && !exc) {
      console.log(key);
      const element = data[key];
      if (element instanceof Object) {
      }
      if (element === search) return true;
    }
  }
  return false;
}
