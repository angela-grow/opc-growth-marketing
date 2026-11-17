---
title: Design onboarding for AI agents
summary: Treat the AI coding agent as your most important new user. Watch it try to set up your product, fix every place it gets stuck, and give it a clear path from "what is this?" to a working result.
kind: tactic
stages: [conversion]
channels: [product]
principles: [friction, ikea-effect, cognitive-load]
effort: medium
cost: $
time_to_impact: Weeks
tools: [Claude Code, 2027.dev, Mintlify, Context7]
foundations: []
sources:
  - title: "How to win Agent-led Growth - Jay Sahnan on X"
    url: https://x.com/JaySahnan/status/2070248073851470326
---

## Why it works

Engineers increasingly hand setup to an AI agent instead of reading the docs and writing code themselves. That changes the psychology of switching. When a person built an integration by hand, the effort made them attached to it, so they forgave a rough setup, a confusing error or a missing example. Code written by an agent in seconds carries no such attachment. If your setup fights the agent, it throws the code away and tries a competitor. Switching used to cost a rewrite. Now it costs a sentence. This is "instant churn".

So the lever is ease, not persuasion. Every step that confuses the agent is a point where the user can give up. Removing friction lifts activation more directly than any homepage copy.

## Steps

1. **Make the agent a customer.** Watch an agent such as Claude Code try to get started with only your docs, in a sandbox, and note every place it trips.
2. **Make your docs easy for agents to find and read.** Publish an llms.txt file, get indexed by services like Context7, offer an official MCP server, full type definitions and a published OpenAPI spec.
3. **Fix dead ends.** Broken quickstart links that send the agent bouncing through several pages are expensive. Every bit of friction burns time and tokens.
4. **Catch hallucinations.** If agents keep guessing a wrong package name, register those names and point them to the real one.
5. **Give agents a ready-made prompt.** Add a skill.md route so an agent can grab instructions for using you instead of guessing.
6. **Write onboarding for an agent first,** not a human clicking through screenshots.
7. **Change the main call to action.** "Contact sales" assumes a human who wants to talk to a human. "Setup for agents" assumes the thing arriving is an agent, ready to onboard itself.
8. **Measure time to a working result** and keep cutting it.

## Example

Browserbase tested agents setting up their product and found two broken quickstart pages that sent the agent through five doc pages before it found working code. Agents also kept hallucinating two package names that did not exist, so Browserbase registered both and pointed them to the real package. After the fixes they scored 88 out of 100 on Mintlify's agent benchmark and got Claude from "what is Browserbase?" to a working integration in about 90 seconds. Their new "Setup for agents" button reached the top five most-clicked homepage buttons within a week. Over three months the company doubled its customer base, grew self-serve revenue by 119% and increased activation by more than 10%.

## Prerequisites

- A product developers set up themselves.
- Someone who can test with agents and fix docs quickly.

## How to measure

- Time from first agent prompt to a working integration.
- Activation rate for new sign-ups.
- Scores on agent-readiness benchmarks.
- Clicks on agent-specific calls to action.

## Pitfalls

- Assuming a human reads your docs top to bottom.
- Testing once and stopping. Docs drift, and agents change.
- Hiding setup behind a sales conversation.
