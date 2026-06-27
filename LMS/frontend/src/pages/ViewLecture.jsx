import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";

function ViewLecture() {

  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const navigate = useNavigate();

  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );

  const [watchedLectures, setWatchedLectures] = useState([]);

  const totalLectures = selectedCourse?.lectures?.length || 0;

  const progressPercent =
    totalLectures === 0
      ? 0
      : Math.round((watchedLectures.length / totalLectures) * 100);

  const courseCompleted = watchedLectures.length === totalLectures;

  const courseCreator =
    userData?._id === selectedCourse?.creator ? userData : null;

  // LOAD PROGRESS
  useEffect(() => {

    const saved = localStorage.getItem(
      `course-progress-${courseId}-${userData?._id}`
    );

    if (saved) {
      setWatchedLectures(JSON.parse(saved));
    } else {
      setWatchedLectures([]);
    }

  }, [courseId, userData]);

  // SAVE PROGRESS PER STUDENT
  useEffect(() => {

    if (!userData?._id) return;

    localStorage.setItem(
      `course-progress-${courseId}-${userData._id}`,
      JSON.stringify(watchedLectures)
    );

  }, [watchedLectures, courseId, userData]);

  const markLectureWatched = (lectureId) => {
    setWatchedLectures(prev =>
      prev.includes(lectureId) ? prev : [...prev, lectureId]
    );
  };

  const generateCertificate = async () => {

    if (!courseCompleted) return;

    try {

      const res = await fetch("http://localhost:8000/api/certificate/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentName: userData?.name,
          courseName: selectedCourse?.title
        })
      });

      const data = await res.json();

      window.open(`http://localhost:8000${data.file}`);

    } catch (error) {
      console.log("Certificate error", error);
    }

  };

  return (

    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">

      {/* LEFT SECTION */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">

        <div className="mb-6">

          <h1 className="text-2xl font-bold flex items-center gap-[20px] text-gray-800">

            <FaArrowLeftLong
              className='text-black w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")}
            />

            {selectedCourse?.title}

          </h1>

          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>

        </div>


        {/* VIDEO PLAYER */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">

          {selectedLecture?.videoUrl ? (

            <video
              src={selectedLecture.videoUrl}
              controls
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onPlay={() => markLectureWatched(selectedLecture._id)}
            />

          ) : (

            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>

          )}

        </div>


        <div className="mt-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedLecture?.lectureTitle}
          </h2>
        </div>


        {/* PROGRESS BAR */}
        <div className="mt-6">

          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Course Progress</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />

          </div>

        </div>


        {/* COURSE RESOURCES */}
        {selectedCourse?.notes && (

          <div className="mt-6 bg-white border rounded-xl shadow-sm p-5">

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Course Resources
            </h3>


            {/* NOTES */}
            <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4 hover:bg-gray-100 transition mb-3">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-lg text-lg">
                  📄
                </div>

                <div>
                  <p className="font-medium text-gray-800">Course Notes</p>
                  <p className="text-sm text-gray-500">
                    Download PDF study material
                  </p>
                </div>

              </div>

              <a
                href={`http://localhost:8000${selectedCourse.notes}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
              >
                Download
              </a>

            </div>


            {/* CERTIFICATE */}
            <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4 hover:bg-gray-100 transition">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg text-lg">
                  🎓
                </div>

                <div>

                  <p className="font-medium text-gray-800">
                    Course Certificate
                  </p>

                  <p className="text-sm text-gray-500">
                    {courseCompleted
                      ? "You can now download your certificate"
                      : `Complete all lectures (${watchedLectures.length}/${totalLectures})`}
                  </p>

                </div>

              </div>

              {courseCompleted ? (

                <button
                  onClick={generateCertificate}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
                >
                  Download
                </button>

              ) : (

                <span className="text-sm text-gray-500">
                  Locked
                </span>

              )}

            </div>

          </div>

        )}

      </div>


      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          All Lectures
        </h2>

        <div className="flex flex-col gap-3 mb-6">

          {selectedCourse?.lectures?.length > 0 ? (

            selectedCourse.lectures.map((lecture, index) => (

              <button
                key={index}
                onClick={() => setSelectedLecture(lecture)}
                className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
                  selectedLecture?._id === lecture._id
                    ? 'bg-gray-200 border-gray-500'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
              >

                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {lecture.lectureTitle}
                  </h4>
                </div>

                <FaPlayCircle className="text-black text-xl" />

              </button>

            ))

          ) : (

            <p className="text-gray-500">
              No lectures available.
            </p>

          )}

        </div>


        {/* INSTRUCTOR */}
        {courseCreator && (

          <div className="mt-4 border-t pt-4">

            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Instructor
            </h3>

            <div className="flex items-center gap-4">

              <img
                src={courseCreator.photoUrl || '/default-avatar.png'}
                alt="Instructor"
                className="w-14 h-14 rounded-full object-cover border"
              />

              <div>

                <h4 className="text-base font-medium text-gray-800">
                  {courseCreator.name}
                </h4>

                <p className="text-sm text-gray-600">
                  {courseCreator.description || 'No bio available.'}
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default ViewLecture;