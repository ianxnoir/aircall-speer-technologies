const BASE_URL = 'https://cerulean-marlin-wig.cyclic.app';

const isValidCall = (call) => {
  return (
    call &&
    call.direction &&
    call.from &&
    call.to &&
    call.duration &&
    call.is_archived !== undefined &&
    call.id &&
    call.created_at
  );
};

const fetchCalls = async () => {
  try {
    const response = await fetch(`${BASE_URL}/activities`);
    if (!response.ok) {
      throw new Error('Failed to fetch calls');
    }

    const data = await response.json();

    const completeCalls = data.filter(call => isValidCall(call));
    console.log(completeCalls, 'fetch call - complete');
    return completeCalls;
  } catch (error) {
    console.error('Error fetching calls:', error);
    return [];
  }
};

const fetchCallDetails = async (callId) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/${callId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch call ${callId}: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching call details ${callId}:`, error);
    return null;
  }
};

const updateCallArchivedStatus = async (callId, isArchived) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/${callId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_archived: isArchived }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update call ${callId} archived status: ${response.statusText}`);
    }

    console.log(`Updated archive status of Call ${callId} successfully.`);
    return true;
  } catch (error) {
    console.error(`Error updating call ${callId} archived status:`, error);
    return null;
  }
};

const handleArchiveButtonClick = async (callId, isArchived) => {
  try {
    const response = await fetch(`${BASE_URL}/activities/${callId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch call ${callId}: ${response.statusText}`);
    }

    const call = await response.json();

    if (isValidCall(call)) {
      await updateCallArchivedStatus(callId, isArchived);
    } else {
      console.error(`Call ${callId} is incomplete or unusual.`);
    }
  } catch (error) {
    console.error(`Error archiving call ${callId}:`, error);
  }
};

const resetAllCalls = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reset`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to reset calls');
    }
    return true;
  } catch (error) {
    console.error('Error resetting calls:', error);
    return null;
  }
};

export {
  fetchCalls,
  fetchCallDetails,
  updateCallArchivedStatus,
  resetAllCalls,
  handleArchiveButtonClick,
};
