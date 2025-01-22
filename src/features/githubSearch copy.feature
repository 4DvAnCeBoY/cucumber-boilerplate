Feature: Github test
    As a Developer in Test
    I want to search for webdriverio repository
    So that I can use it in my future tests

Scenario: open URL
    Given I open the url "https://github.com/"
    Then  I expect the url to contain "github.com"
    And   I expect that the title is "GitHub: Let’s build from here · GitHub"

Scenario: search for webdriverio repository
    Given I open the url "https://github.com/search"
    And   the element "[placeholder='Search GitHub']" not contains any text
    And   I clear the inputfield "[placeholder='Search GitHub']"
    And   I add "webdriverio" to the inputfield "[placeholder='Search GitHub']"
    When  I press "Enter"
    # Then  I expect that element "span[data-target='qbsearch-input.inputButtonText']" contains the text "webdriverio"
    # And   I expect that container "div[data-testid='results-list']:first-child" contains the text "Next-gen browser and mobile automation test framework for Node.js"


Scenario Outline: "<Title>"
    Given user launches the "https://github.com/search"
    And user navigates to "<url>"
    And user searches for "<search_query>"

    @GITHUB_Search_Basic
    Examples: Basic Search Scenarios
      | url                          | search_query    | Title                                       |
      | https://github.com           | webdriverio     | Search for WebdriverIO Repository          |
      | https://github.com           | selenium        | Search for Selenium Repository             |
      | https://github.com           | puppeteer       | Search for Puppeteer Repository            |
      | https://github.com           | jest            | Search for Jest Testing Framework          |

    @GITHUB_Search_Advanced
    Examples: Advanced Search Scenarios
      | url                          | search_query           | Title                                  |
      | https://github.com/search    | webdriverio stars:>50  | Search for WebdriverIO with 50+ stars |
      | https://github.com/search    | puppeteer forks:>20    | Search for Puppeteer with 20+ forks   |
      | https://github.com/search    | jest is:public         | Search for Public Jest Repositories   |
      | https://github.com/search    | selenium language:Java | Search for Selenium Java Projects     |

    @GITHUB_Search_ErrorHandling
    Examples: Error Handling Scenarios
      | url                          | search_query | Title                              |
      | https://github.com/search    | invalidquery | Search with Invalid Query          |
      | https://github.com/search    | ""           | Search with Empty Query            |
      | https://github.com/search    | !@#$%^&*()   | Search with Special Characters     |

    @GITHUB_Search_EdgeCases
    Examples: Edge Case Scenarios
      | url                          | search_query             | Title                                   |
      | https://github.com/search    | webdriverio language:Go  | Search for WebdriverIO Go Projects     |
      | https://github.com/search    | puppeteer stars:<0       | Search with Invalid Star Range Query   |
      | https://github.com/search    | jest is:private          | Search for Private Jest Repositories   |
      | https://github.com/search    | selenium sort:random     | Search with Random Sort Order          |
