import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faSquare } from '@fortawesome/free-solid-svg-icons'

function IconPersonQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faUser} transform="shrink-4" inverse />
    </span>
    )
}

export default IconPersonQuestion