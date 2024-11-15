import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NewRequest from './components/NewRequest';
import PsychometricAssessment from './components/PsychometricAssessment';
import AdditionalAssessment from './components/AdditionalAssessment';
import FinalReport from './components/FinalReport';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-request" element={<NewRequest />} />
          <Route path="assessment/:requestId" element={<PsychometricAssessment />} />
          <Route path="module4/:requestId" element={<AdditionalAssessment />} />
          <Route path="report/:requestId" element={<FinalReport />} />
          <Route path="personal" element={<Dashboard />} />
          <Route path="pair" element={<Dashboard />} />
          <Route path="group" element={<Dashboard />} />
          <Route path="team" element={<Dashboard />} />
          <Route path="startup" element={<Dashboard />} />
          <Route path="request/:id" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}