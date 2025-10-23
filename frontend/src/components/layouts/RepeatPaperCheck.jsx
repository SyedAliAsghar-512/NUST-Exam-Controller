import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import axios from "axios";

const RepeatPaperUpload = () => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    console.log("File selected:", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please upload an Excel file!");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      console.log("File reading completed, processing...");
      const binaryStr = reader.result;
      
      // Read the Excel file as array buffer
      const workBook = XLSX.read(binaryStr, { type: "array" });

      const sheetName = workBook.SheetNames[0]; // Get the first sheet name
      const sheet = workBook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(sheet);

      console.log("Excel Data: ", data);

      // Extract repeat papers where condition is false
      const repeatPapers = data.filter((row) => row.Condition === false);

      console.log("Repeat papers filtered: ", repeatPapers);

      for (let paper of repeatPapers) {
        const { courseName, batch, studentBatch } = paper;
        console.log(`Processing paper: ${courseName}, Batch: ${batch}, Student Batch: ${studentBatch}`);

        // Fetch the date sheets for batch and student batch
        if(studentBatch == "NBC/BCE/2019F" || studentBatch == "NBC/BCE/2020F" || studentBatch == "NBC/BSCS/2019F" ||studentBatch == "NBC/BSCS/2020F"){
           toast.error("No contradiction")
        } else {

        const batchDateSheetResponse = await axios.get(`/api/v1/datesheet/${batch}`);
        const studentBatchDateSheetResponse = await axios.get(`/api/v1/datesheet/${studentBatch}`);

        const batchSchedule = batchDateSheetResponse.data.schedule;
        const studentBatchSchedule = studentBatchDateSheetResponse.data.schedule;

        // Check for conflicts in the date sheets for the same course
        const conflict = checkForConflict(courseName, batchSchedule, studentBatchSchedule);

        if (conflict) {
          // If conflict is found, append the repeat paper to the batch's schedule
          await addRepeatPaperToBatch(batch, courseName);
          // toast.error(`${courseName} conflict found! Added to the batch's schedule.`);
        }
      }
    }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read the file.");
    };

    reader.readAsArrayBuffer(file); // Use readAsArrayBuffer for better compatibility
  };

  const checkForConflict = (courseName, batchSchedule, studentBatchSchedule) => {
    console.log("Checking for conflicts...");
  
    // Extract the single object inside the batchSchedule array
    const batchScheduleObj = batchSchedule[0];
    const studentBatchScheduleObj = studentBatchSchedule[0];
  
    // Loop through each date in batchSchedule
    for (let batchExamDate in batchScheduleObj) {
      const batchExamCourse = batchScheduleObj[batchExamDate];
  
      // Check if the batch exam course matches the given course name
      if (batchExamCourse === courseName) {
        // If student batch also has an exam on this date, it's a conflict
        if ((studentBatchScheduleObj[batchExamDate])) {
          console.log(`Conflict found: ${courseName} is scheduled in batch, and student batch also has an exam (${studentBatchScheduleObj[batchExamDate]}) on the same date.`);
          return true;
        }
      }
    }
  
    // No conflict found
    return false;
  };
  
  

  // Add repeat paper to the batch's schedule
  const addRepeatPaperToBatch = async (batch, courseName) => {
    console.log(`Adding repeat paper to batch: ${batch}, Course: ${courseName}`);
    try {
      const newRepeatPaper = { courseName };

      // Append repeat paper to the batch's schedule
      await axios.post(`/api/v1/datesheet/batch/${batch}`, newRepeatPaper);
      toast.success(`${courseName} successfully added to the batch's schedule.`);
    } catch (error) {
      console.error("Error adding repeat paper to batch:", error);
      toast.error("Failed to add repeat paper to the batch's schedule.");
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Semester File</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default RepeatPaperUpload;
