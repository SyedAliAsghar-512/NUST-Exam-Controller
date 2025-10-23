import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useSaveSubjectsMutation, useGetSubjectsQuery } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';

const Subjects = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [saveSubjects] = useSaveSubjectsMutation();
  const { data: fetchedSubjects, refetch } = useGetSubjectsQuery();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const data = await selectedFile.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData = XLSX.utils.sheet_to_json(sheet);

    const uniqueSubjects = [];
    const set = new Set();

    parsedData.forEach((row) => {
      const courseName = row.courseName?.trim();
      const batch = row.batch?.trim();

      if (courseName && batch) {
        const key = `${courseName}_${batch}`;
        if (!set.has(key)) {
          uniqueSubjects.push({ courseName, studentBatch: batch });
          set.add(key);
        }
      }
    });

    try {
      await saveSubjects(uniqueSubjects).unwrap();
      toast.success('Subjects uploaded successfully!');
      setSelectedFile(null);
      refetch(); // refetch subjects after uploading
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload subjects.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Excel File and Save Subjects for Batches</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <br /><br />
      <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
        Upload
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h2>Batch Courses</h2>

      {fetchedSubjects ? (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Student Batch</th>
              <th>Subjects</th>
            </tr>
          </thead>
          <tbody>
            {fetchedSubjects.map((batch, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{batch.batch}</td>
                  <td>
                    {batch.subjects.map((subject, idx) => (
                      <div key={idx}>{subject.courseName}</div>
                    ))}
                  </td>
                </tr>
                {/* Separation Line */}
                <tr>
                  <td colSpan="2">
                    <hr style={{ borderTop: '2px solid black', margin: '10px 0' }} />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Subjects;
