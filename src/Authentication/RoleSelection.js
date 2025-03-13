import React, { useEffect, useState } from "react";

const RoleSelection = () => {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const handleLogin = () => {
    if (password === "correctpassword") {
      setRole(1); 
      setShowModal(true); 
    } else {
      alert("Invalid password");
    }
  };
useEffect(()=>{
    console.log("swijsowjsowi");
})
  const handleAgentSelection = (selectedAgent) => {
    setAgentType(selectedAgent);
    setShowModal(false);
        alert(`Agent type selected: ${selectedAgent}`);
  };
  return (
    <div>
      <h1>Login Form</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={handleLogin}>Submit</button>
      {showModal && role === 1 && (
        <div className="modal">
          <h2>Choose Agent Type</h2>
          <button onClick={() => handleAgentSelection("Buyer")}>Buyer</button>
          <button onClick={() => handleAgentSelection("Seller")}>Seller</button>
        </div>
      )}
    </div>
  );
};
export default RoleSelection;
