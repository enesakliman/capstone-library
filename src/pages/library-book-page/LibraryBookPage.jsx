import "./LibraryBookPage.styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Description } from "@mui/icons-material";

function LibraryBookPage() {
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
  return <div>LibraryBookPage</div>;
}

export default LibraryBookPage;
