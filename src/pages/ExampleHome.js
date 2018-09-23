import React from 'react'
import '../styles/example'
import '../styles/example2'
import '../styles/example3'

class Example extends React.Component {
  componentDidMount() {
    // do something here
  }
  render() {
    return(
        <div className="exampleHome exampleHome2 exampleHome3" style={{color: 'red'}}>
          Example
          <span>Example2</span>
          <i>Example3</i>
        </div>
    )
  }
}
export default Example
