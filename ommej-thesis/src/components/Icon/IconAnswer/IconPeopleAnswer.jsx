import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser,faCircle } from "@fortawesome/free-solid-svg-icons"
function IconPeopleAnswer() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} transform="grow-10"/>
        <FontAwesomeIcon icon={faUser} transform="shrink-4" inverse />
    </span>
    )
}

export default IconPeopleAnswer