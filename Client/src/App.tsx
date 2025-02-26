import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Header from "./components/Header";
import Dashboard from "./Pages/Dashboard";
import Followers from "./Pages/Followers";

function App() {
  return (
    <Router>
      <MainLayout />
      <Toaster />
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Followers" element={<Followers />} />
      </Routes>
    </>
  );
}

export default App;
