/**
 * Converts a WebM audio Blob (from MediaRecorder) to MP3 so it can be uploaded
 * to storage that only allows audio/mpeg.
 * Uses AudioContext.decodeAudioData + lamejs. Runs in the browser only.
 */

function float32ToInt16(float32Array) {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

/**
 * @param {Blob} webmBlob - Audio blob (audio/webm from MediaRecorder)
 * @returns {Promise<Blob>} - MP3 blob (audio/mpeg)
 */
export async function webmBlobToMp3(webmBlob) {
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const sampleRate = audioBuffer.sampleRate;
  const channels = audioBuffer.numberOfChannels;
  const left = audioBuffer.getChannelData(0);
  const right = channels > 1 ? audioBuffer.getChannelData(1) : left;

  const left16 = float32ToInt16(left);
  const right16 = float32ToInt16(right);

  const lamejs = await import("lamejs");
  const Mp3Encoder = lamejs.default?.Mp3Encoder ?? lamejs.Mp3Encoder;
  const encoder = new Mp3Encoder(2, sampleRate, 128);
  const mp3Chunks = [];
  const chunkSize = 1152;

  for (let i = 0; i < left16.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, left16.length);
    const leftChunk = left16.subarray(i, end);
    const rightChunk = right16.subarray(i, end);
    if (leftChunk.length === 0) break;
    const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) mp3Chunks.push(mp3buf);
  }

  const flush = encoder.flush();
  if (flush.length > 0) mp3Chunks.push(flush);

  const totalLength = mp3Chunks.reduce((acc, arr) => acc + arr.length, 0);
  const mp3 = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of mp3Chunks) {
    mp3.set(chunk, offset);
    offset += chunk.length;
  }

  return new Blob([mp3], { type: "audio/mpeg" });
}
