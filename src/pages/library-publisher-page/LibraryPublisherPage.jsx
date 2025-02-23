import axios from "axios";
import "./LibraryPublisherPage.styles.css";
import { useEffect, useState } from "react";
import { useLibrary } from "../../context/library-context/LibraryContext";
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

function LibraryPublisherPage() {
  const { publishers, publisher, setPublisher, fetchPublishers } = useLibrary();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleChange = (e) => {
    setPublisher({ ...publisher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (publisher.id) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/v1/publishers/${publisher.id}`,
          publisher
        );
        setSnackbarMessage("Yayınevi başarıyla güncellendi!");
      } else {
        await axios.post(import.meta.env.VITE_BASE_URL + "/api/v1/publishers", publisher);
        setSnackbarMessage("Yayınevi başarıyla eklendi!");
      }
      setSnackbarOpen(true);

      setPublisher({
        id: null,
        name: "",
        establishmentYear: new Date().getFullYear(),
        address: "",
      });
      fetchPublishers();
    } catch (error) {
      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/publishers/${id}`);
      setSnackbarMessage("Yayınevi başarıyla silindi!");
      setSnackbarOpen(true);
      fetchPublishers();
    } catch (error) {
      console.error("Silme sırasında hata oluştu:", error);
    }
  };

  const handleEdit = (pub) => {
    setPublisher(pub);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="publisher-container">
      <div className="publisher-input-container">
        <Typography variant="h3" gutterBottom>
          Yayınevi
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Yayınevi Adı"
            value={publisher.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="establishmentYear"
            placeholder="Kuruluş Yılı"
            value={publisher.establishmentYear}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Adres"
            value={publisher.address}
            onChange={handleChange}
            required
          />
          <button type="submit">{publisher.id ? "Güncelle" : "Ekle"}</button>
        </form>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Ad</TableCell>
              <TableCell align="center">Kuruluş Yılı</TableCell>
              <TableCell align="center">Adres</TableCell>
              <TableCell align="center">Düzenle</TableCell>
              <TableCell align="center">Sil</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {publishers.map((pub) => (
              <TableRow
                key={pub.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {pub.name}
                </TableCell>
                <TableCell align="center">{pub.establishmentYear}</TableCell>
                <TableCell align="center">{pub.address}</TableCell>
                <TableCell align="center">
                  <button onClick={() => handleEdit(pub)}>
                    <EditIcon />
                  </button>
                </TableCell>
                <TableCell align="center">
                  <button
                    onClick={() => handleDelete(pub.id)}
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default LibraryPublisherPage;
