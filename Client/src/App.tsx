import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import Home from "./Pages/Users/Home";
import Login from "./Pages/Users/Login";
import Register from "./Pages/Users/Register";
import Header from "./components/Home/Header";
import Dashboard from "./Pages/Users/Dashboard";

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
      </Routes>
    </>
  );
}

export default App;
