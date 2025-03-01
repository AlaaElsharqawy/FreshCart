import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

   categories:WritableSignal<ICategory[]>=signal([]);
   
  private readonly categoriesService=inject(CategoriesService);

  ngOnInit(): void {
    this.getCategoriesData();
  
  }

  getCategoriesData():void{
    this.categoriesService.getAllCategories().subscribe({
      next:(response)=>{
        console.log(response.data);
        this.categories.set(response.data);
      }
    })
  }


}
