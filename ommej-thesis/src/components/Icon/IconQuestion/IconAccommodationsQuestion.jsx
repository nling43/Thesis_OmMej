import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faSquare} from "@fortawesome/free-solid-svg-icons"
function IconAccommodationsQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faHouse} transform="shrink-4" inverse />
    </span>
  )
}

export default IconAccommodationsQuestion