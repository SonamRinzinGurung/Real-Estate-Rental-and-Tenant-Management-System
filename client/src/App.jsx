import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  Homepage,
  Landing,
  NotFound,
  PostRealEstate,
} from "./pages";
import { ProtectedRoutes, SharedLayout } from "./components";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ada2ff",
    },
    secondary: {
      main: "#EE9B01",
    },
    tertiary: {
      main: "#00ACCF",
      dark: "#0496b4",
    },

    tonalOffset: 0.2,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <SharedLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<Homepage />} />
            <Route path="/property/post" element={<PostRealEstate />} />
          </Route>

          <Route path="/login/:role" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
