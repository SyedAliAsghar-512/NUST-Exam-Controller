import React, { useEffect, useState } from "react";
import { useGetDatesheetsQuery, useEditDatesheetMutation, useLazyGetSubjectsByBatchQuery } from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";

const AdminPanel = () => {
  const { data: datesheets, isLoading } = useGetDatesheetsQuery();
  const [updateDatesheet, { isLoading: isUpdating }] = useEditDatesheetMutation();

  const [editing, setEditing] = useState(null);
  const [editedSchedule, setEditedSchedule] = useState({});
  const [usedSubjects, setUsedSubjects] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [subjectsByBatch, setSubjectsByBatch] = useState([]);
  const [trigger] = useLazyGetSubjectsByBatchQuery();


  // then inside your function:
  const fetchSubjectsByBatch = async (batchId) => {
    const response = await trigger(batchId).unwrap(); // now it's a normal function
    return response;
  };
  

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsData = {};
  
      // Loop through each datesheet
      for (const datesheet of datesheets) {
        const batchId = datesheet.batch; // Assuming datesheet.batch is the batch ID
        
        const response = await fetchSubjectsByBatch(batchId); // Assuming fetchSubjectsByBatch is the function you use to get subjects
        
        // Assign the response (which is expected to be an array of subject objects) to the batch ID
        subjectsData[batchId] = response || [];
      }
  
      setSubjectsByBatch(subjectsData); // Set the fetched subjects to the state
    };
  
    if (datesheets) {
      fetchSubjects(); // Trigger the fetching if datesheets are available
    }
  }, [datesheets]); // Dependency array: re-run if datesheets change
  

  useEffect(() => {
    if (datesheets && datesheets.length > 0) {
      const formattedSchedules = {};
      datesheets.forEach((ds) => {
        formattedSchedules[ds._id] = Object.entries(ds.schedule[0] || {}).map(([date, subject]) => ({
          date,
          subject,
        }));
      });
      setEditedSchedule(formattedSchedules);
    }
  }, [datesheets]);

  useEffect(() => {
    if (!datesheets) return;
    const newConflicts = [];

    for (let i = 0; i < datesheets.length; i++) {
      for (let j = i + 1; j < datesheets.length; j++) {
        const batchA = datesheets[i];
        const batchB = datesheets[j];

        const [depA, yearA] = batchA.batchId.split("-").slice(-2);
        const [depB, yearB] = batchB.batchId.split("-").slice(-2);

        if (yearA === yearB && depA !== depB) {
          const scheduleA = batchA.schedule[0] || {};
          const scheduleB = batchB.schedule[0] || {};

          Object.keys(scheduleA).forEach((date) => {
            if (
              scheduleB[date] &&
              scheduleA[date] !== "Preparation Day" &&
              scheduleB[date] !== "Preparation Day" &&
              scheduleA[date] === scheduleB[date]
            ) {
              newConflicts.push({
                batchA: batchA._id,
                batchB: batchB._id,
                date,
                subject: scheduleA[date],
              });

              console.log(`❌ Conflict found: "${scheduleA[date]}" on ${date} between ${batchA.batchId} and ${batchB.batchId}`);
              toast.error(`Conflict: ${scheduleA[date]} on ${date} between ${batchA.batchId} & ${batchB.batchId}`);
            }
          });
        }
      }
    }

    setConflicts(newConflicts);
  }, [datesheets]);

  const handleChange = (datesheetId, e, date) => {
    const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
  
    const joinedSubjects = selectedSubjects.join(' / ');
  
    console.log("Selected subjects:", joinedSubjects);
  
    setEditedSchedule((prev) => ({
      ...prev,
      [datesheetId]: prev[datesheetId].map((item) =>
        item.date === date
          ? { ...item, subject: selectedSubjects } // Save the full array
          : item
      ),
    }));
  
    setUsedSubjects((prev) => ({
      ...prev,
      [datesheetId]: selectedSubjects,
    }));
  };
  

  const handleSave = async (datesheetId) => {
    if (!editedSchedule[datesheetId]) return;
  
    const newSchedule = editedSchedule[datesheetId].reduce((acc, item) => {
      // Ensure item.subject is an array, then join with '/'
      const subjects = Array.isArray(item.subject) ? item.subject : [item.subject];
      acc[item.date] = subjects.join('/'); // Join subjects with '/'
      return acc;
    }, {});
  
    console.log(newSchedule); // Log to see the final schedule format
  
    try {
      await updateDatesheet({
        id: datesheetId,
        schedule: [newSchedule],
      }).unwrap();
      setEditing(null);
      toast.success("Date sheet updated successfully!");
    } catch (error) {
      toast.error("Failed to update date sheet.");
    }
  };
  
  
  

  const getDayName = (date) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[new Date(date).getDay()] || "Invalid Date";
  };

  const isPreparationDay = (subject) => subject === "Preparation Day";

  const addRow = (datesheetId) => {
    setEditedSchedule((prev) => ({
      ...prev,
      [datesheetId]: [
        ...(prev[datesheetId] || []),
        { date: "", subject: "" }, // Subject will be handled as multiple if needed
      ],
    }));
  };
  

  const deleteRow = (datesheetId, index) => {
    if (editedSchedule[datesheetId].length === 1) return;
    setEditedSchedule((prev) => ({
      ...prev,
      [datesheetId]: prev[datesheetId].filter((_, i) => i !== index),
    }));
  };
  

  return (
    <div className="p-6">
      <style>{`
        .conflict-row {
          background-color: #fca5a5;
          font-weight: bold;
          color: #7f1d1d;
        }

        .conflict-row td {
          border-color: #ef4444 !important;
        }

        .batch-group {
          margin-top: 60px;
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "grey" }}>
        Admin Panel - Manage Date Sheets
      </h1>
      <hr />

      {isLoading ? (
        <p className="text-center text-gray-600">Loading date sheets...</p>
      ) : (
        <div className="overflow-x-auto">
          {datesheets.map((datesheet) => (
            <div key={datesheet._id} className="batch-group">
              <table className="min-w-full border-collapse border border-gray-300" style={{ minWidth: "100%" }}>
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Batch</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Day</th>
                    <th className="border border-gray-300 px-4 py-2">Subject</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(editedSchedule[datesheet._id]) &&
                    editedSchedule[datesheet._id].map((entry, index) => {
                      const hasConflict = conflicts.some(
                        (conflict) =>
                          (conflict.batchA === datesheet._id || conflict.batchB === datesheet._id) &&
                          conflict.date === entry.date &&
                          conflict.subject === entry.subject
                      );

                      return (
                        <tr
                          key={`${datesheet._id}-${index}`}
                          className={`border border-gray-300 ${hasConflict ? "conflict-row" : ""}`}
                        >
                          {index === 0 && (
                            <td
                              rowSpan={editedSchedule[datesheet._id].length}
                              className="border border-gray-300 px-4 py-2 font-bold text-center"
                            >
                              {datesheet.batchId}
                            </td>
                          )}
                          <td className="border border-gray-300 px-4 py-2">
                            {editing === datesheet._id ? (
                              <input
                                type="date"
                                value={entry.date}
                                onChange={(e) => handleChange(datesheet._id, index, "date", e.target.value)}
                                className="border rounded p-1 w-full"
                              />
                            ) : (
                              <span>{entry.date}</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{getDayName(entry.date)}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {editing === datesheet._id ? (
                              <select
  multiple
  value={entry.subject || []}
  onChange={(e) => handleChange(datesheet._id, e, entry.date)}
  className="border rounded p-1 w-full"
>
  <option disabled value="">Select Subject</option>
  {(subjectsByBatch[datesheet.batch] || []).flatMap((batchData) =>
    batchData.subjects.map((subject) => (
      <option
        key={subject.courseName}
        value={subject.courseName}
        disabled={usedSubjects[datesheet._id]?.includes(subject.courseName) && !isPreparationDay(subject.courseName)}
      >
        {subject.courseName}
      </option>
    ))
  )}
  <option value="Preparation Day">Preparation Day</option>
</select>


                           

                         
                            ) : (
                              <span>{entry.subject}</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {editing === datesheet._id ? (
                              <>
                                <button
                                  onClick={() => handleSave(datesheet._id)}
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                  style={{
                                    maxWidth: "100px",
                                    marginLeft: "5px",
                                    backgroundColor: "#10B981", // green-500
                                    color: "white",
                                    padding: "8px 16px", // px-4 py-2
                                    borderRadius: "0.375rem", // rounded
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                  }}
                                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")} // hover:bg-green-600
                                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#10B981")} // Reset to bg-green-500
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => addRow(datesheet._id)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                                  style={{
                                    backgroundColor: "#3B82F6", // blue-500
                                    maxWidth: "140px",
                                    marginLeft: "5px",
                                    color: "white",
                                    padding: "8px 16px", // px-4 py-2
                                    borderRadius: "0.375rem", // rounded
                                    marginLeft: "0.5rem", // ml-2
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                  }}
                                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")} // hover:bg-blue-600
                                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")} // Reset to bg-blue-500
                                >
                                  Add Row
                                </button>
                                <button
                                  onClick={() => deleteRow(datesheet._id, index)}
                                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                                  style={{
                                    backgroundColor: "#EF4444", // red-500
                                    color: "white",
                                    maxWidth: "140px",
                                    marginLeft: "5px",
                                    padding: "8px 16px", // px-4 py-2
                                    borderRadius: "0.375rem", // rounded
                                    marginLeft: "0.5rem", // ml-2
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                  }}
                                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#DC2626")} // hover:bg-red-600
                                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#EF4444")} // Reset to bg-red-500
                                  disabled={editedSchedule[datesheet._id].length === 1}
                                >
                                  Delete Row
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setEditing(datesheet._id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                style={{
                                  backgroundColor: "#3B82F6", // blue-500
                                  maxWidth: "140px",
                                  marginLeft: "5px",
                                  color: "white",
                                  padding: "8px 16px", // px-4 py-2
                                  borderRadius: "0.375rem", // rounded
                                  cursor: "pointer",
                                  transition: "background-color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")} // hover:bg-blue-600
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")} // Reset to blue-500
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
