import React, { useEffect, useState } from 'react'
import { useChartStore } from '../store/useChartStore.js'
import Slidebar from '../components/Slidebar.jsx';
import NoChartSelected from '../components/NoChartSelected.jsx';
import ChartCotainer from '../components/ChartCotainer.jsx';

function HomePage() {
  const { selectedUser, setSelectedUser } = useChartStore();
  const [isMobile, setIsMobile] = useState(false);

  // Clear selected user when component mounts
  useEffect(() => {
    setSelectedUser(null);
  }, [setSelectedUser]);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='h-[calc(100vh-4rem)] mt-16'>
      <div className='h-full bg-base-100'>
        <div className='flex h-full'>
          <Slidebar isMobile={isMobile} />
          {!selectedUser && !isMobile ? <NoChartSelected/> : null}
          {selectedUser && <ChartCotainer/>}
        </div>
      </div>
    </div>
  )
}

export default HomePage
