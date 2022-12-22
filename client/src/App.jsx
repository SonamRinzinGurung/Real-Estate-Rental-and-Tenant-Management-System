import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Homepage, Landing } from "./pages";
import { ProtectedRoutes, SharedLayout } from "./components";
function App() {
  return (
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
        </Route>

        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
