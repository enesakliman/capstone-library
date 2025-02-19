import "./LibraryAuthorPage.styles.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function LibraryAuthorPage() {
  const [authors, setAuthors] = useState([]);
  const [author, setAuthor] = useState({
    id: null,
    name: "",
    birthDate: new Date().getDate(),
    country: "",
  });

  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/authors");
      setAuthors(response.data);
    } catch (error) {
      console.error("Yazarlar alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (author.id) {
        await axios.put(
          `http://localhost:8080/api/v1/authors/${author.id}`,
          author
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/authors", author);
      }

      setAuthor({
        id: null,
        name: "",
        birthDate: new Date().getFullYear(),
        country: "",
      });
      fetchAuthors();
    } catch (error) {
      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/authors/${id}`);
      fetchAuthors();
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };

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
      <div className="authors-table-container">
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Doğum Tarihi</th>
              <th>Ülke</th>
              <th>Düzenle</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((pub) => (
              <tr key={pub.id}>
                <td>{pub.name}</td>
                <td>{pub.birthDate}</td>
                <td>{pub.country}</td>
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

export default LibraryAuthorPage;
