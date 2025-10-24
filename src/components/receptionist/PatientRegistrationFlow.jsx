import React, { useState } from "react";
import PatientRegistration from "./PatientRegistration";
import TestOrder from "./TestOrder";

const PatientRegistrationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientData, setPatientData] = useState(null);

  const handlePatientRegistered = (patient) => {
    setPatientData(patient);
    setCurrentStep(2);
  };

  const handleOrderComplete = () => {
    // Reset the flow or redirect to another page
    setCurrentStep(1);
    setPatientData(null);
  };

  const handleBackToPatientInfo = () => {
    setCurrentStep(1);
  };

  return (
    <div>
      {currentStep === 1 && (
        <PatientRegistration onPatientRegistered={handlePatientRegistered} />
      )}
      {currentStep === 2 && patientData && (
        <TestOrder
          patient={patientData}
          onOrderComplete={handleOrderComplete}
          onBack={handleBackToPatientInfo}
        />
      )}
    </div>
  );
};

export default PatientRegistrationFlow;
