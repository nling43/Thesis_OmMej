import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faT, faCircle } from "@fortawesome/free-solid-svg-icons";

function IconText({ zoomIn }) {
	if (zoomIn) {
		return (
			<span className="fa-layers fa-fw fa-lg">
				<FontAwesomeIcon icon={faCircle} transform={"grow-50"} />
				<FontAwesomeIcon icon={faComment} transform={"grow-30"} inverse />
				<FontAwesomeIcon icon={faT} transform="grow-10" />
			</span>
		);
	} else {
		return (
			<span className="fa-layers fa-fw fa-lg">
				<FontAwesomeIcon icon={faCircle} />
				<FontAwesomeIcon icon={faComment} transform="shrink-10" inverse />
				<FontAwesomeIcon icon={faT} transform="shrink-4" />
			</span>
		);
	}
}
export default IconText;
