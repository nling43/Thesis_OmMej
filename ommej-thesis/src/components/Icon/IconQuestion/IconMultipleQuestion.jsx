import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListCheck, faSquare } from '@fortawesome/free-solid-svg-icons'
function IconMultipleQuestion() {
  return   (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faListCheck} transform="grow-7" color='black' />
    </span>
  )
}

export default IconMultipleQuestion