import { createContext, useContext, useState, } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  LibraryProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // States
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    id: null,
    name: "",
    description: "",
  });

  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState({
    id: null,
    name: "",
    establishmentYear: new Date().getFullYear(),
    address: "",
  });

  const [authors, setAuthors] = useState([]);
  const [author, setAuthor] = useState({
    id: null,
    name: "",
    birthDate: new Date().getDate(),
    country: "",
  });

  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    id: null,
    name: "",
    publicationYear: new Date().getFullYear(),
    stock: 0,
    author: {
      id: null,
      name: "",
      birthDate: new Date().getDate(),
    },
    publisher: {
      id: null,
      name: "",
      establishmentYear: "",
      address: "",
    },
    categories: [
      {
        id: null,
        name: "",
        description: "",
      },
    ],
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler alınırken hata oluştu:", error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/publishers"
      );
      setPublishers(response.data);
    } catch (error) {
      console.error("Yayınevleri alınırken hata oluştu:", error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/authors");
      setAuthors(response.data);
    } catch (error) {
      console.error("Yazarlar alınırken hata oluştu:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Kitaplar alınırken hata oluştu:", error);
    }
  };


  const data = {
    categories,
    setCategories,
    category,
    setCategory,
    publishers,
    setPublishers,
    publisher,
    setPublisher,
    authors,
    setAuthors,
    author,
    setAuthor,
    books,
    setBooks,
    book,
    setBook,
    fetchCategories,
    fetchPublishers,
    fetchAuthors,
    fetchBooks,
  };
  return (
    <LibraryContext.Provider value={data}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
