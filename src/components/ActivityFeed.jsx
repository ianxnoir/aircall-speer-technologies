import React from 'react';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import PhoneCallbackRoundedIcon from '@mui/icons-material/PhoneCallbackRounded';
import PhoneMissedRoundedIcon from '@mui/icons-material/PhoneMissedRounded';
import VoicemailRoundedIcon from '@mui/icons-material/VoicemailRounded';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, green, grey } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import moment from "moment";
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

const ActivityFeed = ({
  calls,
  handleArchive,
  handleArchiveAll,
  selectedCallIds,
  toggleSelectCall,
  handleArchiveSelected,
  isSelectMode,
  cancelSelection,
  setIsSelectMode,
}) => {
  const activeCalls = calls.filter((call) => !call.is_archived);

  const theme = createTheme({
    palette: {
      green: {
        main: '#c8e6c9'
      },
    },
  });

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };


  return (
    <div >

      {activeCalls.length > 0 ?
        <ul className='activity-container'>
          <>
            {activeCalls.map((call) => (
              <li key={call.id} className="call-item">
                {isSelectMode ? <Checkbox
                  color='default'
                  checked={selectedCallIds.includes(call.id)}
                  onChange={() => toggleSelectCall(call.id)}
                  disabled={!isSelectMode}
                />
                  : null}
                <div className='call-container'>
                  <div className='call-content-container'>
                    <div className='call-icon-container'>
                      {call.call_type == "missed" ?
                        <div className='call-icon'><PhoneMissedRoundedIcon sx={{ color: red[500] }} /></div>
                        : call.call_type == "voicemail" ? <div className='call-icon'><VoicemailRoundedIcon /></div> :
                          <div className='call-icon'><PhoneCallbackRoundedIcon sx={{ color: green[500] }} /></div>

                      }
                      <div className='call-details'>
                        <div className='from-text'>+{call.from} </div>
                        <div className='type-text'>{call.call_type}</div>
                        {call.call_type !== "missed" ? <div className='duration-text'> Duration: {formatDuration(call.duration)} </div> : null}
                      </div>
                    </div>
                    <div className='time-text'>{moment(call.created_at).format('lll')} </div>
                  </div>

                  {isSelectMode ?
                    <div className='call-btn-container'>
                      <ThemeProvider theme={theme}>
                        <Button color="green" variant='contained' className='archive-btn' 
                        onClick={() =>{ 
                          setIsSelectMode(false);
                          handleArchive(call.id);
                        }}
                        >
                          <div className='archive-btn-content'>
                            <ArchiveRoundedIcon sx={{ color: grey[700] }} />
                            Archive
                          </div>
                        </Button>
                      </ThemeProvider>
                    </div>
                    : null}
                </div>
              </li>
            ))}
          </>
        </ul>
        :
        <div className='no-activity-container'>
          <HistoryRoundedIcon className='history-icon' />
          <div>No Calls yet</div>
        </div>
      }

      {!isSelectMode ? (
        <div className='btn-container'>
          <Chip label="Select" className='top-btn' onClick={() => setIsSelectMode(true)} />
          <Chip label="Archive All" className='top-btn' color="success" onClick={handleArchiveAll} />
        </div>

      ) : (
        <div className='btn-container'>
          <Chip label="Archive Selected" className='top-btn' color="primary" onClick={handleArchiveSelected} />
          <Chip label="Cancel" className='top-btn' onClick={cancelSelection}></Chip>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;