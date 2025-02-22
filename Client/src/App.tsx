import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Users/Home";
import Login from "./Pages/Users/Login";
import Register from "./Pages/Users/Register";
import Header from "./components/Home/Header";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  const shouldHideHeader = () => {
    const hideHeaderPaths = ["/login", "/register"];
    const dynamicRouteRegex = /^\/invoice\/[^/]+$/; 

    return hideHeaderPaths.includes(location.pathname) || dynamicRouteRegex.test(location.pathname);
  };

  return (
    <>
      {!shouldHideHeader() && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
