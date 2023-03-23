import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCheck,faSquare } from '@fortawesome/free-solid-svg-icons'
function IconSinglePersonQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faUserCheck} transform="grow-7" color='black' />
    </span>
  )
}

export default IconSinglePersonQuestion