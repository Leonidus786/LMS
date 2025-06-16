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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:5000/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [edtiLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          console.log(res);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    console.log({ lectureTitle, uploadVideoInfo, isFree, courseId, lectureId });
    await edtiLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture({ lectureId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData.message);
    }
  }, [removeSuccess]);

  return (
    <div className="p-0">
      <Card className="bg-white text-black rounded-lg p-4 shadow-lg w-full max-w-[1100px] mx-auto px-6">
        <CardHeader className="space-y-2">
          <div>
            <CardTitle className="text-black">Edit Lecture</CardTitle>
            <CardDescription className="text-black">
              Make changes and click save when you&apos;re done.
            </CardDescription>
          </div>
          <div>
            <Button
              disabled={removeLoading}
              variant="destructive"
              onClick={removeLectureHandler}
              className="bg-[#C70039] text-white hover:bg-black dark:hover:text-[#C70039]"
            >
              {removeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Remove Lecture "
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label>
              Title <span className="text-red-800">*</span>
            </Label>
            <Input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              type="text"
              placeholder="Ex. Introduction to Machine Learning."
            />
          </div>
          <div className="my-5">
            <Label>
              Video <span className="text-red-800">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              placeholder="Ex. Introduction to Machine Learning."
              className="w-fit"
            />
          </div>
          <div className="flex items-center space-x-2 my-5">
            <Switch
              checked={isFree}
              onCheckedChange={setIsFree}
              id="airplane-mode"
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 data-[state=checked]:bg-[#C70039] transition-all"
            >
              <span className="absolute left-1 h-4 w-4 rounded-full bg-gray-200 shadow-md transition-transform transform data-[state=checked]:translate-x-6" />
            </Switch>
            <Label
              htmlFor="airplane-mode"
              className="text-black font-medium text-sm"
            >
              Is this video free?
            </Label>
          </div>

          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />

              <p>{uploadProgress}% uploaded</p>
            </div>
          )}
          <div className="mt-4 ">
            <Button
              disabled={isLoading}
              onClick={editLectureHandler}
              className="bg-[#C70039] text-white hover:bg-black dark:hover:text-[#C70039]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Update Lecture "
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureTab;
