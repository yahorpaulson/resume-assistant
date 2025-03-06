import { useState } from "react";

export default function UploadResume() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [resumeAnalysis, setResumeAnalysis] = useState("");


    const formatAnalysisText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br />");
    };


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("No file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadStatus("Uploading...");
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });




            const text = await response.text();
            const result = text ? JSON.parse(text) : {};

            if (response.ok) {
                setUploadStatus(`Success: ${result.filename}. Please wait for response...`);

                uploadtoOpenAI(result.filename);

            } else {
                setUploadStatus(`Error: ${result.error || "Unknown error"}`);
            }
        } catch (error) {
            setUploadStatus("Error uploading file");
        }
    };

    const uploadtoOpenAI = async (filename) => {
        try {
            const response = await fetch("http://localhost:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: filename }),
            });

            const result = await response.json();
            setResumeAnalysis(result.result);
        } catch {
            setUploadStatus("Error uploading file to OpenAI");
        }

    }

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



            {resumeAnalysis && (
                <div className="p-6 bg-white shadow-md rounded-lg mt-4">
                    <h2 className="text-xl font-bold mb-4">Analysis</h2>
                    <div
                        className="text-sm text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatAnalysisText(resumeAnalysis) }}
                    />
                </div>
            )}

        </div>
    );
}
