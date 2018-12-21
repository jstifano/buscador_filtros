import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import _ from "lodash";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "buscar";
  jsonUrl = "./assets/catalogo.json"; // Ruta donde se encuentra el archivo JSON
  dataObtained = null;
  input_filter = null;
  array_formatted = [];
  values_autocompleted = [];
  filters = []; // Array donde se guardaran los carros filtrados
  colors = "ROJOAZULBLANCONEGROAMARILLOMARRONVERDE"; // Colores de los carros

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
        data[i].body_type.toLowerCase() +
        data[i].car_make.toLowerCase() +
        data[i].car_model.toLowerCase() +
        data[i].car_trim.toLowerCase() +
        data[i].car_year.toLowerCase() +
        data[i].cylinder.toLowerCase() +
        data[i].date_delivery.toLowerCase() +
        data[i].doors.toLowerCase() +
        data[i].downpayment.toString() +
        data[i].engine.toLowerCase() +
        data[i].ext_color.toLowerCase() +
        data[i].fepm.toString() +
        data[i].filter_status.toLowerCase() +
        data[i].fuel_type.toLowerCase() +
        data[i].horsepower.toLowerCase() +
        //data[i].interior_color.toLowerCase() +
        data[i].km.toLowerCase() +
        data[i].location_filter.toLowerCase() +
        data[i].market_price.toString() +
        data[i].passengers.toString() +
        data[i].price.toString() +
        data[i].savings.toString() +
        data[i].seats.toLowerCase() +
        data[i].status.toLowerCase() +
        data[i].traction.toLowerCase() +
        data[i].transmission.toLowerCase() +
        data[i].uber_type.toLowerCase();

      object.word_minimized.replace(/ /g, ""); // Quito todos los espacios en blanco del string completo

      this.array_formatted.push(object.word_minimized); // Agrego el string nuevo de los filtros al arreglo formateado
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
    this.input_filter = entry || null; // Si el entry no existe, le asigno null
    
    if (this.input_filter) {
      // Si la variable en entrada no es null ni vacia entonces ...
      split_filters = this.input_filter.toLowerCase().split(" ");
      for (let j = 0; j < split_filters.length; j++) {
        // Quiere decir que hay mas de un filtro para recorrer en el split
        if (j > 0) {
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
}
