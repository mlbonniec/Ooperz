import {createContext} from 'react';

const CategoriesContext = createContext();
CategoriesContext.displayName = "Categories";

export const CategoriesProvider = CategoriesContext.Provider;
export const CategoriesConsumer = CategoriesContext.Consumer;

export default CategoriesContext;