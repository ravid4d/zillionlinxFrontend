import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyBookmarks from './pages/MyBookmarks';
import PrivateRoute from './components/PrivateRoute';

function App() {

    return (
        // <BrowserRouter basename='/zillionfront/'> "homepage": "/zillionfront",
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}></Route>
                    <Route path="bookmarks" element={<PrivateRoute><MyBookmarks /></PrivateRoute>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
