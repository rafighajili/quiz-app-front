import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Create from "./components/Create";
import Footer from "./components/Footer";
import Question from "./components/Question";
import Edit from "./components/Edit";

const App = () => {
  return (
    <div className="min-h-screen grid grid-rows-[1fr,auto]">
      <Navbar />
      <div className="container my-28 lg:w-3/4 xl:w-3/5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/question/:id" element={<Question />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
