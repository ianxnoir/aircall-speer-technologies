import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import ActivityFeed from './components/ActivityFeed.jsx';
import ArchiveTab from './components/ArchiveTab.jsx';
import {
  fetchCalls,
  updateCallArchivedStatus,
  resetAllCalls,
  handleArchiveButtonClick,
} from './api/calls.js';

const App = () => {

  const [calls, setCalls] = useState([]);
  const [selectedCallIds, setSelectedCallIds] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);


  const handleArchive = async (id) => {
    try {
      const updatedCalls = calls.map((call) =>
        call.id === id ? { ...call, is_archived: true } : call
      );
      setCalls(updatedCalls);

      await handleArchiveButtonClick(id, true);
      console.log('Archive status updated successfully');
    } catch (error) {
      console.error('Error updating archive status:', error);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      const updatedCalls = calls.map((call) =>
        call.id === id ? { ...call, is_archived: false } : call
      );
      setCalls(updatedCalls);


      await handleArchiveButtonClick(id, false);
      console.log('Archive status updated successfully');
    } catch (error) {
      console.error('Error updating archive status:', error);
    }
  };


  const activeCalls = calls.filter((call) => !call.is_archived);
  const archivedCalls = calls.filter((call) => call.is_archived);

  const handleArchiveAll = async () => {
    try {
      // Extract call IDs to update
      const callIdsToUpdate = calls.map(call => call.id);

      // Make parallel API calls to update archive status for all calls
      await Promise.all(callIdsToUpdate.map(callId => updateCallArchivedStatus(callId, true)));

      // Update state after all calls have been successfully archived
      const updatedCalls = calls.map(call => ({ ...call, is_archived: true }));
      setCalls(updatedCalls);
    } catch (error) {
      console.error('Error archiving all calls:', error);
    }
  };


  const handleUnarchiveAll = async () => {
    try {
      const data = await resetAllCalls();

      if (data) {
        const updatedCalls = calls.map((call) => ({ ...call, is_archived: false }));
        setCalls(updatedCalls);
        console.log('All calls have been unarchived.');
      } else {
        console.log('Failed to reset calls.');
      }
    } catch (error) {
      console.error('Error resetting calls:', error);
    }
  };

  const fetchInitialCalls = async () => {
    try {
      const data = await fetchCalls();
      data.sort((p, n) => {
        const dateA = new Date(p.created_at);
        const dateB = new Date(n.created_at);
        return dateB - dateA;
      });
      setCalls(data);
    } catch (error) {
      console.error('Error fetching initial calls:', error);
    }
  };


  const toggleSelectCall = (id) => {
    const isSelected = selectedCallIds.includes(id);
    setSelectedCallIds((prevSelectedCallIds) =>
      isSelected
        ? prevSelectedCallIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedCallIds, id]
    );
  };

  const handleArchiveSelected = async () => {
    try {
      await Promise.all(
        selectedCallIds.map(async (callId) => updateCallArchivedStatus(callId, true))
      );
      const updatedCalls = calls.map((call) =>
        selectedCallIds.includes(call.id) ? { ...call, is_archived: true } : call
      );
      setCalls(updatedCalls);
      setSelectedCallIds([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error('Error archiving selected calls:', error);
    }
  };

  const handleUnarchiveSelected = async () => {
    try {
      await Promise.all(
        selectedCallIds.map(async (callId) => updateCallArchivedStatus(callId, false))
      );
      const updatedCalls = calls.map((call) =>
        selectedCallIds.includes(call.id) ? { ...call, is_archived: false } : call
      );
      setCalls(updatedCalls);
      setSelectedCallIds([]);
      setIsSelectMode(false); 
    } catch (error) {
      console.error('Error archiving selected calls:', error);
    }
  };

  const cancelSelection = () => {
    setSelectedCallIds([]);
    setIsSelectMode(false);
  };

  const [alignment, setAlignment] = useState('web');

  const handleChange = (
    newAlignment
  ) => {
    setAlignment(newAlignment);
    setIsSelectMode(false);
  };

  const [activeTab, setActiveTab] = useState('page1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchInitialCalls();
  }, []);

  return (
    <Router>
      <div className='container'>

        <div className="container-view">
          <div className="tabs">
            <Header />
          <div className='tab-btn-grp'>
          <Link to="/" className="tab-link">
            <button
              className={activeTab === 'page1' ? 'tab-btn' : 'active tab-btn'}
              onClick={() => handleTabClick('page1')}
            >
              Activity Feed
            </button></Link>
            
            <Link to="/archived" className="tab-link"><button
              className={activeTab == 'page2' ? 'tab-btn' : 'active tab-btn'}
              onClick={() => handleTabClick('page2')}
            >
            Archived Calls
            </button>
            </Link>
          </div>
          </div>

        </div>

        <div className="tab-layout">

          <div className="tab-content">
            <Switch>
              <Route exact path="/">
                <ActivityFeed
                  calls={activeCalls}
                  handleArchive={handleArchive}
                  handleArchiveAll={handleArchiveAll}
                  selectedCallIds={selectedCallIds}
                  toggleSelectCall={toggleSelectCall}
                  handleArchiveSelected={handleArchiveSelected}
                  isSelectMode={isSelectMode}
                  cancelSelection={cancelSelection}
                  setIsSelectMode={setIsSelectMode}
                />
              </Route>
              <Route path="/archived">
                <ArchiveTab
                  archivedCalls={archivedCalls}
                  handleUnarchive={handleUnarchive}
                  handleUnarchiveAll={handleUnarchiveAll}
                  selectedCallIds={selectedCallIds}
                  toggleSelectCall={toggleSelectCall}
                  handleUnarchiveSelected={handleUnarchiveSelected}
                  isSelectMode={isSelectMode}
                  cancelSelection={cancelSelection}
                  setIsSelectMode={setIsSelectMode}
                />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

export default App;
