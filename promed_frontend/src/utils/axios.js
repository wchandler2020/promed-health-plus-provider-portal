import axios from 'axios';

// const authRequest = () => { 
//     const axiosInstance=  axios.create({
//         baseURL: process.env.REACT_APP_API_URL,
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         },
//     });

//     axiosInstance.interceptors.response.use(
//         response => response,

//         error => {
//             if (error.response && error.response.status === 401) {
                
//                 // Handle unauthorized access, e.g., redirect to login
//                 console.error('Unauthorized access - redirecting to login');
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 localStorage.removeItem('user');
//                 // Optionally, you can redirect to a login pag
//                 window.location.href = '/login';
//             }
//             return Promise.reject(error);
//         }
//     );
// }

// export default authRequest;

const authRequest = () => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 401 by attempting to refresh the token
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and it's not a retry request
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(`${process.env.REACT_APP_API_URL}/provider/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem('accessToken', newAccessToken);

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login'; // redirect to login
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default authRequest;
