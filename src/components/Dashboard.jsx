// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // holds student data for editing

  const fetchStudents = () => {
    fetch("http://localhost:3001/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/students/${id}`, { method: "DELETE" }).then(
      () => {
        setStudents(students.filter((student) => student.id !== id));
      }
    );
  };

  // Opens modal for adding new student
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowModal(true);
  };

  // Opens modal for editing student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <button className="btn add-btn" onClick={handleAddStudent}>
        Add Student
      </button>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th className="table-header">First Name</th>
              <th className="table-header">Last Name</th>
              <th className="table-header">Student ID</th>
              <th className="table-header">Email</th>
              <th className="table-header">Address</th>
              <th className="table-header">Subjects</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="table-cell">{student.firstName}</td>
                <td className="table-cell">{student.lastName}</td>
                <td className="table-cell">{student.studentId}</td>
                <td className="table-cell">{student.email}</td>
                <td className="table-cell">{student.address}</td>
                <td className="table-cell">{student.subjects.join(", ")}</td>
                <td className="table-cell">
                  <FaPencilAlt
                    className="subject-edit-icon"
                    onClick={() => handleEditStudent(student)}
                  />

                  {/* comment */}
                  <FaTrashAlt
                    className="subject-delete-icon"
                    onClick={() => handleDelete(student.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <StudentForm
              initialData={selectedStudent}
              onClose={() => {
                setShowModal(false);
                fetchStudents(); // Refresh list after adding/updating a student
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
