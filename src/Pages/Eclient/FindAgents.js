
// import React, { useEffect, useState } from 'react';
// import { _get } from "../../Service/apiClient";

// export default function FindAgents() {
//   const [agents, setAgents] = useState([]);
//   const district = "Vizianagaram";

//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         const response = await _get(`agent/getAgentByDistrict/${district}`);
//         if (response && response.data) {
//           setAgents(response.data);
//           console.log("Agents fetched successfully:", response.data);
//         } else {
//           console.log("No data received from the API.");
//         }
//       } catch (error) {
//         console.error("Error fetching agents: ", error);
//       }
//     };
//     fetchAgents();
//   }, [district]);

//   return (
//     <div>
//       <h1>Agent Details</h1>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
//         {agents.length > 0 ? (
//           agents.map((agent) => (
//             <div
//               key={agent._id}
//               style={{
//                 border: '1px solid #ccc',
//                 borderRadius: '10px',
//                 padding: '20px',
//                 width: '300px',
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               }}
//             >
//               <img
//                 src={agent.profilePicture}
//                 alt={`${agent.firstName} ${agent.lastName}`}
//                 style={{
//                   width: '100%',
//                   height: '200px',
//                   borderRadius: '10px',
//                   objectFit: 'cover',
//                 }}
//               />
//               <h2 style={{ fontSize: '1.5rem', margin: '10px 0' }}>
//                 {agent.firstName} {agent.lastName}
//               </h2>
//               <h3><strong style={{color:"red"}}>Agent ID:{agent._id}</strong></h3>
//               <p><strong>Email:</strong> {agent.email}</p>
//               <p><strong>Phone:</strong> {agent.phoneNumber}</p>
//               <p><strong>City:</strong> {agent.city}</p>
//               <p><strong>District:</strong> {agent.district}</p>
//               <p><strong>State:</strong> {agent.state}</p>
//             </div>
//           ))
//         ) : (
//           <p>No agents found for the district: {district}</p>
//         )}
//       </div>
//     </div>
//   );
// }


// ----------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { _get } from "../../Service/apiClient";

export default function FindAgents() {
  const [agents, setAgents] = useState([]);
  const district = "Vizianagaram";

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await _get(`agent/getAgentByDistrict/${district}`);
        if (response && response.data) {
          setAgents(response.data);
          console.log("Agents fetched successfully:", response.data);
        } else {
          console.log("No data received from the API.");
        }
      } catch (error) {
        console.error("Error fetching agents: ", error);
      }
    };
    fetchAgents();
  }, [district]);
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, ""); 
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber; 
};



  const handleChooseAgent = (agent) => {
    const selectedAgent = {
      id: agent._id,
      name: `${agent.firstName} ${agent.lastName}`,
      phoneNumber: agent.phoneNumber,
      location: `${agent.city}, ${agent.district}, ${agent.state}`,
    };

    // Save the selected agent to local storage
    localStorage.setItem("selectedAgent", JSON.stringify(selectedAgent));
    console.log("Agent stored in local storage:", selectedAgent);
  };

  return (
    <div>
      <h1>Agent Details</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div
              key={agent._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                width: '300px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={agent.profilePicture}
                alt={`${agent.firstName} ${agent.lastName}`}
                style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
              />
              <h2 style={{ fontSize: '1.5rem', margin: '10px 0' }}>
                {agent.firstName} {agent.lastName}
              </h2>
              <h3><strong style={{ color: "red" }}>Agent ID: {agent._id}</strong></h3>
              <p><strong>Email:</strong> {agent.email}</p>
              <p><strong>Phone:</strong>  {formatPhoneNumber(agent.phoneNumber)}</p>
              <p><strong>City:</strong> {agent.city}</p>
              <p><strong>District:</strong> {agent.district}</p>
              <p><strong>State:</strong> {agent.state}</p>
              <button
                onClick={() => handleChooseAgent(agent)}
                style={{
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Choose
              </button>
            </div>
          ))
        ) : (
          <p>No agents found for the district: {district}</p>
        )}
      </div>
    </div>
  );
}


