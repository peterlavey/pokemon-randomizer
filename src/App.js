import Team from "./components/team/team";
import './index.css';
import {SoundContextProvider} from "./contexts/soundContext";

function App() {
  return (
    <div className='container'>
        <SoundContextProvider>
            <Team/>
        </SoundContextProvider>
    </div>
  );
}

export default App;
