import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useGetDatesheetsQuery, useGetRoomsQuery } from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faDownload } from "@fortawesome/free-solid-svg-icons";


const ROOM_CONFIG = [
  { desks: 20, columns: 4, roomNo: 202 },
  { desks: 24, columns: 4, roomNo: 203 },
  { desks: 24, columns: 4, roomNo: 207 },
  { desks: 27, columns: 4, roomNo: 302 },
  { desks: 23, columns: 4, roomNo: 307 },
  { desks: 21, columns: 4, roomNo: 313 },
  { desks: 28, columns: 4, roomNo: 309 },
  { desks: 28, columns: 4, roomNo: 311 },
];


const getDepartmentName = (batch) => {
  const upper = batch.toUpperCase();
  const deptCode = upper.split("/")[1];
  if (deptCode.includes("AI") || deptCode.includes("CS")) return "Computer Science Department";
  if (deptCode.includes("CE")) return "Civil Engineering Department";
  return "Other Departments";
};

const SeatingPlan = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [seatedStudents, setSeatedStudents] = useState({ male: [], female: [] });
  const [editableLayout, setEditableLayout] = useState(null);
  const [openRooms, setOpenRooms] = useState({});
  const { data: datesheetData } = useGetDatesheetsQuery();
  const { data: fetchedRooms = []} = useGetRoomsQuery();
  const [roooms, setRooms] = useState([]);

  useEffect(() => {
    if (fetchedRooms.length) {
        const cloned = JSON.parse(JSON.stringify(fetchedRooms?.[0]?.rooms));
      setRooms(cloned);
    }
  }, [fetchedRooms]);

  console.log(roooms);

  const getStudentsForSelectedDate = (excel, date) => {
    const matchingBatches = [];
    datesheetData?.forEach((ds) => {
      const entry = ds.schedule?.[0]?.[date];
      if (entry && entry !== "Preparation Day") {
        matchingBatches.push({ batch: ds.batch, subjects: entry.split("/") });
      }
    });

    const grouped = { male: [], female: [] };
    excel.forEach((student) => {
      const matchedBatch = matchingBatches.find(
        (b) =>
          b.batch === student.batch &&
          b.subjects.some((sub) => student.courseName?.includes(sub.trim()))
      );
      if (matchedBatch) {
        const studentInfo = {
          id: student.studentId,
          name: student.studentName,
          batch: student.batch,
        };
        if (student.Gender === "Male") grouped.male.push(studentInfo);
        if (student.Gender === "Female") grouped.female.push(studentInfo);
      }
    });
    return grouped;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setExcelData(data);
      toast.success("Excel uploaded. Now select a date.");
    };
    reader.readAsBinaryString(file);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate("");
    setTimeout(() => setSelectedDate(date), 0);

    if (!excelData.length) {
      toast.error("Please upload an Excel file first.");
      return;
    }

    const groupedStudents = getStudentsForSelectedDate([...excelData], date);
    const maleRooms = assignToRooms(groupedStudents.male, "male");
    const femaleRooms = assignToRooms(groupedStudents.female, "female");

    setSeatedStudents({ male: maleRooms, female: femaleRooms });
    setEditableLayout({ male: maleRooms, female: femaleRooms });

    toast.success("Seating plan generated!");
  };

  const assignToRooms = (students, gender) => {
    const rooms = gender === "male" ? roooms.slice(0, 6) : roooms.slice(6);
    const seatedStudentIds = new Set();
    const batchMap = new Map();
    students.forEach((s) => {
      if (!batchMap.has(s.batch)) batchMap.set(s.batch, []);
      batchMap.get(s.batch).push(s);
    });

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const columns = room.columns;
      const rows = Math.ceil(room.desks / columns);
      const layout = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => [null, null])
      );

      for (const [batch, batchStudents] of batchMap) {
        shuffleArray(batchStudents);
        let index = 0;

        while (index < batchStudents.length) {
          const studentA = batchStudents[index];
          if (seatedStudentIds.has(studentA.id)) {
            index++;
            continue;
          }

          let placed = false;
          const preferredColumnPairs = [[1, 2], [0, 1], [2, 3], [0, 3]];
          for (const [left, right] of preferredColumnPairs) {
            for (let r = 0; r < rows && !placed; r++) {
              for (let seat = 0; seat < 2 && !placed; seat++) {
                const leftSeat = layout[r][left][seat];
                const rightSeat = layout[r][right][seat];
                if (
                  leftSeat === null &&
                  rightSeat === null &&
                  canSit(layout, r, left, seat, batch) &&
                  canSit(layout, r, right, seat, batch)
                ) {
                  const mirror = batchStudents.find(
                    (s, idx) => idx !== index && !seatedStudentIds.has(s.id)
                  );
                  if (mirror) {
                    layout[r][left][seat] = studentA;
                    layout[r][right][seat] = mirror;
                    seatedStudentIds.add(studentA.id);
                    seatedStudentIds.add(mirror.id);
                    placed = true;
                  }
                }
              }
            }
          }

          if (!placed) {
            outerLoop: for (let r = 0; r < rows; r++) {
              for (let c = 0; c < columns; c++) {
                for (let seat = 0; seat < 2; seat++) {
                  if (
                    layout[r][c][seat] === null &&
                    canSit(layout, r, c, seat, batch)
                  ) {
                    layout[r][c][seat] = studentA;
                    seatedStudentIds.add(studentA.id);
                    placed = true;
                    break outerLoop;
                  }
                }
              }
            }
          }

          index++;
        }
      }

      rooms[i].layout = layout;
    }

    return rooms;
  };

  const canSit = (layout, r, c, seat, batch) => {
    const directions = [
      [0, 0, seat === 0 ? 1 : 0],
      [-1, 0, 0], [-1, 0, 1],
      [0, -1, 0], [0, -1, 1],
      [-1, -1, 0], [-1, -1, 1],
    ];
    for (const [dr, dc, s] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        layout[nr]?.[nc]?.[s] &&
        layout[nr][nc][s].batch === batch
      ) {
        return false;
      }
    }
    return true;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleSeatClick = (roomIndex, rowIndex, deskIndex, seatIndex, gender) => {
    const student = editableLayout[gender][roomIndex].layout[rowIndex][deskIndex][seatIndex] || {};
    const name = prompt("Enter student name:", student.name || "");
    const id = prompt("Enter student ID:", student.id || "");
    const batch = prompt("Enter student batch:", student.batch || "");
    if (!name || !id || !batch) return;
    const newLayout = JSON.parse(JSON.stringify(editableLayout));
    newLayout[gender][roomIndex].layout[rowIndex][deskIndex][seatIndex] = { name, id, batch };
    setEditableLayout(newLayout);
  };

  const handleToggleRoom = (roomKey) => {
    setOpenRooms((prev) => {
      const isOpen = !!prev[roomKey];
      return isOpen ? {} : { [roomKey]: true };
    });
  };

  const handleDownloadRoomPDF = (roomNo, gender) => {
    const element = document.getElementById(`room-${gender}-${roomNo}`);
    const opt = {
      margin: 0, // No margin to keep size exact
      filename: `Room-${roomNo}-${gender}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2, // High enough for sharpness without bloating
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY, // Capture as seen, not scrolled
        windowWidth: element.scrollWidth, // Ensure full width captured
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "px", // Use pixels to match screen dimensions
        format: [element.scrollWidth, element.scrollHeight], // Exact match
        orientation: "portrait", // or "portrait" based on your design
      },
    };
    html2pdf().set(opt).from(element).save();
  };
  

  const handleDownloadAttendance = (room, gender) => {
    const batchWiseData = {};
  
    room.layout.forEach((row) =>
      row.forEach((desk) =>
        desk.forEach((student) => {
          if (student) {
            if (!batchWiseData[student.batch]) batchWiseData[student.batch] = [];
            batchWiseData[student.batch].push({
              "Name": student.name,
              "ID": student.id,
              "Batch": student.batch,
              "Sheet No": "",           // new column
              "Extra Sheet No": "",     // new column
              "Signature": "",          // new column
            });
          }
        })
      )
    );
  
    const wb = XLSX.utils.book_new();
  
    Object.entries(batchWiseData).forEach(([batch, students]) => {
      const safeBatchName = batch.replace(/[:\\\/\?\*\[\]]/g, "-");
  
      // --- Add Header Row ---
      const headerRow = [
        [`Attendance Sheet - Room ${room.roomNo} (${gender})`, `Batch: ${batch}`, `Date: ${selectedDate}`],
        [""], // blank row for spacing
      ];
  
      // Convert student data
      const ws = XLSX.utils.json_to_sheet(students, { origin: "A4" });
  
      // Prepend header rows
      XLSX.utils.sheet_add_aoa(ws, headerRow, { origin: "A1" });
  
      // --- Add footer (Invigilator Signature) ---
      const footerRow = [[""], ["Invigilator’s Signature: ___________"]];
      XLSX.utils.sheet_add_aoa(ws, footerRow, {
        origin: { r: students.length + 6, c: 0 },
      });
  
      XLSX.utils.book_append_sheet(wb, ws, safeBatchName);
    });
  
    XLSX.writeFile(wb, `Attendance-Room-${room.roomNo}-${gender}.xlsx`);
  };
  

  const countBatches = (layout) => {
    const counts = {};
    layout.forEach((row) =>
      row.forEach((desk) =>
        desk.forEach((student) => {
          if (student?.batch) {
            counts[student.batch] = (counts[student.batch] || 0) + 1;
          }
        })
      )
    );
    return counts;
  };

  const renderLayout = (rooms, gender) => {
    return rooms.map((room, roomIndex) => {
      const isOpen = openRooms[`${gender}-${room.roomNo}`];
      const batchCount = countBatches(room.layout);

      return (
        <div key={roomIndex} className="mb-6">
          <div
            className="cursor-pointer bg-gray-200 p-3 text-lg flex items-center justify-between rounded-md hover:bg-gray-300"
            style={{
              cursor: "pointer",
              backgroundColor: "#e5e7eb", // Tailwind gray-200
              padding: "0.75rem",         // Tailwind p-3
              fontSize: "1.125rem",       // Tailwind text-lg
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "0.375rem",   // Tailwind rounded-md
              transition: "background-color 0.2s ease",
              marginBottom: "5px"
            }}
            onClick={() => handleToggleRoom(`${gender}-${room.roomNo}`)}
          >
            <span>Room {room.roomNo} ({gender})</span>
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </div>

          {isOpen && (
            <div id={`room-${gender}-${room.roomNo}`} className="p-4 border mt-2" style={{ marginBottom: "10px" }}>
              <div className="text-center font-bold text-xl mb-1">Seating Plan - NBC</div>
              <div className="text-center font-semibold mb-1">Room No: {room.roomNo}</div>
              <div className="text-center text-sm mb-4">Exam Date: {selectedDate}</div>
              <div className="text-center font-semibold mb-2" style={{ backgroundColor: "darkgrey" }}>Whiteboard</div>

              <div className="column-header-row">
                {Array.from({ length: room.columns * 2 }, (_, i) => (
                  <div className="column-header" key={i}>
                    C{i + 1}
                  </div>
                ))}
              </div>

              <div className="room-layout" style={{ width: "100%", overflowX: "auto", marginBottom: "10px"}}>
                {room.layout.map((row, rowIndex) => (
                  <div key={rowIndex} className="room-row flex mb-2">
                    {row.map((desk, deskIndex) => (
                      <div
                        key={deskIndex}
                        className="desk border p-2 m-1 w-40 h-20 flex flex-col justify-between items-center bg-gray-100"
                      >
                        {desk.map((student, seatIndex) => (
                          <div
                            key={seatIndex}
                            className="w-full cursor-pointer border-t border-dashed border-gray-400"
                            style={{
                              paddingTop: seatIndex === 0 ? "0" : "4px",
                              marginTop: seatIndex === 0 ? "0" : "4px",
                            }}
                            onClick={() =>
                              handleSeatClick(roomIndex, rowIndex, deskIndex, seatIndex, gender)
                            }
                          >
                            {student ? (
                              <div className="student-info text-sm text-center">
                                <div>{student.name}</div>
                                <div className="student-id">{student.id} - {student.batch}</div>
                              </div>
                            ) : (
                              <div className="empty-desk text-gray-400 text-sm text-center">
                                Empty
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="text-sm mt-4 font-medium">
                <div className="font-semibold mb-1">Batch-wise Count:</div>
                {Object.entries(batchCount).map(([batch, count]) => (
                  <div key={batch}>{batch}: {count} students</div>
                ))}
                <div className="mt-4 font-semibold">Department Totals:</div>
                {Object.entries(
                  Object.entries(batchCount).reduce((acc, [batch, count]) => {
                    const dept = getDepartmentName(batch);
                    if (dept) acc[dept] = (acc[dept] || 0) + count;
                    return acc;
                  }, {})
                ).map(([dept, total]) => (
                  <div key={dept}>{dept}: {total} students</div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded" onClick={() => handleDownloadRoomPDF(room.roomNo, gender)} style={{marginRight: "5px"}}>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Plan
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded" onClick={() => handleDownloadAttendance(room, gender)}>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Attendance Sheet
                </button>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="seating-plan-container p-4">
      <h2 className="text-2xl font-bold mb-4">Seating Layout Generator</h2>
      <div className="input-container flex gap-4 mb-6">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      {editableLayout?.male && renderLayout(editableLayout.male, "male")}
      {editableLayout?.female && renderLayout(editableLayout.female, "female")}

      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }

        `}
      </style>
    </div>
  );
};

export default SeatingPlan;
