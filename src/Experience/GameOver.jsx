import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import usePoints from "../stores/usePoints";
import useGame from "../stores/useGame";
import { useMemo } from "react";

const GameOver = ({ isGameOver }) => {
  return (
    <Html>
      <AnimatePresence>{isGameOver && <GameOverDom />}</AnimatePresence>
    </Html>
  );
};

export default GameOver;

const GameOverDom = () => {
  const highScore = localStorage.getItem("highScore") || 0;
  const score = usePoints((state) => state.score);
  const setRestart = useGame((state) => state.setRestart);
  const setGameOver = useGame((state) => state.setGameOver);
  const handleMove = (e) => {
    e.stopPropagation();
  };

  const baseVariants = {
    hidden: { opacity: 0, transition: { duration: 1 } },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1 } },
  };
  const clickAudio = useMemo(() => new Audio("/audios/click.mp3"), []);
  clickAudio.volume = 0.2;
  const handleRestart = () => {
    clickAudio.pause();
    clickAudio.currentTime = 0;
    clickAudio.play();
    setRestart(true);
    setGameOver(false);
  };
  return (
    <>
      <motion.div
        variants={baseVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="gameover"
        onPointerMove={handleMove}
      >
        <h1>Game Over</h1>
        <h2>Score: {score}</h2>
        <h2>High Score: {highScore}</h2>
        <button className="start-button" onClick={handleRestart}>
          Restart
        </button>
      </motion.div>
    </>
  );
};
