import api from './api'

async function getChatroomMessages(chatroomId) {
  try {
    const apiResponse = await api.get(`/chatrooms/${chatroomId}/messages`,       
    {
      headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return apiResponse.data.data;
  } catch (error) {    
    console.log(error);
    return [];
  }

}

export default { getChatroomMessages };
