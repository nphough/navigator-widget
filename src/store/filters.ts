import { create } from 'zustand';
import { FilterState, Location } from '@/lib/types';

interface FilterStore extends FilterState {
  // Actions
  setQuery: (query: string) => void;
  setNear: (location: Location | null) => void;
  setRadius: (radius: number) => void;
  setTypes: (types: ('business' | 'event')[]) => void;
  setCategoryIds: (categoryIds: string[]) => void;
  setSubcategoryIds: (subcategoryIds: string[]) => void;
  setOnlineOnly: (onlineOnly: boolean) => void;
  setAfOnly: (afOnly: boolean) => void;
  setSort: (sort: 'relevance' | 'distance') => void;
  clearFilters: () => void;
  toggleType: (type: 'business' | 'event') => void;
  toggleCategory: (categoryId: string) => void;
  toggleSubcategory: (subcategoryId: string) => void;
}

const initialState: FilterState = {
  query: '',
  near: null,
  radius: 25,
  types: [],
  categoryIds: [],
  subcategoryIds: [],
  onlineOnly: false,
  afOnly: false,
  sort: 'relevance',
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,

  setQuery: (query) => set({ query }),
  
  setNear: (near) => {
    const currentSort = get().sort;
    set({ 
      near,
      // Auto-switch to distance sort when location is set (if not already set)
      sort: near && currentSort === 'relevance' ? 'distance' : currentSort,
    });
  },
  
  setRadius: (radius) => set({ radius }),
  
  setTypes: (types) => set({ types }),
  
  setCategoryIds: (categoryIds) => set({ 
    categoryIds,
    // Clear subcategories that don't belong to selected categories
    subcategoryIds: [],
  }),
  
  setSubcategoryIds: (subcategoryIds) => set({ subcategoryIds }),
  
  setOnlineOnly: (onlineOnly) => set({ onlineOnly }),
  
  setAfOnly: (afOnly) => set({ afOnly }),
  
  setSort: (sort) => {
    const state = get();
    // Can't sort by distance without location
    if (sort === 'distance' && !state.near) {
      return;
    }
    set({ sort });
  },

  clearFilters: () => set({
    ...initialState,
    // Preserve location and sort if they were explicitly set
    near: get().near,
    sort: get().near ? get().sort : 'relevance',
  }),

  toggleType: (type) => {
    const currentTypes = get().types;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    set({ types: newTypes });
  },

  toggleCategory: (categoryId) => {
    const currentCategories = get().categoryIds;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    set({ 
      categoryIds: newCategories,
      // Clear subcategories when categories change
      subcategoryIds: [],
    });
  },

  toggleSubcategory: (subcategoryId) => {
    const currentSubcategories = get().subcategoryIds;
    const newSubcategories = currentSubcategories.includes(subcategoryId)
      ? currentSubcategories.filter(id => id !== subcategoryId)
      : [...currentSubcategories, subcategoryId];
    
    set({ subcategoryIds: newSubcategories });
  },
}));

// Selectors for derived state
export const useFilterParams = () => {
  const store = useFilterStore();
  
  return {
    query: store.query || undefined,
    near: store.near ? `${store.near.lat},${store.near.lng}` : undefined,
    radius: store.radius,
    types: store.types.length > 0 ? store.types.join(',') : undefined,
    categoryIds: store.categoryIds.length > 0 ? store.categoryIds.join(',') : undefined,
    subcategoryIds: store.subcategoryIds.length > 0 ? store.subcategoryIds.join(',') : undefined,
    onlineOnly: store.onlineOnly || undefined,
    afOnly: store.afOnly || undefined,
    sort: store.sort,
  };
};

export const useHasActiveFilters = () => {
  const store = useFilterStore();
  
  return (
    store.query.length > 0 ||
    store.near !== null ||
    store.types.length > 0 ||
    store.categoryIds.length > 0 ||
    store.subcategoryIds.length > 0 ||
    store.onlineOnly ||
    store.afOnly
  );
};

export const useCanSortByDistance = () => {
  const near = useFilterStore(state => state.near);
  return near !== null;
};