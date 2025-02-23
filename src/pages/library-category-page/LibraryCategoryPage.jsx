import "./LibraryCategoryPage.styles.css";
import { useEffect, useState } from "react";
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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function LibraryCategoryPage() {
  // context hook
  const { categories, category, setCategory, fetchCategories } = useLibrary();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // fetch categories işlemi
  useEffect(() => {
    fetchCategories();
  }, []);

  // inputlardaki değişiklikleri takip eden fonksiyon
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // form submit işlemi
  const handleSubmit = async (e) => {
    // formun default işlemlerini engelle
    e.preventDefault();
    // yeni kategori eklemek için post, var olanı güncellemek için put requesti
    try {
      if (category.id) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/v1/categories/${category.id}`,
          category
        );
        setSnackbarMessage("Kategori başarıyla güncellendi!");
      } else {
        await axios.post(
          import.meta.env.VITE_BASE_URL + "/api/v1/categories",
          category
        );
        setSnackbarMessage("Kategori başarıyla eklendi!");
      }
      setSnackbarOpen(true);
      // formu sıfırla ve kategorileri tekrar çek
      setCategory({ id: null, name: "", description: "" });
      fetchCategories();
    } catch (error) {
      // hata durumunda console'a yazdır
      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  // kategori silme işlemi
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/categories/${id}`
      );
      setSnackbarMessage("Kategori başarıyla silindi!");
      setSnackbarOpen(true);
      fetchCategories();
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };

  // kategori düzenleme işlemi
  const handleEdit = (id) => {
    const selectedCategory = categories.find((category) => category.id === id);
    setCategory(selectedCategory);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="categories-container">
      <Typography variant="h3" sx={{}} gutterBottom>
        Kategori
      </Typography>

      <div className="categories-input-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="Kategori adı"
            required
          />
          <input
            type="text"
            name="description"
            value={category.description}
            onChange={handleChange}
            placeholder="Kategori açıklaması"
            required
          />
          <button type="submit">{category.id ? "Güncelle" : "Ekle"}</button>
        </form>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Kategori Adı</TableCell>
              <TableCell align="center">Açıklaması</TableCell>
              <TableCell align="center">Düzenle</TableCell>
              <TableCell align="center">Sil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell align="center">{category.name}</TableCell>
                <TableCell align="center">{category.description}</TableCell>
                <TableCell align="center">
                  <button onClick={() => handleEdit(category.id)}>
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => handleDelete(category.id)}
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

export default LibraryCategoryPage;
