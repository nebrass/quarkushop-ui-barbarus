import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';
import {JwtInterceptor, JwtModule} from '@auth0/angular-jwt';

import {ProductsListComponent} from './components/product/products-list/products-list.component';
import {ProductDetailsComponent} from './components/product/product-details/product-details.component';
import {AddProductComponent} from './components/product/add-product/add-product.component';
import {PaymentsListComponent} from './components/payment/payments-list/payments-list.component';
import {BarbarusComponent} from './components/barbarus/barbarus.component';
import {BarbarusService} from './services/barbarus/barbarus.service';
import {ErrorInterceptor} from './services/error/error-interceptor.service';
import {AuthGuardService} from './services/authGuard/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: 'products', component: ProductsListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'add-product', component: AddProductComponent},
  {path: 'payments', component: PaymentsListComponent, canActivate: [AuthGuardService]},
  {path: 'barbarus', component: BarbarusComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

function tokenGetter(): string {
  return localStorage.getItem('access_token');
}

export function appInitializer(barbarusService: BarbarusService): any {
  return () => new Promise(resolve => {
    // attempt to refresh token on app start up to auto authenticate
    barbarusService.refreshToken()
      .subscribe()
      .add(resolve);
  });
}

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    ProductDetailsComponent,
    AddProductComponent,
    PaymentsListComponent,
    BarbarusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8080'],
        disallowedRoutes: ['http://localhost:8080/barbarus']
      }
    })
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [BarbarusService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
