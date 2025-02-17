import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import dataHome from "../../dataHome";
import { Link } from "react-router-dom";

function HomeCard() {
  return dataHome.map((data) => (
    <>
      <Card sx={{ maxWidth: 345 }} key={data.title}>
        <CardMedia
          component="img"
          alt={data.title}
          height="140"
          image={data.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {data.descripton}
          </Typography>
        </CardContent>
        <CardActions>
          <Link to={data.nav}>
          <Button size="small">Daha fazlası...</Button>
          </Link>
        </CardActions>
      </Card>
    </>
  ));
}

export default HomeCard;
