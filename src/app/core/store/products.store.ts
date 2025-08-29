import { effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { IProduct } from '../models/product';
import { ProductsService } from '../services/products.service';
import { IFilter } from '../models/filter';

const initialProducts: IProduct[] | null = null;

export const ProductsStore = signalStore(
  { providedIn: 'root' },

  withState<{
    products: IProduct[] | null;
    filteredProducts: IProduct[] | null;
    filters: IFilter;
    searchText: string;
  }>({
    products: initialProducts,
    filteredProducts: initialProducts,
    filters: {
      suppliers: [],
      categories: [],
      state: [],
      moqs: [],
    },
    searchText: '',
  }),

  withMethods((state) => {
    const productsService = inject(ProductsService);

    // ✅ Centralized Filtering Logic
    function applyFilters() {
      const products = state.products();
      if (!products) return;

      const { suppliers, categories, state: states, moqs } = state.filters();
      const searchText = state.searchText().toLowerCase();

      let results = [...products];

      // 🔍 Search
      if (searchText) {
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(searchText) ||
            p.description?.toLowerCase().includes(searchText) ||
            p.sku?.toLowerCase().includes(searchText)
        );
      }

      if (categories.length > 0) {
        results = results.filter((p) => categories.includes(p.category.main));
      }

      if (suppliers.length > 0) {
        results = results.filter(
          (p) => p.supplier?.name && suppliers.includes(p.supplier.name)
        );
      }

      if (states.length > 0) {
        results = results.filter((p) =>
          p.status?.tags?.some((tag) => states.includes(tag))
        );
      }

      if (moqs.length > 0) {
        results = results.filter((p) => {
          const moq = p.inventory?.moq;
          if (moq == null) return false;

          return moqs.some((range) => {
            switch (range) {
              case 'first':
                return moq >= 0 && moq <= 100;
              case 'second':
                return moq > 100 && moq <= 500;
              case 'third':
                return moq > 500 && moq <= 1000;
              case 'last':
                return moq > 1000;
              default:
                return false;
            }
          });
        });
      }

      patchState(state, { filteredProducts: results });
    }

    return {
      setSearch(searchText: string) {
        patchState(state, { searchText });
        applyFilters();
      },

      updateFilters(filters: Partial<IFilter>) {
        patchState(state, { filters: { ...state.filters(), ...filters } });
        applyFilters();
      },

      clearFilters() {
        patchState(state, {
          filters: { suppliers: [], categories: [], state: [], moqs: [] },
          searchText: '',
          filteredProducts: state.products(),
        });
      },
    };
  }),

  withHooks({
    onInit(state) {
      const productsService = inject(ProductsService);
      effect(() => {
        productsService.list().then((res) => {
          if (res.items.length > 0)
            patchState(state, {
              products: res.items,
              filteredProducts: res.items,
            });
        });
      });
    },
  }),

  withMethods((state) => {
    const productsService = inject(ProductsService);

    return {
      async loadByIds(productIds: string[]) {
        if (!productIds || productIds.length === 0) {
          patchState(state, { products: [], filteredProducts: [] });
          return;
        }

        const items: IProduct[] = [];
        for (const id of productIds) {
          const product = await productsService.getOnce(id); // reuse getOnce()
          if (product) {
            items.push(product);
          }
        }

        patchState(state, { products: items, filteredProducts: items });
      },
    };
  })
);
