import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAddressBook,faSquare } from '@fortawesome/free-solid-svg-icons'
function IconSingleAccommodation() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faAddressBook} transform="shrink-4" inverse />
    </span>
    )
}

export default IconSingleAccommodation