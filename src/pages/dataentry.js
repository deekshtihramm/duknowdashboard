import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DataEntrySidebar from "../components/DataEntrySidebar";
import AddQuestionsTab from "./tabs/AddQuestionsTab";
import AllQuestionsTab from "./tabs/AllQuestionsTab";
import CreatePageTab from "./tabs/CreatePageTab.js";
import SubmitTab from "./tabs/postquestions.js";
import MockTestQuestion from "./tabs/mocktest.js";
import QuestionsList from "./tabs/allQuestions.js";
import Header from "../components/header.js";

import "./DataEntry.css";
import { BASE_URL } from "../config";

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState("#basic-info");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("general");

  const [allQuestions, setAllQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchAllQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/randomquestions/`);
      const data = await response.json();
      if (response.ok) setAllQuestions(data);
      else alert("Failed to fetch questions");
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Error fetching questions");
    }
  };

  const handleAddQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter at least one question");
      return;
    }

    const questionLines = question
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    if (questionLines.length === 0) {
      alert("No valid questions to submit");
      return;
    }

    const questionPayload = {
      questions: questionLines.map((q) => ({
        question: q,
        category: category,
      })),
    };

    try {
      const response = await fetch(`${BASE_URL}/api/randomquestions/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionPayload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Questions added successfully!");
        setQuestion("");
        setCategory("general");
      } else {
        alert("Failed to add questions: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Error adding questions");
    }
  };

  const handleDelete = async (questionId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/randomquestions/delete/${questionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Deleted successfully");
        fetchAllQuestions();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    if (activeTab === "#contact") fetchAllQuestions();
  }, [activeTab]);

  const filteredQuestions = allQuestions
    .filter((q) => filterCategory === "All" || q.category === filterCategory)
    .filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()));

  const groupedQuestions = filteredQuestions.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const uniqueCategories = ["All", ...new Set(allQuestions.map((q) => q.category))];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-layout">

        <main className="dashboard-content dataentry-layout">

          
        </main>
      </div>
    </div>
  );
};

export default DataEntry;
