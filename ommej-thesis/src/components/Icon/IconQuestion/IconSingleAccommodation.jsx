import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAddressBook,faSquare } from '@fortawesome/free-solid-svg-icons'
function IconSingleAccommodation() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faAddressBook} transform="grow-7" color='black' />
    </span>
    )
}

export default IconSingleAccommodation