import "./LibraryBorrowingPage.styles.css";
import { useLibrary } from "../../context/library-context/LibraryContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function LibraryBorrowingPage() {
  // context hook
  const {
    books,
    borrowings,
    borrowing,
    setBorrowing,
    fetchBorrowings,
    fetchBooks,
  } = useLibrary();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // fetch işlemleri
  useEffect(() => {
    fetchBorrowings();
    fetchBooks();
  }, []);

  // inputlardaki değişiklikleri takip eden fonksiyon
  const handleChange = (e) => {
    // inputun name ve value değerlerini al
    const { name, value } = e.target;

    if (name === "bookId") {
      // Eğer input kitap seçimi ise
      const selectedBook = books.find((book) => book.id === +value) || null;
      setBorrowing((prev) => ({
        ...prev,
        book: selectedBook,
      }));
    } else {
      // Diğer inputlar için
      setBorrowing((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Düzenleme işlemi
  const handleEdit = (borrowId) => {
    // Düzenlenecek ödünç alma bilgisini al
    const borrowToEdit = borrowings.find((borrow) => borrow.id === borrowId);
    if (borrowToEdit) {
      // Eğer ödünç alma bilgisi varsa
      setBorrowing({
        // Formu doldur
        id: borrowToEdit.id,
        borrowerName: borrowToEdit.borrowerName,
        borrowerMail: borrowToEdit.borrowerMail,
        borrowingDate: borrowToEdit.borrowingDate,
        returnDate: borrowToEdit.returnDate || "",
        book: borrowToEdit.book,
      });
    }
  };

  // Form submit işlemi
  const handleSubmit = async (e) => {
    // Formun default işlemlerini engelle
    e.preventDefault();

    try {
      if (!borrowing.book?.id) {
        // Eğer kitap seçimi yapılmamışsa
        console.error("Kitap seçimi zorunludur");
        return;
      }
      // Ödünç alma bilgilerini formatla
      const formattedBorrowing = {
        borrowerName: borrowing.borrowerName,
        borrowerMail: borrowing.borrowerMail,
        borrowingDate: borrowing.borrowingDate,
        returnDate: borrowing.returnDate || null,
        bookForBorrowingRequest: {
          id: parseInt(borrowing.book.id),
          name: borrowing.book.name,
          publicationYear: borrowing.book.publicationYear,
          stock: borrowing.book.stock,
        },
      };

      // Eğer ödünç alma bilgisi varsa güncelleme, yoksa yeni ödünç alma bilgisi ekleme
      let response;
      if (borrowing.id) {
        response = await axios.put(
          `http://localhost:8080/api/v1/borrows/${borrowing.id}`,
          formattedBorrowing
        );
        setSnackbarMessage("Yazar başarıyla güncellendi!");
      } else {
        response = await axios.post(
          "http://localhost:8080/api/v1/borrows",
          formattedBorrowing
        );
        setSnackbarMessage("Yazar başarıyla eklendi!");
      }
      setSnackbarOpen(true);
      // Eğer işlem başarılıysa
      if (response.status === 200 || response.status === 201) {
        fetchBorrowings();
        // Formu sıfırla
        setBorrowing({
          borrowerName: "",
          borrowerMail: "",
          borrowingDate: "",
          returnDate: "",
          book: null,
        });
      }
    } catch (error) {
      // Eğer hata oluşursa
      console.error(
        "İşlem sırasında hata:",
        error.response?.data || error.message
      );
    }
  };

  // Silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/borrows/${id}`);
      setSnackbarMessage("Yazar başarıyla silindi!");
      setSnackbarOpen(true);
      fetchBorrowings();
    } catch (error) {
      console.error(
        "Silme işlemi sırasında hata:",
        error.response?.data || error.message
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="borrows-container">
      <Typography variant="h3" gutterBottom>
        {borrowing.id ? "Ödünç Alma Düzenle" : "Kitap Alma"}
      </Typography>
      <div className="borrows-input-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="borrowerName"
            placeholder="İsminiz"
            value={borrowing.borrowerName || ""}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="borrowerMail"
            placeholder="Mail Adresiniz"
            value={borrowing.borrowerMail || ""}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="borrowingDate"
            value={borrowing.borrowingDate || ""}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="returnDate"
            value={borrowing.returnDate || ""}
            onChange={handleChange}
          />
          <select
            name="bookId"
            value={borrowing.book ? borrowing.book.id : ""}
            onChange={handleChange}
            required
          >
            <option value="">Kitap Seçiniz</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
          <button type="submit">{borrowing.id ? "Güncelle" : "Kaydet"}</button>
          {borrowing.id && (
            <button
              type="button"
              onClick={() =>
                setBorrowing({
                  borrowerName: "",
                  borrowerMail: "",
                  borrowingDate: "",
                  returnDate: "",
                  book: null,
                })
              }
            >
              İptal
            </button>
          )}
        </form>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">İsim</TableCell>
              <TableCell align="center">E-Posta</TableCell>
              <TableCell align="center">Alma Tarihi</TableCell>
              <TableCell align="center">İade Tarihi</TableCell>
              <TableCell align="center">Kitap</TableCell>
              <TableCell align="center">Düzenle</TableCell>
              <TableCell align="center">Sil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowings.map((borrow) => (
              <TableRow
                key={borrow.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{borrow.borrowerName}</TableCell>
                <TableCell align="center">{borrow.borrowerMail}</TableCell>
                <TableCell align="center">{borrow.borrowingDate}</TableCell>
                <TableCell align="center">{borrow.returnDate || "-"}</TableCell>
                <TableCell align="center">
                  {borrow.book?.name || "Bilinmiyor"}
                </TableCell>
                <TableCell align="center">
                  <button onClick={() => handleEdit(borrow.id)}>
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => handleDelete(borrow.id)}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          severity="success"
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default LibraryBorrowingPage;
