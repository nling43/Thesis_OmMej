import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment,faT,faCircle } from "@fortawesome/free-solid-svg-icons";

function IconText() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} />
        <FontAwesomeIcon icon={faComment} transform="shrink-6" inverse />   
        <FontAwesomeIcon icon={faT} transform="shrink-11"   />
    </span>
    )
}

export default IconText