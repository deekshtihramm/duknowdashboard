import React, { useEffect, useState } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import DataEntrySidebar from "../components/DataEntrySidebar";
import '../pages/DataEntry.css';
import AddQuestionsTab from "../pages/tabs/AddQuestionsTab";
import AllQuestionsTab from "../pages/tabs/AllQuestionsTab";
import CreatePageTab from "../pages/tabs/CreatePageTab.js";
import SubmitTab from "../pages/tabs/postquestions.js";
import MockTestQuestion from "../pages/tabs/mocktest.js";
import QuestionsList from "../pages/tabs/allQuestions.js";
import { BASE_URL } from "../config";
import "./UserDetails.css";

const UserDetails = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("#notes");
    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("general");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [allQuestions, setAllQuestions] = useState([]);

      const fetchAllQuestions = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/random/`);
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
          const response = await fetch(`${BASE_URL}/api/random/add`, {
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
          const response = await fetch(`${BASE_URL}/api/random/delete/${category}/${questionId}`, {
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
      .filter((q) =>
        (q.question || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

      const groupedQuestions = filteredQuestions.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
      }, {});
    
      const uniqueCategories = ["All", ...new Set(allQuestions.map((q) => q.category))];
    
  return (
    <div className="user-details">
      <NewHeader />
      <div className="user-details-content" style={{ display: "flex" }}>
        <NewSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <main
          className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}
          style={{ flex: 1, padding: "20px" }}
        >
            <h2>Data Entry</h2>
          <DataEntrySidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dataentry-main">
            {activeTab === "#basic-info" && (
              <AddQuestionsTab
                question={question}
                setQuestion={setQuestion}
                category={category}
                setCategory={setCategory}
                handleAddQuestion={handleAddQuestion}
              />
            )}

            {activeTab === "#contact" && (
              <AllQuestionsTab
                groupedQuestions={groupedQuestions}
                uniqueCategories={uniqueCategories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                handleDelete={handleDelete}
              />
            )}

            {activeTab === "#notes" && <CreatePageTab />}

            {activeTab === "#submit" && <SubmitTab />}

            {activeTab === "#mocktest" && (
              <MockTestQuestion activeTab={activeTab} setActiveTab={setActiveTab} />
            )}

            {activeTab === "#allQuestions" && <QuestionsList />}
          </div>
         
        </main>
      </div>
    </div>
  );
};

export default UserDetails;
