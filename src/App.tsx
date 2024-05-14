import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import MainLayout from './layouts/MainLayout';
import Posts from './pages/posts';
import EditPost from './pages/posts/EditPost';
import { Toaster } from './components/ui/toaster';

function App() {

  return (
    <>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path='/'>
              <Route index element={<Home />} />
              <Route path='posts' element={<Posts />} />
              <Route path='posts/:id' element={<EditPost />} />
            </Route>
          </Routes>
        </MainLayout>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App