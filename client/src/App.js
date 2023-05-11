import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { Footer, Navbar } from "./components";
import {
  About,
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
    <AuthProvider>
      <BrowserRouter>
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
          <Route path="/profile" element={<PrivateOnlyRouteWrapper />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
