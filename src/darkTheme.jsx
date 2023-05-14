import { createTheme } from '@mui/material/styles';


export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            light: "#E3FDFD",
            main: "#00ADB5",
            dark: "#222831",
            contrastText: "#fff",
        },
    },
});
