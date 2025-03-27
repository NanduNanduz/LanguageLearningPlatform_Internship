import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

// Make sure you have this export:
export default MainLayout;
