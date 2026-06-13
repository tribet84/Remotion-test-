import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Calidad alta para un resultado más cinemático
Config.setCodec('h264');
Config.setCrf(18);
