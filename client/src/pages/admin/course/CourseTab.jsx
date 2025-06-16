// import RichTextEditor from "@/components/RichTextEditor";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   useEditCourseMutation,
//   useGetCourseByIdQuery,
//   usePublishCourseMutation,
// } from "@/features/api/courseApi";
// import { Loader2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

// const CourseTab = () => {
//   const [input, setInput] = useState({
//     courseTitle: "",
//     subTitle: "",
//     description: "",
//     category: "",
//     courseLevel: "",
//     coursePrice: "",
//     courseThumbnail: "",
//   });

//   const params = useParams();
//   const courseId = params.courseId;
//   const {
//     data: courseByIdData,
//     isLoading: courseByIdLoading,
//     refetch,
//   } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

//   const [publishCourse] = usePublishCourseMutation();

//   useEffect(() => {
//     if (courseByIdData?.course) {
//       const course = courseByIdData?.course;
//       console.log("Course category from API:", course.category); // Debug API response
//       setInput({
//         courseTitle: course.courseTitle,
//         subTitle: course.subTitle,
//         description: course.description,
//         category: Array.isArray(course.category)
//           ? course.category[0]
//           : course.category || "", // Ensure single string
//         courseLevel: course.courseLevel,
//         coursePrice: course.coursePrice,
//         courseThumbnail: "",
//       });
//     }
//   }, [courseByIdData]);

//   const [previewThumbnail, setPreviewThumbnail] = useState("");
//   const navigate = useNavigate();

//   const [editCourse, { data, isLoading, isSuccess, error }] =
//     useEditCourseMutation();

//   const changeEventHandler = (e) => {
//     const { name, value } = e.target;
//     setInput({ ...input, [name]: value });
//   };

//   const selectCategory = (value) => {
//     setInput({ ...input, category: value });
//   };

//   const selectCourseLevel = (value) => {
//     setInput({ ...input, courseLevel: value });
//   };

//   // get file
//   const selectThumbnail = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setInput({ ...input, courseThumbnail: file });
//       const fileReader = new FileReader();
//       fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
//       fileReader.readAsDataURL(file);
//     }
//   };

//   const updateCourseHandler = async () => {
//     const formData = new FormData();
//     formData.append("courseTitle", input.courseTitle);
//     formData.append("subTitle", input.subTitle);
//     formData.append("description", input.description);
//     formData.append("category", input.category);
//     formData.append("courseLevel", input.courseLevel);
//     formData.append("coursePrice", input.coursePrice);
//     formData.append("courseThumbnail", input.courseThumbnail);

//     await editCourse({ formData, courseId });
//   };

//   const publishStatusHandler = async (action) => {
//     try {
//       const response = await publishCourse({ courseId, query: action });
//       if (response.data) {
//         refetch();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to publish or unpublish course.");
//     }
//   };

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success(data.message || "Course updated.");
//     }
//     if (error) {
//       toast.error(error.data.message || "Failed to update course.");
//     }
//   }, [isSuccess, error]);

//   if (courseByIdLoading) return <h1>Loading...</h1>;

