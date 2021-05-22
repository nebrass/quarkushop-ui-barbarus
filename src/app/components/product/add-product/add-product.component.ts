import {Component, OnInit} from '@angular/core';
import {ProductService} from 'src/app/services/product/product.service';
import {Product} from '../../../models/product/product.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: Product = {
    categoryId: null,
    description: '',
    id: null,
    name: '',
    price: null,
    salesCounter: null,
    status: ''
  };
  submitted = false;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
  }

  saveProduct(): void {
    const data: Product = {
      categoryId: this.product.categoryId,
      description: this.product.description,
      name: this.product.name,
      price: this.product.price,
      id: null,
      salesCounter: 0,
      status: 'AVAILABLE'
    };

    this.productService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newProduct(): void {
    this.submitted = false;
    this.product = {
      categoryId: null,
      description: '',
      id: null,
      name: '',
      price: null,
      salesCounter: null,
      status: ''
    };
  }

}
