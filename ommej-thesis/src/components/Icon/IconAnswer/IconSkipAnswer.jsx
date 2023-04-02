import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCircle } from "@fortawesome/free-solid-svg-icons";

function IconText({ zoomIn }) {
  if (zoomIn) {
    return (
      <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} transform="grow-50" />
        <FontAwesomeIcon icon={faArrowDown} transform="grow-30" inverse />
      </span>
    );
  } else {
    return (
      <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} transform="grow-10"/>
        <FontAwesomeIcon icon={faArrowDown} transform="shrink-4" inverse />
      </span>
    );
  }
}

export default IconText;
