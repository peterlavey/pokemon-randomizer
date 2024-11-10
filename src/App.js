import Team from "./components/team/team";
import {SoundContextProvider} from "./contexts/soundContext";
import './index.css';
import React, {Suspense} from "react";

function App() {
  return (
    <div className='container'>
        <Suspense fallback={<p>loading...</p>}>
            <SoundContextProvider>
                <Team/>
            </SoundContextProvider>
        </Suspense>
    </div>
  );
}

export default App;
