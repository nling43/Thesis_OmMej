import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faSquare } from '@fortawesome/free-solid-svg-icons'
function IconMultiplePersonQuestion({zoomIn}) {
  if(zoomIn){
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-80"/>
        <FontAwesomeIcon icon={faUsers} transform="grow-40" color='black' />
    </span>
    )
}else{
  return (
    <span className="fa-layers fa-fw fa-lg">
        <FontAwesomeIcon icon={faSquare} transform="grow-30"/>
        <FontAwesomeIcon icon={faUsers} transform="grow-7"color='black' />
    </span>
  )
}}

export default IconMultiplePersonQuestion