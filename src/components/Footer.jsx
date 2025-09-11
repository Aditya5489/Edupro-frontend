import React from 'react';


const Footer = () => {
  return (
    <footer className=" text-white py-4" style={{ backgroundColor: "rgba(26, 26, 46, 0.95)", backdropFilter: "blur(6px)",marginTop:"auto" }}>
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} EduPro. All rights reserved.</p>
        <small>
          Designed for educational purposes | <a href="/" className="text-warning text-decoration-none">Privacy Policy</a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
