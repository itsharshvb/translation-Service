// src/components/TranslatorService.js
import React, { useState } from "react";
import {
  submitTranslation,
  checkTranslationStatus,
  checkTranslationContent,
} from "../utils/api";
import { formatTranslationResult } from "../utils/utils";

const TranslatorService = () => {
  const [text, setText] = useState("");
  const [languages, setLanguages] = useState("");
  const [taskId, setTaskId] = useState(0);
  const [progress, setProgress] = useState(0);
  const [translationResult, setTranslationResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [content, setContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSubmit = async () => {
    const languageArray = languages.split(",").map((lang) => lang.trim());
    if (!text || languageArray.length === 0) {
      alert("Please provide both text and target language");
      return;
    }
    setIsTranslating(true);
    setProgress(0);
    setTranslationResult(null);
    setStatus(null);
    setContent(null);

    try {
      const task_Id = await submitTranslation(text, languageArray);
      console.log(task_Id);
      setTaskId(task_Id);
      alert(`Task ID: ${task_Id}`);
      pollTranslation(task_Id);
    } catch (error) {
      console.error(error);
      alert("An error occurred");
      setIsTranslating(false);
    }
  };

  const pollTranslation = async (taskId) => {
    let progressPercentage = 0;
    while (progressPercentage < 100) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const translationProgress = await checkTranslationStatus(taskId);
        progressPercentage = translationProgress === "completed" ? 100 : 50;

        setProgress(progressPercentage);
        if (progressPercentage === 100) {
          const result = formatTranslationResult(translationProgress);
          setTranslationResult(result);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while checking translation progress.");
        break;
      }
    }
    setIsTranslating(false);
  };

  const handleCheckStatus = async () => {
    const id = document.getElementById("search-id").value;
    try {
      const result = await checkTranslationStatus(id);
      setStatus(`Status: ${result.status}`);
      setTranslationResult(result.translations);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  const handleCheckContent = async () => {
    const id = document.getElementById("search-id").value;
    try {
      const result = await checkTranslationContent(id);
      setContent(result);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#34568b" }}
      >
        <div className="container">
          <a className="navbar-brand mx-auto" href="#">
            Translator Service
          </a>
          <div className="navbar-text text-light">
            Translate text to desired language
          </div>
        </div>
      </nav>

      {/* Form */}
      <div className="container form-container" style={{ padding: "20px" }}>
        <div
          className="form-box"
          style={{ maxWidth: "600px", margin: "10px 0" }}
        >
          <label
            htmlFor="text"
            className="form-label"
            style={{ color: "#34568b" }}
          >
            Text to Translate
          </label>
          <textarea
            id="text"
            className="form-control"
            rows="10"
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div
          className="form-box"
          style={{ maxWidth: "600px", margin: "10px 0" }}
        >
          <label
            htmlFor="languages"
            className="form-label"
            style={{ color: "#34568b" }}
          >
            Languages
          </label>
          <input
            id="languages"
            className="form-control"
            type="text"
            placeholder="e.g., english, german, russian"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
          />
          <small className="form-text text-muted">
            Write the languages you want to translate your text to, separated by
            commas.
          </small>
        </div>

        <div
          className="btn-container text-center"
          style={{ marginTop: "20px" }}
        >
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isTranslating}
          >
            {isTranslating ? "Translating..." : "Translate"}
          </button>
        </div>

        {progress > 0 && (
          <div className="mt-4">
            <h4>{`Translating: ${progress}%`}</h4>
            <div className="progress">
              <div
                className={`progress-bar ${
                  progress === 100 ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {translationResult && (
          <div className="mt-4">
            <h3>Translation Results</h3>
            <pre>{JSON.stringify(translationResult, null, 2)}</pre>
          </div>
        )}

        {/* Status and Content Section */}
        <div className="mt-4">
          <label
            htmlFor="search-id"
            className="form-label"
            style={{ color: "#34568b" }}
          >
            Check translation by ID
          </label>
          <input
            type="number"
            id="search-id"
            className="form-control"
            placeholder="Enter translation ID"
          />
          <button className="btn btn-info mt-2" onClick={handleCheckStatus}>
            Check Status
          </button>
          <button
            className="btn btn-secondary mt-2"
            onClick={handleCheckContent}
          >
            Check Content
          </button>
        </div>

        {status && (
          <div className="mt-4">
            <h4>Translation Status</h4>
            <pre>{status}</pre>
          </div>
        )}

        {content && (
          <div className="mt-4">
            <h4>Translation Content</h4>
            <pre>{JSON.stringify(content, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslatorService;
