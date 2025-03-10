// src/components/StudentForm.js
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaTrashAlt } from "react-icons/fa";

const StudentForm = ({ onClose, initialData = null }) => {
  const [subjectInput, setSubjectInput] = useState("");

  const initialValues = initialData || {
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    address: "",
    image: "",
    subjects: [],
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    studentId: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    address: Yup.string().required("Required"),
    image: Yup.mixed().required("Image is required"),
    subjects: Yup.array().min(1, "Please add at least one subject"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `http://localhost:3001/students/${initialData.id}`
      : "http://localhost:3001/students";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then(() => {
        setSubmitting(false);
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitting(false);
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {initialData ? "Edit Student" : "Add Student"}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <table style={{ width: "100%" }}>
              <tr>
                <td>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <Field name="firstName" className="form-input" />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <Field name="lastName" className="form-input" />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <Field name="studentId" className="form-input" />
                    <ErrorMessage
                      name="studentId"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <Field name="email" type="email" className="form-input" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-input" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label className="form-label">Student Image</label>
                    <input
                      style={{ marginBottom: "20px" }}
                      name="image"
                      type="file"
                      className="form-input"
                      onChange={(event) => {
                        setFieldValue(
                          "image",
                          event.currentTarget.files[0]?.name
                        );
                      }}
                    />
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  {/* Subject Addition */}
                  <div className="form-group">
                    <label className="form-label">Subjects</label>
                    <div className="subject-add">
                      <input
                        type="text"
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        placeholder="Enter subject"
                        className="subject-input"
                      />
                      <button
                        type="button"
                        className="btn add-subject-btn"
                        onClick={() => {
                          if (subjectInput.trim() !== "") {
                            setFieldValue("subjects", [
                              ...values.subjects,
                              subjectInput.trim(),
                            ]);
                            setSubjectInput("");
                          }
                        }}
                      >
                        Add Subject
                      </button>
                    </div>
                    {values.subjects && values.subjects.length > 0 && (
                      <ul className="subject-list">
                        {values.subjects.map((sub, index) => (
                          <li key={index} className="subject-item">
                            {sub}
                            <FaTrashAlt
                              className="subject-delete-icon"
                              onClick={() =>
                                setFieldValue(
                                  "subjects",
                                  values.subjects.filter((_, i) => i !== index)
                                )
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                    <ErrorMessage
                      name="subjects"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn submit-btn"
                    >
                      {initialData ? "Update" : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </table>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StudentForm;
