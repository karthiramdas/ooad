import React from 'react';
import { useNavigate } from 'react-router-dom';
 import './LandingPage.css'; // Import your styles

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Redirect to respective login page based on the selected role
    // console.log(role)
    navigate(`/login`,{state:{role}});
  };
  // const toPatient = (role)=>{
  //   navigate(`/patient`);
  // }

  return (
    <div className="role-selection-container">
      <h1>Select Your Role</h1>
      <div className="role-buttons">
        <button className="role-button" onClick={() => handleRoleSelect('admin')}>
          Admin
        </button>
        <button className="role-button" onClick={() => handleRoleSelect('patient')}>
          Patient/Family
        </button>
        <button className="role-button" onClick={() => handleRoleSelect('doctor')}>
         Doctor
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
