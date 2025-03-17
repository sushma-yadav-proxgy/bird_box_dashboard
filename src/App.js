import { createContext } from "react";
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import Router from "./routes";
import { useJsApiLoader } from "@react-google-maps/api";
import ScrollToTop from "./birdbox/components/common/ScrollToTop";

export const ThemeContext = createContext(null);

export default function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_G_MAP_API_KEY,
    libraries: ["places"],
  });
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <ThemeContext.Provider value={isLoaded}>
        <Router />
      </ThemeContext.Provider>
    </ThemeConfig>
  );
}
