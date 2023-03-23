import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListCheck, faSquare } from '@fortawesome/free-solid-svg-icons'
function IconMultipleQuestion() {
  return   (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faListCheck} transform="shrink-4" inverse />
    </span>
  )
}

export default IconMultipleQuestion