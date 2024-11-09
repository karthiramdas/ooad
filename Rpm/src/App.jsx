import AdminPage from "./pages/Adminpage";
import PatientPage from "./pages/PatientPage";
import DoctorPage from "./pages/DoctorPage";
import ManagePatients from "./pages/ManagePatients"
import ManageDoctors from "./pages/ManageDoctors";
import Login from "./Login";
import RoleSelection from "./LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export default function App() {
  return (<>
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} /> {/* Login Page */}
        {/* <Route path="/login" element={<Login  />} />  */}
        <Route path="/login" element={<Login  />} /> 
        
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/admin/patients" element={< ManagePatients/>} />
        <Route path="/admin/doctors" element={< ManageDoctors/>} />
      </Routes>
    </Router>
  </>
  );
}
