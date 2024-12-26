import { lazy } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./pages/dashboard'));
const Posts = lazy(() => import('./pages/posts'));
const EditPost = lazy(() => import('./pages/posts/EditPost'));
const Users = lazy(() => import('./pages/users'));
const EditUser = lazy(() => import('./pages/users/EditUser'));
const Clients = lazy(() => import('./pages/clients'));
const EditClient = lazy(() => import('./pages/clients/EditClient'));
const Wallets = lazy(() => import('./pages/wallets'));
const EditWallet = lazy(() => import('./pages/wallets/EditWallet'));
const Transactions = lazy(() => import('./pages/transactions'));
const Expenses = lazy(() => import('./pages/expenses'));
const ExpenseCategories = lazy(() => import('./pages/expense-categories'));
const Ingredients = lazy(() => import('./pages/ingredients'));
const IngredientsPurchase = lazy(() => import('./pages/ingredients-purchases'));
const IngredientTransaction = lazy(() => import('./pages/ingredients-transactions'));
const Warehouses = lazy(() => import('./pages/ingredient-warehouses'));
const EditWarehouse = lazy(() => import('./pages/ingredient-warehouses/EditIngredientWarehouse'));
const IngredientsCategories = lazy(() => import('./pages/ingredient-categories'));
const Women = lazy(() => import('./pages/woman'));
const EditWoman = lazy(() => import('./pages/woman/EditWoman'));
const Products = lazy(() => import('./pages/products'));
const Sales = lazy(() => import('./pages/sales'));
const Men = lazy(() => import('./pages/men'));
const EditMan = lazy(() => import('./pages/men/EditMan'));
const Bonuses = lazy(() => import('./pages/bonuses'));
const Fees = lazy(() => import('./pages/fees'));
const Providers = lazy(() => import('./pages/providers'));
const ProductWarehouses = lazy(() => import('./pages/product-warehouses'));
const EditProductWarehouse = lazy(() => import('./pages/product-warehouses/EditProductWarehouse'));
const Discounts = lazy(() => import('./pages/discounts'));
const Production = lazy(() => import('./pages/production'));
const Advances = lazy(() => import('./pages/advances'));
const Payments = lazy(() => import('./pages/payments'));
const MonthlyPayments = lazy(() => import('./pages/monthly-payments'));

// Route configuration object
const routes = [
  { path: '/', element: <Dashboard /> },
  // User Management
  { path: 'users', element: <Users /> },
  { path: 'users/:id', element: <EditUser /> },
  { path: 'clients', element: <Clients /> },
  { path: 'clients/:id', element: <EditClient /> },
  // Financial Management
  { path: 'wallets', element: <Wallets /> },
  { path: 'wallets/:id', element: <EditWallet /> },
  { path: 'transactions', element: <Transactions /> },
  { path: 'expenses', element: <Expenses /> },
  { path: 'expense-categories', element: <ExpenseCategories /> },
  { path: 'payments', element: <Payments /> },
  { path: 'monthly-payments', element: <MonthlyPayments /> },
  { path: 'bonuses', element: <Bonuses /> },
  { path: 'fees', element: <Fees /> },
  { path: 'advances', element: <Advances /> },
  // Inventory Management
  { path: 'ingredients', element: <Ingredients /> },
  { path: 'ingredients-purchases', element: <IngredientsPurchase /> },
  { path: 'ingredients-transactions', element: <IngredientTransaction /> },
  { path: 'ingredient-warehouses', element: <Warehouses /> },
  { path: 'ingredient-categories', element: <IngredientsCategories /> },
  { path: 'ingredient-warehouses/:id', element: <EditWarehouse /> },
  { path: 'product-warehouses', element: <ProductWarehouses /> },
  { path: 'product-warehouses/:id', element: <EditProductWarehouse /> },
  // Content Management
  { path: 'posts', element: <Posts /> },
  { path: 'posts/:id', element: <EditPost /> },
  // Product Management
  { path: 'products', element: <Products /> },
  { path: 'women', element: <Women /> },
  { path: 'women/:id', element: <EditWoman /> },
  { path: 'men', element: <Men /> },
  { path: 'men/:id', element: <EditMan /> },
  { path: 'sales', element: <Sales /> },
  { path: 'discounts', element: <Discounts /> },
  { path: 'production', element: <Production /> },
  { path: 'providers', element: <Providers /> },
  // 404
  { path: '*', element: <>NOT FOUND</> },
];

export default routes