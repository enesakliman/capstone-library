import publisherImg from "./assets/photos/yayinci.png";
import categoryImg from "./assets/photos/library.webp";
import bookImg from "./assets/photos/book.jpg";
import authorImg from "./assets/photos/yazar.jpg";
import libraryBookImg from "./assets/photos/library-book.png";

const dataHome = [
  {
    title: "Kitap Alma",
    descripton: "Eklediğiniz kitapları alabilirsiniz.",
    image: libraryBookImg,
    nav: "/kitap-alma",
  },
  {
    title: "Kitap",
    descripton: "Eklediğiniz kitapların bilgilerini belirtir.",
    image: bookImg,
    nav: "/kitap",
  },
  {
    title: "Kategori",
    descripton: "Eklediğiniz kitabın kategorisini belirtir.",
    image: categoryImg,
    nav: "/kategori",
  },
  {
    title: "Yazar",
    descripton: "Eklediğiniz kitabın yazarını belirtir.",
    image: authorImg,
    nav: "/yazar",
  },
  {
    title: "Yayımcı",
    descripton: "Eklediğiniz kitapların yayımcısını belirtir.",
    image: publisherImg,
    nav: "/yayimci",
  },
];

export default dataHome;
