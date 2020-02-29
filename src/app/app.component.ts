import { Component, OnInit } from '@angular/core';
import { Car, LazyLoadEvent } from './types';
import { CarService } from './car.service';

import {SelectItem} from 'primeng/api';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styles: [`
        .ui-table.ui-table-cars .ui-table-caption.ui-widget-header {
            border: 0 none;
            padding: 12px;
            text-align: left;
            font-size: 20px;
        }

        .ui-column-filter {
            margin-top: 1em;
        }

        .ui-column-filter .ui-multiselect-label {
            font-weight: 500;
        }
        
        .ui-table.ui-table-cars .ui-table-thead > tr > th {
            border: 0 none;
            text-align: left;
        }
        
        .ui-table-globalfilter-container {
            float: right;
            display: inline;
        }

        .ui-table.ui-table-cars .ui-table-tbody > tr > td {
            border: 0 none;
        }

        .ui-table.ui-table-cars .ui-table-tbody .ui-column-title {
            font-size: 16px;
        }

        .ui-table.ui-table-cars .ui-paginator {
            border: 0 none;
            padding: 1em;
        }
    ` ],
})
export class AppComponent implements OnInit {
   datasource: Car[];

    cars: Car[];

    selectedCar: Car;

    totalRecords: number;

    cols: any[];

    cities2: SelectItem[] = [
      {label:'Select City', value:null},
        {label: 'New York', value: 'NY'},
        {label: 'Rome', value: 'RM'},
        {label: 'London', value: 'LDN', disabled: true, title: 'Doesn\'t work and this message needs to be longer than it is right now.'},
        {label: 'Istanbul', value: 'IST'},
        {label: 'Paris', value: 'PRS'}
    ];
    selectedCity2: City;
    placeholderText = "Select Option"

    loading: boolean;
    pageSizeOptions = [10, 25, 50, {showAll: 'All'}]
    disable = false;
    constructor(private carService: CarService) {
      setTimeout(()=>{this.disable = true}, 5000)
     }

    ngOnInit() {
        this.getOtherData();
        //datasource imitation
       

        this.cols = [
            { field: 'vin', header: 'Vin', width: '20%' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand', width: '33%' },
            { field: 'color', header: 'Color' }
        ];
        this.getCars();
        // this.loading = true;
        setTimeout(()=> {this.placeholderText = 'It has changed'}, 5000)
    }

    getCars(){
       this.carService.getCarsLarge().then(cars => {
            this.datasource = cars;
            this.cars = this.datasource;
            // this.cars = cars
            this.totalRecords = this.datasource.length;
        });
    }
    loadCarsLazy(event) {  
        this.loading = true;

        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        //imitate db connection over a network
        setTimeout(() => {
            if (this.datasource) {
                this.cars = this.datasource.slice(event.first, (event.first + event.rows));
                this.loading = false;
            }
        }, 100);

    }

    buttonClick(){
      console.log('button clicked!')
    }

    getOtherData(){
       this.carService.getTableSource().then(cars => {
            console.log(cars)
            // this.datasource = cars;
            // this.totalRecords = this.datasource.length;
        });
    }


    displayDialog: boolean;

    car: Car = {};

    newCar: boolean;
    showDialogToAdd() {
        this.newCar = true;
        this.car = {};
        this.displayDialog = true;
    }

    save() {
        let cars = [...this.cars];
        if (this.newCar)
            cars.push(this.car);
        else
            cars[this.cars.indexOf(this.selectedCar)] = this.car;

        this.cars = cars;
        this.car = null;
        this.displayDialog = false;
    }

    delete() {
        let index = this.cars.indexOf(this.selectedCar);
        this.cars = this.cars.filter((val, i) => i != index);
        this.car = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        console.log(event)
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }

    cloneCar(c: Car): Car {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }

    cancel(){
      this.newCar = false;
      this.car = null;
      this.displayDialog = false;

    }
}
