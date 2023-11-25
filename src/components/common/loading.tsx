import React from "react"
import { ThreeCircles } from "react-loader-spinner"

const Loading = (props: { width: string; height: string }): React.JSX.Element => {
  return (
    <div className='justify-center flex items-center '>
      <ThreeCircles
        height={props.height}
        width={props.width}
        color='#f7a418'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        ariaLabel='three-circles-rotating'
        outerCircleColor=''
        innerCircleColor=''
        middleCircleColor=''
      />
    </div>
  )
}

export default Loading
