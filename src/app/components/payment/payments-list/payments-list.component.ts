import {Component, OnInit} from '@angular/core';
import {PaymentService} from 'src/app/services/payment/payment.service';
import {Payment} from '../../../models/payment/payment.model';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.css']
})
export class PaymentsListComponent implements OnInit {

  payments: Array<Payment>;
  currentPayment: Payment = null;
  currentIndex = -1;
  title = '';

  constructor(private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.retrievePayments();
  }

  retrievePayments(): void {
    this.paymentService.getAll()
      .subscribe(
        data => {
          this.payments = data;
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrievePayments();
    this.currentPayment = null;
    this.currentIndex = -1;
  }

  setActivePayment(payment, index): void {
    this.currentPayment = payment;
    this.currentIndex = index;
  }

  removeAllPayments(): void {
    this.paymentService.deleteAll()
      .subscribe(
        response => {
          this.retrievePayments();
        },
        error => {
          console.log(error);
        });
  }
}
