






import React from "react";
import { Card } from "antd";

const RealEstate = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "150px",
        position: "relative",
        marginRight:"50%",
      }}
    >
      {/* Common Line */}

     
 

     
      {[
        {
          title: "Agriculture",
          imageUrl:
            "https://img.freepik.com/free-photo/green-tea-bud-leaves-green-tea-plantations-morning_335224-955.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
        },
        {
          title: "Residential",
          imageUrl:
            "https://img.freepik.com/premium-photo/modern-white-villa-with-lush-gardens-sunny-coastal-area-daytime_588826-7317.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
        },
        {
          title: "Commercial",
          imageUrl:
            "https://img.freepik.com/premium-photo/warehouse-commerical-building_87720-49770.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
        },
        {
          title: "Layout",
          imageUrl:
            "https://img.freepik.com/free-photo/view-land-plot-real-estate-business-development_23-2149916728.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
        },
      ].map((card, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 20px", // Space between cards
            zIndex: 1,
          }}
        >
         
          {/* Card */}
          <Card
            style={{
              width: "110px",
              height: "100px",
              backgroundColor:"rgb(0, 0, 0, 0.5)",
              color:"white",
              borderRadius: "8px",
              border: "1px solid #ddd", // Border styling
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for the card
              overflow: "hidden", // Ensure image doesn't overflow the card
            }}
          >
            {" "}
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "white",
                textTransform: "capitalize", // Capitalize the text
                marginTop: "-30%",
                fontFamily: "'Pacifico', cursive",
              }}
            >
              {card.title}
            </div>
            <img
              src={card.imageUrl} // Use the specific image URL
              alt={card.title} // Alt text for the image
              style={{
                width: "210%", // Make the image cover the full width of the card
                height: "100%", // Make the image cover the full height of the card
                objectFit: "cover",
                marginLeft: "-40%",
              }}
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default RealEstate;








