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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (!borrowing.book || !borrowing.book.id) {
            alert("Lütfen bir kitap seçin!");
            return;
        }

        // Book ID'sini kontrol edin
        const bookId = parseInt(borrowing.book.id);
        if (isNaN(bookId) || bookId <= 0) {
            alert("Geçersiz kitap ID'si!");
            return;
        }

        // Tarihlerin tam ve doğru formatta olduğundan emin olun
        const borrowingDate = borrowing.borrowingDate || new Date().toISOString().split('T')[0];
        const returnDate = borrowing.returnDate || new Date().toISOString().split('T')[0];
        
        // Formatlı veri hazırlama - kesinlikle istenen formatta
        const formattedBorrowing = {
            borrowerName: borrowing.borrowerName,
            borrowerMail: borrowing.borrowerMail,
            borrowingDate: borrowingDate,
            returnDate: returnDate,
            bookForBorrowingRequest: {
                bookId: bookId
            }
        };

        // Veriyi kontrol edin
        console.log("Backend'e gönderilen veri:", JSON.stringify(formattedBorrowing, null, 2));
        
        // API isteği - Explicit olarak belirtin
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/borrows',
            data: formattedBorrowing,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log("Sunucu yanıtı:", response.data);

        // Başarılı olursa formu temizle
        setBorrowing({
            id: null,
            borrowerName: "",
            borrowerMail: "",
            borrowingDate: new Date().toISOString().split('T')[0],
            returnDate: new Date().toISOString().split('T')[0],
            book: null,
        });

        // Listeyi yenile
        fetchBorrowings();
        alert("Kitap başarıyla ödünç alındı!");
        
    } catch (error) {
        console.error("İşlem sırasında bir hata oluştu:", error);
        
        // Detaylı hata bilgisi
        if (error.response) {
            console.error("Sunucu yanıtı:", error.response.status, error.response.data);
            alert(`Sunucu hatası: ${error.response.status} - ${JSON.stringify(error.response.data || 'Internal Server Error')}`);
        } else {
            alert(`Bağlantı hatası: ${error.message}`);
        }
    }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/borrows/${id}`);
      fetchBorrowings();
    } catch (error) {
      console.error("İşlem sırasında bir hata oluştu.", error);
      alert("Silme işlemi başarısız oldu.");
    }
  };

  const handleEdit = (borrowItem) => {
    setBorrowing({
      ...borrowItem,
      book: borrowItem.book || null,
    });
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
