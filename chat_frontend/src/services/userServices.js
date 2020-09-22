import api from './api'

async function getUserChatrooms(userId) {
  try {
    const apiResponse = await api.get(`/users/${userId}/chatrooms`)
    return apiResponse.data.data;
  } catch (error) {    
    console.log(error);
    return [];
  }
}

export default { getUserChatrooms };
