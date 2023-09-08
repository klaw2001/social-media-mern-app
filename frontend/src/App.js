import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/Login/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/authRoutes/ProtectedRoute";
import PublicRoute from "./components/authRoutes/PublicRoute";
import SignIn from "./components/Login/SignIn";
import Home from "./components/Main/Home";
import ViewProfile from "./components/Users/ViewProfile";
import AppDrawer from "./components/Main/AppDrawer";
import GridHomePage from "./components/GridHome/GridHomePage";
import EditProfileComp from "./components/Users/EditProfileComp";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<GridHomePage />} index="true"/>
              <Route path="/view-profile" element={<ViewProfile />} />
              <Route path="/edit-profile" element={<EditProfileComp />} />
            {/* </Route> */}
          </Route>

          <Route path="/" element={<PublicRoute />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
