import React, { memo } from "react";
import { getBezierPath } from "reactflow";

export default memo(
	({
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		markerEnd,
		selected,
	}) => {
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
							stroke: "#ffbf00",
							strokeWidth: 10,
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
							stroke: "#00ccff",
							strokeWidth: 10,
						}}
						className="react-flow__edge-path"
						d={edgePath}
						markerEnd={markerEnd}
					/>
				</>
			);
		}
	}
);
