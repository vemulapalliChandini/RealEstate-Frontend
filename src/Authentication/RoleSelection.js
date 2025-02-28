import React, { useEffect, useState } from "react";

const RoleSelection = () => {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null); // Role 1 for agent selection
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [agentType, setAgentType] = useState(""); // To store selected agent type

  // Mocking a login function that sets the role based on the password entered.
  const handleLogin = () => {
    // Simulating role 1 based on password for this example
    if (password === "correctpassword") {
      setRole(1); // Assuming 1 is the agent role
      setShowModal(true); // Show the modal
    } else {
      // Handle invalid password logic (e.g., error message)
      alert("Invalid password");
    }
  };
useEffect(()=>{
    console.log("swijsowjsowi");
})
  // Handle agent type selection
  const handleAgentSelection = (selectedAgent) => {
    setAgentType(selectedAgent);
    setShowModal(false); // Close the modal
    // You can now handle what happens after the agent is selected, e.g., navigate
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

      {/* Modal for Agent Selection when role is 1 */}
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