//   return (
//     <Card>
//       <CardHeader className="flex flex-row justify-between">
//         <div>
//           <CardTitle>Basic Course Information.</CardTitle>
//           <CardDescription>
//             Make Changes to your courses here. Click save when you're done.
//           </CardDescription>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             disabled={courseByIdData?.course.lectures.length === 0}
//             className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2"
//             onClick={() =>
//               publishStatusHandler(
//                 courseByIdData?.course.isPublished ? "false" : "true"
//               )
//             }
//           >
//             {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
//           </Button>
//           <Button className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2">
//             Remove Course
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4 mt-5">
//           <div>
//             <Label>Title</Label>
//             <Input
//               type="text"
//               name="courseTitle"
//               value={input.courseTitle}
//               onChange={changeEventHandler}
//               placeholder="Ex. Fullstack Developer"
//             />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input
//               type="text"
//               name="subTitle"
//               value={input.subTitle}
//               onChange={changeEventHandler}
//               placeholder="Ex. Become a Fullstack Developer from zero to hero in 9 months."
//             />
//             <div>
//               <Label>Description</Label>
//               <RichTextEditor input={input} setInput={setInput} />
//             </div>
//           </div>
//           <div className="flex items-center gap-5">
//             <div>
//               <Label>Category</Label>
//               <Select onValueChange={selectCategory} value={input.category}>
//                 <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
//                   <SelectGroup>
//                     <SelectLabel className="text-white">Category</SelectLabel>
//                     <SelectItem
//                       value="Diploma in Digital Marketing"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Diploma in Digital Marketing
//                     </SelectItem>
//                     <SelectItem
//                       value="Digital Marketing"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Digital Marketing
//                     </SelectItem>
//                     <SelectItem
//                       value="Data Structures and Algorithms"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Data Structures and Algorithms
//                     </SelectItem>
//                     <SelectItem
//                       value="Diploma in AI & Machine Learning"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Diploma in AI & Machine Learning
//                     </SelectItem>
//                     <SelectItem
//                       value="Diploma in Data Science & ML"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Diploma in Data Science & ML
//                     </SelectItem>
//                     <SelectItem
//                       value="Diploma in UI/UX"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Diploma in UI/UX
//                     </SelectItem>
//                     <SelectItem
//                       value="Data Analytics & Business Analytics"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Data Analytics & Business Analytics
//                     </SelectItem>
//                     <SelectItem
//                       value="Fullstack Development"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Fullstack Development
//                     </SelectItem>
//                     <SelectItem
//                       value="Python Development"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Python Development
//                     </SelectItem>
//                     <SelectItem
//                       value="Data Visualization"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Data Visualization
//                     </SelectItem>
//                     <SelectItem
//                       value="Stock Marketing"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Stock Marketing
//                     </SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Course Level</Label>
//               <Select
//                 onValueChange={selectCourseLevel}
//                 value={input.courseLevel}
//               >
//                 <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
//                   <SelectValue placeholder="Select a course level" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
//                   <SelectGroup>
//                     <SelectLabel className="text-white">
//                       Course Level
//                     </SelectLabel>
//                     <SelectItem
//                       value="Beginner"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Beginner
//                     </SelectItem>
//                     <SelectItem
//                       value="Medium"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Medium
//                     </SelectItem>
//                     <SelectItem
//                       value="Advance"
//                       className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                     >
//                       Advance
//                     </SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Price in (INR)</Label>
//               <Input
//                 type="number"
//                 name="coursePrice"
//                 value={input.coursePrice}
//                 onChange={changeEventHandler}
//                 placeholder="Set a Price (₹)"
//                 className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Course Thumbnail</Label>
//             <Input
//               type="file"
//               onChange={selectThumbnail}
//               accept="image/*"
//               className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//             />
//             {previewThumbnail && (
//               <img
//                 src={previewThumbnail}
//                 className="w-64 my-2"
//                 alt="Course Thumbnail"
//               />
//             )}
//           </div>
//           <div>
//             <Button
//               onClick={() => navigate("/admin/course")}
//               className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isLoading}
//               onClick={updateCourseHandler}
//               className="ml-2 w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Please Wait..
//                 </>
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default CourseTab;

// import RichTextEditor from "@/components/RichTextEditor";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   useEditCourseMutation,
//   useGetCourseByIdQuery,
//   usePublishCourseMutation,
// } from "@/features/api/courseApi";
// import { Loader2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

// const CourseTab = () => {
//   const [input, setInput] = useState({
//     courseTitle: "",
//     subTitle: "",
//     description: "",
//     category: "",
//     courseLevel: "",
//     coursePrice: "",
//     courseThumbnail: "",
//   });

//   const params = useParams();
//   const courseId = params.courseId;
//   const {
//     data: courseByIdData,
//     isLoading: courseByIdLoading,
//     refetch,
//   } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

//   const [publishCourse] = usePublishCourseMutation();

//   useEffect(() => {
//     if (courseByIdData?.course) {
//       const course = courseByIdData?.course;
//       console.log("Course category from API:", course.category);
//       setInput({
//         courseTitle: course.courseTitle,
//         subTitle: course.subTitle,
//         description: course.description,
//         category: Array.isArray(course.category)
//           ? course.category[0]
//           : course.category || "",
//         courseLevel: course.courseLevel,
//         coursePrice: course.coursePrice,
//         courseThumbnail: "",
//       });
//     }
//   }, [courseByIdData]);

//   const [previewThumbnail, setPreviewThumbnail] = useState("");
//   const navigate = useNavigate();

//   const [editCourse, { data, isLoading, isSuccess, error }] =
//     useEditCourseMutation();

//   const changeEventHandler = (e) => {
//     const { name, value } = e.target;
//     setInput({ ...input, [name]: value });
//   };

//   const selectCategory = (value) => {
//     setInput({ ...input, category: value });
//   };

//   const selectCourseLevel = (value) => {
//     setInput({ ...input, courseLevel: value });
//   };

//   const selectThumbnail = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setInput({ ...input, courseThumbnail: file });
//       const fileReader = new FileReader();
//       fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
//       fileReader.readAsDataURL(file);
//     }
//   };

