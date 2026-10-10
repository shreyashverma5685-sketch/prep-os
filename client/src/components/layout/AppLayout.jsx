import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';

export default function AppLayout() {
  return (
    <>
      <TopNavigation />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        Prep OS — Technical Interview Preparation & Weakness Intelligence Engine
      </footer>
    </>
  );
}
