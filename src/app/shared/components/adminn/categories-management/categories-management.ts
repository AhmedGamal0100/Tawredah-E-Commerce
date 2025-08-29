import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';

interface Category {
  key: string;
  name: string;
  description: string;
  type: string;
  productCount: number;
  status: string;
  level: number;
  children?: Category[];
}

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    CardModule,
  ],
  templateUrl: './categories-management.html',
  styleUrls: ['./categories-management.css'],
})
export class CategoriesManagement {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  flattenedCategories: any[] = [];
  searchInput: string = '';

  constructor() {
    this.loadCategories();
  }

  get totalCategories(): number {
    return this.flattenedCategories.length;
  }

  get mainCategoriesCount(): number {
    return this.categories.length;
  }

  get subcategoriesCount(): number {
    return this.totalCategories - this.mainCategoriesCount;
  }

  get totalProducts(): number {
    return this.flattenedCategories.reduce(
      (sum: number, category: any) => sum + (category?.productCount || 0),
      0
    );
  }

  loadCategories() {
    // Simulated data
    this.categories = [
      {
        key: '0',
        name: 'Raw Materials',
        description: 'Basic materials used to create products',
        type: 'Main Category',
        productCount: 156,
        status: 'Active',
        level: 1,
        children: [
          {
            key: '0-0',
            name: 'Metals',
            description: 'Various metal materials',
            type: 'Subcategory',
            productCount: 78,
            status: 'Active',
            level: 2,
            children: [
              {
                key: '0-0-0',
                name: 'Steel',
                description: 'Different types of steel',
                type: 'Material Type',
                productCount: 45,
                status: 'Active',
                level: 3,
              },
              {
                key: '0-0-1',
                name: 'Aluminum',
                description: 'Aluminum sheets and rods',
                type: 'Material Type',
                productCount: 33,
                status: 'Active',
                level: 3,
              },
            ],
          },
          {
            key: '0-1',
            name: 'Plastics',
            description: 'Plastic raw materials',
            type: 'Subcategory',
            productCount: 42,
            status: 'Active',
            level: 2,
            children: [
              {
                key: '0-1-0',
                name: 'ABS',
                description: 'Acrylonitrile Butadiene Styrene',
                type: 'Material Type',
                productCount: 25,
                status: 'Active',
                level: 3,
              },
              {
                key: '0-1-1',
                name: 'Polycarbonate',
                description: 'Polycarbonate materials',
                type: 'Material Type',
                productCount: 17,
                status: 'Active',
                level: 3,
              },
            ],
          },
        ],
      },
      {
        key: '1',
        name: 'Components',
        description: 'Pre-made components for assembly',
        type: 'Main Category',
        productCount: 234,
        status: 'Active',
        level: 1,
        children: [
          {
            key: '1-0',
            name: 'Electronics',
            description: 'Electronic components',
            type: 'Subcategory',
            productCount: 127,
            status: 'Active',
            level: 2,
            children: [
              {
                key: '1-0-0',
                name: 'Resistors',
                description: 'Various resistance values',
                type: 'Component Type',
                productCount: 45,
                status: 'Active',
                level: 3,
              },
            ],
          },
        ],
      },
    ];

    this.filteredCategories = [...this.categories];
    this.flattenCategories();
  }

  flattenCategories() {
    this.flattenedCategories = [];

    const flatten = (nodes: Category[], parentLevel: number = 0) => {
      nodes.forEach((node) => {
        const flatNode = {
          key: node.key,
          name: node.name,
          description: node.description,
          type: node.type,
          productCount: node.productCount,
          status: node.status,
          level: parentLevel + 1,
        };

        this.flattenedCategories.push(flatNode);

        if (node.children && node.children.length > 0) {
          flatten(node.children, parentLevel + 1);
        }
      });
    };

    flatten(this.categories, 0);
  }

  onSearchInput(event: any) {
    this.searchInput = event.target.value;
    this.applySearch();
  }

  applySearch() {
    if (!this.searchInput) {
      this.filteredCategories = [...this.categories];
      this.flattenCategories();
      return;
    }

    const searchTerm = this.searchInput.toLowerCase();

    const filterNodes = (nodes: Category[]): Category[] => {
      return nodes
        .filter((node) => {
          if (!node) return false;

          const matches =
            node.name.toLowerCase().includes(searchTerm) ||
            node.description.toLowerCase().includes(searchTerm) ||
            node.type.toLowerCase().includes(searchTerm);

          if (matches) {
            return true;
          }

          if (node.children && node.children.length > 0) {
            const filteredChildren = filterNodes(node.children);
            return filteredChildren.length > 0;
          }

          return false;
        })
        .map((node) => {
          const newNode = { ...node };
          if (newNode.children && newNode.children.length > 0) {
            newNode.children = filterNodes([...newNode.children]);
          }
          return newNode;
        });
    };

    this.filteredCategories = filterNodes([...this.categories]);
    this.flattenCategories();
  }

  getCategoryIcon(category: any): string {
    if (!category) return 'pi pi-question';

    const level = category.level || 1;
    switch (level) {
      case 1:
        return 'pi pi-folder';
      case 2:
        return 'pi pi-tag';
      case 3:
        return 'pi pi-box';
      default:
        return 'pi pi-question';
    }
  }

  getCategoryColor(level: number): string {
    const colors = [
      'var(--blue-100)',
      'var(--green-100)',
      'var(--purple-100)',
      'var(--orange-100)',
    ];
    return colors[(level || 1) - 1] || colors[0];
  }

  viewCategory(category: Category) {
    console.log('View category:', category);
  }

  editCategory(category: Category) {
    console.log('Edit category:', category);
  }

  deleteCategory(category: Category) {
    console.log('Delete category:', category);
  }

  addCategory() {
    console.log('Add new category');
  }
}
