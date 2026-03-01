import { BrowserRouter, Routes, Route } from "react-router-dom";
import CampusHubLanding from "./components/landing.page.jsx";
import Login from "./components/Auth/login.jsx";
import Signup from "./components/Auth/sign.up.jsx";
import ErrorPage from "./components/error.page.jsx";
import { WelcomePage } from "./components/home.jsx";
import { Dashboard } from "./components/dasboard.jsx";
import { PDFLibrary } from "./components/simple.search.jsx";
import { DeepPDFSearch } from "./components/deep.search.jsx";
import { UploadResources } from "./components/upload.AI.jsx";
import { UploadResourcesToThers } from "./components/upload.resource.others.jsx";
import { MyCollection } from "./components/MyCollection.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* my collection route */}
          <Route
            path="/myCollection"
            element={
              <Dashboard>
                <MyCollection />
              </Dashboard>
            }
          />
          {/* pdf */}
          <Route
            path="/deepsearch"
            element={
              <Dashboard>
                <DeepPDFSearch />
              </Dashboard>
            }
          />
          <Route
            path="/AISummary"
            element={
              <Dashboard>
                <UploadResources />
              </Dashboard>
            }
          />
          <Route
            path="/simpleSearch"
            element={
              <Dashboard>
                <PDFLibrary />
              </Dashboard>
            }
          />
          <Route
            path="/sharePDF"
            element={
              <Dashboard>
                <UploadResourcesToThers />
              </Dashboard>
            }
          />
          <Route path="/" element={<CampusHubLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<ErrorPage />}></Route>
          <Route
            path="/homepage"
            element={
              <Dashboard>
                <WelcomePage />
              </Dashboard>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
