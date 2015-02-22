# UI-state

Conversion tool to transform UI state object to readable url query params and back.


## Conventions

1. All strings are processed AS IS.
2. Numbers are converted to strings.
and prepended with `\` (123 -> '\123').
3. Null, true, false and undefined are converted to strings
and prepended with `\` (false -> '\false').
4. Objects with depth over 2 are not accepted, Error will be raised.

## Tests

[Tests and coverage](https://packetloop.github.io/ui-state/doc)
