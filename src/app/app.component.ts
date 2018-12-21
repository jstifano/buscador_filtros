import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';
import findCars from './find-cars';
import { findValueInObject } from './find-value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jsonUrl = './assets/catalogo.json'; // Ruta donde se encuentra el archivo JSON
  dataObtained = null;
  input_filter = null;
  array_formatted = [];
  values_autocompleted = [];
  filters = []; // Array donde se guardaran los carros filtrados
  data = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getJson().subscribe(info => {
      this.data = info['data'];
      this.dataObtained = info['data'];
      this.getValuesForAutoComplete(this.dataObtained);
    });
  }

  /**********************************************
   * Funcion para recibir el json mediante HTTP  *
   **********************************************/
  getJson() {
    return this.http.get(this.jsonUrl);
  }

  makeSearching(input_filter) {
    this.filters = findCars(this.data, input_filter);
    findValueInObject(this.data[0], input_filter, ['interior_color']);
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
