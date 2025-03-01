import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/IBrand/ibrand';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
 

  brands:WritableSignal<IBrand[]>=signal([]);
  private readonly brandsService=inject(BrandsService);

  ngOnInit(): void {
    this.getAllBrands();
  }


  getAllBrands():void{
    this.brandsService.GetAllBrands().subscribe({
      next:(res)=>{
        console.log(res.data)
        this.brands.set(res.data);
      }
    })
  }



  
}
