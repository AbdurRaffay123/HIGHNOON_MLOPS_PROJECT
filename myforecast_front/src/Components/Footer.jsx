import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <hr />
      <div className="footer-logo">
        <p>SALES FORECASTING</p>
      </div>
      <div className="rows">
        <div className="row1">
          <h3>Company</h3>
          <ul className="footer_company">
            <li>About Highnoon</li>
            <li>Our Products</li>
            <li>Our Business</li>
            <li>Careers</li>
            <li>Media Center</li>
            <li>Environmental Social & Governance</li>
            <li>Lab Policy</li>
            <li >Confidentiality & Impartiality</li>
            <li>EHS Policy</li>
          </ul>
        </div>
        <div className="row2">
          <h3>Our Products</h3>
          <ul className="company_product">
            <li>Cardiology</li>
            <li>Metabolic</li>
            <li>Gastroenterology</li>
            <li>Musculoskeletal</li>
            <li>Anti-infective</li>
            <li>Obstetrics and Gynaecology</li>
            <li>Paediatrics</li>
            <li>Allergy</li>
            <li>Respiratory</li>
            <li>Urology</li>
          </ul>
        </div>
        <div className="row3">
          <h3>Contact Us</h3>
          <ul className="footer_contact">
            <li>Phone: +92 (42) 37510023-27</li>
            <li>Fax: +92 (42) 37510037</li>
            <li>UAN: +92 (42) 111-000-465</li>
            <li>Email: info@highnoon.com.pk</li>
            <li>Address: 17.5 KM, Multan Road,</li>
            <li>Lahore - 53700, Pakistan</li>
          </ul>
        </div>
        <div className="row4">
  
        <ul className="footer_about">
          <li>For any query or complaints please contact:</li>
          <li>Mr. Baqar Hasan</li>
          <li>Company Secretary</li>
          <li>17.5 KM, Multan Road,</li>
          <li>Lahore - 53700</li>
          <li>Email: corporate.affairs@highnoon.com.pk</li>
        </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @2024 - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
