import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyBookmarks from './pages/MyBookmarks';
import About from './pages/About';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import NotFound from './components/NotFound';
import Category from './pages/admin/Category';
import AdminLogin from './components/admin/AdminLogin';
import NonProtectedAdminRoutes from './routes/NonProtectedAdminRoutes';

function App() {
    return (
        // <BrowserRouter basename='/zillionfront/'> "homepage": "/zillionfront",       
       
        <BrowserRouter>
            <Routes>
                {/* Routes, those both users and admin can access */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}></Route>
                    <Route path="/about" element={<About />}></Route>
                </Route>

                {/* Unauthorized Page - Rendered Independently */}
                <Route path="/unauthorized" element={<Unauthorized />} />


                {/* Routes, those users can access */}
                <Route element={<ProtectedRoute allowedRoles={["user"]}  />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="bookmarks" element={<MyBookmarks />}></Route>
                    </Route>
                </Route>

                <Route path="/admin/login" element={<NonProtectedAdminRoutes><AdminLogin /></NonProtectedAdminRoutes>}></Route>
                
                {/* Routes, those admin can access */}                
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />}></Route>
                        <Route path="category" element={<Category />}></Route>
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
