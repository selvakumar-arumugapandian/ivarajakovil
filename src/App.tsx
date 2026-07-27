import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { History } from "./pages/History";
import { Story } from "./pages/Story";
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
          <Route path="history" element={<History />} />
          <Route path="story" element={<Story />} />
          <Route path="villupaattu" element={<Villupaattu />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
