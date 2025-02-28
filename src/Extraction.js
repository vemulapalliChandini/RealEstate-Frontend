import React, { useState } from "react";
import Tesseract from "tesseract.js";

const Extraction = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");

    // Function to handle file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    // Function to extract text from image
    const extractText = async () => {
        if (!selectedImage) {
            alert("Please upload an image first!");
            return;
        }

        setLoading(true);
        setExtractedText("");
        setSummary("");

        try {
            const result = await Tesseract.recognize(selectedImage, "eng", {
                logger: (info) => console.log(info), // Logs progress in console
            });

            const text = result.data.text;
            setExtractedText(text);

            // Generate a summary (basic example: show the first few lines)
            const lines = text.split("\n").filter((line) => line.trim() !== "");
            setSummary(lines.slice(0, 3).join(". ") + (lines.length > 3 ? "..." : ""));
        } catch (error) {
            console.error("OCR Error:", error);
            alert("Failed to extract text from image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">
                Image Text Extractor
            </h1>

            {/* File Input */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
            />

            {/* Display Uploaded Image */}
            {selectedImage && (
                <div className="mb-4">
                    <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-w-sm border border-gray-300 rounded shadow"
                    />
                </div>
            )}

            {/* Extract Button */}
            <button
                onClick={extractText}
                disabled={loading}
                className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                    }`}
            >
                {loading ? "Extracting..." : "Extract Text"}
            </button>

            {/* Display Extracted Text */}
            {extractedText && (
                <div className="mt-4 p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-bold text-gray-700">Extracted Text:</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{extractedText}</p>
                </div>
            )}

            {/* Display Summary */}
            {summary && (
                <div className="mt-4 p-4 bg-white shadow rounded">
                    <h2 className="text-lg font-bold text-gray-700">Summary:</h2>
                    <p className="text-gray-600">{summary}</p>
                </div>
            )}
        </div>
    );
};

export default Extraction;
