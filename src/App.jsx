import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LibraryHomePage from "./components/library-home-page/LibraryHomePage";
import LibraryPublisherPage from "./components/library-publisher-page/LibraryPublisherPage";
import LibraryCategoryPage from "./components/library-category-page/LibraryCategoryPage";
import LibraryBookPage from "./components/library-book-page/LibraryBookPage";
import LibraryAuthorPage from "./components/library-author-page/LibraryAuthorPage";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LibraryHomePage />} />
        <Route path="/yayimci" element={<LibraryPublisherPage/>} />
        <Route path="/kategori" element={<LibraryCategoryPage/>} />
        <Route path="/kitap" element={<LibraryBookPage />} />
        <Route path="/yazar" element={<LibraryAuthorPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
