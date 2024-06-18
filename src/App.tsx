import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import MainLayout from './layouts/MainLayout';
import Posts from './pages/posts';
import EditPost from './pages/posts/EditPost';
import { Toaster } from './components/ui/toaster';
import Login from './pages/login';
import useAuthStore from './store/auth';
import Users from './pages/users';
import EditUser from './pages/users/EditUser';
import Clients from './pages/clients';
import EditClient from './pages/clients/EditClient';
import Wallets from './pages/wallets';
import EditWallet from './pages/wallets/EditWallet';

function App() {
  const { token } = useAuthStore()

  return (
    <BrowserRouter>
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
            </Route>
          </Routes>
        </MainLayout>
      )}
      <Toaster />
    </BrowserRouter>
  )
}

export default App