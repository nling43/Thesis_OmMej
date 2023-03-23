import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faSquare } from '@fortawesome/free-solid-svg-icons'

function IconPersonQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30" />
        <FontAwesomeIcon icon={faUser} transform="grow-7" color='black'/>
    </span>
    )
}

export default IconPersonQuestion