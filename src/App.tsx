import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Varalaru } from "./pages/Varalaru";
import { Villupaattu } from "./pages/Villupaattu";
import { Events } from "./pages/Events";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="varalaru" element={<Varalaru />} />
          <Route path="story" element={<Navigate to="/varalaru" replace />} />
          <Route path="history" element={<Navigate to="/varalaru" replace />} />
          <Route path="villupaattu" element={<Villupaattu />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
