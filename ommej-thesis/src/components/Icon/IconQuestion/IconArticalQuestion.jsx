import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquare } from "@fortawesome/free-solid-svg-icons"
import { faFileWord } from "@fortawesome/free-regular-svg-icons"
function IconArticalQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faFileWord} transform="grow-7" color='black' />
    </span>
    )
}

export default IconArticalQuestion