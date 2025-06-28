import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css'

const initialCourseTypes = [
  { id: 'ct1', name: 'Individual' },
  { id: 'ct2', name: 'Group' },
  { id: 'ct3', name: 'Special' },
];

const initialCourses = [
  { id: 'c1', name: 'Hindi' },
  { id: 'c2', name: 'English' },
  { id: 'c3', name: 'Urdu' },
];

const initialCourseOfferings = [
  { id: 'co1', courseId: 'c2', courseTypeId: 'ct1' }, // Individual - English
  { id: 'co2', courseId: 'c1', courseTypeId: 'ct2' }, // Group - Hindi
];

const initialRegistrations = [
  { id: 'r1', studentName: 'Alice', offeringId: 'co1' },
  { id: 'r2', studentName: 'Bob', offeringId: 'co1' },
];

function App() {
  const [courseTypes, setCourseTypes] = useState(initialCourseTypes);
  const [courses, setCourses] = useState(initialCourses);
  const [courseOfferings, setCourseOfferings] = useState(initialCourseOfferings);
  const [registrations, setRegistrations] = useState(initialRegistrations);

  const [courseTypeInput, setCourseTypeInput] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [studentName, setStudentName] = useState('');
  const [filterType, setFilterType] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [modalContent, setModalContent] = useState({ id: null, type: '', currentName: '', courseId: '', courseTypeId: '' });
  const [editValue, setEditValue] = useState('');


  // Course Types
  const addCourseType = () => {
    if (courseTypeInput.trim()) {
      setCourseTypes([...courseTypes, { id: uuid(), name: courseTypeInput.trim() }]);
      setCourseTypeInput('');
    }
  };

  const handleUpdateCourseType = (id, newName) => {
    setCourseTypes(courseTypes.map(ct => ct.id === id ? { ...ct, name: newName } : ct));
  };

  const deleteCourseType = (id) => {
    setCourseTypes(courseTypes.filter(ct => ct.id !== id));
    const remainingOfferings = courseOfferings.filter(co => co.courseTypeId !== id);
    setCourseOfferings(remainingOfferings);
    setRegistrations(registrations.filter(reg => remainingOfferings.some(co => co.id === reg.offeringId)));
  };

  // Courses
  const addCourse = () => {
    if (courseInput.trim()) {
      setCourses([...courses, { id: uuid(), name: courseInput.trim() }]);
      setCourseInput('');
    }
  };

  const handleUpdateCourse = (id, newName) => {
    setCourses(courses.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    // Also remove course offerings and registrations associated with this course
    const remainingOfferings = courseOfferings.filter(co => co.courseId !== id);
    setCourseOfferings(remainingOfferings);
    setRegistrations(registrations.filter(reg => remainingOfferings.some(co => co.id === reg.offeringId)));
  };

  // Course Offerings
  const addCourseOffering = () => {
    if (selectedCourse && selectedCourseType) {
      setCourseOfferings([...courseOfferings, {
        id: uuid(),
        courseId: selectedCourse,
        courseTypeId: selectedCourseType
      }]);
      setSelectedCourse('');
      setSelectedCourseType('');
    }
  };

  const handleUpdateCourseOffering = (id, newCourseId, newCourseTypeId) => {
    setCourseOfferings(courseOfferings.map(co => co.id === id ? { ...co, courseId: newCourseId, courseTypeId: newCourseTypeId } : co));
  };

  const deleteCourseOffering = (id) => {
    setCourseOfferings(courseOfferings.filter(co => co.id !== id));
    // Also remove registrations for this offering
    setRegistrations(registrations.filter(reg => reg.offeringId !== id));
  };

  // Student Registrations
  const registerStudent = (offeringId) => {
    if (studentName.trim() && offeringId) {
      setRegistrations([...registrations, { id: uuid(), offeringId, name: studentName.trim() }]);
      setStudentName('');
    }
  };

  // Helper function to get full offering name
  const getOfferingName = (offering) => {
    const courseType = courseTypes.find(ct => ct.id === offering.courseTypeId);
    const course = courses.find(c => c.id === offering.courseId);
    return `${courseType?.name || 'Unknown Type'} - ${course?.name || 'Unknown Course'}`;
  };

  // Filtered offerings based on selected course type
  const filteredOfferings = filterType ?
    courseOfferings.filter(co => co.courseTypeId === filterType) : courseOfferings;


  // --- Modal Logic for Edit ---
  const openEditModal = (id, type, currentName = '', courseId = '', courseTypeId = '') => {
    setModalContent({ id, type, currentName, courseId, courseTypeId });
    setEditValue(currentName); // Initialize with current name for simple edits
    setShowEditModal(true);
  };

  const handleModalSubmit = () => {
    const { id, type, courseId, courseTypeId } = modalContent;
    if (type === 'courseType') {
      handleUpdateCourseType(id, editValue);
    } else if (type === 'course') {
      handleUpdateCourse(id, editValue);
    } else if (type === 'courseOffering') {
      handleUpdateCourseOffering(id, selectedCourse || courseId, selectedCourseType || courseTypeId);
    }
    setShowEditModal(false);
    setEditValue('');
    setSelectedCourse('');
    setSelectedCourseType('');
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditValue('');
    setSelectedCourse('');
    setSelectedCourseType('');
  };

  return (
    <div className="app-container">
      <div className="main-content-wrapper">
        <h1 className="main-title">
          Student Registration System
        </h1>

        {/* Course Types Section */}
        <section className="course-types-section">
          <h2>Course Types</h2>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="New course type name"
              value={courseTypeInput}
              onChange={e => setCourseTypeInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addCourseType()}
            />
            <button
              onClick={addCourseType}
              className="action-button"
            >
              Add Course Type
            </button>
          </div>
          <ul>
            {courseTypes.map(ct => (
              <li
                key={ct.id}
                className="list-item"
              >
                <span >{ct.name}</span>
                <div className="button-group">
                  <button
                    onClick={() => openEditModal(ct.id, 'courseType', ct.name)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourseType(ct.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Courses Section */}
        <section className="courses-section">
          <h2>Courses</h2>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="New course name"
              value={courseInput}
              onChange={e => setCourseInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addCourse()}
            />
            <button
              onClick={addCourse}
              className="action-button"
            >
              Add Course
            </button>
          </div>
          <ul>
            {courses.map(c => (
              <li
                key={c.id}
                className="list-item"
              >
                <span>{c.name}</span>
                <div className="button-group">
                  <button
                    onClick={() => openEditModal(c.id, 'course', c.name)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Course Offerings Section */}
        <section className="offerings-section">
          <h2>Course Offerings</h2>
          <div className="input-group">
            <select
              className="select-field"
              onChange={e => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select
              className="select-field"
              onChange={e => setSelectedCourseType(e.target.value)}
              value={selectedCourseType}
            >
              <option value="">Select Course Type</option>
              {courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
            </select>
            <button
              onClick={addCourseOffering}
              className="action-button"
            >
              Add Offering
            </button>
          </div>
          <ul>
            {courseOfferings.map(co => (
              <li
                key={co.id}
                className="list-item"
              >
                <span>
                  {getOfferingName(co)}
                </span>
                <div className="button-group">
                  <button
                    onClick={() => openEditModal(co.id, 'courseOffering', '', co.courseId, co.courseTypeId)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourseOffering(co.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Filter Offerings Section */}
        <section className="filter-section">
          <h2>Filter Offerings by Course Type</h2>
          <select
            className="select-field"
            onChange={e => setFilterType(e.target.value)}
            value={filterType}
            style={{ marginBottom: '1.5rem' }} 
          >
            <option value="">All Course Types</option>
            {courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
          </select>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }} >Available Offerings:</h3>
          <ul>
            {filteredOfferings.length > 0 ? (
              filteredOfferings.map(co => (
                <li
                  key={co.id}
                  className="list-item"
                  style={{ backgroundColor: '#fef3c7', color: '#92400e' }} 
                >
                  {getOfferingName(co)}
                </li>
              ))
            ) : (
              <li className="no-results" style={{ color: '#a16207' }} >No offerings match the selected filter.</li>
            )}
          </ul>
        </section>

        {/* Student Registrations Section */}
        <section className="registrations-section">
          <h2>Student Registrations</h2>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Student Name"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && registerStudent(e.target.nextElementSibling.value)}
            />
            <select
              className="select-field"
              onChange={e => registerStudent(e.target.value)}
              value="" // Reset select after selection
            >
              <option value="">Select Offering to Register</option>
              {courseOfferings.map(co => (
                <option key={co.id} value={co.id}>
                  {getOfferingName(co)}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Registered Students:</h3>
          <ul>
            {registrations.length > 0 ? (
              registrations.map(reg => (
                <li
                  key={reg.id}
                  className="list-item"
                  style={{ backgroundColor: '#e0e7ff', color: '#312e81' }} 
                >
                  {reg.name} ({getOfferingName(courseOfferings.find(co => co.id === reg.offeringId) || {})})
                </li>
              ))
            ) : (
              <li className="no-results" style={{ color: '#4f46e5' }} >No students registered yet.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              Edit {modalContent.type === 'courseType' ? 'Course Type' : modalContent.type === 'course' ? 'Course' : 'Course Offering'}
            </h3>
            {modalContent.type === 'courseType' || modalContent.type === 'course' ? (
              <input
                type="text"
                className="modal-input-field"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                placeholder={`New ${modalContent.type} name`}
              />
            ) : (
              <>
                <select
                  className="modal-select-field"
                  value={selectedCourse || modalContent.courseId}
                  onChange={e => setSelectedCourse(e.target.value)}
                >
                  <option value="">Select New Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select
                  className="modal-select-field"
                  value={selectedCourseType || modalContent.courseTypeId}
                  onChange={e => setSelectedCourseType(e.target.value)}
                >
                  <option value="">Select New Course Type</option>
                  {courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                </select>
              </>
            )}
            <div className="modal-buttons">
              <button
                onClick={closeModal}
                className="modal-cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="modal-save-button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
