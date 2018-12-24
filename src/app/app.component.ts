import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  filterAndAutocompleteTextInArrayOfObjects,
  filterTextInArrayOfObjects,
  findValueInObject
} from './find-value';

import { CompleterService, CompleterData } from 'ng2-completer';

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
  filters = {
    filtered: [],
    autocomplete: []
  }; // Array donde se guardaran los carros filtrados
  data = null;
  dataService: CompleterData;

  constructor(
    private http: HttpClient,
    private completerService: CompleterService
  ) {}

  ngOnInit() {
    this.getJson().subscribe(info => {
      this.data = info['data'];
      this.dataObtained = info['data'];
    });
  }

  /**********************************************
   * Funcion para recibir el json mediante HTTP  *
   **********************************************/
  getJson() {
    return this.http.get(this.jsonUrl);
  }

  makeSearching(input_filter) {
    this.filters = filterAndAutocompleteTextInArrayOfObjects(
      this.data,
      input_filter
    );
    this.dataService = this.completerService.local(
      this.filters.autocomplete,
      'value',
      'value'
    );
  }
}
