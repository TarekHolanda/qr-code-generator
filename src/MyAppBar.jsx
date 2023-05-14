import React from "react";
import hcIconWhite from "./assets/hc-icon-white.png";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";

export function MyAppBar() {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Employee QR Code Generator
                    </Typography>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="HeavyConnect">
                            <a href="https://www.heavyconnect.com/" target="_blank">
                                <img src={hcIconWhite} className="logo" alt="HC logo" width={64} />
                            </a>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
