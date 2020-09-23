import api from './api'

async function getUserChatrooms(userId) {
  try {
    const apiResponse = await api.get(`/users/${userId}/chatrooms`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }})
    return apiResponse.data.data;
  } catch (error) {    
    console.log(error);
    return [];
  }
}

export default { getUserChatrooms };
