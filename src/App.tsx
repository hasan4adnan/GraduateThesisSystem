import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Universities from './pages/master-data/Universities';
import Institutes from './pages/master-data/Institutes';
import People from './pages/master-data/People';
import SubjectTopics from './pages/master-data/SubjectTopics';
import ThesisSubmission from './pages/theses/ThesisSubmission';
import ThesisSearch from './pages/theses/ThesisSearch';
import ThesisDetail from './pages/theses/ThesisDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="master-data/universities" element={<Universities />} />
          <Route path="master-data/institutes" element={<Institutes />} />
          <Route path="master-data/people" element={<People />} />
          <Route path="master-data/subject-topics" element={<SubjectTopics />} />
          
          <Route path="theses/new" element={<ThesisSubmission />} />
          <Route path="theses/search" element={<ThesisSearch />} />
          <Route path="theses/:id" element={<ThesisDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
