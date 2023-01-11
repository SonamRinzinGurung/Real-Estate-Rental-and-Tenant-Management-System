import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  HomepageOwner,
  HomepageTenant,
  Landing,
  NotFound,
  PostRealEstate,
  AllRealEstate,
  RealEstateDetail,
  PersonalRealEstateDetail,
  SavedRealEstate,
  ProfilePageTenant,
  ProfilePageOwner,
} from "./pages";
import {
  SharedLayoutOwner,
  SharedLayoutTenant,
  ProtectedRoutesOwner,
  ProtectedRoutesTenant,
} from "./components";

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
            path="/owner"
            element={
              <ProtectedRoutesOwner>
                <SharedLayoutOwner />
              </ProtectedRoutesOwner>
            }
          >
            <Route index element={<HomepageOwner />} />
            <Route path="/owner/property/post" element={<PostRealEstate />} />
            <Route
              path="/owner/real-estate/:slug"
              element={<PersonalRealEstateDetail />}
            />
            <Route path="/owner/profile" element={<ProfilePageOwner />} />
          </Route>
          <Route
            path="/tenant"
            element={
              <ProtectedRoutesTenant>
                <SharedLayoutTenant />
              </ProtectedRoutesTenant>
            }
          >
            <Route index element={<HomepageTenant />} />
            <Route path="/tenant/real-estate/all" element={<AllRealEstate />} />
            <Route
              path="/tenant/real-estate/:slug"
              element={<RealEstateDetail />}
            />
            <Route
              path="/tenant/real-estate/saved/all"
              element={<SavedRealEstate />}
            />
            <Route path="/tenant/profile" element={<ProfilePageTenant />} />
          </Route>
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
