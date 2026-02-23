import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function CourseDetails() {

  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/courses/${id}`
        );
        setCourse(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
         <img src={course.coverImage}></img>
      <h1>{course.title}</h1>
      <h1>{course.courseId}</h1>
      
      <h1>{course.subject?.name}</h1>
     <h1>{course.subject?.instructor}</h1>
     <h1>{course.subject?.description}</h1>
     <h1>{course.instructor?.name}</h1>
     <h1>{course.instructor?.role}</h1>
      <p>{course.description}</p>
      <p>Price: {course.price}</p>
    </div>
  );
}

export default CourseDetails;