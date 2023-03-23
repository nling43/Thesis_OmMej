import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestion, faSquare } from '@fortawesome/free-solid-svg-icons'
function IconSingleQuestion() {
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-10"/>
        <FontAwesomeIcon icon={faQuestion} transform="shrink-4" inverse />
    </span>
  )
}

export default IconSingleQuestion