import React, { useEffect, useRef, useState } from 'react';

export const PodcastStudio: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setStream(s);
    if (videoRef.current) {
      videoRef.current.srcObject = s;
      await videoRef.current.play();
    }
  };

  const startRecording = () => {
    if (!stream) return;
    const mr = new MediaRecorder(stream);
    setChunks([]);
    mr.ondataavailable = ev => setChunks(prev => prev.concat(ev.data));
    mr.onstop = () => {
      // noop, blob is available in chunks
    };
    mediaRecorderRef.current = mr;
    mr.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const save = (type: 'audio' | 'video') => {
    const blob = new Blob(chunks, { type: type === 'audio' ? 'audio/webm' : 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'audio' ? 'podcast.webm' : 'podcast-video.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Audio/Video Podcast</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} className="w-full h-full" muted controls />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 bg-slate-700 rounded" onClick={startCamera}>Enable Camera/Mic</button>
            {!recording ? (
              <button className="px-3 py-2 bg-cyan-600 rounded" onClick={startRecording} disabled={!stream}>Start Recording</button>
            ) : (
              <button className="px-3 py-2 bg-red-600 rounded" onClick={stopRecording}>Stop</button>
            )}
            <button className="px-3 py-2 bg-green-600 rounded" onClick={() => save('audio')} disabled={!chunks.length}>Save Audio</button>
            <button className="px-3 py-2 bg-green-600 rounded" onClick={() => save('video')} disabled={!chunks.length}>Save Video</button>
          </div>
        </div>
      </div>
    </div>
  );
};

