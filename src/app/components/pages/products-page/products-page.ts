import {
  Component,
  HostListener,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MotionDirective } from '../../../directives/motion.directive';
import { FormsModule } from '@angular/forms';
import { CategoryResponse } from '../../../model/response/CategoryResponse';
import { CategoryService } from '../../../services/category-service';
import { ProductMaterial } from '../../../model/response/product/ProductMaterial';
import { ProductService } from '../../../services/productService';
import {
  ProductFilterParams,
  ProductSort,
  ProductSortLabels,
} from '../../../model/response/product/ProductFilterModel';
import { ProductSummaryModel } from '../../../model/response/product/ProductSummaryModel';
import { PageInterface } from '../../../model/PageInterface';
import { PaginationComponent } from '../../ui/c-pagination/c-pagination';
import { CProductCard } from '../../ui/c-product-card/c-product-card';
import { CartService } from '../../../services/cart-service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products-page',
  imports: [
    MotionDirective,
    FormsModule,
    PaginationComponent,
    CProductCard,
    CurrencyPipe,
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit, OnDestroy {
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  ProductSortLabels = ProductSortLabels;
  Math = Math;
  sortOptionsArray: ProductSort[] = [
    ProductSort.NAME_ASC,
    ProductSort.NAME_DESC,
    ProductSort.PRICE_ASC,
    ProductSort.PRICE_DESC,
    ProductSort.MOST_POPULAR,
  ];
  categoriesOptionsArray: CategoryResponse[] = [];
  materialOptionsArray: ProductMaterial[] = [
    ProductMaterial.STEEL,
    ProductMaterial.WOOD,
    ProductMaterial.PVC,
    ProductMaterial.GOLDEN,
  ];
  products: PageInterface<ProductSummaryModel> =
    {} as PageInterface<ProductSummaryModel>;
  selectedCategory: CategoryResponse | null = null;
  selectedMaterial: ProductMaterial | null = null;
  priceRange = { min: 0, max: 300 };
  sortOptions: ProductSort = ProductSort.MOST_POPULAR;
  searchQuery: string = '';
  isDropdownOpen = false;
  isMobileFiltersOpen = false;
  currentPage: number = 1;
  isLoadingProducts = true;
  isLoadingCategories = true;

  private searchSubject = new Subject<string>();
  private priceChangeSubject = new Subject<void>();
  private subscriptions = new Subscription();

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.cartService.loadCart();

    // Debounce para búsqueda - espera 400ms después de que el usuario deje de escribir
    const searchSub = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.loadProducts();
      });

    // Throttle para cambios de precio - espera 500ms después del último cambio
    const priceSub = this.priceChangeSubject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadProducts();
      });

    this.subscriptions.add(searchSub);
    this.subscriptions.add(priceSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onMinPriceChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    if (value > this.priceRange.max) {
      this.priceRange.min = this.priceRange.max;
    }
    this.priceChangeSubject.next();
  }

  onMaxPriceChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    if (value < this.priceRange.min) {
      this.priceRange.max = this.priceRange.min;
    }
    this.priceChangeSubject.next();
  }

  selectCategory(categoryId: number | null) {
    if (categoryId === null) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory =
        this.categoriesOptionsArray.find(
          (category) => category.id === categoryId,
        ) || null;
    }
    this.currentPage = 1;
    this.loadProducts();
  }

  selectMaterial(material: ProductMaterial | null) {
    this.selectedMaterial = material;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(sort: ProductSort) {
    this.sortOptions = sort;
    this.isDropdownOpen = false;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  openMobileFilters() {
    this.isMobileFiltersOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMobileFilters() {
    this.isMobileFiltersOpen = false;
    document.body.style.overflow = '';
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategory?.id === categoryId;
  }

  isMaterialSelected(material: ProductMaterial | null): boolean {
    return this.selectedMaterial === material;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.products-page__custom-select')) {
      this.isDropdownOpen = false;
    }
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getAll().subscribe((response) => {
      this.categoriesOptionsArray = response.data;
      this.isLoadingCategories = false;
      console.log(response);
    });
  }

  clearFilters() {
    this.selectedCategory = null;
    this.selectedMaterial = null;
    this.priceRange = { min: 0, max: 300 };
    this.currentPage = 1;
    this.loadProducts();
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedCategory !== null ||
      this.selectedMaterial !== null ||
      this.priceRange.min !== 0 ||
      this.priceRange.max !== 300
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadProducts() {
    this.isLoadingProducts = true;
    const filters: ProductFilterParams = {
      page: this.currentPage,
      size: 6,
      sort: this.sortOptions,
    };

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      filters.name = this.searchQuery.trim();
    }

    if (this.selectedCategory !== null) {
      filters.categoryId = this.selectedCategory.id;
    }

    if (this.selectedMaterial !== null) {
      filters.material = this.selectedMaterial;
    }

    if (this.priceRange.min !== 0) {
      filters.minPrice = this.priceRange.min;
    }

    if (this.priceRange.max !== 300) {
      filters.maxPrice = this.priceRange.max;
    }

    this.productService.getFilteredProducts(filters).subscribe((response) => {
      this.products = response;
      this.isLoadingProducts = false;
      console.log('Products loaded:', this.products);
    });
  }
}
