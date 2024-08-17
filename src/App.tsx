import { HashRouter, Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from './components/ui/toaster';
import Home from './pages/home';
import MainLayout from './layouts/MainLayout';
import Posts from './pages/posts';
import EditPost from './pages/posts/EditPost';
import Login from './pages/login';
import useAuthStore from './store/auth';
import Users from './pages/users';
import EditUser from './pages/users/EditUser';
import Clients from './pages/clients';
import EditClient from './pages/clients/EditClient';
import Wallets from './pages/wallets';
import EditWallet from './pages/wallets/EditWallet';
import Transactions from './pages/transactions';
import Expenses from './pages/expenses';
import Ingredients from './pages/ingredients';
import IngredientsPurchase from './pages/ingredients-purchases';
import IngredientTransaction from './pages/ingredients-transactions';
import Women from './pages/woman';
import EditWoman from './pages/woman/EditWoman';
import Products from './pages/products';
import Sales from './pages/sales';

function App() {
  const { token } = useAuthStore()

  return (
    <HashRouter>
      {!token ? (
        <Routes>
          <Route path='/*' element={<Login />} />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            <Route path='/'>
              <Route index element={<Home />} />
              <Route path='posts' element={<Posts />} />
              <Route path='posts/:id' element={<EditPost />} />
              <Route path='users' element={<Users />} />
              <Route path='users/:id' element={<EditUser />} />
              <Route path='clients' element={<Clients />} />
              <Route path='clients/:id' element={<EditClient />} />
              <Route path='wallets' element={<Wallets />} />
              <Route path='wallets/:id' element={<EditWallet />} />
              <Route path='transactions' element={<Transactions />} />
              <Route path='expenses' element={<Expenses />} />
              <Route path='ingredients' element={<Ingredients />} />
              <Route path='ingredients-purchases' element={<IngredientsPurchase />} />
              <Route path='ingredients-transactions' element={<IngredientTransaction />} />
              <Route path='women' element={<Women />} />
              <Route path='women/:id' element={<EditWoman />} />
              <Route path='products' element={<Products />} />
              <Route path='payments' element={<Ingredients />} />
              <Route path='sales' element={<Sales />} />
              <Route path='*' element={<>NOT FOUNND</>} />
            </Route>
          </Routes>
        </MainLayout>
      )}
      <Toaster />
      <ReactQueryDevtools />
    </HashRouter>
  )
}

export default App