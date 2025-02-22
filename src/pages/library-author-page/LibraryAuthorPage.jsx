import "./LibraryAuthorPage.styles.css";
import axios from "axios";
import { useEffect } from "react";
import { useLibrary } from "../../context/library-context/LibraryContext";
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

function LibraryAuthorPage() {
  // context hook
  const { authors, author, setAuthor, fetchAuthors } = useLibrary();

  // fetch authors işlemi
  useEffect(() => {
    fetchAuthors();
  }, []);

  // inputlardaki değişiklikleri takip eden fonksiyon
  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  // form submit işlemi
  const handleSubmit = async (e) => {
    // formun default işlemlerini engelle
    e.preventDefault();

    // yeni yazar eklemek için post, var olanı güncellemek için put requesti
    try {
      if (author.id) {
        await axios.put(
          `http://localhost:8080/api/v1/authors/${author.id}`,
          author
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/authors", author);
      }

      // formu sıfırla ve yazarları tekrar çek
      setAuthor({
        id: null,
        name: "",
        birthDate: new Date().getFullYear(),
        country: "",
      });
      fetchAuthors();
    } catch (error) {
      // hata durumunda console'a yazdır
      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  // yazar silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/authors/${id}`);
      fetchAuthors();
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };

  // yazar düzenleme işlemi
  const handleEdit = (author) => {
    setAuthor(author);
  };
  return (
    <div className="authors-container">
      <div className="authors-input-container">
        <Typography variant="h3" sx={{}} gutterBottom>
          Yazar
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={author.name}
            onChange={handleChange}
            placeholder="Ad Soyad"
          />
          <input
            type="date"
            name="birthDate"
            value={author.birthDate}
            onChange={handleChange}
            placeholder="Doğum Yılı"
          />
          <input
            type="text"
            name="country"
            value={author.country}
            onChange={handleChange}
            placeholder="Ülke"
          />
          <button type="submit">{author.id ? "Güncelle" : "Ekle"}</button>
        </form>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ad</TableCell>
              <TableCell align="center">Doğum Tarihi</TableCell>
              <TableCell align="center">Ülke</TableCell>
              <TableCell align="center">Düzenle</TableCell>
              <TableCell align="center">Sil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((auth) => (
              <TableRow key={auth.id}>
                <TableCell align="center">{auth.name}</TableCell>
                <TableCell align="center">{auth.birthDate}</TableCell>
                <TableCell align="center">{auth.country}</TableCell>
                <TableCell align="center">
                  <button onClick={() => handleEdit(auth)} >
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => handleDelete(auth.id)} 
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

export default LibraryAuthorPage;
