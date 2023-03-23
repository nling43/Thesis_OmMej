import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCheck,faSquare } from '@fortawesome/free-solid-svg-icons'
function IconSinglePersonQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faUserCheck} transform="shrink-4" inverse />
    </span>
  )
}

export default IconSinglePersonQuestion