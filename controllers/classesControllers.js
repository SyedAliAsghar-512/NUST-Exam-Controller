import Classes from "../backend/models/classes.js"
import catchAsyncErrors from "../backend/middlewares/catchAsyncErrors.js"
import attendance from "../backend/models/attendance.js"
import datesheet from "../backend/models/datesheet.js"
import Batch from "../backend/models/batch.js"
import Subject from "../backend/models/subject.js"
import subject from "../backend/models/subject.js"
import roomconfig from "../backend/models/roomconfig.js"

// Get logged in user orders
export const myClasses = catchAsyncErrors(async (req, res, next) => {
    const classes = await Classes.find({ user: req.user._id })

    res.status(200).json({
        classes
    })
})

//get attendance 
export const myAttendance = catchAsyncErrors(async (req, res, next) => {
    const Attendance = await attendance.findOne({classid: req?.params?.id})

    res.status(200).json({
        Attendance
    })
})

export const getDatesheet = catchAsyncErrors(async (req, res, next) => {
  try {
    // Assuming req.user contains the authenticated user information
    const { batchId } = req.params; // This assumes 'batch' is a field in the user's data
    
    // Find the date sheet by the user's batch (classId)
    const dateSheet = await datesheet.findOne({ batchId });

    if (!dateSheet) {
      return res.status(404).json({ message: "No date sheet found" });
    }
    
    res.json(dateSheet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export const auDatesheet = catchAsyncErrors(async (req, res, next) => {
  try {
    const { batchId, schedule, batch } = req.body;

    if (!batchId || !schedule) {
      return res.status(400).json({ message: "batchId and schedule are required." });
    }

    // Check if a date sheet exists for this batch
    let dateSheet = await datesheet.findOne({ batchId });

    if (dateSheet) {
      // Update existing date sheet
      dateSheet.schedule = schedule;
    } else {
      // Create new date sheet
      dateSheet = new datesheet({ batchId, schedule, batch });
    }

    await dateSheet.save();
    res.json({ message: "Date Sheet saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

function findSaturdayBetween(startDate, endDate) {
  const current = new Date(startDate);

  while (current <= endDate) {
    if (current.getDay() === 6) { // 6 = Saturday
      return new Date(current);
    }
    current.setDate(current.getDate() + 1);
  }

  return null; // No Saturday found
}

export const postRepeatPaper = async (req, res) => {
  const fullParam = req.params[0];
  const batch  = fullParam;
  const { courseName } = req.body;

  try {
    // Find the batch date sheet
    const batchDateSheet = await datesheet.findOne({ batch });

    if (!batchDateSheet) {
      return res.status(404).json({ success: false, message: "Batch date sheet not found." });
    }

    // Find the schedule (which is an array of date objects)
    let schedule = batchDateSheet.schedule[0];

    // Find the current date of the course in the schedule
    let currentDate = null;
    for (let date in schedule) {
      if (schedule[date] === courseName) {
        currentDate = date;
        break;
      }
    }

    if (!currentDate) {
      return res.status(404).json({ success: false, message: "Course not found in schedule." });
    }

    // Update the schedule to move the paper to the Saturday date
    // First, delete the old entry
    delete schedule[currentDate];

    // Add the course to the new Saturday date (12th April, for example)
// Convert currentDate string to a Date object
const dateObj = new Date(currentDate);

// Get the day of the week (0 = Sunday, ..., 6 = Saturday)
const currentDay = dateObj.getDay();

// Calculate how many days until next Saturday
const daysUntilSaturday = (6 - currentDay + 7) % 7 || 7; // ensures we go to *next* Saturday

// Move dateObj to next Saturday
dateObj.setDate(dateObj.getDate() + daysUntilSaturday);

// Format the date back to YYYY-MM-DD
const saturdayDate = dateObj.toISOString().split('T')[0];

// Add the course to the new Saturday date
schedule[saturdayDate] = courseName;

console.log(schedule);

    // Save the updated schedule in the database
    batchDateSheet.schedule[0] = schedule;
    await batchDateSheet.save();

    // Return the updated schedule to the frontend
    res.status(200).json({
      success: true,
      message: `Paper "${courseName}" moved to Saturday (${saturdayDate}) successfully.`,
      updatedSchedule: batchDateSheet.schedule
    });

  } catch (error) {
    console.error("Error updating date sheet:", error);
    res.status(500).json({ success: false, message: "Failed to update date sheet." });
  }
};

export const getRepeatDatesheet = catchAsyncErrors(async (req, res, next) => {
  const fullParam = req.params[0];
  const batch = fullParam
  try {
    const dateSheet = await datesheet.findOne({ batch });

    if (!dateSheet) {
      return res.status(404).json({ message: "Date sheet not found for this batch" });
    }

    res.json(dateSheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching date sheet" });
  }
});



export const getSubjects = catchAsyncErrors(async (req, res, next) => {
  try {
    const subjects = await Subject.find(); // already grouped by batch

    const result = subjects.map((doc) => ({
      batch: doc.batch,
      subjects: doc.subjects.map((subj) => ({
        courseName: subj.courseName,
      })),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export const getSubjectsByBatch = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get the batch from the request parameters or query
    const fullParam = req.params[0];
    const batchId = fullParam;

    // Find subjects where the batch matches the provided batchId
    const subjects = await Subject.find({ batch: batchId });

    // If no subjects are found for the batchId, send a 404 response
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ message: "No subjects found for this batch" });
    }

    // Map the subjects to only include the course name for each subject
    const result = subjects.map((doc) => ({
      batch: doc.batch,
      subjects: doc.subjects.map((subj) => ({
        courseName: subj.courseName,
      })),
    }));

    // Send the response with the filtered subjects
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

  export const saveSubjects = catchAsyncErrors(async (req, res, next) => {
    const subjects = req.body; // [{ courseName, batch }]
    console.log(subjects);
  
    if (!Array.isArray(subjects)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }
  
    try {
      const batchesMap = {};
  
      // Group subjects by batch
      for (const subject of subjects) {
        const { batch, courseName } = subject;
  
        if (!batchesMap[batch]) {
          batchesMap[batch] = new Set();
        }
        batchesMap[batch].add(courseName); // Set automatically prevents duplicates
      }
  
      // Now batchesMap = { "BSAI-7A": Set(["AI-101", "Math-202"]), "BSAI-7B": Set([...]) }
  
      for (const [batch, courseNamesSet] of Object.entries(batchesMap)) {
        const existingBatch = await subject.findOne({ batch });
  
        if (existingBatch) {
          // Batch exists → update subjects, but avoid duplications
          const existingCourseNames = new Set(existingBatch.subjects.map(s => s.courseName));
  
          for (const courseName of courseNamesSet) {
            if (!existingCourseNames.has(courseName)) {
              existingBatch.subjects.push({ courseName });
            }
          }
          await existingBatch.save();
        } else {
          // Batch doesn't exist → create new
          const newBatch = new subject({
            batch,
            subjects: Array.from(courseNamesSet).map(courseName => ({ courseName })),
          });
          await newBatch.save();
        }
      }
  
      res.status(200).json({ message: 'Subjects saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

  export const getDatesheets = catchAsyncErrors(async (req, res, next) => {
    try {
      const datesheets = await datesheet.find(); // Fetch all date sheets
      res.json(datesheets);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  export const editDatesheet = catchAsyncErrors(async (req, res, next) => {
    try {
      const { schedule } = req.body;
      const updatedDatesheet = await datesheet.findByIdAndUpdate(
        req.params.id,
        { schedule },
        { new: true }
      );
      res.json(updatedDatesheet);
    } catch (error) {
      res.status(500).json({ message: "Update Failed" });
    }
  });

  export const updateRoomsConfig = catchAsyncErrors(async (req, res, next) => {
    try {
      const  rooms  = req.body;
      console.log(rooms);
      await roomconfig.deleteMany(); // clear old
      await roomconfig.insertMany(rooms);
      res.status(200).json({ message: 'Saved successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  export const fetchRoomsConfig = catchAsyncErrors(async (req, res, next) => {
    try {
      const rooms = await roomconfig.find({});
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });