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
import UnarchiveRoundedIcon from '@mui/icons-material/UnarchiveRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';

const ArchiveTab = ({
  archivedCalls,
  handleUnarchive,
  handleUnarchiveAll,
  selectedCallIds,
  toggleSelectCall,
  handleUnarchiveSelected,
  isSelectMode,
  cancelSelection,
  setIsSelectMode, }) => {

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
    <div>
      {archivedCalls.length > 0 ?
        <ul className='activity-container'>
          {archivedCalls.map((call) => (
            <li key={call.id} className="call-item">

              {isSelectMode ? <Checkbox
                checked={selectedCallIds.includes(call.id)}
                onChange={() => toggleSelectCall(call.id)}
                disabled={!isSelectMode}
                color='default'
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
                      <div className='from-text'>+{call.from}</div>
                      <div className='type-text'>{call.call_type}</div>
                      <div className='duration-text'> Duration: {formatDuration(call.duration)} </div>
                    </div>
                  </div>
                  <div className='time-text'>{moment(call.created_at).format('lll')} </div>
                </div>

                {isSelectMode ?
                  <div className='call-btn-container'>
                    <ThemeProvider theme={theme}>
                      <Button color="green" variant='contained' className='archive-btn'
                        onClick={() => {
                          handleUnarchive(call.id);
                          setIsSelectMode(false);
                        }}>
                        <div className='archive-btn-content'>
                          <UnarchiveRoundedIcon sx={{ color: grey[700] }} />
                          Unarchive
                        </div>
                      </Button>
                    </ThemeProvider>
                  </div>
                  : null}
              </div>
            </li>
          ))}
        </ul>
        :
        <div className='no-activity-container'>
          <Inventory2RoundedIcon className='history-icon' />
          <div>No Archive</div>
        </div>
      }

      {!isSelectMode ? (
        <div className='btn-container'>
          <Chip label="Select" className='top-btn' onClick={() => setIsSelectMode(true)} />
          <Chip label="Unarchive All" className='top-btn' color="success" onClick={handleUnarchiveAll}></Chip>
        </div>

      ) : (
        <div className='btn-container'>
          <Chip label="Unarchive Selected" className='top-btn' color="primary" onClick={handleUnarchiveSelected} />
          <Chip label="Cancel" className='top-btn' onClick={cancelSelection}></Chip>
        </div>
      )}
    </div>
  );
};

export default ArchiveTab;
