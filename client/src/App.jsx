import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import BatchTable from "./pages/admin/batch/BatchTable";
import AddBatch from "./pages/admin/batch/AddBatch";
import EditBatch from "./pages/admin/batch/EditBatch";
import StudentManagement from "./pages/admin/student/StudentManagement";
import AddStudent from "./pages/admin/student/AddStudent";
import EditStudent from "./pages/admin/student/EditStudent";
import ChangePassword from "./pages/student/ChangePassword";
import { useSelector, useDispatch } from "react-redux";
import { useLoadUserQuery } from "./features/api/authApi";
import { setLoading, setUser, logout } from "./features/authSlice";
import { useEffect, useState } from "react";
// import Sidebar from "./pages/admin/Sidebar";

// Parent component for admin routes to include Sidebar
const AdminLayout = () => {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

// Wrapper component to handle user authentication and redirects
const RootLayout = () => {
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useSelector((store) => store.auth);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasAttemptedRefetch, setHasAttemptedRefetch] = useState(false); // Track refetch attempt
  const isHomepage = window.location.pathname === "/";

  // Check for token in localStorage to restore authentication
  const token = localStorage.getItem("token");
  const isTokenValid = !!token;

  const {
    data,
    isLoading: queryLoading,
    isSuccess,
    isError,
    error,
    refetch,
    isUninitialized, // Check if query has not started
  } = useLoadUserQuery(undefined, {
    skip: !token || isHomepage,
    refetchOnMountOrArgChange: true,
  });

  console.log("App.jsx: useLoadUserQuery state:", {
    queryLoading,
    isSuccess,
    isError,
    error,
    data,
    isAuthenticated,
    user,
    isUninitialized,
  });

  useEffect(() => {
    if (token && !isAuthenticated && !isUninitialized && !hasAttemptedRefetch) {
      console.log("App.jsx: Restoring authentication from token");
      setHasAttemptedRefetch(true);
      refetch().catch((err) => {
        console.error("App.jsx: Failed to refetch user data:", err);
        dispatch(logout());
      });
    }
  }, [
    token,
    isAuthenticated,
    refetch,
    isUninitialized,
    hasAttemptedRefetch,
    dispatch,
  ]);

  useEffect(() => {
    if (isHomepage) {
      setIsInitialLoading(false);
    } else if (queryLoading) {
      setIsInitialLoading(true);
    } else if (isSuccess || isError) {
      setIsInitialLoading(false);
    }

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (queryLoading) {
        console.log(
          "App.jsx: Load user query timed out, setting loading to false"
        );
        setIsInitialLoading(false);
        if (!isAuthenticated) {
          dispatch(logout());
        }
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [queryLoading, isSuccess, isError, isHomepage, dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(setLoading(isInitialLoading));
  }, [isInitialLoading, dispatch]);

  useEffect(() => {
    if (isSuccess && data?.user) {
      console.log("App.jsx: Dispatching setUser with:", data.user);
      dispatch(setUser(data.user));
    }
    if (isError && error?.status === 401) {
      console.error("App.jsx: Unauthorized, logging out");
      dispatch(logout());
    }
  }, [isSuccess, data, isError, error, dispatch]);

  useEffect(() => {
    if (
      !isHomepage &&
      (window.location.pathname.startsWith("/course-progress") ||
        window.location.pathname.startsWith("/my-learning") ||
        window.location.pathname.startsWith("/profile"))
    ) {
      console.log("App.jsx: Refetching user data on protected route");
      if (!isUninitialized) {
        refetch().catch((err) => {
          console.error(
            "App.jsx: Failed to refetch user data on protected route:",
            err
          );
          dispatch(logout());
        });
      }
    }
  }, [
    window.location.pathname,
    refetch,
    isHomepage,
    isUninitialized,
    dispatch,
  ]);

  if (authLoading || isInitialLoading) {
    console.log("App.jsx: Rendering loading state");
    return <div>Loading...</div>;
  }

  if (user?.forcePasswordChange) {
    console.log(
      "App.jsx: Redirecting to /change-password due to forcePasswordChange"
    );
    return <Navigate to="/change-password" replace />;
  }

  if (
    !isTokenValid &&
    !isHomepage &&
    !window.location.pathname.startsWith("/login") &&
    !window.location.pathname.startsWith("/signup")
  ) {
    console.log("App.jsx: Redirecting to /login", {
      isTokenValid,
      pathname: window.location.pathname,
    });
    return <Navigate to="/login" replace />;
  }

  return (
    <main>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </main>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <>
                <HeroSection />
                <Courses />
              </>
            ),
          },
          {
            path: "login",
            element: (
              <AuthenticatedUser>
                <Login />
              </AuthenticatedUser>
            ),
          },
          {
            path: "signup",
            element: <Navigate to="/login" replace />,
          },
          {
            path: "my-learning",
            element: (
              <ProtectedRoute>
                <MyLearning />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "change-password",
            element: (
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            ),
          },
          {
            path: "course/search",
            element: (
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "course-detail/:courseId",
            element: (
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: "course-progress/:courseId",
            element: (
              <ProtectedRoute>
                <PurchaseCourseProtectedRoute>
                  <CourseProgress />
                </PurchaseCourseProtectedRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
              },
              {
                path: "dashboard",
                element: (
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                ),
              },
              {
                path: "batches",
                element: (
                  <AdminRoute>
                    <BatchTable />
                  </AdminRoute>
                ),
              },
              {
                path: "batches/create",
                element: (
                  <AdminRoute>
                    <AddBatch />
                  </AdminRoute>
                ),
              },
              {
                path: "batches/:batchId",
                element: (
                  <AdminRoute>
                    <EditBatch />
                  </AdminRoute>
                ),
              },
              {
                path: "course",
                element: (
                  <AdminRoute>
                    <CourseTable />
                  </AdminRoute>
                ),
              },
              {
                path: "course/create",
                element: (
                  <AdminRoute>
                    <AddCourse />
                  </AdminRoute>
                ),
              },
              {
                path: "course/:courseId",
                element: (
                  <AdminRoute>
                    <EditCourse />
                  </AdminRoute>
                ),
              },
              {
                path: "course/:courseId/lecture",
                element: (
                  <AdminRoute>
                    <CreateLecture />
                  </AdminRoute>
                ),
              },
              {
                path: "course/:courseId/lecture/:lectureId",
                element: (
                  <AdminRoute>
                    <EditLecture />
                  </AdminRoute>
                ),
              },
              {
                path: "students",
                element: (
                  <AdminRoute>
                    <StudentManagement />
                  </AdminRoute>
                ),
              },
              {
                path: "students/create",
                element: (
                  <AdminRoute>
                    <AddStudent />
                  </AdminRoute>
                ),
              },
              {
                path: "students/:studentId",
                element: (
                  <AdminRoute>
                    <EditStudent />
                  </AdminRoute>
                ),
              },
              {
                path: "instructors",
                element: (
                  <AdminRoute>
                    <div className="p-6">
                      <h1 className="text-2xl font-semibold">
                        Instructor Management - Coming Soon
                      </h1>
                    </div>
                  </AdminRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <h1>404 - Page Not Found</h1>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
