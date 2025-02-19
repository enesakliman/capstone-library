import "./LibraryBookPage.styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Kitaplar alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (book.id) {
        await axios.put(`http://localhost:8080/api/v1/books/${book.id}`, book);

      } else {
        await axios.post("http://localhost:8080/api/v1/books", book);
      }
      setBook({
        id: null,
        name:"",
        publicationYear: new Date().getFullYear(),
        stock: 0,
      })
      fetchBooks();
    } catch (error) {
      console.error("İşlem sırasında hata oluştu:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  }

  const handleEdit = (book) => {
    setBook(book);
  }
  return <div className="books-container">
    <div className="books-input-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Kitap adı"
          value={book.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="publicationYear"
          placeholder="Yayın yılı"
          value={book.publicationYear}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stok"
          value={book.stock}
          onChange={handleChange}
        />
        <input type="text" />
        <button type="submit">Kaydet</button>
      </form>
    </div>
    <div className="books-table-container">
      <table>
        <thead>
          <tr>
            <th>Kitap Adı</th>
            <th>Yayın Yılı</th>
            <th>Stok</th>
            <th>Yazar</th>
            <th>Yayınevi</th>
            <th>Kategoriler</th>
            <th>Düzenle</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {}
        </tbody>
      </table>
    </div>
  </div>;
}

export default LibraryBookPage;
