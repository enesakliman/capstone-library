import axios from "axios";
import "./LibraryPublisherPage.styles.css";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";

function LibraryPublisherPage() {
  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState({
    id: null,
    name: "",
    establishmentYear: new Date().getFullYear(),
    address: "",
  });

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/publishers"
      );
      setPublishers(response.data);
    } catch (error) {
      console.error("Yayınevleri alınırken hata oluştu:", error);
    }
  };

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
          `http://localhost:8080/api/v1/publishers/${publisher.id}`,
          publisher
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/publishers", publisher);
      }

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
    if (window.confirm("Bu yayınevini silmek istediğine emin misin?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/publishers/${id}`);
        fetchPublishers();
      } catch (error) {
        console.error("Silme sırasında hata oluştu:", error);
      }
    }
  };

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

      <div className="publisher-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Kuruluş Yılı</th>
              <th>Adres</th>
              <th>Düzenle</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((pub) => (
              <tr key={pub.id}>
                <td>{pub.id}</td>
                <td>{pub.name}</td>
                <td>{pub.establishmentYear}</td>
                <td>{pub.address}</td>
                <td>
                  <button onClick={() => handleEdit(pub)}>
                    <EditIcon />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(pub.id)}>
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

export default LibraryPublisherPage;
