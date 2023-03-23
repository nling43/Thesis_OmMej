import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar , faSquare} from "@fortawesome/free-solid-svg-icons"
function IconFrequencyQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faCalendar} transform="shrink-4" inverse />
    </span>
  )
}

export default IconFrequencyQuestion