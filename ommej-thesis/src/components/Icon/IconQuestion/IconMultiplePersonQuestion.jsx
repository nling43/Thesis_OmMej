import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faSquare } from '@fortawesome/free-solid-svg-icons'
function IconMultiplePersonQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faUsers} transform="grow-7" color='black' />
    </span>
    )
}

export default IconMultiplePersonQuestion