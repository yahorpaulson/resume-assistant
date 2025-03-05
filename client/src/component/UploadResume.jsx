import { useState } from "react";

export default function UploadResume() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("Choose the file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadStatus("Uploading...");
            const response = await fetch("http://localhost:5173/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setUploadStatus(`Success: ${result.filename}`);
            } else {
                setUploadStatus(`Upload error: ${result.error}`);
            }
        } catch (error) {
            setUploadStatus("Error: " + error.message);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload resume</h2>
            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="mb-4 p-2 border rounded w-full"
            />
            {file && (
                <p className="text-sm text-gray-600">
                    <strong>your SV: {file.name}</strong>
                </p>
            )}
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleUpload}>
                Upload
            </button>
            {uploadStatus && <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>}
        </div>
    );
}
