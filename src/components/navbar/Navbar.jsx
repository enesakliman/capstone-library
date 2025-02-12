import { Routes, Route } from "react-router";
import LibraryHomePage from "../library-home-page/LibraryHomePage";

function Navbar() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LibraryHomePage />} />
      </Routes>
    </>
  );
}

export default Navbar;
