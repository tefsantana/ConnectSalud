import { Component, OnInit } from '@angular/core';
import { Plan, PlanService } from '../services/plan.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  plans: Plan[] = [];

  constructor(
    private planService: PlanService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.planService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
      }
    });
  }

  addToCart(plan: Plan): void {
    const planKeyMap: Record<string, string> = {
      'Básico': 'basic',
      'Basico': 'basic',
      'Intermedio': 'intermediate',
      'Intensivo': 'intensive',
      'Avanzado': 'intensive',
    };

    this.cartService.addProduct({
      name: plan.name,
      price: Number(plan.price),
      planKey: planKeyMap[plan.name] || 'intermediate',
      featured: !!plan.featured,
    });

    this.router.navigate(['/carrito']);
  }

}
