import "./LibraryCategoryPage.styles.css";
import { useEffect } from "react";
import { useLibrary } from "../../context/library-context/LibraryContext";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";

function LibraryCategoryPage() {
  const { categories, setCategories, category, setCategory } = useLibrary();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (category.id) {
        await axios.put(
          `http://localhost:8080/api/v1/categories/${category.id}`,
          category
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/categories", category);
      }

      setCategory({ id: null, name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("İşlem sırasında hata oluştu:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Silme işlemi sırasında hata oluştu:", error);
      }
    }
  };

  const handleEdit = (id) => {
    const selectedCategory = categories.find((category) => category.id === id);
    setCategory(selectedCategory);
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

      <div className="categories-table-container">
        <table>
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>Açıklaması</th>
              <th>Düzenle</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button onClick={() => handleEdit(category.id)}>
                    <EditIcon />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(category.id)}
                    style={{ color: "red" }}
                  >
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

export default LibraryCategoryPage;
