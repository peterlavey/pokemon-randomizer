import Team from "./components/team/team";
import {SoundContextProvider} from "./contexts/soundContext";
import './index.css';

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
