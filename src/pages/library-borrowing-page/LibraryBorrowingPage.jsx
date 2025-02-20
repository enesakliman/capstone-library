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
      const selectedBook = books.find((book) => book.id === parseInt(value));
      setBorrowing({
        ...borrowing,
        book: selectedBook || {
          id: 0,
          name: "",
          publicationYear: 0,
          stock: 0,
          author: {
            id: 0,
            name: '',
            birthDate: '',
            country: ''
          },
          publisher: {
            id: 0,
            name: '',
            establishmentYear: 0,
            address: ''
          },
          categories: [
            {
              id: 0,
              name: '',
              description: ''
            }
          ]
        },
      });
    } else {
      setBorrowing({ ...borrowing, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!borrowing.book || !borrowing.book.id) {
        alert("Lütfen bir kitap seçin!");
        return;
      }

      const formattedBorrowing = {
        ...borrowing,
        borrowingDate: borrowing.borrowingDate,
        returnDate: borrowing.returnDate,
      };

      if (formattedBorrowing.id) {
        await axios.put(
          `http://localhost:8080/api/v1/borrows/${formattedBorrowing.id}`,
          formattedBorrowing
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/borrows", formattedBorrowing);
      }

      setBorrowing({
        id: null,
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: new Date().toISOString().split('T')[0],
        returnDate: new Date().toISOString().split('T')[0],
        book: {
          id: 0,
          name: "",
          publicationYear: 0,
          stock: 0,
          author: {
            id: 0,
            name: '',
            birthDate: '',
            country: ''
          },
          publisher: {
            id: 0,
            name: '',
            establishmentYear: 0,
            address: ''
          },
          categories: [
            {
              id: 0,
              name: '',
              description: ''
            }
          ]
        },
      });
      fetchBorrowings();
    } catch (error) {
      console.error("İşlem sırasında bir hata oluştu.", error);
      if (error.response) {
        console.error("Sunucu yanıtı:", error.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/borrows/${id}`);
      fetchBorrowings();
    } catch (error) {
      console.error("İşlem sırasında bir hata oluştu.", error);
    }
  };

  const handleEdit = (borrowItem) => {
    setBorrowing(borrowItem);
  };

  return (
    <div className="borrows-container">
      <Typography variant="h3" gutterBottom>
        Kitap Alma
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
          />
          <input
            type="date"
            name="returnDate"
            value={borrowing.returnDate || ""}
            onChange={handleChange}
          />
          <select 
            name="bookId" 
            value={borrowing.book?.id || ""}
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
          <button type="submit">Kaydet</button>
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
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.borrowerName}</td>
                <td>{borrow.borrowerMail}</td>
                <td>{borrow.borrowingDate}</td>
                <td>{borrow.returnDate}</td>
                <td>{borrow.book?.name || "Bilinmiyor"}</td>
                <td>
                  <button onClick={() => handleEdit(borrow)}>Düzenle</button>
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