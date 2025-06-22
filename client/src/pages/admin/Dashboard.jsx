import React, { useEffect, useRef } from "react";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import CardComponent from "@/components/CardComponent";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data, isSuccess, isError, isLoading, error, isFetching } =
    useGetPurchasedCoursesQuery(undefined, {
      skip: !isAuthenticated,
    });
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Role-based access control
  useEffect(() => {
    if (user && user.role !== "instructor") {
      console.log(
        `Dashboard instance ${instanceId.current} - Redirecting to / due to role`
      );
      navigate("/");
    }
  }, [user, navigate]);

  console.log(`Dashboard instance ${instanceId.current} - Query state:`, {
    isLoading,
    isFetching,
    isError,
    isSuccess,
    data,
    error,
  });

  useEffect(() => {
    if (data) {
      console.log(
        `Dashboard instance ${instanceId.current} rendered with data:`,
        data
      );
    }
  }, [data]);

  if (!isAuthenticated) {
    console.log(
      `Dashboard instance ${instanceId.current} - Not authenticated, redirecting to /login`
    );
    navigate("/login", { replace: true });
    return null;
  }

  if (isLoading || isFetching) {
    console.log(
      `Dashboard instance ${instanceId.current} - Rendering loading state`
    );
    return <h1 className="text-center text-lg font-semibold">Loading...</h1>;
  }

  if (isError) {
    console.log(
      `Dashboard instance ${instanceId.current} - Rendering error state:`,
      error
    );
    if (error?.status === 401) {
      console.log(
        `Dashboard instance ${instanceId.current} - Unauthorized, redirecting to /login`
      );
      navigate("/login", { replace: true });
      return null;
    }
    return (
      <h1 className="text-center text-red-500 text-lg">
        Failed to get purchased courses:{" "}
        {error?.data?.message || error?.message || "Unknown error"}
      </h1>
    );
  }

  if (!isSuccess || !data) {
    console.log(
      `Dashboard instance ${instanceId.current} - No data or success state`
    );
    return <h1 className="text-center text-lg">No data available</h1>;
  }

  const purchasedCourse = data?.purchases || [];
  console.log(
    `Dashboard instance ${instanceId.current} - Raw purchasedCourse:`,
    purchasedCourse
  );

  // If no purchased courses, render a message
  if (purchasedCourse.length === 0) {
    console.log(
      `Dashboard instance ${instanceId.current} - No purchased courses`
    );
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col w-full p-6">
        <h1 className="text-center text-lg font-semibold">
          No purchased courses available
        </h1>
      </div>
    );
  }

  try {
    // De-duplicate courses based on normalized course title
    const uniqueCoursesMap = new Map();
    purchasedCourse.forEach((course, index) => {
      // Ensure courseId and courseTitle exist
      if (!course.courseId || !course.courseId.courseTitle) {
        console.warn(
          `Dashboard instance ${instanceId.current} - Skipping course ${index} due to missing courseId or courseTitle:`,
          course
        );
        return;
      }

      // Normalize course title: trim, lowercase, and replace non-breaking spaces
      const courseTitle = course.courseId.courseTitle
        .trim()
        .toLowerCase()
        .replace(/\u00A0/g, " ");
      const createdAt = course.createdAt
        ? new Date(course.createdAt)
        : new Date(0);
      console.log(`Processing course ${index}:`, {
        courseTitle,
        courseId: course.courseId._id,
        price: course.courseId.coursePrice,
        createdAt: course.createdAt,
      });
      if (!uniqueCoursesMap.has(courseTitle)) {
        uniqueCoursesMap.set(courseTitle, {
          name:
            course.courseId.courseTitle.length > 20
              ? `${course.courseId.courseTitle.substring(0, 20)}...`
              : course.courseId.courseTitle,
          price: course.courseId.coursePrice || 0,
          createdAt: createdAt,
        });
      } else {
        const existing = uniqueCoursesMap.get(courseTitle);
        const existingCreatedAt = existing.createdAt
          ? new Date(existing.createdAt)
          : new Date(0);
        if (createdAt > existingCreatedAt) {
          console.log(
            `Updating record for ${courseTitle}: Old price ${existing.price} (createdAt: ${existing.createdAt}) -> New price ${course.courseId.coursePrice} (createdAt: ${course.createdAt})`
          );
          uniqueCoursesMap.set(courseTitle, {
            name:
              course.courseId.courseTitle.length > 20
                ? `${course.courseId.courseTitle.substring(0, 20)}...`
                : course.courseId.courseTitle,
            price: course.courseId.coursePrice || 0,
            createdAt: createdAt,
          });
        }
      }
    });

    const courseData = Array.from(uniqueCoursesMap.values());
    console.log(
      `Dashboard instance ${instanceId.current} - De-duplicated courseData by title:`,
      courseData
    );

    // Ensure courseData has valid entries
    if (courseData.length === 0) {
      console.log(
        `Dashboard instance ${instanceId.current} - No valid course data after processing`
      );
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col w-full p-6">
          <h1 className="text-center text-lg font-semibold">
            No valid course data available
          </h1>
        </div>
      );
    }

    const totalRevenue = purchasedCourse.reduce(
      (acc, element) => acc + (element.amount || 0),
      0
    );
    const totalSales = purchasedCourse.length;
    const maxPrice = Math.max(...courseData.map((course) => course.price), 300);
    const yAxisMax = Math.ceil(maxPrice / 10000) * 10000;

    console.log(
      `Dashboard instance ${instanceId.current} - Rendering main content:`,
      { totalSales, totalRevenue, courseData }
    );

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col w-full p-6">
        {/* Cards Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 w-full mt-4">
          <CardComponent
            title="Total Sales"
            value={totalSales}
            className="p-4 text-lg bg-white shadow-md rounded-lg w-full hover:shadow-lg transition-shadow duration-300"
          />
          <CardComponent
            title="Total Revenue"
            value={`₹${formatNumber(totalRevenue)}`}
            className="p-4 text-lg bg-white shadow-md rounded-lg w-full hover:shadow-lg transition-shadow duration-300"
          />
        </div>

        {/* Chart Section */}
        <div className="w-full">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 pt-6 px-6">
              Course Prices
            </h2>
            <div className="w-full px-0 pb-4" style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={courseData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <defs>
                    <linearGradient
                      id="priceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#C70039"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis
                    dataKey="name"
                    stroke="#4b5563"
                    interval={0}
                    tick={{ fontSize: 14, fill: "#4b5563" }}
                    angle={-30}
                    dy={15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#4b5563"
                    domain={[0, yAxisMax]}
                    tickFormatter={(value) => formatNumber(value)}
                    tick={{ fontSize: 14, fill: "#4b5563" }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₹${formatNumber(value)}`,
                      "Course Price",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#priceGradient)"
                    strokeWidth={4}
                    dot={{ stroke: "#C70039", strokeWidth: 3, r: 6 }}
                    activeDot={{
                      r: 8,
                      fill: "#FF6B6B",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    label={{
                      position: "top",
                      formatter: (value) => `₹${formatNumber(value)}`,
                      fontSize: 14,
                      fill: "#4b5563",
                    }}
                  />
                  <ReferenceLine
                    y={yAxisMax / 2}
                    stroke="#9ca3af"
                    strokeDasharray="3 3"
                    label={{
                      value: "Midpoint",
                      position: "insideTopRight",
                      fill: "#6b7280",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(
      `Dashboard instance ${instanceId.current} - Error in rendering:`,
      error
    );
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col w-full p-6">
        <h1 className="text-center text-red-500 text-lg">
          Error loading dashboard: {error.message}
        </h1>
      </div>
    );
  }
};

export default React.memo(Dashboard);
