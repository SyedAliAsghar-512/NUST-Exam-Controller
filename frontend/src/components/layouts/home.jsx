import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useDatesheetQuery,
  useAuDatesheetMutation,
  useGetAccessQuery,
  useLazyGetSubjectsByBatchQuery,
} from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";

const SUBJECTS = {
  "BS-AI-24": ["OOP", "DLD", "DBMS", "Linear Algebra", "MVC/Calculas"],
  "BS-CS-23": ["PF", "ICT", "DSA", "SE", "OS", "CN"],
};

const getDayName = (date) =>
  new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const batchId = user?.class;
  const batch = user?.batch;

  const { data: existingData } = useDatesheetQuery(batchId);
  const { data } = useGetAccessQuery();
  const [uploadDatesheet, { isLoading: isUploading }] = useAuDatesheetMutation();

  const [hasAccess, setAccess] = useState(false);
  const [weekDates, setWeekDates] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [subjectsByBatch, setSubjectsByBatch] = useState([]);
  const [trigger] = useLazyGetSubjectsByBatchQuery();


  // then inside your function:
  const fetchSubjectsByBatch = async (batch) => {
    const response = await trigger(batch).unwrap(); // now it's a normal function
    return response;
  };
  

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsData = {};
        
        const response = await fetchSubjectsByBatch(batch); // Assuming fetchSubjectsByBatch is the function you use to get subjects
        
        // Assign the response (which is expected to be an array of subject objects) to the batch ID
        subjectsData[batch] = response || [];
      
  
      setSubjectsByBatch(subjectsData); // Set the fetched subjects to the state
    };
  
    
      fetchSubjects(); // Trigger the fetching if datesheets are available
    
  }, []); // Dependency array: re-run if datesheets change
  const subjectOptions = [
    ...(subjectsByBatch[batch]?.[0]?.subjects || []), // Access the subjects array
    "Preparation Day" // Add the "Preparation Day" option
  ];

  useEffect(() => {
    if (existingData?.schedule?.length > 0) {
      const fetchedSchedule = existingData.schedule[0];
      const fetchedDates = Object.keys(fetchedSchedule).map((date) => ({
        date,
        day: getDayName(new Date(date)),
      }));

      setWeekDates(fetchedDates);
      setSchedule(fetchedSchedule);
      setIsEditable(false);
    } else {
      const startDate = new Date();
      const tempDates = [];
      let dateCursor = new Date(startDate);

      while (getDayName(dateCursor) !== "Friday") {
        dateCursor.setDate(dateCursor.getDate() + 1);
      }

      while (tempDates.length < 6) {
        const dayName = getDayName(dateCursor);
        if (dayName !== "Saturday" && dayName !== "Sunday") {
          const dateStr = dateCursor.toISOString().split("T")[0];
          tempDates.push({ date: dateStr, day: dayName });
        }
        dateCursor.setDate(dateCursor.getDate() + 1);
      }

      const initialSchedule = {};
      tempDates.forEach(({ date }) => {
        initialSchedule[date] = "";
      });

      setWeekDates(tempDates);
      setSchedule(initialSchedule);
    }

    setAccess(data?.hasAccess || false);
  }, [existingData, data]);
  

  const handleUpload = async () => {
    if (!isEditable) {
      setIsEditable(true);
      return;
    }

    const newErrors = {};
    Object.keys(schedule).forEach((date) => {
      if (!schedule[date].trim()) {
        newErrors[date] = "Subject is required!";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all subjects before uploading!");
      return;
    }

    try {
      await uploadDatesheet({ batchId, schedule, batch }).unwrap();
      toast.success("Date Sheet Uploaded Successfully!");
      setIsEditable(false);
    } catch (error) {
      toast.error("Failed to Upload Date Sheet!");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Date Sheet for {batchId}</h1>

      <table className="border-collapse border border-gray-500 w-3/4">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-gray-500 px-4 py-2">Date</th>
            <th className="border border-gray-500 px-4 py-2">Day</th>
            <th className="border border-gray-500 px-4 py-2">Subject</th>
            {isEditable && <th className="border border-gray-500 px-4 py-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {weekDates.map(({ date, day }, index) => (
            <tr key={index}>
              <td className="border border-gray-500 px-4 py-2">
                <input
                  type="date"
                  value={date}
                  className="p-1 border rounded w-full"
                  disabled={!isEditable}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    const newDay = getDayName(new Date(newDate));

                    if (newDay === "Saturday" || newDay === "Sunday") {
                      toast.error("Papers cannot be on Saturday or Sunday!");
                      return;
                    }

                    if (schedule[newDate]) {
                      toast.error("This date is already assigned.");
                      return;
                    }

                    setWeekDates((prev) =>
                      prev.map((entry) =>
                        entry.date === date
                          ? { ...entry, date: newDate, day: newDay }
                          : entry
                      )
                    );

                    setSchedule((prev) => {
                      const updated = { ...prev };
                      updated[newDate] = updated[date];
                      delete updated[date];
                      return updated;
                    });
                  }}
                />
              </td>
              <td className="border border-gray-500 px-4 py-2 font-bold">{day}</td>
              <td className="border border-gray-500 px-4 py-2">
                {isEditable ? (
               <select
  multiple
  value={schedule[date]?.split("/") || []}  // Ensure value is an array of selected subjects
  onChange={(e) => {
    // Get all selected options as an array of values
    const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
    console.log(selectedSubjects)

    // Check for duplicate subjects (excluding "Preparation Day")
    const isDuplicate = selectedSubjects.some(
      (subject) =>
        subject !== "Preparation Day" &&
        Object.entries(schedule).some(
          ([d, subj]) => d !== date && subj.includes(subject)  // Check if subject is already selected in other dates
        )
    );

    // If there's a duplicate, show an error and return
    if (isDuplicate) {
      toast.error("One or more subjects are already selected.");
      return;
    }

    // Update the schedule state with the new selected subjects (joined with a "/")
    setSchedule((prev) => ({
      ...prev,
      [date]: selectedSubjects.join("/"),  // Join subjects with a slash as delimiter
    }));
  }}
  className="w-full p-1 border rounded"
>
  <option value="">-- Select Subject --</option>
  {subjectOptions.map((subj, idx) => (
    <option key={idx} value={subj.courseName || subj}>
      {subj.courseName || subj}
    </option>
  ))}
</select>

               
                ) : (
                  <div>{schedule[date]}</div>
                )}
              </td>

              {isEditable && (
                <td className="border border-gray-500 px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      if (weekDates.length <= 1) {
                        toast.error("At least one row must remain.");
                        return;
                      }

                      setWeekDates((prev) => prev.filter((entry) => entry.date !== date));

                      setSchedule((prev) => {
                        const updated = { ...prev };
                        delete updated[date];
                        return updated;
                      });
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Remove Row"
                  >
                    ❌
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ➕ Add Row Button */}
      {isEditable && (
        <button
          onClick={() => {
            const lastDate = new Date(weekDates[weekDates.length - 1].date);
            let nextDate = new Date(lastDate);
            let nextDay = "";

            do {
              nextDate.setDate(nextDate.getDate() + 1);
              nextDay = getDayName(nextDate);
            } while (nextDay === "Saturday" || nextDay === "Sunday");

            const dateStr = nextDate.toISOString().split("T")[0];

            if (schedule[dateStr]) {
              toast.error("This date already exists.");
              return;
            }

            setWeekDates((prev) => [...prev, { date: dateStr, day: nextDay }]);
            setSchedule((prev) => ({ ...prev, [dateStr]: "" }));
          }}
          className="mt-4 px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
        >
          + Add Row
        </button>
      )}

      {/* Upload/Edit Button */}
      {hasAccess ? (
        <button
          onClick={handleUpload}
          className={`mt-4 px-4 py-2 rounded text-white ${
            isEditable ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          } disabled:opacity-50`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : isEditable ? "Upload Date Sheet" : "Edit Date Sheet"}
        </button>
      ) : (
        <h4 className="text-gray-500 mt-4 text-center">
          Admin has not given you edit access. Kindly contact the examination department (NUST).
        </h4>
      )}
    </div>
  );
};

export default Home;
