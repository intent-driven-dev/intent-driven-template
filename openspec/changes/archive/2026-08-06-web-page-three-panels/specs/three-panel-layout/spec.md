# Three Panel Layout

This feature defines the behavior for a web page with three equal horizontal panels.

```gherkin
Feature: Three panel layout
  # @openspec: ADDED
  Rule: Page content is displayed in three equal horizontal panels
    As a user viewing a web page
    I want to see content arranged in three equally sized horizontal panels
    So that I can view related information simultaneously

    Scenario: Page with three-panel layout is rendered correctly
      Given the page contains a three-panel layout
      When the page is displayed
      Then the browser window should show three panels side-by-side
      And each panel should occupy exactly one-third of the available width
      And all panels should have the same height

  # @openspec: ADDED
  Rule: Panels maintain equal width on window resize
    As a user viewing a web page
    I want the panel widths to adjust when the window is resized
    So that content remains properly aligned

    Scenario: Panel widths adjust when browser window is resized
      Given the page has three panels with equal widths
      When the browser window is resized
      Then each panel should maintain approximately one-third of the window width
      And the total panel width should equal the window width

  # @openspec: ADDED
  Rule: Panels are responsive and adapt to different screen sizes
    As a user viewing a web page on different devices
    I want the layout to work on desktop, tablet and mobile screens
    So that content remains accessible across all devices

    Scenario: Three panels adapt to desktop screen size
      Given the page is viewed on a desktop screen
      When the page loads
      Then three horizontal panels should be displayed side-by-side

    Scenario: Three panels stack vertically on small screen
      Given the page is viewed on a mobile screen with small width
      When the page loads
      Then the panels should stack vertically instead of horizontally
```