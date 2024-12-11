import { HashRouter, Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy } from 'react';
import { Toaster } from './components/ui/toaster';
import MainLayout from './layouts/MainLayout';
import useAuthStore from './store/auth';
import Loader from './components/loader';
import routes from './routes';

const Login = lazy(() => import('./pages/login'));

function App() {
  const { token } = useAuthStore()

  return (
    <HashRouter>
      <Suspense fallback={<Loader />}>
        {!token ? (
          <Routes>
            <Route path='/*' element={<Login />} />
          </Routes>
        ) : (
          <MainLayout>
            <Routes>
              <Route path='/'>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>
            </Routes>
          </MainLayout>
        )}
      </Suspense>
      <Toaster />
      <ReactQueryDevtools />
    </HashRouter>
  )
}

export default App