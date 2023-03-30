import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faSquare} from "@fortawesome/free-solid-svg-icons"
import {faCalendar} from "@fortawesome/free-regular-svg-icons"
function IconFrequencyQuestion({zoomIn}) {
  if(zoomIn){
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-80"/>
        <FontAwesomeIcon icon={faCalendar} transform="grow-40" color='black' />
    </span>
  )
}else{
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faCalendar} transform="grow-7"color='black' />
    </span>
  )
}
}

export default IconFrequencyQuestion