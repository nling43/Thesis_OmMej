import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faSquare} from "@fortawesome/free-solid-svg-icons"
import {faCalendar} from "@fortawesome/free-regular-svg-icons"
function IconFrequencyQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faCalendar} transform="grow-7" color='black' />
    </span>
  )
}

export default IconFrequencyQuestion