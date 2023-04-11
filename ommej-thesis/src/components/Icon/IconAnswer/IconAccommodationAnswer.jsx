import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse , faCircle } from "@fortawesome/free-solid-svg-icons"
function IconAccommodationAnswer({zoomIn}) {
  if(zoomIn){
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} transform="grow-50"/>
        <FontAwesomeIcon icon={faHouse} transform="grow-30" inverse/>
    </span>
    )
}
else{
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faCircle} transform="grow-10"/>
        <FontAwesomeIcon icon={faHouse} transform="shrink-4" inverse/>
    </span>
    )
}}

export default IconAccommodationAnswer