import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import ImageCropArea from "./components/ImageCropArea";

function App() {
  return (
    <ChakraProvider>
      <div className="app">
        <ImageCropArea/>
      </div>
    </ChakraProvider>
  );
}

export default App;
