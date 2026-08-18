"use client";

/**
 * Converts any decodable audio blob (webm/opus from MediaRecorder) into a
 * 16kHz mono 16-bit PCM WAV blob — the format Gemini reliably accepts as
 * inline audio. Resampling to 16kHz also keeps uploads small.
 */
export async function blobToWav(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioCtx();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log("[Audio] Decoded blob:", {
      originalChannels: audioBuffer.numberOfChannels,
      originalSampleRate: audioBuffer.sampleRate,
      durationSec: audioBuffer.duration.toFixed(2),
    });

    // Render as mono at 16kHz.
    const targetRate = 16000;
    const offline = new OfflineAudioContext(
      1,
      Math.max(1, Math.ceil(audioBuffer.duration * targetRate)),
      targetRate
    );
    const source = offline.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offline.destination);
    const rendered = await offline.startRendering();

    return encodeWavPcm16(rendered);
  } finally {
    audioContext.close();
  }
}

function encodeWavPcm16(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const bytesPerSample = 2;

  const buffer = new ArrayBuffer(44 + length * numChannels * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * numChannels * bytesPerSample, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // byte rate
  view.setUint16(32, numChannels * bytesPerSample, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, length * numChannels * bytesPerSample, true);

  let offset = 44;
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/** Reads a blob as a base64 data string (for sending to the API). */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix if present.
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
