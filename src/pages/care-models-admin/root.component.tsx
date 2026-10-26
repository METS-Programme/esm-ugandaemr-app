import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CareModelsAdmin from './care-models-admin.component';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={`${window.getOpenmrsSpaBase()}care-models-admin`}>
      <main>
        <Routes>
          <Route path="/" element={<CareModelsAdmin />} />
          <Route path="*" element={<CareModelsAdmin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default Root;
