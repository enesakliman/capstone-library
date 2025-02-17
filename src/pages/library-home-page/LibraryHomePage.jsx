import "./LibraryHomePage.styles.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomeCard from "../../components/home-card/HomeCard";

function LibraryHomePage() {
  return (
    <>
      <Box>
        <div className="home-text-container">
          <div className="home-text">
            <Typography variant="h2" sx={{}} gutterBottom>
              Kütüphane
            </Typography>
            <Typography variant="h4" sx={{ maxWidth: "400px" }} gutterBottom>
              Kişisel kütüphanenize hoş geldiniz.
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "400px" }} gutterBottom>
              Kişisel kütüphanenizi oluşutabilir, yönetebilir ve
              paylaşabilirsiniz. Detaylı bir şekilde arama yapabilir ve
              kitaplarınızı kategorilere ayırabilirsiniz. Yayım evlerini,
              yazarları ve kitapları ekleyebilirsiniz.
            </Typography>
          </div>
          <div className="home-img-container">
            <img src="/home-screen.jpg" alt="HomeScreen" />
          </div>
        </div>
        <div className="home-card-container">
          <HomeCard />
        </div>
      </Box>
    </>
  );
}

export default LibraryHomePage;
