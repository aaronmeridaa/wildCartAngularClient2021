import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeService } from 'src/app/service/datetime.service';
import { ProductoService } from 'src/app/service/producto.service';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Iproduct  } from 'src/app/model/producto-interfaces';

declare let $: any;


@Component({
  selector: 'app-new-producto',
  templateUrl: './new-producto.component.html',
  styleUrls: ['./new-producto.component.css']
})
export class NewProductoComponent implements OnInit {

  oProduct2Send : any;
  id: number = 0;
  oForm: FormGroup = null;
  strResult: string = "";

  get f() { return this.oForm.controls; }

  constructor(
    private oFormBuilder: FormBuilder,
    private oRouter: Router,
    private oProductoService: ProductoService,
    private oActivatedRoute: ActivatedRoute,  
    private oLocation: Location,
    private oDateTimeService: DateTimeService
    ) {

    if (this.oActivatedRoute.snapshot.data.message) {
      const strUsuarioSession: string = this.oActivatedRoute.snapshot.data.message;
      localStorage.setItem("user", strUsuarioSession);
    } else {
      localStorage.clear();
      oRouter.navigate(['/home']);
    }

  }

  ngOnInit(): void {
    this.oForm = this.oFormBuilder.group({
      codigo: ['', [Validators.required]],
      nombre: ['', Validators.required],
      existencias: ['', Validators.required],
      precio: ['', Validators.required],
      imagen: [''],
      descuento:[''],
      id_tipoproducto:['', Validators.required]
    });
    
  }

  onSubmit(): void {
    if (this.oForm) {
      this.oProduct2Send = {
        codigo: this.oForm.value.codigo,
        nombre: this.oForm.value.nombre,
        existencias: this.oForm.value.existencias,
        precio: this.oForm.value.precio,
        imagen: this.oForm.value.imagen,
        descuento: this.oForm.value.descuento,
        id_tipoproducto: this.oForm.value.id_tipoproducto,
      }
      this.new();
    }
  }

  new = ():void => {
    console.log(this.oProduct2Send)
    this.oProductoService.newOne(JSON.stringify(this.oProduct2Send)).subscribe((oProduct:Iproduct) => {
      if (oProduct.id) {
        this.id = oProduct.id;
        this.strResult = "El post se ha creado correctamente";
      } else {
        this.strResult = "Error en la creación del registro";
      }
      this.openModal();
    })
  }

  goBack():void {
    this.oLocation.back();
  }

  eventsSubject: Subject<void> = new Subject<void>();


  openModal():void {
    this.eventsSubject.next();
  }

  closeModal() {
    this.oRouter.navigate(["/plist"]);
  }

}