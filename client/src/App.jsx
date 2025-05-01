// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./Welcome Page/Welcome";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import AdminPage from "./Admin Pages/Admin";
import EmployeePage from "./Employee Pages/EmployeePage";
import ManagerPage from "./Manager Pages/ManagerPage";
import ProtectedRoute from "./ProtectedRoute";
import Forbidden from "./Forbidden";
import CourseList from "./Admin Pages/CourseList";
import ViewRequest from "./Admin Pages/ViewRequest";
import CreateCourse from "./Admin Pages/CreateCourse";
import DynamicForm from "./Admin Pages/Createassesments";
import UpdateAssessment from "./Admin Pages/UpdateAssessment";
import TakeAssessment from "./Employee Pages/TakeAssessment";
import GiveFeedback from "./Employee Pages/GiveFeedback";
import ManagerCourseList from "./Manager Pages/ManagerCourseList";
import ViewAssessments from "./Manager Pages/ViewAssessments";
import EmployeeProgress from "./Manager Pages/EmployeeProgress";
import Coursestats from "./Admin Pages/Coursestats";
import UpdateManagerProfile from "./Manager Pages/UpdateManagerProfile";
import AdminProfileUpdate from "./Admin Pages/AdminProfileUpdate";
import EmployeeProfileUpdate from "./Employee Pages/EmployeeProfileUpdate";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/update-admin-profile" element={<AdminProfileUpdate/>}/>
          <Route path="/courselist" element={<CourseList />} />
          <Route path="/viewRequest" element={<ViewRequest />} />
          <Route path="/createCourse" element={<CreateCourse />} />
          <Route path="/createassessment" element={<DynamicForm />} />
          <Route path="/updateassessment" element={<UpdateAssessment />} />
          <Route path="/coursestats" element={<Coursestats />} />
        </Route>
        <Route element={<ProtectedRoute allowedRole="Manager" />}>
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/manager-course-list" element={<ManagerCourseList />} />
          <Route path="/view-assessments" element={<ViewAssessments />} />
          <Route path="/employee-progresses" element={<EmployeeProgress />} />
          <Route path="/update-profile" element={<UpdateManagerProfile/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRole="Employee" />}>
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/takeassessment" element={<TakeAssessment />} />
          <Route path="/givefeedback" element={<GiveFeedback />} />
          <Route path="/update-employee-profile" element={<EmployeeProfileUpdate/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
