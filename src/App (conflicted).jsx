import React, { useState, useRef } from "react";
import hcIconWhite from "./assets/hc-icon-white.png";
import hcLogoWhite from "./assets/hc-logo-white.png";
import "./App.css";

import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import saveAs from "file-saver";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const pages = ["Scan & Go", "Employee QR Code", "Free QR Code"];
const settings = ["GitHub Project", "Vercel Project", "HC Website", "HC Dashboard"];

function MyAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
  
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={hcIconWhite} className="logo" alt="HC logo" width={64} />

                    {/*
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    */}
                    
                    

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

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
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <MyAppBar />

            <div>
                <a href="https://www.heavyconnect.com/" target="_blank">
                    <img src={hcIconWhite} className="logo" alt="HC logo" width={100} />
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
        </ThemeProvider>
    )
}

export default App
