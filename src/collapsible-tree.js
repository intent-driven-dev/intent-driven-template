// Collapsible Node Tree Component

class CollapsibleNodeTree {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id '${containerId}' not found`);
    }
    
    // Initialize the component
    this.init();
  }

  init() {
    // Create the basic structure for our collapsible tree
    const treeContainer = document.createElement('div');
    treeContainer.className = 'collapsible-node-tree';
    treeContainer.setAttribute('role', 'tree');

    // Add sample hierarchical data structure (this would be configurable)
    const sampleData = [
      {
        id: '1',
        text: 'Level 1 Node',
        expanded: false,
        children: [
          {
            id: '1-1',
            text: 'Level 2 Node 1',
            expanded: false,
            children: [
              { id: '1-1-1', text: 'Level 3 Node 1', expanded: false, children: [] },
              { id: '1-1-2', text: 'Level 3 Node 2', expanded: false, children: [] }
            ]
          },
          {
            id: '1-2',
            text: 'Level 2 Node 2',
            expanded: false,
            children: [
              { id: '1-2-1', text: 'Level 3 Node 3', expanded: false, children: [] }
            ]
          }
        ]
      },
      {
        id: '2',
        text: 'Level 1 Node 2',
        expanded: true,
        children: [
          { id: '2-1', text: 'Level 2 Node 3', expanded: false, children: [] }
        ]
      }
    ];

    const treeHTML = this.createTreeHTML(sampleData);
    treeContainer.innerHTML = treeHTML;
    
    // Add the tree to the container
    this.container.appendChild(treeContainer);
    
    // Add event listeners for toggle functionality
    this.addEventListeners();
  }

  createTreeHTML(data) {
    let html = '<ul class="tree-root">';

    data.forEach(node => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = node.expanded;
      
      html += `
        <li class="tree-node ${hasChildren ? 'has-children' : 'no-children'}" 
            data-node-id="${node.id}">
          <div class="node-content">
            ${hasChildren ? `<span class="toggle-icon" data-node-id="${node.id}">${isExpanded ? '▼' : '▶'}</span>` : ''}
            <span class="node-text">${node.text}</span>
          </div>
          ${hasChildren ? `<ul class="children ${isExpanded ? 'expanded' : 'collapsed'}">${this.createTreeHTML(node.children)}</ul>` : ''}
        </li>`;
    });
    
    html += '</ul>';
    return html;
  }

  addEventListeners() {
    // Add click event listener to toggle icons
    const toggleIcons = this.container.querySelectorAll('.toggle-icon');
    
    toggleIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNode(e.target);
      });
    });

    // Add click event listener to node content for collapsing/expanding
    const nodeContents = this.container.querySelectorAll('.node-content');
    
    nodeContents.forEach(content => {
      content.addEventListener('click', (e) => {
        // Check if we clicked on the text or icon, and handle accordingly
        if (!e.target.classList.contains('toggle-icon') && !e.target.classList.contains('node-text')) {
          // If clicked on the node content area but not a child element, toggle
          const parentLi = e.currentTarget.closest('.tree-node');
          const toggleIcon = parentLi.querySelector('.toggle-icon');
          
          if (toggleIcon) {
            this.toggleNode(toggleIcon);
          }
        }
      });
    });
  }

  // Function to toggle node expansion state
  toggleNode(iconElement) {
    const nodeId = iconElement.getAttribute('data-node-id');
    const node = this.container.querySelector(`[data-node-id="${nodeId}"]`);
    
    if (!node) return;
    
    const childrenList = node.querySelector('.children');
    const isExpanded = childrenList.classList.contains('expanded');
    
    // Toggle the expansion state
    if (isExpanded) {
      childrenList.classList.remove('expanded');
      childrenList.classList.add('collapsed');
      iconElement.textContent = '▶'; // Right-pointing arrow 
      iconElement.classList.remove('expanded');
    } else {
      childrenList.classList.remove('collapsed');
      childrenList.classList.add('expanded');
      iconElement.textContent = '▼'; // Down-pointing arrow
      iconElement.classList.add('expanded');
    }
    
    // Update the expansion state in node data
    node.classList.toggle('expanded');
    node.classList.toggle('collapsed');
  }

  // Function to expand all nodes
  expandAll() {
    const expandedNodes = this.container.querySelectorAll('.children.collapsed');
    expandedNodes.forEach(node => {
      node.classList.remove('collapsed');
      node.classList.add('expanded');
    });
    
    const toggleIcons = this.container.querySelectorAll('.toggle-icon');
    toggleIcons.forEach(icon => {
      if (icon.textContent === '▶') {
        icon.textContent = '▼';
        icon.classList.add('expanded');
      }
    });
  }

  // Function to collapse all nodes
  collapseAll() {
    const collapsedNodes = this.container.querySelectorAll('.children.expanded');
    collapsedNodes.forEach(node => {
      node.classList.remove('expanded');
      node.classList.add('collapsed');
    });
    
    const toggleIcons = this.container.querySelectorAll('.toggle-icon');
    toggleIcons.forEach(icon => {
      if (icon.textContent === '▼') {
        icon.textContent = '▶';
        icon.classList.remove('expanded');
      }
    });
  }

  // Function to get the current state of all nodes
  getNodeState() {
    const nodeStates = {};
    
    const treeNodes = this.container.querySelectorAll('.tree-node[data-node-id]');
    treeNodes.forEach(node => {
      const nodeId = node.getAttribute('data-node-id');
      const childrenList = node.querySelector('.children');
      const isExpanded = childrenList && childrenList.classList.contains('expanded');
      
      nodeStates[nodeId] = {
        expanded: isExpanded,
        children: Array.from(node.querySelectorAll('.tree-node[data-node-id]')).map(child => child.getAttribute('data-node-id'))
      };
    });
    
    return nodeStates;
  }
}

// Initialize the component when the page loads
document.addEventListener('DOMContentLoaded', () => {
  try {
    // For this example, we'll create the component in the second panel (panel 2)
    const panel2 = document.querySelector('.panel:nth-child(2)');
    
    if (panel2) {
      // Create a new section for our tree
      const treeSection = document.createElement('div');
      treeSection.className = 'collapsible-tree-section';
      treeSection.innerHTML = '<h3>Collapsible Tree</h3>';
      panel2.appendChild(treeSection);
      
      // Initialize the component with container id
      const tree = new CollapsibleNodeTree('collapsible-tree-section');
    }
  } catch (error) {
    console.error('Error initializing collapsible node tree:', error);
  }
});