---
name: ips-chrome-background
description: >-
  Use browser automation without disturbing the user's desktop: official Chrome
  extension background tabs for existing logins, or isolated headless Playwright
  for full scripts and tests.
---

# ips-chrome-background

Keep the user's mouse, keyboard, foreground window and current tab untouched
while using the browser's available capabilities. This skill chooses the
interaction method; the task and project still govern accounts, submissions,
data changes, costs and test execution.

## Choose The Channel

- **Existing login or interactive exploration:** official Chrome extension,
  dedicated background task tab, DOM reads and documented locators.
- **Full scripts or tests:** official Playwright in an isolated headless
  browser, including UI/API, network observation, popups and downloads.

Use either channel when the task permits it. An extension limitation is not a
ban on headless Playwright. Respect an explicit extension-only requirement;
headless is also not a substitute when the exact existing session is required.
Never export the user's cookies/tokens or attach Playwright to their Chrome
profile. A headless session signs in normally with authorized credentials.

## Headless Playwright

Use the project's existing official entrypoint and dependencies. Inspect its
effective config and custom launchers first: every browser must be headless.
For Playwright Test, set the owning config's `use.headless: true`; retain the
declared channel, viewport, environment, run selection and recording policy.
For a standalone script, launch explicitly:

```javascript
const browser = await chromium.launch({ channel: 'chrome', headless: true });
```

Use isolated contexts, never the user's persistent profile or a CDP
attachment to their browser. Native page locators and `page.mouse` /
`page.keyboard` target the headless page, not the system input devices.
Use permitted DOM, network evidence and file screenshots for diagnostics.
Keep auth/OTP recording off when project rules require it.

Do not use `--headed`, `--debug`, `--ui`, Inspector or `bringToFront`.
Unset inherited `PWDEBUG` and disable automatic HTML report opening.
Keep workers within the project's resource budget; close only task-owned
contexts/processes. First verify the smallest authorized real flow, not the
whole suite merely to test the channel.

If a flow requires visible browser or OS interaction, preserve the result and
report the specific limitation. Never silently switch to headed/desktop
operation or weaken the test. Headless execution is real native Playwright
evidence, but does not certify untested headed or OS-specific behavior.

## Extension Start

Use `mcp__cua_repl.js`. On a fresh runtime, the first call is only
`await cua.getState();`. Inspect the returned browser inventory and select
Chrome with `type: "extension"` through the documented browser entrypoint.
Do not select a native Chrome app, the in-app browser or a CDP connection.
After a context summary, use `await cua.rewriteDocumentation();` before
continuing. Reuse a valid existing browser binding.

Read the effective browser documentation. When it exposes the native
`browser.tabs` interface, use that documented `browser` handle. Do not assume
the generic `cua.getBrowser()` facade has the same methods.

Before opening or claiming tabs, name the session as its documentation requires.
Create a dedicated task tab with **`await browser.tabs.new()`**. This was
verified to create a background tab on the connected Chrome extension.
The generic `cua.createBrowserTab(..., { visible: false })` failed there with
an unsupported visibility capability; that is not evidence that background
extension operation is unavailable.

For setup and working examples, read [references/background-tabs.md](references/background-tabs.md).
The examples use the host runtime, not a terminal Playwright installation.
Follow newly returned API documentation if the available surface changes.

## Extension Work

Navigate only the task tab. Read its DOM, then use `taskTab.playwright`
locators such as `getByRole`, `getByLabel`, `getByTestId`, `click` and `fill`.
Inspect the resulting DOM or the relevant control state before the next
decision. For a contenteditable textbox, verify `innerText()` rather than
`.value`; clear only text this task entered, never an existing draft.

Reuse Chrome's current login, but verify the required account before an
account-specific action. Being signed in is not evidence of the right identity.
Never export cookies or tokens to emulate the session elsewhere.

## Do Not Take Over

- No `@Computer`, native app actions, coordinate clicks, system typing,
  clipboard input, AppleScript, or OS input automation.
- No window activation, tab selection, `bringToFront`, focusing management
  updates, or switching a user-owned tab.
- Do not use generic native-input wrappers such as `tab.click`,
  `tab.typeText`, `tab.pressKey` or `tab.paste`; use the extension's DOM locators.
- No visible-browser or desktop fallback. A permitted headless route is
  separate execution, not a continuation using the user's existing session.

Check at setup that creating and navigating the task tab did not activate it.
The documented `management` capability's read-only tab/window queries can
verify this requested boundary; do not organize or modify the user's tabs.
If foreground behavior is uncertain or changes unexpectedly, stop and explain.
Never "repair" it by switching the user's tab back. A human may change tabs
while the task runs; do not mistake that for permission to seize focus.

If an extension method is missing, inspect the effective documentation and
its available troubleshooting guidance. Use a supported alternative or the
permitted headless route; otherwise preserve progress and report the missing
capability. Never report extension exploration as a native Playwright test.

Leave user-owned tabs alone. Let routine task tabs close automatically at turn
end; use `markHandoff()` only for an unfinished live workflow that must continue,
or `markDeliverable()` for a user-requested live output.
