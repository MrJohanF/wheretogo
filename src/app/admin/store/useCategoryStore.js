
// src/store/useCategoriesStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useCategoriesStore = create(
  devtools(
    (set, get) => ({
      // ============= Core State =============
      categories: [],
      loading: false,
      error: null,
      searchTerm: '',
      
      // ============= Pagination State =============
      currentPage: 1,
      itemsPerPage: 10,
      
      // ============= Category CRUD State =============
      isAddingCategory: false,
      isEditingCategory: false,
      currentCategory: null,
      showDeleteConfirm: false,
      categoryToDelete: null,
      
      // ============= Subcategory State =============
      viewingSubcategories: false,
      selectedCategory: null,
      isAddingSubcategory: false,
      isEditingSubcategory: false,
      currentSubcategory: null,
      showDeleteSubcategoryConfirm: false,
      subcategoryToDelete: null,
      
      // ============= Form Data =============
      formData: {
        name: "",
        description: "",
        icon: "",
        color: "#6366F1", // Default indigo color
        isTrending: false,
        image: null,
      },
      
      subcategoryFormData: {
        name: "",
        categoryId: null,
      },
      
      // ============= Helper Methods =============
      getFilteredCategories: () => {
        const { categories, searchTerm } = get();
        return categories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      },
      
      getCurrentPageItems: () => {
        const { currentPage, itemsPerPage } = get();
        const filteredCategories = get().getFilteredCategories();
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
      },
      
      getPaginationInfo: () => {
        const { currentPage, itemsPerPage } = get();
        const filteredCategories = get().getFilteredCategories();
        const totalItems = filteredCategories.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        
        return {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          startItem: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
          endItem: Math.min(currentPage * itemsPerPage, totalItems),
        };
      },
      
      // ============= Actions =============
      
      // Search and Pagination Actions
      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
      
      setCurrentPage: (page) => {
        const { getPaginationInfo } = get();
        const { totalPages } = getPaginationInfo();
        const newPage = Math.max(1, Math.min(page, totalPages));
        set({ currentPage: newPage });
      },
      
      setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),
      
      // Category CRUD Actions
      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );
          
          if (!response.ok) {
            throw new Error("Error al cargar las categorías");
          }
          
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || "Error al cargar las categorías");
          }
          
          // Transform API data to match component requirements
          const transformedCategories = (data.categories || []).map((category) => ({
            ...category,
            count: category._count?.places || 0,
            icon: category.icon,
          }));
          
          set({ categories: transformedCategories, currentPage: 1 });
        } catch (err) {
          set({ error: err.message, categories: [] });
          console.error("Error fetching categories:", err);
        } finally {
          set({ loading: false });
        }
      },
      
      // Category Form Management
      initAddCategory: () => set({
        isAddingCategory: true,
        formData: {
          name: "",
          description: "",
          icon: "",
          color: "#6366F1",
          isTrending: false,
          image: null,
        }
      }),
      
      initEditCategory: (category) => set({
        isEditingCategory: true,
        currentCategory: category,
        formData: {
          name: category.name,
          description: category.description || "",
          icon: category.icon,
          color: category.color || "#6366F1",
          isTrending: category.isTrending,
          image: category.image,
        }
      }),
      
      handleInputChange: (e) => {
        const { name, value, type, checked } = e.target;
        set((state) => ({
          formData: {
            ...state.formData,
            [name]: type === "checkbox" ? checked : value,
          }
        }));
      },
      
      handleIconSelect: (iconName) => set((state) => ({
        formData: {
          ...state.formData,
          icon: iconName,
        }
      })),
      
      handleImageSelect: (e) => {
        if (e === null) {
          set((state) => ({ 
            formData: { 
              ...state.formData, 
              image: null 
            } 
          }));
        } else if (e.target?.files?.[0]) {
          set((state) => ({ 
            formData: {
              ...state.formData,
              image: URL.createObjectURL(e.target.files[0]),
            }
          }));
        }
      },
      
      resetCategoryForm: () => set({
        isAddingCategory: false,
        isEditingCategory: false,
        currentCategory: null,
        formData: {
          name: "",
          description: "",
          icon: "",
          color: "#6366F1",
          isTrending: false,
          image: null,
        }
      }),
      
      cancelCategoryForm: () => {
        set((state) => ({
          isAddingCategory: false,
          isEditingCategory: false,
          currentCategory: null,
          formData: {
            name: "",
            description: "",
            icon: "",
            color: "#6366F1",
            isTrending: false,
            image: null,
          }
        }));
      },
      
      // Category Delete Operations
      initDeleteCategory: (category) => set({
        categoryToDelete: category,
        showDeleteConfirm: true
      }),
      
      confirmDeleteCategory: async () => {
        const { categoryToDelete } = get();
        
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${categoryToDelete.id}`,
            {
              method: "DELETE",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );
          
          if (!response.ok) {
            throw new Error("Error al eliminar la categoría");
          }
          
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || "Error al eliminar la categoría");
          }
          
          // Update local state
          set((state) => {
            // Get the updated list without the deleted category
            const updatedCategories = state.categories.filter(cat => cat.id !== categoryToDelete.id);
            
            // Get pagination info with the updated list
            const filteredCategories = updatedCategories.filter(
              (cat) =>
                cat.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                (cat.description && cat.description.toLowerCase().includes(state.searchTerm.toLowerCase()))
            );
            
            const totalItems = filteredCategories.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / state.itemsPerPage));
            const newCurrentPage = state.currentPage > totalPages && totalPages > 0 ? totalPages : state.currentPage;
            
            return {
              categories: updatedCategories,
              currentPage: newCurrentPage,
              showDeleteConfirm: false,
              categoryToDelete: null
            };
          });
        } catch (err) {
          set({ error: err.message });
          console.error("Error deleting category:", err);
        } finally {
          set({ loading: false });
        }
      },
      
      cancelDeleteCategory: () => set({ 
        showDeleteConfirm: false, 
        categoryToDelete: null 
      }),
      
      // Toggle Trending Status
      toggleTrendingStatus: async (category) => {
        try {
          set({ loading: true });
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${category.id}`,
            {
              method: "PUT",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...category,
                isTrending: !category.isTrending,
              }),
            }
          );
          
          if (!response.ok) {
            throw new Error("Error al actualizar la categoría");
          }
          
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || "Error al actualizar la categoría");
          }
          
          // Update category in local state
          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === category.id ? { ...cat, isTrending: !cat.isTrending } : cat
            )
          }));
        } catch (err) {
          set({ error: err.message });
          console.error("Error updating category:", err);
        } finally {
          set({ loading: false });
        }
      },
      
      // Save Category (Create/Update)
      saveCategory: async () => {
        const { formData, isAddingCategory, currentCategory } = get();
        
        try {
          set({ loading: true, error: null });
          
          // Prepare data for API
          const categoryData = {
            name: formData.name,
            icon: formData.icon,
            description: formData.description,
            image: formData.image,
            color: formData.color,
            isTrending: formData.isTrending
          };
          
          let response;
          
          if (isAddingCategory) {
            // Create new category
            response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/add`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(categoryData),
              }
            );
          } else {
            // Update existing category
            response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${currentCategory.id}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(categoryData),
              }
            );
          }
          
          if (!response.ok) {
            throw new Error(isAddingCategory ? 'Error al crear la categoría' : 'Error al actualizar la categoría');
          }
          
          const result = await response.json();
          
          if (result.success) {
            const updatedCategory = result.category;
            
            // Update state based on operation
            set((state) => ({
              categories: isAddingCategory
                ? [...state.categories, updatedCategory]  // Add new category
                : state.categories.map(cat =>            // Update existing category
                    cat.id === updatedCategory.id
                      ? { ...cat, ...updatedCategory, count: cat.count }
                      : cat
                  ),
              isAddingCategory: false,
              isEditingCategory: false,
              currentCategory: null,
              formData: {
                name: "",
                description: "",
                icon: "",
                color: "#6366F1",
                isTrending: false,
                image: null,
              }
            }));
          }
          
          return result;
        } catch (err) {
          set({ error: err.message });
          console.error('Error saving category:', err);
          return { success: false, message: err.message };
        } finally {
          set({ loading: false });
        }
      },
      
      // ============= Subcategory Management =============
      viewSubcategories: (category) => set({
        selectedCategory: category,
        viewingSubcategories: true
      }),
      
      exitSubcategoriesView: () => set({
        viewingSubcategories: false,
        selectedCategory: null
      }),
      
      initAddSubcategory: () => {
        const { selectedCategory } = get();
        set({
          isAddingSubcategory: true,
          subcategoryFormData: {
            name: "",
            categoryId: selectedCategory?.id,
          }
        });
      },
      
      initEditSubcategory: (subcategory) => {
        const { selectedCategory } = get();
        set({
          isEditingSubcategory: true,
          currentSubcategory: subcategory,
          subcategoryFormData: {
            name: subcategory.name,
            categoryId: selectedCategory?.id,
          }
        });
      },
      
      handleSubcategoryInputChange: (e) => {
        const { name, value } = e.target;
        set((state) => ({
          subcategoryFormData: {
            ...state.subcategoryFormData,
            [name]: value,
          }
        }));
      },
      
      // NEW - Updated to use API
      saveSubcategory: async () => {
        const { 
          subcategoryFormData, isAddingSubcategory, isEditingSubcategory, 
          currentSubcategory, selectedCategory
        } = get();
        
        // Form validation
        if (!subcategoryFormData.name.trim()) {
          set({ error: "El nombre de la subcategoría es obligatorio" });
          return;
        }
        
        try {
          set({ loading: true, error: null });
          
          const requestData = {
            name: subcategoryFormData.name,
            categoryId: selectedCategory?.id
          };
          
          let response;
          let updatedSubcategory;
          
          if (isAddingSubcategory) {
            // Create new subcategory via API
            response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subcategories/add`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(requestData),
              }
            );
            
            if (!response.ok) {
              throw new Error('Error al crear la subcategoría');
            }
            
            const result = await response.json();
            if (!result.success) {
              throw new Error(result.message || 'Error al crear la subcategoría');
            }
            
            updatedSubcategory = result.subcategory;
          } 
          else if (isEditingSubcategory && currentSubcategory) {
            // Update existing subcategory via API
            response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subcategories/${currentSubcategory.id}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(requestData),
              }
            );
            
            if (!response.ok) {
              throw new Error('Error al actualizar la subcategoría');
            }
            
            const result = await response.json();
            if (!result.success) {
              throw new Error(result.message || 'Error al actualizar la subcategoría');
            }
            
            updatedSubcategory = result.subcategory;
          }
          
          // Update local state based on the operation
          set((state) => {
            // Find the parent category and update its subcategories
            const updatedCategories = state.categories.map((cat) => {
              if (cat.id === selectedCategory?.id) {
                let updatedSubcategories;
                
                if (isAddingSubcategory) {
                  // Add new subcategory to the list
                  updatedSubcategories = [
                    ...(cat.subcategories || []),
                    updatedSubcategory
                  ];
                } else {
                  // Update existing subcategory
                  updatedSubcategories = (cat.subcategories || []).map((sub) =>
                    sub.id === updatedSubcategory.id ? updatedSubcategory : sub
                  );
                }
                
                return { ...cat, subcategories: updatedSubcategories };
              }
              return cat;
            });
            
            // Update the selected category in the view
            const updatedSelectedCategory = updatedCategories.find(
              (cat) => cat.id === selectedCategory?.id
            );
            
            return {
              categories: updatedCategories,
              selectedCategory: updatedSelectedCategory,
              isAddingSubcategory: false,
              isEditingSubcategory: false,
              currentSubcategory: null,
              subcategoryFormData: {
                name: "",
                categoryId: null
              }
            };
          });
        } 
        catch (err) {
          set({ error: err.message });
          console.error('Error saving subcategory:', err);
        } 
        finally {
          set({ loading: false });
        }
      },
      
      // FIXED - Implement cancelSubcategoryForm
      cancelSubcategoryForm: () => set({
        isAddingSubcategory: false,
        isEditingSubcategory: false,
        currentSubcategory: null,
        subcategoryFormData: {
          name: "",
          categoryId: null
        },
        error: null
      }),
      
      // Function to initialize delete confirmation
      initDeleteSubcategory: (subcategory) => set({
        subcategoryToDelete: subcategory,
        showDeleteSubcategoryConfirm: true
      }),
      
      // NEW - Updated confirmDeleteSubcategory to use API
      confirmDeleteSubcategory: async () => {
        const { subcategoryToDelete, selectedCategory } = get();
        
        try {
          set({ loading: true, error: null });
          
          // Call API to delete subcategory
          const response = await fetch(
            `\${process.env.NEXT_PUBLIC_API_URL}/api/admin/subcategories/\${subcategoryToDelete.id}`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            }
          );
          
          if (!response.ok) {
            throw new Error('Error al eliminar la subcategoría');
          }
          
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || 'Error al eliminar la subcategoría');
          }
          
          // Update local state to remove the deleted subcategory
          set((state) => ({
            categories: state.categories.map((cat) => {
              if (cat.id === selectedCategory?.id) {
                return {
                  ...cat,
                  subcategories: (cat.subcategories || []).filter(
                    (sub) => sub.id !== subcategoryToDelete.id
                  ),
                };
              }
              return cat;
            }),
            selectedCategory: selectedCategory ? {
              ...selectedCategory,
              subcategories: (selectedCategory.subcategories || []).filter(
                (sub) => sub.id !== subcategoryToDelete.id
              ),
            } : null,
            showDeleteSubcategoryConfirm: false,
            subcategoryToDelete: null
          }));
        } 
        catch (err) {
          set({ error: err.message });
          console.error('Error deleting subcategory:', err);
        } 
        finally {
          set({ loading: false });
        }
      },
      
      // Function to cancel delete confirmation
      cancelDeleteSubcategory: () => set({
        showDeleteSubcategoryConfirm: false,
        subcategoryToDelete: null
      }),
    }),
    {
      name: "categories-store", // Name for Redux DevTools
    }
  )
);

export default useCategoriesStore;