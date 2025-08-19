import React, { useRef, useState } from 'react';

type Clip = { id: string; src: string; type: 'image' | 'video'; duration?: number };

export const FilmMaker: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addClip = (files: FileList | null) => {
    if (!files) return;
    const arr: Clip[] = Array.from(files).map((f) => ({ id: Math.random().toString(36).slice(2), src: URL.createObjectURL(f), type: f.type.startsWith('video') ? 'video' : 'image' }));
    setClips(prev => prev.concat(arr));
  };

  const exportProject = () => {
    // Minimal placeholder: export a JSON manifest to be used by ffmpeg offline
    const manifest = JSON.stringify(clips, null, 2);
    const blob = new Blob([manifest], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'film-project.json';
    a.click();
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Film Maker</h2>
      <div className="flex gap-2 mb-3">
        <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => addClip(e.target.files)} className="hidden" />
        <button className="px-3 py-2 bg-slate-700 rounded" onClick={() => inputRef.current?.click()}>Add Media</button>
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportProject} disabled={!clips.length}>Export Project</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {clips.map(c => (
          <div key={c.id} className="bg-slate-800/40 border border-slate-700 rounded p-2">
            {c.type === 'image' ? (
              <img src={c.src} className="w-full h-40 object-cover rounded" />
            ) : (
              <video src={c.src} className="w-full h-40 object-cover rounded" controls />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

