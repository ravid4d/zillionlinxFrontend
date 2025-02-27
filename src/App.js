import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyBookmarks from './pages/MyBookmarks';
import PrivateRoute from './components/PrivateRoute';
import { Provider } from 'react-redux';
import { store } from "./redux/store";
import About from './pages/About';

function App() {

    return (
        // <BrowserRouter basename='/zillionfront/'> "homepage": "/zillionfront",
        <Provider store={store}>

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="bookmarks" element={<PrivateRoute><MyBookmarks /></PrivateRoute>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
        </Provider>
    );
}

export default App;
