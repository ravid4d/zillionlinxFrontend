import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/common/Home';
import MyBookmarks from './pages/user/MyBookmarks';
import About from './pages/common/About';
import UserAgreement from './pages/common/UserAgreement';
import PrivacyPolicy from './pages/common/PrivacyPolicy';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './components/common/Unauthorized';
import NotFound from './components/common/NotFound';
import Category from './pages/admin/Category';
import AdminLogin from './components/admin/AdminLogin';
import NonProtectedAdminRoutes from './routes/NonProtectedAdminRoutes';
import User from './pages/admin/User';
import GoogleCustomSearch from './pages/user/GoogleCustomSearch';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminBookmarks from './components/admin/AdminBookmarks';
import ImportBookmarks from './pages/user/ImportBookmarks';
import ResetPassword from './components/common/ResetPassword';
import ChangePassword from './components/admin/ChangePassword';
import UpdateAdmin from './components/admin/UpdateAdmin';
import ScrollToTop from './services/ScrollToTop';
import Import from './pages/admin/Import';
import GoodBye from './pages/user/GoodBye';

function App() {
    return (
        // <BrowserRouter basename='/zillionfront/'> "homepage": "/zillionfront",       
        <>
        <ScrollToTop />
        <ToastContainer hideProgressBar={true} autoClose={2000} />
            <Routes>
                {/* Routes, those both users and admin can access */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/user-agreement" element={<UserAgreement />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                </Route>

                {/* Reset Password Page */}
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/good-bye" element={<GoodBye />} />
                
                {/* Unauthorized Page - Rendered Independently */}
                <Route path="/unauthorized" element={<Unauthorized />} />


                {/* Routes, those users can access */}
                <Route element={<ProtectedRoute allowedRoles={["user"]}  />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="bookmarks" element={<MyBookmarks />} />
                        <Route path="result" element={<GoogleCustomSearch />} />
                        <Route path="import" element={<ImportBookmarks />} />
                    </Route>
                </Route>

                <Route path="/admin/login" element={<NonProtectedAdminRoutes><AdminLogin /></NonProtectedAdminRoutes>} />
                
                {/* Routes, those admin can access */}                
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="category" element={<Category />} />
                        <Route path="user" element={<User />} />
                        <Route path="admin-bookmarks" element={<AdminBookmarks />} />
                        <Route path="change-password" element={<ChangePassword />} />
                        <Route path="update-user" element={<UpdateAdmin />} />
                        <Route path="import" element={<Import />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
        // </BrowserRouter>
    );
}

export default App;
