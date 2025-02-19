import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LibraryProvider } from "./context/library-context/LibraryContext";
import Navbar from "./components/navbar/Navbar";
import LibraryHomePage from "./pages/library-home-page/LibraryHomePage";
import LibraryPublisherPage from "./pages/library-publisher-page/LibraryPublisherPage";
import LibraryCategoryPage from "./pages/library-category-page/LibraryCategoryPage";
import LibraryBookPage from "./pages/library-book-page/LibraryBookPage";
import LibraryAuthorPage from "./pages/library-author-page/LibraryAuthorPage";

function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LibraryHomePage />} />
          <Route path="/yayimci" element={<LibraryPublisherPage />} />
          <Route path="/kategori" element={<LibraryCategoryPage />} />
          <Route path="/kitap" element={<LibraryBookPage />} />
          <Route path="/yazar" element={<LibraryAuthorPage />} />
        </Routes>
      </LibraryProvider>
    </BrowserRouter>
  );
}

export default App;
