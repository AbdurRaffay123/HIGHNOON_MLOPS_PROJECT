import './App.css';
import Footer from './Components/Footer';
import MainBody from './Components/MainBody';
import Navbar from './Components/Navbar';

function App() {
  return (
    <>
     <div className="app-container">
      <Navbar/>
      <MainBody/>
      <Footer/>
    </div>
      
    </>
  );
}
export default App;
