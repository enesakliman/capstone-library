import { createContext, useContext, useState } from "react";
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
  };
  return (
    <LibraryContext.Provider value={data}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
