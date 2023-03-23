import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faSquare } from '@fortawesome/free-solid-svg-icons'
function IconMultiplePersonQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faUsers} transform="shrink-4" inverse />
    </span>
    )
}

export default IconMultiplePersonQuestion