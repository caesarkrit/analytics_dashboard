import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import networkData from './building_map.json'; // import your JSON data

const convertJsonToCytoscapeElements = (json) => {
    const elements = [];
    let buildingYPosition = 100; // Y position for the first building
  
    json.buildings.forEach((building) => {
      // Add the building as a parent node
      elements.push({
        data: {
          id: building.buildingId,
          label: `Building ${building.buildingId}`,
        },
        classes: 'compound', // A class to style the buildings differently
        position: { x: 0, y: buildingYPosition } // Position for the building
      });
  
      // Initial positions for nodes inside the building
      let nodeXPosition = 100;
      const nodeYPosition = buildingYPosition + 50;
  
      // Add nodes (switches/devices)
      building.nodes.forEach((node) => {
        elements.push({
          data: {
            id: node.id,
            label: node.label,
            deviceType: node.deviceType,
            parent: building.buildingId, // Define the parent of this node
          },
          position: { x: nodeXPosition, y: nodeYPosition } // Position for the node
        });
        nodeXPosition += 200; // Increment X position for the next node
      });
  
      // Update Y position for the next building
      buildingYPosition += 200;
  
      // Add links (edges)
      building.links.forEach((link) => {
        // Only add the link if both the source and the target exist
        const sourceExists = building.nodes.some(n => n.id === link.source);
        const targetExists = building.nodes.some(n => n.id === link.target);
        
        if (sourceExists && targetExists) {
          elements.push({
            data: {
              id: `${link.source}-${link.target}`,
              source: link.source,
              target: link.target,
              portSpeed: link.portSpeed,
              status: link.status,
            }
          });
        } else {
          console.error(`One of the nodes for the edge ${link.source}-${link.target} does not exist.`);
        }
      });
    });
  
    return elements;
  };
  
  

const CytoscapeComponent = () => {
  const cyContainer = useRef(null);

  useEffect(() => {
    const elements = convertJsonToCytoscapeElements(networkData);

    const cy = cytoscape({
      container: cyContainer.current,
      elements: elements, // use the elements from your JSON data
      style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#0074D9', // A distinct color for nodes
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#fff' // White text for better visibility
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(portSpeed)'
        }
      },
      {
        selector: 'edge[status="up"]',
        style: {
          'line-color': 'green',
        }
      },
      {
        selector: 'edge[status="down"]',
        style: {
          'line-color': 'red',
        }
      },
      {
        selector: '.compound', // Class for building nodes
        style: {
          'background-opacity': 0.1, // Make the building background more transparent
          'background-color': '#545454', // A neutral color for the building
          'border-color': '#000000',
          'border-width': 2,
          'border-opacity': 0.5,
          'text-valign': 'top',
          'text-halign': 'center',
          'padding': 50, // Increase padding to make space for the nodes inside
          'font-size': 20, // Increase font size for building labels
          'color': '#fff', // White text for better visibility
          'text-outline-width': 2, // Outline the text for better visibility
          'text-outline-color': '#545454'
        }
      }
    ],
    layout: {
        name: 'preset'
      }
    });

    return () => { cy.destroy(); }; 
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={cyContainer} />
  );
};

export default CytoscapeComponent;
