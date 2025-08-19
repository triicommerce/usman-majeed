import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudioLayout } from '../components/studio/StudioLayout';
import { StudioHome } from '../components/studio/StudioHome';
import { PodcastStudio } from '../components/studio/PodcastStudio';
import { MindmapStudio } from '../components/studio/MindmapStudio';
import { Logo2DStudio } from '../components/studio/Logo2DStudio';
import { Logo3DStudio } from '../components/studio/Logo3DStudio';
import { HabitTracker } from '../components/studio/HabitTracker';
import { FilmMaker } from '../components/studio/FilmMaker';
import { SignsStudio } from '../components/studio/printables/SignsStudio';
import { ChecklistStudio } from '../components/studio/printables/ChecklistStudio';
import { MapsStudio } from '../components/studio/printables/MapsStudio';
import { CouponsStudio } from '../components/studio/printables/CouponsStudio';
import { WorksheetsStudio } from '../components/studio/printables/WorksheetsStudio';
import { FlashcardsStudio } from '../components/studio/printables/FlashcardsStudio';
import { BookmarksStudio } from '../components/studio/printables/BookmarksStudio';

export const StudioRoutes: React.FC = () => {
  return (
    <StudioLayout>
      <Routes>
        <Route path="" element={<StudioHome />} />
        <Route path="podcast" element={<PodcastStudio />} />
        <Route path="mindmap" element={<MindmapStudio />} />
        <Route path="logo-2d" element={<Logo2DStudio />} />
        <Route path="logo-3d" element={<Logo3DStudio />} />
        <Route path="habits" element={<HabitTracker />} />
        <Route path="film" element={<FilmMaker />} />
        <Route path="print/signs" element={<SignsStudio />} />
        <Route path="print/checklists" element={<ChecklistStudio />} />
        <Route path="print/maps" element={<MapsStudio />} />
        <Route path="print/coupons" element={<CouponsStudio />} />
        <Route path="print/worksheets" element={<WorksheetsStudio />} />
        <Route path="print/flashcards" element={<FlashcardsStudio />} />
        <Route path="print/bookmarks" element={<BookmarksStudio />} />
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Routes>
    </StudioLayout>
  );
};

