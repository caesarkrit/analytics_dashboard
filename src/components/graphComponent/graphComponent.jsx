// import React, { useEffect, useRef } from "react";
// import * as yfiles from "yfiles";

// function GraphComponent() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     // Initialize yFiles graph component
//     const graphComponent = new yfiles.graph.GraphComponent(
//       containerRef.current
//     );

//     // Create a sample graph
//     const graph = graphComponent.graph;
//     const node1 = graph.createNode(new yfiles.geometry.Rect(100, 100, 30, 30));
//     const node2 = graph.createNode(new yfiles.geometry.Rect(200, 100, 30, 30));
//     graph.createEdge(node1, node2);

//     // Finally, if you want to fit the content into the viewport
//     graphComponent.fitGraphBounds();

//     return () => {
//       // Clean up resources if necessary
//       graphComponent.dispose();
//     };
//   }, []);

//   return (
//     <div ref={containerRef} style={{ width: "600px", height: "400px" }}></div>
//   );
// }

// export default GraphComponent;