//   const updateCourseHandler = async () => {
//     const formData = new FormData();
//     formData.append("courseTitle", input.courseTitle);
//     formData.append("subTitle", input.subTitle);
//     formData.append("description", input.description);
//     formData.append("category", input.category);
//     formData.append("courseLevel", input.courseLevel);
//     formData.append("coursePrice", input.coursePrice);
//     formData.append("courseThumbnail", input.courseThumbnail);

//     await editCourse({ formData, courseId });
//   };

//   const publishStatusHandler = async (action) => {
//     console.log("Publish button clicked with action:", action); // Debug log
//     try {
//       const response = await publishCourse({ courseId, query: action });
//       console.log("Publish course response:", response);
//       if (response.data) {
//         refetch();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       console.error("Publish course error:", error);
//       toast.error("Failed to publish or unpublish course.");
//     }
//   };

//   const removeCourseHandler = async () => {
//     console.log("Remove Course button clicked"); // Debug log
//     toast.error("Delete course functionality not implemented yet.");
//     // Placeholder: Add deleteCourse mutation once available
//   };

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success(data.message || "Course updated.");
//     }
//     if (error) {
//       toast.error(error.data.message || "Failed to update course.");
//     }
//   }, [isSuccess, error]);

//   if (courseByIdLoading) return <h1>Loading...</h1>;

//   return (
//     <div className="mt-16 max-w-4xl mx-auto px-4 md:px-0">
//       <Card>
//         <CardHeader className="flex flex-row justify-between">
//           <div>
//             <CardTitle>Basic Course Information.</CardTitle>
//             <CardDescription>
//               Make Changes to your courses here. Click save when you're done.
//             </CardDescription>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               disabled={courseByIdData?.course.lectures.length === 0}
//               className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2"
//               onClick={() =>
//                 publishStatusHandler(
//                   courseByIdData?.course.isPublished ? "false" : "true"
//                 )
//               }
//             >
//               {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
//             </Button>
//             <Button
//               className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2"
//               onClick={removeCourseHandler}
//             >
//               Remove Course
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4 mt-5">
//             <div>
//               <Label>Title</Label>
//               <Input
//                 type="text"
//                 name="courseTitle"
//                 value={input.courseTitle}
//                 onChange={changeEventHandler}
//                 placeholder="Ex. Fullstack Developer"
//               />
//             </div>
//             <div>
//               <Label>Subtitle</Label>
//               <Input
//                 type="text"
//                 name="subTitle"
//                 value={input.subTitle}
//                 onChange={changeEventHandler}
//                 placeholder="Ex. Become a Fullstack Developer from zero to hero in 9 months."
//               />
//               <div>
//                 <Label>Description</Label>
//                 <RichTextEditor input={input} setInput={setInput} />
//               </div>
//             </div>
//             <div className="flex items-center gap-5">
//               <div>
//                 <Label>Category</Label>
//                 <Select onValueChange={selectCategory} value={input.category}>
//                   <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
//                     <SelectGroup>
//                       <SelectLabel className="text-white">Category</SelectLabel>
//                       <SelectItem
//                         value="Diploma in Digital Marketing"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Diploma in Digital Marketing
//                       </SelectItem>
//                       <SelectItem
//                         value="Digital Marketing"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Digital Marketing
//                       </SelectItem>
//                       <SelectItem
//                         value="Data Structures and Algorithms"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Data Structures and Algorithms
//                       </SelectItem>
//                       <SelectItem
//                         value="Diploma in AI & Machine Learning"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Diploma in AI & Machine Learning
//                       </SelectItem>
//                       <SelectItem
//                         value="Diploma in Data Science & ML"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Diploma in Data Science & ML
//                       </SelectItem>
//                       <SelectItem
//                         value="Diploma in UI/UX"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Diploma in UI/UX
//                       </SelectItem>
//                       <SelectItem
//                         value="Data Analytics & Business Analytics"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Data Analytics & Business Analytics
//                       </SelectItem>
//                       <SelectItem
//                         value="Fullstack Development"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Fullstack Development
//                       </SelectItem>
//                       <SelectItem
//                         value="Python Development"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Python Development
//                       </SelectItem>
//                       <SelectItem
//                         value="Data Visualization"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Data Visualization
//                       </SelectItem>
//                       <SelectItem
//                         value="Stock Marketing"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Stock Marketing
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Course Level</Label>
//                 <Select
//                   onValueChange={selectCourseLevel}
//                   value={input.courseLevel}
//                 >
//                   <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
//                     <SelectValue placeholder="Select a course level" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
//                     <SelectGroup>
//                       <SelectLabel className="text-white">
//                         Course Level
//                       </SelectLabel>
//                       <SelectItem
//                         value="Beginner"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Beginner
//                       </SelectItem>
//                       <SelectItem
//                         value="Medium"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Medium
//                       </SelectItem>
//                       <SelectItem
//                         value="Advance"
//                         className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
//                       >
//                         Advance
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Price in (INR)</Label>
//                 <Input
//                   type="number"
//                   name="coursePrice"
//                   value={input.coursePrice}
//                   onChange={changeEventHandler}
//                   placeholder="Set a Price (₹)"
//                   className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//                 />
//               </div>
//             </div>
//             <div>
//               <Label>Course Thumbnail</Label>
//               <Input
//                 type="file"
//                 onChange={selectThumbnail}
//                 accept="image/*"
//                 className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//               />
//               {previewThumbnail && (
//                 <img
//                   src={previewThumbnail}
//                   className="w-64 my-2"
//                   alt="Course Thumbnail"
//                 />
//               )}
//             </div>
//             <div>
//               <Button
//                 onClick={() => navigate("/admin/course")}
//                 className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 disabled={isLoading}
//                 onClick={updateCourseHandler}
//                 className="ml-2 w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Please Wait..
//                   </>
//                 ) : (
//                   "Save"
//                 )}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CourseTab;

