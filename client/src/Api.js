// src/Api.js
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = "http://localhost:5000/api"
// const API_URL1 = "http://localhost:5000/api/auth"
const API_URL2 = "http://localhost:5000/api/manager"
const API_URL3 = "http://localhost:5000/api/admin"
const API_URL4 = "http://localhost:5000/api/courses"
const API_URL5 = "http://localhost:5000/api/course-assignments"
const API_URL6 = "http://localhost:5000/api/employees"
const API_URL7 = "http://localhost:5000/api/course-progress"
const API_URL8 = "http://localhost:5000/api/assessments"
const API_URL9 = "http://localhost:5000/api/feedbacks"

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    return response
  } catch (error) {
    throw error
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    if (response.data && response.data.token) {
      console.log("Login Response Data:", response.data);

      // Extract the token from the response
      const token = response.data.token;  // Assuming the token is inside response.data.token

      // Store the token in localStorage as a string
      localStorage.setItem("token", token);
      console.log("JWT Token stored in localStorage:", token);

      // Decode token to extract role
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      if (decodedToken.role) {
        localStorage.setItem("role", decodedToken.role);
        console.log("Role stored in localStorage:", decodedToken.role);
      } else {
        console.error("Role not found in decoded token.");
      }
    } else {
      console.error("Response does not contain token.");
    }

    return response;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};


// Function to retrieve the token from localStorage
export const getAuthToken = () => localStorage.getItem("token")

// Set up Axios instance with interceptor to include the token in request headers
const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Function to get resource based on role
export const getResource = async (role) => {
  const rolePathMap = {
    Admin: "/admin",
    Manager: "/manager",
    Employee: "/employee",
  }

  try {
    const path = rolePathMap[role] || "/employee"
    const response = await axiosInstance.get(`${API_URL1}${path}`)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
} 

export const createRequest = async (requestData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/course-requests/create`, requestData)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
}// used in ManagerPage.jsx

export const getManagerRequests = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/course-requests/my-requests`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}// used in ManagerPage.jsx

export const getAssessmentsByCourseId = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/view-assessments/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

// export const getAllRequests = async () => {
//   try {
//     const response = await axiosInstance.get(`${API_URL3}/getAllRequests`)
//     console.log("Response Data\n", response.data)
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }  

export const getRequests = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/course-requests/requests`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
} // used in admin.jsx

export const getRequestById = async (requestId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/course-requests/request/${requestId}`)
    console.log("Request Data:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching request:", error)
    throw error
  }
} // used in admin.jsx

// Accept Request
export const acceptRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/course-requests/approve/${requestId}`)
    console.log("Accept Request Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error accepting request:", error)
    throw error
  }
} // used in admin.jsx

// Reject Request
export const rejectRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/course-requests/reject/${requestId}`)
    console.log("Reject Request Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error rejecting request:", error)
    throw error
  }
} // used in admin.jsx

export const deleteRequest = async (requestId) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/course-requests/delete/${requestId}`)
    console.log("Reject Request Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error rejecting request:", error)
    throw error
  }
} // used in admin.jsx

export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL3}/courses`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
} //used in Courselist.jsx

export const uploadPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const token = localStorage.getItem("token");

    const response = await axios.post(`${API_URL}/upload/pdf`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.file.url;
  } catch (error) {
    console.error("PDF upload failed:", error);
    throw error; // Important to re-throw so the calling function can handle it
  }
}; //used by CourseList.jsx, createCourse.jsx

export const createCourse = async (requestId, formData, pdfFile) => {
  try {
    let pdfLink = null;
    
    // If a file is uploaded, first upload it and get the pdf link
    if (pdfFile) {
      pdfLink = await uploadPDF(pdfFile);
    }

    // Now add the pdfLink to the formData
    const courseData = { 
      ...formData, 
      pdfLink: pdfLink || formData.pdfLink // Use uploaded pdfLink or passed pdfLink
    };

    const response = await axiosInstance.post(`${API_URL4}/create/${requestId}`, courseData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token if necessary
      },
    });

    console.log("Response Data\n", response.data);
    return response;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}; // used by createCourse.jsx, uploadPdf.jsx

