import "./LibraryBookPage.styles.css";
import { useEffect } from "react";
import { useLibrary } from "../../context/library-context/LibraryContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";

function LibraryBookPage() {
  const {
    books,
    book,
    setBook,
    authors,
    publishers,
    categories,
    fetchBooks,
    fetchCategories,
    fetchPublishers,
    fetchAuthors,
  } = useLibrary();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchPublishers();
    fetchAuthors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "authorId") {
      setBook({
        ...book,
        author: authors.find((a) => a.id === parseInt(value)) || {},
      });
    } else if (name === "publisherId") {
      setBook({
        ...book,
        publisher: publishers.find((p) => p.id === parseInt(value)) || {},
      });
    } else if (name === "categoryId") {
      setBook({
        ...book,
        categories: categories.filter((c) => c.id === parseInt(value)),
      });
    } else {
      setBook({ ...book, [name]: value });
    }
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
        name: "",
        publicationYear: new Date().getFullYear(),
        stock: 0,
        author: {},
        publisher: {},
        categories: [],
      });
      fetchBooks();
    } catch (error) {
      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };

  const handleEdit = (selectedBook) => {
    setBook(selectedBook);
  };

  return (
    <div className="books-container">
      <Typography variant="h3" sx={{}} gutterBottom>
        Kitaplık
      </Typography>
      <div className="books-input-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Kitap adı"
            value={book.name || ""}
            onChange={handleChange}
          />
          <input
            type="number"
            name="publicationYear"
            placeholder="Yayın yılı"
            value={book.publicationYear || ""}
            onChange={handleChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={book.stock || ""}
            onChange={handleChange}
          />
          <select
            name="authorId"
            onChange={handleChange}
            value={book.author?.id || ""}
          >
            <option value="">Yazar seçiniz</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <select
            name="publisherId"
            onChange={handleChange}
            value={book.publisher?.id || ""}
          >
            <option value="">Yayınevi seçiniz</option>
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </option>
            ))}
          </select>
          <select
            name="categoryId"
            onChange={handleChange}
            value={book.categories?.[0]?.id || ""}
          >
            <option value="">Kategori seçiniz</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.publicationYear}</td>
                <td>{book.stock}</td>
                <td>{book.author?.name || "Bilinmiyor"}</td>
                <td>{book.publisher?.name || "Bilinmiyor"}</td>
                <td>
                  {book.categories
                    .map((category) => category.name)
                    .join(", ") || "Bilinmiyor"}
                </td>
                <td>
                  <button onClick={() => handleEdit(book)}>
                    <EditIcon />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(book.id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibraryBookPage;
