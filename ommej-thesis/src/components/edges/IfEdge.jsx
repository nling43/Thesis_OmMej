import React, { memo } from "react";
import { getBezierPath } from "reactflow";
import styled from "styled-components";

export default function CustomEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
	selected,
}) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	if (selected) {
		return (
			<>
				<path
					id={id}
					style={{
						stroke: "green",
						strokeWidth: 8,
						padding: 4,
					}}
					className="react-flow__edge-path"
					d={edgePath}
					markerEnd={markerEnd}
				/>
			</>
		);
	} else {
		return (
			<>
				<path
					id={id}
					style={{
						stroke: "green",
						strokeWidth: 4,
						padding: 4,
					}}
					className="react-flow__edge-path"
					d={edgePath}
					markerEnd={markerEnd}
				/>
			</>
		);
	}
}
