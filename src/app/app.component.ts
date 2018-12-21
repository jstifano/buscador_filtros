import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import _ from "lodash";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  jsonUrl = "./assets/catalogo.json"; // Ruta donde se encuentra el archivo JSON
  dataObtained = null;
  input_filter = null;
  array_formatted = [];
  values_autocompleted = [];
  filters = []; // Array donde se guardaran los carros filtrados

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getJson().subscribe(info => {
      this.dataObtained = info["data"];
      this.getValuesForAutoComplete(this.dataObtained);
      this.formattingData(info["data"]);
    });
  }

  /**********************************************
   * Funcion para recibir el json mediante HTTP  *
   **********************************************/
  getJson() {
    return this.http.get(this.jsonUrl);
  }

  /**********************************************************************
   * Funcion para formatear los filtros de la data obtenida en strings  *
   **********************************************************************/
  formattingData = data => {
    let object = {
      word_minimized: ""
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

      object.word_minimized.replace(/ /g, ""); // Quito todos los espacios en blanco del string completo
      object.word_minimized = object.word_minimized.toLowerCase();
      let word_formatted = this.takeOffAcents(object.word_minimized);
      this.array_formatted.push(word_formatted); // Agrego el string nuevo de los filtros al arreglo formateado
      object.word_minimized = ""; // Limpio la variable local del objeto
    }
  };

  /*********************************************************************
   * Funcion para realizar la búsqueda mediante los filtros ingresados *
   *********************************************************************/

  makeSearching = (entry) => {
    let split_filters = []; // Todos los filtros cada uno colocado en una posicion del arreglo
    let aux_array_formatted = [];
    this.filters = [];
    this.input_filter = this.takeOffAcents(entry) || null; // Si el entry no existe, le asigno null
    
    if (this.input_filter) {
      // Si la variable en entrada no es null ni vacia entonces ...
      split_filters = this.input_filter.toLowerCase().split(" ");
      for (let j = 0; j < split_filters.length; j++) {
        // Quiere decir que hay mas de un filtro para recorrer en el split
        if (j > 0) {
          this.filters = [];
          for (let h = 0; h < aux_array_formatted.length; h++) {
            if (aux_array_formatted[h].data.indexOf(split_filters[j]) !== -1) {
              this.filters.push(
                this.dataObtained[aux_array_formatted[h].pos]
              ); 
            } else {
              this.filters.splice(h, 1);
            }
          }
        } else {
          // Solamente el usuario coloco un filtro

          for (let i = 0; i < this.array_formatted.length; i++) {
            // Si los filtros ingresados son iguales al string en la pos del array, entonces ...
            if (this.array_formatted[i].indexOf(split_filters[j]) !== -1) {
              let new_info = {
                pos: i,
                data: this.array_formatted[i]
              };

              this.filters.push(this.dataObtained[i]);
              aux_array_formatted.push(new_info);              
            }
          }
        }
      }
    } else {
      this.filters = [];
      this.input_filter = null;
    }

    this.filters = _.uniqBy(this.filters, "id"); // Quito los registros que esten duplicados
    console.log("Filters ::: ", this.filters);
  };

  valueAutoComplete(data: any): string {
    return `(${data["id"]}) ${data["car_name"]}`;
  }

  getValuesForAutoComplete = data => {
    for (let i = 0; i < data.length; i++) {
      let new_value = {
        id: i,
        value: data[i].car_name
      };

      this.values_autocompleted.push(new_value);
    }
  };

  /*************************************************
  * Función para quitar los acentos de una palabra *
  **************************************************/
  takeOffAcents = (s) => {
    let r = null
    if(s){
      r = s.toLowerCase();
    }
    else {
      return s;
    }
    
    //r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
            
    return r;
  }
}
