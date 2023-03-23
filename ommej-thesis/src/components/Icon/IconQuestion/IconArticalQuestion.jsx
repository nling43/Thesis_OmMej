import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen,faSquare } from "@fortawesome/free-solid-svg-icons"
function IconArticalQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faBookOpen} transform="shrink-4" inverse />
    </span>
    )
}

export default IconArticalQuestion