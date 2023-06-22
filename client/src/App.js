import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { Footer, Interceptors, Navbar } from "./components";
import {
  About,
  AdminBoard,
  HomePage,
  Login,
  NotFound,
  Profile,
  PrivateOnlyRouteWrapper,
  PublicOnlyRouteWrapper,
  Signup,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Interceptors>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<PublicOnlyRouteWrapper />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/signup" element={<PublicOnlyRouteWrapper />}>
              <Route index element={<Signup />} />
            </Route>
            <Route
              path="/profile"
              element={<PrivateOnlyRouteWrapper requiredRole="user" />}
            >
              <Route index element={<Profile />} />
            </Route>
            <Route
              path="/admin-board"
              element={<PrivateOnlyRouteWrapper requiredRole="admin" />}
            >
              <Route index element={<AdminBoard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Interceptors>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
