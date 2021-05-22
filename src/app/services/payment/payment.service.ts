import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Payment} from '../../models/payment/payment.model';

const baseUrl = 'http://localhost:8080/payments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(baseUrl);
  }

  get(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${baseUrl}/${id}`);
  }

  create(data: Payment): Observable<Payment> {
    return this.http.post<Payment>(baseUrl, data);
  }

  update(id: number, data: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
}
