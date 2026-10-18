## Why

Implementing a collapsible node tree hierarchy in the right panel will enhance user experience by providing an organized way to navigate complex hierarchical data structures. This feature allows users to efficiently explore nested content by folding/unfolding levels of the hierarchy, which is particularly useful for file systems, organizational charts, or any data with inherent parent-child relationships.

## What Changes

- Create a collapsible node tree component for the right panel
- Implement toggle functionality where clicking an arrow icon expands/collapses child nodes
- Support hierarchical data structure with multiple levels of nesting
- Add visual indication (arrow direction) to show current expansion state
- Ensure proper styling that matches existing UI patterns

## Capabilities

### New Capabilities
- `collapsible-node-tree`: A reusable component that displays hierarchical data in a collapsible tree format

### Modified Capabilities

## Impact

This change introduces a new UI component. The implementation will require:
- CSS styling for the tree structure and toggle arrows 
- JavaScript functionality to handle expansion/collapse events
- Integration with existing panel layout system
- No breaking changes to existing functionality