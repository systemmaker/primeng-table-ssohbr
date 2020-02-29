import { Component, OnInit } from '@angular/core';
import { Car, LazyLoadEvent } from './types';
import { CarService } from './car.service';
import {SelectItem, MenuItem} from 'primeng/components/common/api';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  providers: [MessageService]
//   styles: [`
//         :host ::ng-deep .ui-table .ui-table-thead > tr > th {
//             position: -webkit-sticky;
//             position: sticky;
//             top: 70px;
//         }

//         @media screen and (max-width: 64em) {
//             :host ::ng-deep .ui-table .ui-table-thead > tr > th {
//                 top: 100px;
//             }
//         }
// `]
})
export class AppComponent implements OnInit {
   items: MenuItem[];
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
    constructor(private carService: CarService, private messageService: MessageService) {
      setTimeout(()=>{this.disable = true}, 5000)
     }

    ngOnInit() {
        this.getOtherData();
        //datasource imitation
       

        this.cols = [
            { field: 'vin', header: 'Vin', width: '20%' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand', width: '33%' },
            { field: 'color', header: 'Color' },
            { field: 'date', header: 'date' }
        ];

        this.items = [
            { label: 'View', icon: 'pi pi-search', command: (event) => this.viewCar(this.selectedCar) },
            { label: 'Delete', icon: 'pi pi-times', command: (event) => this.deleteCar(this.selectedCar) }
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



    viewCar(car: Car) {
        this.messageService.add({ severity: 'info', summary: 'Car Selected', detail: car.vin + ' - ' + car.brand });
    }

    deleteCar(car: Car) {
        this.delete();
        this.messageService.add({ severity: 'error', summary: 'Car Deleted', detail: car.vin + ' - ' + car.brand });
    }

    transferDate(m){
      // // console.log(m);
      // let dateString = m;
      // if(m){
      //   let obj = {...m}
      //   // console.log(m.getFullYear());
      //   // dateString = obj.getFullYear() + "/" + (obj.getMonth() +1) + "/" + obj.getDate()
      // }
      // console.log(dateString)
      // return m;
    }
}
