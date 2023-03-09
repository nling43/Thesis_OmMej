import React from 'react'
import useStore from '../Store/store'
import { shallow } from 'zustand/shallow'

const selector = (state) => ({
    nodes: state.nodes,
})

function SearchResults() {
    const {
        nodes
    } = useStore(selector, shallow)
  return (
    <div>SearchResults</div>
  )
}

export default SearchResults