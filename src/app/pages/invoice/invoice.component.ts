import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';


import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Invoice } from '../../shared/interfaces/invoice';
import { Router } from 'express';
import { CheckoutService } from '../../core/services/checkout/checkout.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  imports: [NgFor,NgIf],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit{
  invoiceDetails!:Invoice;
    

  private readonly checkoutService=inject(CheckoutService);

  ngOnInit(): void {
    console.log(   this.checkoutService.invoiceData());

    this.invoiceDetails= this.checkoutService.invoiceData()!;

    
;
  }


  
 
  

 








}
