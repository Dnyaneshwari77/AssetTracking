import React, { useState } from "react";
import { motion } from "framer-motion";
import SurveyCard from "./SurveyCard";
import DetailSurveyCard from "./DetailSurveyCard";

export default function SurveyList({ surveyList, newFillterSurvey }) {
  const initialSurveysToShow = 4;
  const [visibleSurveys, setVisibleSurveys] = useState(initialSurveysToShow);

  // State to manage modal visibility and selected survey
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadMore = () => {
    setVisibleSurveys(
      (prevVisibleSurveys) => prevVisibleSurveys + initialSurveysToShow
    );
  };

  const handleCardClick = (survey) => {
    setSelectedSurvey(survey); // Set the selected survey data
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedSurvey(null); // Clear the selected survey data
  };

  return (
    <div
      style={{
        zIndex: 99,
        backgroundColor: "gray.600",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "20px",
          width: "100%",
        }}
      >
        {newFillterSurvey && newFillterSurvey.length > 0 ? (
          <>
            {newFillterSurvey.slice(0, visibleSurveys).map((survey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
                onClick={() => handleCardClick(survey)} // Handle card click to open modal
              >
                <SurveyCard
                  address={survey.location.coordinates}
                  Time={survey.time}
                  Region={survey.region}
                  Department={survey.department}
                  Owner={survey.asset_owner}
                  name={survey.asset_name}
                />
              </motion.div>
            ))}
          </>
        ) : (
          <h1>No Survey available</h1>
        )}
      </div>

      {visibleSurveys < newFillterSurvey.length && (
        <button
          onClick={handleLoadMore}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            backgroundColor: "#32004B",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Load More
        </button>
      )}

      {/* Survey Detail Modal */}
      {selectedSurvey && (
        <DetailSurveyCard
          survey={selectedSurvey}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
