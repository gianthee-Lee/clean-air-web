import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
      onChange(data.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <label className="form-label" style={{ display: "block", marginBottom: "4px" }}>
        이미지 업로드
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {value && (
          <img 
            src={value} 
            alt="Uploaded" 
            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--color-border)" }} 
          />
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={uploading}
          style={{
            fontSize: "13px",
            color: "var(--color-text-light)"
          }}
        />
        {uploading && <span style={{ fontSize: "12px", color: "var(--color-primary)" }}>업로드 중...</span>}
      </div>
    </div>
  );
}
