import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.util.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaEnvelopeOpenText } from "react-icons/fa";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("message", formData.message);
      formPayload.append("access_key", "edf4bf9b-0055-40a1-8c09-bb1baf444b85"); 

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formPayload
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Form submitted successfully!");
        
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error("Web3Forms error:", data);
        toast.error(data.message || "Failed to send message.");
        setResult(data.message);
      }
    } catch (err) {
      console.error("Error sending via Web3Forms:", err);
      toast.error("Failed to send message. Please try again.");
      setResult("Error sending message.");
    }
  };

  return (
    <div className="contact-page py-5">
      <div className="container">
        <h1 className="fw-bold text-center neon-title mb-3">
          <span className="d-inline-flex align-items-center">
            <FaEnvelopeOpenText className="me-2" />
            Contact Us :
          </span>
        </h1>

        <div className="row g-4 mt-2">
          
          <div className="col-md-7">
            <div className="contact-card p-4">
              <h4 className="mb-4 text-white">Send us a message</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-neon w-100">
                  🚀 Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="col-md-5">
          <div className="contact-card p-4 h-100">
            <h3 className="mb-4 neon-title1"><span className="d-inline-flex align-items-center">
              <FaPhoneAlt className="me-2" style={{color:"green"}} />
              Get in Touch :
            </span></h3>
            <p className="text-white lh-base mt-2" style={{fontSize: "1.1rem"}}>
              We’re always happy to connect! Whether you have questions, need a little support, want to share your valuable feedback, or simply feel like saying hello 👋 - don’t 
              hesitate to reach out. Our team is here to listen, assist, and make sure you feel heard every step of the way.
            </p>
            <ul className="list-unstyled mt-5">
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-2 text-primary fs-5" />
                <span className="text-white">LinkedIn: <a 
                    href="https://www.linkedin.com/in/aditya-a193bb298/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white text-decoration-none"
                  >
                    linkedin.com/in/aditya-a193bb298
                  </a>
                </span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhoneAlt className="me-2 text-success fs-5" />
                <span className="text-white">+91 8368422026</span>
              </li>
              <li className="d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-danger fs-5" />
                <span className="text-white">Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
