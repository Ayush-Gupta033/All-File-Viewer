import React, { useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { RotateLeft, RotateRight, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import {
  handleCSVFile,
  handleExcelFile,
  handleDOCXFile,
  handleXMLFile,
} from "../utils/handleFilesView";

const FileViewer = () => {
  const [rotateDegree, setRotateDegree] = useState(0);
  const [fileExtension, setFileExtension] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [miscData, setMiscData] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleFileChange = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileExtension = getFileExtension(file.name);
    setFileExtension(fileExtension);

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;

      if (fileExtension === "docx" || fileExtension === "doc") {
        handleDOCXFile(data);
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        console.log("xls");
        handleExcelFile(data);
      } else if (fileExtension === "csv") {
        handleCSVFile(data);
      } else if (
        fileExtension === "html" ||
        fileExtension === "txt" ||
        fileExtension === "pdf"
      ) {
        handleMiscFile(data, fileExtension, file);
      } else if (fileExtension === "mp4" || fileExtension === "mov"  ) {
        const videoURL = URL.createObjectURL(file);
        setSelectedVideo(videoURL);
      } else if (fileExtension === "xml") {
        handleXMLFile(data);
      } else if (fileExtension.match(/(jpg|jpeg|png|gif|webp|bmp)$/i)) {
        handleImgFile(data);
      } else {
        alert(
          "Unsupported file type. Please upload an Excel, CSV, XML, PPTX, or DOCX file."
        );
      }
    };

    if (
      fileExtension === "docx" ||
      fileExtension === "doc" ||
      fileExtension === "xls" ||
      fileExtension === "xlsx"
    ) {
      reader.readAsArrayBuffer(file);
    } else if (fileExtension === "pptx") {
      reader.readAsBinaryString(file);
    } else if (fileExtension.match(/(jpg|jpeg|png|gif|webp|bmp)$/i)) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  const handleImgFile = (data) => {
    setImageData(data);
  };

  const handleMiscFile = (data, extension, file) => {
    if (extension === "pdf") {
      const pdfUrl = URL.createObjectURL(file);
      setMiscData(pdfUrl);
    } else {
      setMiscData(data);
    }
  };

  const handleRotateLeft = () => {
    setRotateDegree((prevDegree) => {
      const newDegree = prevDegree - 90;
      return newDegree < -180 ? -180 : newDegree;
    });
  };

  const handleRotateRight = () => {
    setRotateDegree((prevDegree) => {
      const newDegree = prevDegree + 90;
      return newDegree > 180 ? 180 : newDegree;
    });
  };

  const handleZoomIn = () => {
    setZoomScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setZoomScale((prevScale) => prevScale - 0.1);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept:
      ".jpg, .jpeg, .png, .gif, .webp, .bmp, .docx, .doc, .xlsx, .xls, .csv, .xml, .html, .txt, .pdf, .pptx, .mp4, .mov",
  });

  return (
    <div>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "60%",
              border: "3px solid black",
            }}
          >
            <Typography variant="h3" color="initial">
              All File Viewer
            </Typography>
            <Typography variant="subtitle1" color="initial">
              docx, xlsx, xls, csv, xml, html, txt, pdf, video/mp4, images (jpg,
              jpeg, png, gif, webp, bmp)
            </Typography>
            <div {...getRootProps()} style={dropzoneStyle}>
              <input {...getInputProps()} />
              <p>Drag and drop a file here, or click to select a file</p>
            </div>
            {[
              "jpg",
              "jpeg",
              "png",
              "gif",
              "webp",
              "bmp",
              "html",
              "txt",
            ].includes(fileExtension) && (
              <Grid item xs={12} style={{ padding: "20px" }}>
                <Typography variant="h6" gutterBottom>
                  Preview:
                </Typography>
                <div>
                  <Button
                    variant="outlined"
                    onClick={handleRotateLeft}
                    sx={{ mr: 2 }}
                  >
                    <RotateLeft />
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleRotateRight}
                    sx={{ mr: 2 }}
                  >
                    <RotateRight />
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleZoomIn}
                    sx={{ mr: 2 }}
                  >
                    <ZoomIn />
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleZoomOut}
                    sx={{ mr: 2 }}
                  >
                    <ZoomOut />
                  </Button>
                </div>
                <div>
                  <Typography>
                    Rotate: {rotateDegree}° Zoom: {Math.round(zoomScale * 100)}%
                  </Typography>
                  <Typography></Typography>
                </div>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
      <div id="sheetSelectorWrapper" style={{ display: "none" }}>
        <label htmlFor="sheetSelector">Switch Sheet: </label>
        <select id="sheetSelector"></select>
      </div>
      <div id="excelData">
        <div className="excel-table">
          {["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(
            fileExtension
          ) && (
            <img
              src={imageData}
              alt="Uploaded Image"
              style={{
                transform: `rotate(${rotateDegree}deg) scale(${zoomScale})`,
              }}
            />
          )}
          {["html", "txt", "pdf"].includes(fileExtension) && (
            <iframe
              title="HTML Preview"
              src={fileExtension === "pdf" ? miscData : undefined}
              srcDoc={fileExtension !== "pdf" ? miscData : undefined}
              style={{
                width: "100%",
                height: "650px",
                transform: `rotate(${
                  (fileExtension === "html" || fileExtension === "txt") &&
                  rotateDegree
                }deg) scale(${
                  (fileExtension === "html" || fileExtension === "txt") &&
                  zoomScale
                })`,
              }}
            />
          )}
          {selectedVideo && (
            <div>
              <video
                controls
                style={{
                  width: "100%",
                  height: "600px",
                }}
              >
                <source src={selectedVideo} type="video/mov" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const dropzoneStyle = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  marginTop: "20px",
  width: "40%",
};

export default FileViewer;
