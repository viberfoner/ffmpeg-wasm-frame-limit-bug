// this is a demo to illustrate an issue with
// ffmpeg.wasm

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: true });

const writeFrames = async (frame) => {
  const numFrames = 300;
  for (let i = 0; i < numFrames; i++) {
    ffmpeg.FS('writeFile', `${i}.png`, frame)
  }
}

(async () => {
  const img = document.querySelector('img');
  const frame = await fetchFile(img.src);
  await ffmpeg.load();
  await writeFrames(frame);

  const ffmpegCmd = '-r 60 -pattern_type glob -i *.png -c:v libx264 -t 3 -pix_fmt yuv420p -vf scale=400:400 concat.mp4';
  const ffmpegArgs = ffmpegCmd.split(' ');
  await ffmpeg.run(...ffmpegArgs);

  const data = ffmpeg.FS('readFile', 'concat.mp4');
  const video = document.getElementById('player');
  video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
})();