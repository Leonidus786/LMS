const testBatchCreation = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/batches/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if required
        },
        body: JSON.stringify({
          batchName: "Batch A - Data Science",
          courseId: "65a1f2c5e5d1f2b6c3e5d1f2",
          instructorId: "65b3c2d4e6f7g8h9i1j2k3l4",
          startDate: "2025-04-01",
          endDate: "2025-06-30",
        }),
      }
    );

    const data = await response.json();
    console.log("Batch Created:", data);
  } catch (error) {
    console.error("Error creating batch:", error);
  }
};

testBatchCreation(); // Run this function in a useEffect or on button click
