import { inject, Injectable, signal, computed } from '@angular/core';
import { CartHttp } from './cart-http';
import { AlertService } from './alert-service';
import { AuthService } from './auth-service';
import { ProductService } from './productService';
import { OrderResponse, OrderStatus } from '../model/response/order/OrderResponse';
import { OrderItemResponse } from '../model/response/order/OrderItemResponse';
import { OrderUpdateRequest } from '../model/request/order/OrderUpdateRequest';
import { ProductSummaryModel } from '../model/response/product/ProductSummaryModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartHttp = inject(CartHttp);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  private readonly _cart = signal<OrderResponse | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _isCartOpen = signal<boolean>(false);

  readonly cart$ = this._cart.asReadonly();
  readonly isLoading$ = this._isLoading.asReadonly();
  readonly isCartOpen$ = this._isCartOpen.asReadonly();

  readonly cartItemsCount = computed(() => {
    const cart = this._cart();
    if (!cart || !cart.orderItems) return 0;
    return cart.orderItems.reduce((total, item) => total + item.quantity, 0);
  });

  readonly cartSubtotal = computed(() => {
    const cart = this._cart();
    if (!cart || !cart.orderItems) return 0;
    return cart.orderItems.reduce((total, item) => total + item.total, 0);
  });

  readonly shippingCost = computed(() => {
    const cart = this._cart();
    return cart?.shippingCost ?? 0;
  });

  readonly cartTotal = computed(() => {
    const cart = this._cart();
    return cart?.totalPrice ?? 0;
  });

  loadCart(): void {
    const user = this.authService.user$();
    if (!user) {
      this._cart.set(null);
      return;
    }

    this._isLoading.set(true);

    this.cartHttp.getActiveCart(user.id).subscribe({
      next: (cart) => {
        console.log('Cart loaded from backend:', cart);
        this._cart.set(cart);
        this._isLoading.set(false);
      },
      error: (error) => {
        this._isLoading.set(false);
        console.error('Error loading cart:', error);
      },
    });
  }

  addToCart(product: ProductSummaryModel, quantity: number = 1): void {
    const user = this.authService.user$();
    if (!user) {
      this.alertService.warning({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para añadir productos al carrito',
      });
      return;
    }

    const currentCart = this._cart();
    if (!currentCart) {
      this.loadCart();
      return;
    }

    const existingItemIndex =
      currentCart.orderItems?.findIndex(
        (item) => item.product.id === product.id,
      ) ?? -1;

    let updatedItems: OrderItemResponse[];

    if (existingItemIndex >= 0) {
      updatedItems = currentCart.orderItems.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + quantity;
          const unitPrice = item.product.price;
          return {
            ...item,
            quantity: newQuantity,
            total: unitPrice,
          };
        }
        return item;
      });
    } else {
      const newItem: OrderItemResponse = {
        id: 0,
        product: product,
        productName: product.name,
        productImage: product.image,
        productImageName: '',
        quantity: quantity,
        basePrice: product.basePrice,
        discountPercentage: product.discountPercentage,
        total: product.price * quantity,
      };
      updatedItems = [...(currentCart.orderItems || []), newItem];
    }

    this.updateCartItems(updatedItems);
    this.alertService.success({
      title: 'Añadido al carrito',
      text: `${product.name} se ha añadido al carrito`,
      duration: 2000,
    });
  }

  updateItemQuantity(productId: number, quantity: number): void {
    const currentCart = this._cart();
    if (!currentCart) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updatedItems = currentCart.orderItems.map((item) => {
      if (item.product.id === productId) {
        const unitPrice = item.product.price;
        return {
          ...item,
          quantity: quantity,
          total: quantity * unitPrice,
        };
      }
      return item;
    });

    this.updateCartItems(updatedItems);
  }

  removeFromCart(productId: number): void {
    const currentCart = this._cart();
    if (!currentCart) return;

    const updatedItems = currentCart.orderItems.filter(
      (item) => item.product.id !== productId,
    );

    this.updateCartItems(updatedItems);
  }

  toggleCart(): void {
    this._isCartOpen.update((isOpen) => !isOpen);
  }

  openCart(): void {
    this._isCartOpen.set(true);
  }

  closeCart(): void {
    this._isCartOpen.set(false);
  }

  private updateCartItems(items: OrderItemResponse[]): void {
    const user = this.authService.user$();
    if (!user) return;

    const cartUpdateRequest: OrderUpdateRequest = {
      userId: user.id,
      orderItems: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    console.log('Sending cart update request:', cartUpdateRequest);

    // Actualización optimista de items (UX inmediata)
    const currentCart = this._cart();
    if (currentCart) {
      this._cart.set({
        ...currentCart,
        orderItems: items,
      });
    }

    this.cartHttp.updateCart(cartUpdateRequest).subscribe({
      next: () => {
        console.log('Cart updated successfully');
        // Recargar del backend para obtener subtotal, shippingCost y totalPrice calculados
        this.loadCart();
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        // Revertir en caso de error
        this.loadCart();
        this.alertService.error({
          title: 'Error',
          text: 'No se pudo actualizar el carrito',
        });
      },
    });
  }
}
