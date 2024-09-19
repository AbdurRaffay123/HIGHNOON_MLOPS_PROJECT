import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./MainBody.css";
import loading from "../assets/GIF/loading.gif";

const MainBody = () => {
  const [file, setFile] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [images, setImages] = useState({ forecast: "", pie: "", bar: "" });
  const [productId, setProductId] = useState("");
  const imagesContainerRef = useRef(null);

  useEffect(() => {
    if (!loadingState && images.forecast) {
      if (imagesContainerRef.current) {
        imagesContainerRef.current.classList.add("show");
      }
    }
  }, [loadingState, images.forecast]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileName = selectedFile.name;
      const idMatch = fileName.match(/\d+/);
      if (idMatch) {
        setProductId(idMatch[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoadingState(true); // Start loading spinner

    const formData = new FormData();
    formData.append("file", file);

    const delay = new Promise((resolve) => setTimeout(resolve, 6000)); // 60-second delay

    try {
      const [response] = await Promise.all([
        axios.post("http://localhost:8000/uploadfile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        delay,
      ]);

      if (
        response.data.forecast_plot &&
        response.data.pie_chart &&
        response.data.bar_chart
      ) {
        setImages({
          forecast: response.data.forecast_plot,
          pie: response.data.pie_chart,
          bar: response.data.bar_chart,
        });

        // Scroll to images container after loading
        if (imagesContainerRef.current) {
          imagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        console.error("Backend did not return expected data.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoadingState(false); // Stop loading spinner after exactly 60 seconds
    }
  };

  return (
    <div className="container">
      <h1>SALES FORECASTER</h1>
      <div className="container_entry">
        <input type="file" onChange={handleFileChange} className="red" />
        {loadingState && (
          <div className="loading-overlay">
            <div className="loading-container">
              <img src={loading} alt="Loading..." className="loading-icon" />
            </div>
          </div>
        )}
        <button className="btn" onClick={handleUpload}>
          FORECAST
        </button>
      </div>

      <div className="images-container" ref={imagesContainerRef}>
        {images.forecast && productId && (
          <h2 className="imagesContainer">Product ID: {productId}</h2>
        )}

        <div className="two_plots">
          {images.pie && (
            <div className="image1_container">
              <img
                src={`http://localhost:8000/Saved_images/${images.pie
                  .split("/")
                  .pop()}`}
                alt="Pie Chart"
              />
            </div>
          )}

          {images.bar && (
            <div className="image2_container">
              <img
                src={`http://localhost:8000/Saved_images/${images.bar
                  .split("/")
                  .pop()}`}
                alt="Bar Chart"
              />
            </div>
          )}
        </div>

        {images.forecast && (
          <div className="image_container">
            <img
              src={`http://localhost:8000/Saved_images/${images.forecast
                .split("/")
                .pop()}`}
              alt="Forecast Plot"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainBody;