import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useDeleteCourseMutation, // Import the deleteCourse mutation
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params = useParams();
  const courseId = params.courseId;
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [publishCourse] = usePublishCourseMutation();
  const [deleteCourse, { isLoading: deleteIsLoading }] =
    useDeleteCourseMutation(); // Add deleteCourse mutation

  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course;
      console.log("Course category from API:", course.category);
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: Array.isArray(course.category)
          ? course.category[0]
          : course.category || "",
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({
        courseId,
        query: action,
      }).unwrap();
      console.log("Publish course response:", response);
      console.log("Full response object:", JSON.stringify(response, null, 2));
      refetch();
      toast.success(response.message || "Course status updated successfully.");
    } catch (error) {
      console.error("Publish course error:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      toast.error(
        error?.data?.message || "Failed to publish or unpublish course."
      );
    }
  };

  const removeCourseHandler = async () => {
    try {
      const response = await deleteCourse(courseId).unwrap();
      console.log("Delete course response:", response);
      console.log("Full response object:", JSON.stringify(response, null, 2));
      toast.success(response.message || "Course removed successfully.");
      navigate("/admin/course");
    } catch (error) {
      console.error("Delete course error:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      toast.error(error?.data?.message || "Failed to remove course.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated.");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course.");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) return <h1>Loading...</h1>;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information.</CardTitle>
          <CardDescription>
            Make Changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={courseByIdData?.course.lectures.length === 0}
            className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
          </Button>
          <Button
            disabled={deleteIsLoading}
            className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2"
            onClick={removeCourseHandler}
          >
            {deleteIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove Course"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack Developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack Developer from zero to hero in 9 months."
            />
            <div>
              <Label>Description</Label>
              <RichTextEditor input={input} setInput={setInput} />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory} value={input.category}>
                <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel className="text-white">Category</SelectLabel>
                    <SelectItem
                      value="Diploma in Digital Marketing"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Diploma in Digital Marketing
                    </SelectItem>
                    <SelectItem
                      value="Digital Marketing"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Digital Marketing
                    </SelectItem>
                    <SelectItem
                      value="Data Structures and Algorithms"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Data Structures and Algorithms
                    </SelectItem>
                    <SelectItem
                      value="Diploma in AI & Machine Learning"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Diploma in AI & Machine Learning
                    </SelectItem>
                    <SelectItem
                      value="Diploma in Data Science & ML"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Diploma in Data Science & ML
                    </SelectItem>
                    <SelectItem
                      value="Diploma in UI/UX"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Diploma in UI/UX
                    </SelectItem>
                    <SelectItem
                      value="Data Analytics & Business Analytics"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Data Analytics & Business Analytics
                    </SelectItem>
                    <SelectItem
                      value="Fullstack Development"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Fullstack Development
                    </SelectItem>
                    <SelectItem
                      value="Python Development"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Python Development
                    </SelectItem>
                    <SelectItem
                      value="Data Visualization"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Data Visualization
                    </SelectItem>
                    <SelectItem
                      value="Stock Marketing"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Stock Marketing
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                onValueChange={selectCourseLevel}
                value={input.courseLevel}
              >
                <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel className="text-white">
                      Course Level
                    </SelectLabel>
                    <SelectItem
                      value="Beginner"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Beginner
                    </SelectItem>
                    <SelectItem
                      value="Medium"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="Advance"
                      className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                    >
                      Advance
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="Set a Price (₹)"
                className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div>
            <Button
              onClick={() => navigate("/admin/course")}
              className="w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={updateCourseHandler}
              className="ml-2 w-fit bg-[#C70039] text-white placeholder-white hover:bg-black dark:hover:text-[#C70039]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait..
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
