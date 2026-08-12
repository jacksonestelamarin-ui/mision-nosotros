import { useState } from 'react';
import { GameScene } from './types';
import { Scene1Arequipa } from './components/scenes/Scene1Arequipa';
import { Scene2Barranca } from './components/scenes/Scene2Barranca';
import { Scene3UtahTravel } from './components/scenes/Scene3UtahTravel';
import { Scene4ProvoTemple } from './components/scenes/Scene4ProvoTemple';
import { GameHUD } from './components/GameHUD';

export default function App() {
  const [currentScene, setCurrentScene] = useState<GameScene>(GameScene.AREQUIPA);
  const [sceneKey, setSceneKey] = useState(1);

  const handleNextScene = () => {
    switch (currentScene) {
      case GameScene.AREQUIPA:
        setCurrentScene(GameScene.BARRANCA);
        break;
      case GameScene.BARRANCA:
        setCurrentScene(GameScene.UTAH_TRAVEL);
        break;
      case GameScene.UTAH_TRAVEL:
        setCurrentScene(GameScene.PROVO_TEMPLE);
        break;
      case GameScene.PROVO_TEMPLE:
        setCurrentScene(GameScene.AREQUIPA);
        break;
    }
  };

  const handleRestartScene = () => {
    setSceneKey((prev) => prev + 1);
  };

  const handleRestartGame = () => {
    setCurrentScene(GameScene.AREQUIPA);
    setSceneKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top HUD present across scenes (Scene 2 has its own HUD with boss bar) */}
      {currentScene !== GameScene.BARRANCA && (
        <GameHUD
          currentScene={currentScene}
          onRestartScene={handleRestartScene}
          onRestartGame={handleRestartGame}
        />
      )}

      {/* Active Scene Rendering */}
      <main className="flex-1 relative flex flex-col">
        {currentScene === GameScene.AREQUIPA && (
          <Scene1Arequipa key={sceneKey} onCompleteScene={handleNextScene} />
        )}

        {currentScene === GameScene.BARRANCA && (
          <Scene2Barranca
            key={sceneKey}
            onCompleteScene={handleNextScene}
            onRestartScene={handleRestartScene}
          />
        )}

        {currentScene === GameScene.UTAH_TRAVEL && (
          <Scene3UtahTravel key={sceneKey} onCompleteScene={handleNextScene} />
        )}

        {currentScene === GameScene.PROVO_TEMPLE && (
          <Scene4ProvoTemple key={sceneKey} onRestartGame={handleRestartGame} />
        )}
      </main>
    </div>
  );
}
