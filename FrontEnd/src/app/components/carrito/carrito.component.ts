import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  products: any[] = [];
  isProcessing = false;
  paymentError = '';
  paymentSuccess = '';
  readonly demoCheckoutMode = true;

  constructor(private cartService: CartService, private httpclient: HttpClient) { }

  ngOnInit() {
    this.products = this.cartService.getProducts();
  }

  get total(): number {
    return this.products.reduce((sum, product) => sum + (Number(product?.price) || 0), 0);
  }

  formatPrice(value: any): string {
    const amount = Number(value) || 0;
    const formatted = new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `$${formatted}`;
  }

  removeProduct(product: any) {
    this.cartService.removeProduct(product);
    this.paymentError = '';
    this.paymentSuccess = '';
  }

  iniciarCompra(event?: Event) {
    event?.preventDefault();

    if (!this.products.length || this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.paymentError = '';
    this.paymentSuccess = '';

    if (this.demoCheckoutMode) {
      setTimeout(() => {
        this.cartService.clearProducts();
        this.products = this.cartService.getProducts();
        this.isProcessing = false;
        this.paymentSuccess = 'Compra registrada en modo demo. Te contactaremos para continuar la gestión.';
      }, 700);
      return;
    }

    const createPaymentUrl = 'http://127.0.0.1:8000/createpayment/';

    this.httpclient.post<any>(createPaymentUrl, {}).subscribe(response => {
      const paymentUrl = response.payment_url;
      if (!paymentUrl) {
        this.isProcessing = false;
        this.paymentError = 'No pudimos iniciar el pago. Intenta nuevamente.';
        return;
      }

      window.location.href = paymentUrl;
    }, () => {
      this.isProcessing = false;
      this.paymentError = 'No pudimos iniciar el pago. Verificá la conexión con el servidor.';
    });
  }
}