export const editCourse = async (courseId, formData) => {
  try {
    const response = await axiosInstance.put(`${API_URL4}/edit/${courseId}`, formData)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
} //used by CourseList.jsx

// Assessment related API endpoints
export const createAssessmet = async (courseId,formData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/assessments/create/${courseId}`, formData)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
} //used in CreateAssesment.jsx

export const getAssessmentById = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/assessments/${courseId}`)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
} // used in UpdateAssessment.jsx

export const updateAssessment = async (courseId,formData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/assessments/edit/${courseId}`, formData)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
} //used in UpdateAssessment.jsx

export const getManagerAllCourses = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/courses/all`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
} //used in ManagerCourseList.jsx

export const getManagerViewAssessments = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/view-assessments/course/${courseId}`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
} //used in ViewAssessmnetsList.jsx

export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/manager/employees`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
} // used in ManagerAssign employees

export const getEmployeebyId = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/manager/employee${employeeId}`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}// used in AssignEmployeeModal.jsx

export const getAssignedEmployees = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/manager/course/${courseId}/assigned-employees`);
    return response.data; // Array of employee IDs
  } catch (error) {
    console.error("Error fetching assigned employees", error);
    throw error;
  }
};// used in AssignEmployeeModal.jsx

export const assignCourse = async ({ courseId, employeeIds }) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/course/assign`, {
      courseId,
      employeeIds
    }, {
      headers: {
        "Content-Type": "application/json" // Ensure content type is set correctly
      }
    });
    console.log("Response Data\n", response.data);
    return response.data;
  } catch (error) {
    console.error("Error assigning course", error);
    throw error;
  }
}; // used in AssignEmployeeModal.jsx


export const getEmployeeCourse = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/employee/my-courses`)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
}//used in EmployeePage.jsx

export const updateCourseProgress = async (courseId, progressPercentage) => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/employee/update-progress/${courseId}`,  // Use the courseId here
      { progress: progressPercentage }
    );
    console.log("Response Data\n", response.data);
    return response;
  } catch (error) {
    throw error;
  }
};//used in EmployeePage.jsx


export const completeCourse = async (courseId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/employee/complete-course/${courseId}`);
    return response.data; // You can adjust this based on the API response format
  } catch (error) {
    console.error("Error completing course:", error);
    throw error; // Handle errors appropriately
  }
};//used in EmployeePage.jsx

export const getAssessment = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/employee/${courseId}/assessments`);
    console.log("Response Data\n", response.data);
    return response.data; // <- Just return the first assessment object
  } catch (error) {
    throw error;
  }
};

export const submitAssessment = async (submissionData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/employee/submit-assessment/${submissionData.assessmentId}`, {
      answers: submissionData.answers
    });
    console.log("Response Data\n", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitFeedback = async (ratingCourseId, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post(
      `${API_URL}/employee/rate-course/${ratingCourseId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Attach token here
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};//used in EmployeePage.jsx

export const getCourseRatings = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/manager/course-ratings/${courseId}`);
    console.log("Response Data\n", response.data);
    return response.data; // <- Just return the first assessment object
  } catch (error) {
    throw error;
  }
};//used in ManagerCourseList.jsx

export const getAdminCourseRatings = async (courseId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/manager/course-ratings/${courseId}`);
    console.log("Response Data\n", response.data);
    return response.data; // <- Just return the first assessment object
  } catch (error) {
    throw error;
  }
};//used in CourseList.jsx

export const getAllCourseProgress = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/manager/all-employee-progress`)
    console.log("Reject Request Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching all course progress:", error)
    throw error
  }
}; // used in managerCourseProgress.jsx

export const getAdminCourseStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/admin/courses`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
} // used in CourseStats.jsx

// Employee related API endpoints
export const getAssignments = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL6}/getAssignments`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getAllAssessments = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL8}/getAllAssessments`)
    console.log("Response Data\n", response.data)
    return response
  } catch (error) {
    throw error
  }
}


export const getAllEmployeesAdmin = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/admin/users`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}


export const changeAssignment = async (progressId, courseId) => {
  try {
    const response = await axiosInstance.put(`${API_URL5}/${progressId}/${courseId}`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}







export const getEmployeeAssessments = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL6}/get-employee-assessments`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}



export const getAllFeedbacks = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL9}`)
    console.log("Response Data\n", response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("role")
}
