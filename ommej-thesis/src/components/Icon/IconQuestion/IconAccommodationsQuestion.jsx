import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faSquare} from "@fortawesome/free-solid-svg-icons"
function IconAccommodationsQuestion({zoomIn}) {
  if(zoomIn){
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-80"/>
        <FontAwesomeIcon icon={faHouse} transform="grow-40" color='black' />
    </span>
  )
}
else{
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faHouse} transform="grow-7"color='black' />
    </span>
  )
}
}

export default IconAccommodationsQuestion