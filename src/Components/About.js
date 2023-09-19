import noteContext from '../Context/notes/noteContext'
import React, { useContext, useEffect } from 'react'

const About = () => {
  const a = useContext(noteContext)
  useEffect(() => {
    a.update();
     // eslint-disable-next-line
  }, []) //empty array cz we want it to run 1 time
  
  return (
    <div>
        This is About {a.state.name} and he is in class {a.state.class}
    </div>
  )
}

export default About