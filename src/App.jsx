import { useState, useRef, useEffect } from "react";
import hcIconWhite from "./assets/hc-icon-white.png";
import "./App.css";

import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import saveAs from "file-saver";

function App() {
    // const [loading, setLoading] = useState(false);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [qrCodes, setQrCodes] = useState([]);
    const qrRef = useRef();

    const download = async () => {
        // setLoading(true);
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
            labelContext.font = "56px Arial";
            labelContext.textBaseline = "bottom";
            labelContext.fillStyle = "#000000";
            labelContext.lineWidth = 20;
            labelContext.fillText(qrCodes[i], 12, 600);

            const blob = await new Promise(resolve => canvasWithMargin.toBlob(resolve));
            const fileName = `${qrCodes[i]}.png`;
            zip.file(fileName, blob);
        }

        // Generate zip file
        zip.generateAsync({ type: "blob" }).then((content) => {
            // Save zip file
            saveAs(content, "QRCode.zip");

            // Reset the QR Codes
            setQrCodes([]);

            // Reset loading
            // setLoading(false);
        });
    }

    const generateQrCodes = () => {
        // setLoading(true);
        
        const qrCodesUpdated = new Promise((resolve, reject) => {
            for (let i = min; i <= max; i++) {
                setQrCodes(qrCodes => [...qrCodes, i]);
                if (i === max) resolve();
            }
        });
        
        qrCodesUpdated.then(() => {
            // setLoading(false);
            console.log("QR Codes Updated!");
        });
    }

    const updateMin = (event) => {
        setMin(parseInt(event.target.value) || "");
    }

    const updateMax = (event) => {
        setMax(parseInt(event.target.value) || "");
    }

    return (
        <>
            <div>
                <a href="https://www.heavyconnect.com/" target="_blank">
                    <img src={hcIconWhite} className="logo" alt="HC logo" />
                </a>
            </div>
            
            <h2>
                Employee QR Code Generator
            </h2>

            <div className="card">
                <h3>First QR Code Value</h3>
                <input type="number" placeholder="First QR Code" value={min} onChange={updateMin} />

                <h3>Last QR Code Value</h3>
                <input type="number" placeholder="Last QR Code" value={max} onChange={updateMax} />
            </div>

            <div className="card">
                <button onClick={generateQrCodes}>
                    Generate QR Codes
                </button>

                <div className="spacer-vertical">
                </div>

                <button onClick={() => download()} disabled={!qrCodes.length}>
                    Download
                </button>
            </div>

            <div ref={qrRef} className="display-none">
                {qrCodes.map((qrCode, index) => {
                    return (
                        <div key={index}>
                            <QRCodeCanvas
                                value={'' + qrCode}
                                id={"qrCode" + index}
                                size={512}
                                level={"H"}
                                // imageSettings={{
                                //     src: "./src/assets/hc-icon-black.png",
                                //     height: 103,
                                //     width: 128,
                                //     excavate: true,
                                // }}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default App
