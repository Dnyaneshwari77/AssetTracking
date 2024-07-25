import React from "react";
import SurveyCards from "./SurveyCards";

export default function SurveyList({ surveyList }) {
  console.log("Survey List is here", surveyList.surveys);
  console.log("Survey type", typeof surveyList.surveys);
  return (
    <div style={{ zIndex: 99, height: "10px", backgroundColor: "gray.600" }}>
      {surveyList.surveys != undefined ? (
        surveyList.surveys.map((survey) => {
          return <SurveyCards survey={survey} />;
        })
      ) : (
        <h1>No Survey available</h1>
      )}
    </div>
  );
}
