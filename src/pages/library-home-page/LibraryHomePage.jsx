import "./LibraryHomePage.styles.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomeCard from "../../components/home-card/HomeCard";
import homeIcon from "../../assets/icon/book-icon.png";

function LibraryHomePage() {
  return (
    <>
      <Box>
        <div className="home-text-container">
          <div className="home-img-container">
            {/* <img src="/home-screen.jpg" alt="HomeScreen" /> */}
            <img src={homeIcon} alt="HomeScreen" />
            <Typography variant="h2" sx={{}} gutterBottom>
              LibraryApp
            </Typography>
          </div>
          <div className="home-text">
            <Typography variant="h4" sx={{ maxWidth: "400px" }} gutterBottom>
              Kişisel kütüphanenize hoş geldiniz.
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "400px" }} gutterBottom>
              Kişisel kütüphanenizde kitaplarınızı ekleyebilir, düzenleyebilir
              ve silebilirsiniz. Ayrıca kitaplarınızı kategorilere göre
              filtreleyebilirsiniz. Yayın evi ve yazarlarınızı ekleyebilir,
              düzenleyebilir ve silebilirsiniz.
            </Typography>
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
