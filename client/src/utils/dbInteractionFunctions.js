import axios from 'axios';

export async function checkUserExists(userId){
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/checkUser`, 
      {userId: userId});
      return (response.data.userExists);
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
};

export async function getUser(userId){
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_ROUTE}/api/getUser`, 
    {userId: userId});
    return response.data;
  } catch (error) {
    console.error('Error getting serie number:', error);
    return false;
  }
}