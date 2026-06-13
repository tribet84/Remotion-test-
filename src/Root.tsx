import {Composition} from 'remotion';
import {MadeiraVideo} from './MadeiraVideo';
import {FPS, HEIGHT, WIDTH, totalDurationInFrames} from './scenes';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Madeira"
      component={MadeiraVideo}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
