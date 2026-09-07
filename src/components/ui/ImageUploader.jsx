'use client';
import { useState, useRef } from 'react';
import { Button, Spinner } from '@heroui/react';
import { FiUpload, FiLink, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

async function uploadToImgBB(file) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_IMGBB_API_KEY is not set');
    }
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
    }
    return data.data.url;
}

export default function ImageUploader({ value, onUpload, label = 'Image' }) {
    const [urlInput, setUrlInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);

    async function handleFile(file) {
        if (!file?.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }
        setUploading(true);
        try {
            const url = await uploadToImgBB(file);
            onUpload(url);
            toast.success('Image uploaded');
        }
        catch (err) { toast.error(err.message); }
        finally { setUploading(false); }
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) {
            handleFile(f);
        }
    }
    function handleUrlPaste() {
        if (!urlInput.trim()) {
            return;
        }
        onUpload(urlInput.trim());
        setUrlInput('');
        toast.success('URL applied');
    }
    function handleRemove() {
        onUpload('');
        setUrlInput('');
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {
                label &&
                <p className="text-sm font-medium text-zinc-700">{label}</p>
            }
            {
                value ? (
                    <div className="relative w-full max-w-xs">
                        <img src={value} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-zinc-200" />
                        <button type="button" onClick={handleRemove} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"><FiX size={14} /></button>
                    </div>
                ) : (
                    <div onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                        className={`w-full max-w-xs h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition gap-2 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-blue-400 hover:bg-zinc-50'}`}>
                        {uploading ? <Spinner size="md" /> : (<><FiImage size={28} className="text-zinc-400" /><p className="text-sm text-zinc-500">Click or drag & drop</p><p className="text-xs text-zinc-400">PNG, JPG, WEBP</p></>)}
                    </div>
                )
            }
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {!value && (
                <Button type="button" variant="flat" size="sm" onPress={() => fileRef.current?.click()} isLoading={uploading} className="w-fit flex items-center gap-1.5">
                    <FiUpload size={13} /> Upload File
                </Button>
            )}
            {!value && (
                <div className="flex gap-2 items-center max-w-xs">
                    <div className="relative flex-1">
                        <FiLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input type="text" placeholder="Or paste image URL..." value={urlInput} onChange={e => setUrlInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleUrlPaste(); } }}
                            className="w-full h-9 pl-9 pr-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <Button type="button" size="sm" variant="flat" onPress={handleUrlPaste} isDisabled={!urlInput.trim()}>Apply</Button>
                </div>
            )}
        </div>
    );
}