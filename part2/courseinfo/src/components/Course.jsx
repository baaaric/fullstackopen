const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><strong>total of {total} exercises </strong></p>
}

const Course = ({ course }) => {
  return (
    <div>
      <h1>{course.name}</h1>
      {course.parts.map(part =>
        <Part key={part.id} part={part} /> 
      )}
      <Total parts={course.parts} />

    </div>
  )
}

export default Course 