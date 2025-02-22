import "./LibraryBookPage.styles.css";
import { useEffect } from "react";
import { useLibrary } from "../../context/library-context/LibraryContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function LibraryBookPage() {
  // context hook
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

  // fetch işlemleri
  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchPublishers();
    fetchAuthors();
  }, []);

  // inputlardaki değişiklikleri takip eden fonksiyon
  const handleChange = (e) => {
    // inputun name ve value değerlerini al
    const { name, value } = e.target;

    // eğer input yazar seçimi ise yazarı set et
    if (name === "authorId") { // eğer authorId ise yazarı set et
      setBook({
        ...book,
        author: authors.find((a) => a.id === parseInt(value)) || {},
      });
    } else if (name === "publisherId") { // eğer publisherId ise yayınevi set et
      setBook({
        ...book,
        publisher: publishers.find((p) => p.id === parseInt(value)) || {},
      });
    } else if (name === "categoryId") { // eğer categoryId ise kategoriyi set et
      setBook({
        ...book,
        categories: categories.filter((c) => c.id === parseInt(value)),
      });
    } else { // diğer durumlarda input değerlerini set et
      setBook({ ...book, [name]: value });
    }
  };

  // form submit işlemi
  const handleSubmit = async (e) => {
    // formun default işlemlerini engelle
    e.preventDefault();

    // yeni kitap eklemek için post, var olanı güncellemek için put requesti
    try {
      if (book.id) {
        await axios.put(`http://localhost:8080/api/v1/books/${book.id}`, book);
      } else {
        await axios.post("http://localhost:8080/api/v1/books", book);
      }
      // formu sıfırla ve kitapları tekrar çek
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

  // kitap silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };

  // kitap düzenleme işlemi
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Kitap Adı</TableCell>
              <TableCell align="center">Yayın Yılı</TableCell>
              <TableCell align="center">Stok</TableCell>
              <TableCell align="center">Yazar</TableCell>
              <TableCell align="center">Yayınevi</TableCell>
              <TableCell align="center">Kategoriler</TableCell>
              <TableCell align="center">Düzenle</TableCell>
              <TableCell align="center">Sil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow
                key={book.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {book.name}
                </TableCell>
                <TableCell align="center">{book.publicationYear}</TableCell>
                <TableCell align="center">{book.stock}</TableCell>
                <TableCell align="center">
                  {book.author?.name || "Bilinmiyor"}
                </TableCell>
                <TableCell align="center">
                  {book.publisher?.name || "Bilinmiyor"}
                </TableCell>
                <TableCell align="center">
                  {book.categories
                    .map((category) => category.name)
                    .join(", ") || "Bilinmiyor"}
                </TableCell>
                <TableCell align="center">
                  <button onClick={() => handleEdit(book)}>
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => handleDelete(book.id)}
                    style={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default LibraryBookPage;
