import "./LibraryBorrowingPage.styles.css";
import { useLibrary } from "../../context/library-context/LibraryContext";
import axios from "axios";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";

function LibraryBorrowingPage() {
  const {
    books,
    borrowings,
    borrowing,
    setBorrowing,
    fetchBorrowings,
    fetchBooks,
  } = useLibrary();

  useEffect(() => {
    fetchBorrowings();
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bookId") {
      const selectedBook = books.find((book) => book.id === +value) || null;
      setBorrowing((prev) => ({
        ...prev,
        book: selectedBook,
      }));
    } else {
      setBorrowing((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (borrowId) => {
    const borrowToEdit = borrowings.find((borrow) => borrow.id === borrowId);
    if (borrowToEdit) {
      setBorrowing({
        id: borrowToEdit.id,
        borrowerName: borrowToEdit.borrowerName,
        borrowerMail: borrowToEdit.borrowerMail,
        borrowingDate: borrowToEdit.borrowingDate,
        returnDate: borrowToEdit.returnDate || "",
        book: borrowToEdit.book,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!borrowing.book?.id) {
        console.error("Kitap seçimi zorunludur");
        return;
      }

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

      let response;
      if (borrowing.id) {
        // Update existing borrowing
        response = await axios.put(
          `http://localhost:8080/api/v1/borrows/${borrowing.id}`,
          formattedBorrowing,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new borrowing
        response = await axios.post(
          "http://localhost:8080/api/v1/borrows",
          formattedBorrowing,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        fetchBorrowings();
        // Clear the form
        setBorrowing({
          borrowerName: "",
          borrowerMail: "",
          borrowingDate: "",
          returnDate: "",
          book: null,
        });
      }
    } catch (error) {
      console.error(
        "İşlem sırasında hata:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/borrows/${id}`);
      fetchBorrowings();
    } catch (error) {
      console.error(
        "Silme işlemi sırasında hata:",
        error.response?.data || error.message
      );
    }
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
      <div className="borrows-table-container">
        <table>
          <thead>
            <tr>
              <th>İsim</th>
              <th>E-Posta</th>
              <th>Alma Tarihi</th>
              <th>İade Tarihi</th>
              <th>Kitap</th>
              <th>Düzenle</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.borrowerName}</td>
                <td>{borrow.borrowerMail}</td>
                <td>{borrow.borrowingDate}</td>
                <td>{borrow.returnDate || "-"}</td>
                <td>{borrow.book?.name || "Bilinmiyor"}</td>
                <td>
                  <button onClick={() => handleEdit(borrow.id)}>Düzenle</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(borrow.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibraryBorrowingPage;
