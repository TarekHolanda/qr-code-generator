import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import saveAs from "file-saver";
import Papa from "papaparse";

import "./App.css";
import { MyAppBar } from "./MyAppBar";
import { Spacer } from "./Spacer";
import { darkTheme } from "./darkTheme";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Fade from "@mui/material/Fade";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function TabContent(props) {
    if (props.tab === 0) {
        return (
            <div>
                <div className="card">
                    <h3>First QR Code Value</h3>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="First QR Code"
                        type="number"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        value={props.min}
                        onChange={props.updateMin}
                    />

                    <h3>Last QR Code Value</h3>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label="Last QR Code"
                        type="number"
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        value={props.max}
                        onChange={props.updateMax}
                    />
                </div>

                <div className="card">
                    <ButtonGroup variant="contained">
                        <Button onClick={props.generateQrCodes}>
                            Generate QR Codes
                        </Button>

                        <Button onClick={props.downloadQrCodes} disabled={!props.validCodes}>
                            Download
                        </Button>

                        <Button onClick={props.clearQrCodes} disabled={!props.validCodes}>
                            Clear
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Spacer size={24} horizontal={false} />

                <div className="card">
                    <ButtonGroup variant="contained">
                        <Button variant="contained" size="large" component="label">
                            Upload
                            <input hidden accept=".csv" name="file" type="file" id="file" onChange={props.onFileUploaded} />
                        </Button>
                        
                        <Spacer size={24} horizontal={true} />
                        
                        <Button onClick={props.downloadQrCodes} disabled={!props.validCodes}>
                            Download
                        </Button>

                        <Button onClick={props.clearQrCodes} disabled={!props.validCodes}>
                            Clear
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
}

function App() {
    const [tab, setTab] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [qrCodes, setQrCodes] = useState([{ "description": "QR Code", "data": "QR Code"}]);
    const [validCodes, setValidCodes] = useState(false);
    const qrRef = useRef(null);

    const downloadQrCodes = async () => {
        const zip = new JSZip();

        for (let i = 0; i < qrCodes.length; i++) {
            const canvas = qrRef.current.querySelector("#qrCode" + i);
            
            // Add margin to the QR Code
            const canvasWithMargin = document.createElement("canvas");
            const marginContext = canvasWithMargin.getContext("2d");
            canvasWithMargin.width = canvas.width + 32;
            canvasWithMargin.height = canvas.height + 96;
            marginContext.fillStyle = "#fff";
            marginContext.fillRect(0, 0, canvasWithMargin.width, canvasWithMargin.height);
            marginContext.drawImage(canvas, 16, 16);

            // Draw the QR Code description
            const labelContext = canvasWithMargin.getContext("2d");
            labelContext.font = "48px Arial";
            labelContext.textBaseline = "bottom";
            labelContext.fillStyle = "#000000";
            labelContext.lineWidth = 20;
            labelContext.fillText(qrCodes[i]["description"], 12, 600);

            const blob = await new Promise(resolve => canvasWithMargin.toBlob(resolve));
            const fileName = `${qrCodes[i]["description"]}.png`;
            zip.file(fileName, blob);
        }

        // Generate zip file
        zip.generateAsync({ type: "blob" }).then((content) => {
            // Save zip file
            saveAs(content, "QRCode.zip");
        });
    }

    const generateQrCodes = () => {
        let aux = [];
        if (min && max) {
            for (let i = min; i <= max; i++) {
                aux.push({
                    "description": i,
                    "data": "" + i,
                })
            }
            console.log(aux)
            setQrCodes(aux);
            setValidCodes(true);
        }
    }

    const clearQrCodes = () => {
        setQrCodes([]);
        setValidCodes(false);
    }

    const formatData = (fileRow) => {
        let dataTemp = {
            "description": fileRow["First Name"] + " " + fileRow["Last Name"] + " - " + fileRow["QR Code"],
            "data": fileRow["QR Code"],
        };

        return dataTemp;
    }

    const onFileUploaded = (e) => {
        if (e.target.files.length) {
            Papa.parse(e.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    let dataFormatted = [];
                    console.log(results);

                    for (let i = 0; i < results.data.length; i++) {
                        dataFormatted.push(formatData(results.data[i]));
                    }

                    setQrCodes(dataFormatted);
                    setValidCodes(true);
                },
            });
        }
    };

    const updateMin = (event) => {
        setMin(event.target.value);
    }

    const updateMax = (event) => {
        setMax(event.target.value);
    }

    const updateTab = (event, newTab) => {
        if (newTab !== null) {
            setTab(newTab);
            clearQrCodes();
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <MyAppBar />

            <main>
                <Spacer size={48} horizontal={false} />

                <ToggleButtonGroup
                    color="primary"
                    value={tab}
                    exclusive
                    onChange={updateTab}
                    aria-label="Platform"
                >
                    <ToggleButton value={0}>Free Input</ToggleButton>
                    <ToggleButton value={1}>File Upload</ToggleButton>
                </ToggleButtonGroup>

                <TabContent
                    tab={tab}
                    min={min}
                    max={max}
                    updateMin={updateMin}
                    updateMax={updateMax}
                    generateQrCodes={generateQrCodes}
                    downloadQrCodes={downloadQrCodes}
                    clearQrCodes={clearQrCodes}
                    validCodes={validCodes}
                    onFileUploaded={onFileUploaded}
                />

                <Fade in={validCodes} timeout={1000}>
                    <ImageList sx={{ width: "auto", height: "auto" }} cols={3} gap={64}>
                        {qrCodes.map((qrCode, index) => (
                            <ImageListItem key={index} sx={{ margin: "auto" }}>
                                <QRCodeCanvas
                                    value={qrCode["data"]}
                                    id={"qrCode" + index}
                                    size={352}
                                    level={"H"}
                                    imageSettings={{
                                        src: "./src/assets/hc-icon-black.png",
                                        height: 38,
                                        width: 48,
                                        excavate: true,
                                    }}
                                />
                                
                                <ImageListItemBar
                                    title={qrCode["description"]}
                                    position="bottom"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Fade>
                
                <div ref={qrRef} className="display-none">
                    {qrCodes.map((qrCode, index) => {
                        return (
                            <div key={index}>
                                <QRCodeCanvas
                                    value={qrCode["data"]}
                                    id={"qrCode" + index}
                                    size={512}
                                    level={"H"}
                                    imageSettings={{
                                        src: "./src/assets/hc-icon-black.png",
                                        height: 103,
                                        width: 128,
                                        excavate: true,
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            </main>
        </ThemeProvider>
    )
}

export default App
