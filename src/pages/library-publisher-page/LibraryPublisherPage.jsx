import axios from "axios";
import "./LibraryPublisherPage.styles.css";
import { useEffect } from "react";
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

function LibraryPublisherPage() {
  // context hook
  const { publishers, publisher, setPublisher, fetchPublishers } = useLibrary();

  // fetch publishers işlemi
  useEffect(() => {
    fetchPublishers();
  }, []);

  // inputlardaki değişiklikleri takip eden fonksiyon
  const handleChange = (e) => {
    setPublisher({ ...publisher, [e.target.name]: e.target.value });
  };

  // form submit işlemi
  const handleSubmit = async (e) => {
    // formun default işlemlerini engelle
    e.preventDefault();

    // yeni yayınevi eklemek için post, var olanı güncellemek için put requesti
    try {
      if (publisher.id) {
        await axios.put(
          `http://localhost:8080/api/v1/publishers/${publisher.id}`,
          publisher
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/publishers", publisher);
      }

      // formu sıfırla ve yayınevlerini tekrar çek
      setPublisher({
        id: null,
        name: "",
        establishmentYear: new Date().getFullYear(),
        address: "",
      });
      fetchPublishers();
    } catch (error) {
      // hata durumunda console'a yazdır

      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  // yayınevi silme işlemi
  const handleDelete = async (id) => {
    if (window.confirm("Bu yayınevini silmek istediğine emin misin?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/publishers/${id}`);
        fetchPublishers();
      } catch (error) {
        console.error("Silme sırasında hata oluştu:", error);
      }
    }
  };

  // yayınevi düzenleme işlemi
  const handleEdit = (pub) => {
    setPublisher(pub);
  };

  return (
    <div className="publisher-container">
      <div className="publisher-input-container">
        <Typography variant="h3" sx={{}} gutterBottom>
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
    </div>
  );
}

export default LibraryPublisherPage;
