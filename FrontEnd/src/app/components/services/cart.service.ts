import { Injectable } from '@angular/core';

export interface CartProduct {
  name: string;
  price: number;
  image?: string;
  planKey?: string;
  featured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cartProducts';
  private products: CartProduct[] = [];

  constructor() {
    this.products = this.loadFromStorage();
  }

  getProducts(): CartProduct[] {
    return this.products;
  }

  addProduct(product: CartProduct) {
    this.products.push(product);
    this.saveToStorage();
  }

  removeProduct(product: CartProduct) {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveToStorage();
    }
  }

  clearProducts() {
    this.products = [];
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.products));
  }

  private loadFromStorage(): CartProduct[] {
    const raw = localStorage.getItem(this.CART_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

}


