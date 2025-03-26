

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "./Styles/FooterStyle.css";
import image3 from "../images/image3.png"; 
import image2 from "../images/image2.png"; 
const footerData = [
  {
    title: "footer.Company",
    links: [
      "footer.About Us",
      "footer.Our Services",
      "footer.Privacy Policy",
      "footer.Affiliate Program",
    ],
  },
  {
    title: "footer.Get Help",
    links: [
      "footer.FAQ",
      "footer.Customer Service",
      "footer.SiteMaps",
      "footer.Articles",
    ],
  },
  {
    title: "footer.Real Estate Lokam",
    links: [
      "footer.Price Trends",
      "footer.Post your Property",
      "footer.Booking Appointments",
    ],
  },
  {
    title: "footer.Contact Us",
    links: [
      "footer.Toll Free",
      "footer.Working Hours",
      "footer.Email",
    ],
  },
];
const socialLinks = [
  { icon: faFacebookF, label: "Facebook" },
  { icon: faTwitter, label: "Twitter" },
  { icon: faInstagram, label: "Instagram" },
  { icon: faLinkedinIn, label: "LinkedIn" },
];
const FooterPage = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || 'en'; 
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {footerData.map((col, index) => (
            <div className="footerCol" key={index}>
              <h4>{t(col.title)}</h4> 
              <ul>
                {col.links.map((link, idx) => (
                  <li key={idx}>
                    {/* <a href="#">{t(link)}</a>  */}
                    <p>{t(link)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footerCol">
            <h4>{t("footer.Follow Us")}</h4>
            <div className="socialLinks">
              {socialLinks.map((social, idx) => (
                // <a href="#" aria-label={social.label} key={idx}>
                //   <FontAwesomeIcon icon={social.icon} />
                // </a>
                <p aria-label={social.label} key={idx}>
  <FontAwesomeIcon icon={social.icon} />
</p>

              ))}
            </div>
            <div className="footerImages">
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img src={image3} alt="Download on Google Play" className="footer-image" />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                <img src={image2} alt="Download on the App Store" className="footer-image" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;